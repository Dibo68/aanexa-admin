// src/lib/actions.ts
'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { NewAdminData } from './types'
import { AdminProfile } from './supabase'

// Helper-Funktion, um den sicheren Supabase-Client mit Admin-Rechten zu erhalten
// Diesen Client verwenden wir für Aktionen, die höhere Berechtigungen erfordern (User anlegen/löschen)
const getSupabaseAdminClient = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) {
        throw new Error('Supabase URL or Service Role Key is not configured.');
    }
    return createClient(supabaseUrl, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false }
    });
}

// Diese Funktion ist neu und zentral für die Sicherheit.
// Sie holt den aktuellen User und sein Profil serverseitig und sicher.
async function getCurrentAdminProfile(): Promise<AdminProfile | null> {
  const cookieStore = cookies()
  // Dieser Client hat nur die Rechte des angemeldeten Benutzers
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
        get(name: string) {
            return cookieStore.get(name)?.value;
        },
    },
  });

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from('admin_users')
    .select('*')
    .eq('id', user.id)
    .single()
  
  return profile;
}

const isLastSuperAdmin = async (adminId: string): Promise<boolean> => {
    const supabase = getSupabaseAdminClient();
    const { data, count, error } = await supabase
        .from('admin_users')
        .select('id', { count: 'exact' })
        .eq('role', 'super_admin')
        .eq('status', 'active');
    if (error) {
        console.error('Error checking last super admin:', error);
        return true;
    }
    const isAdminAmongThem = !!data?.some(admin => admin.id === adminId);
    return count === 1 && isAdminAmongThem;
};

export async function updateAdmin(adminId: string, updates: Partial<AdminProfile>) {
    const currentAdmin = await getCurrentAdminProfile();
    if (!currentAdmin || currentAdmin.role !== 'super_admin') {
        return { error: 'Permission denied: Only Super Admins can update users.' };
    }
    
    if (updates.role !== 'super_admin' || updates.status !== 'active') {
        if (await isLastSuperAdmin(adminId)) {
            return { error: 'You cannot change the role or status of the last active Super Admin.' };
        }
    }
    
    const supabaseAdmin = getSupabaseAdminClient();
    const { error: profileError } = await supabaseAdmin
      .from('admin_users')
      .update({
        full_name: updates.full_name,
        role: updates.role,
        status: updates.status,
        email: updates.email
      })
      .eq('id', adminId);

    if (profileError) {
        return { error: profileError.message };
    }

    if (updates.email) {
        const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
            adminId,
            { email: updates.email }
        );
        if (authError) {
            return { error: `Auth user update failed: ${authError.message}` };
        }
    }

    revalidatePath('/dashboard/admins');
    return { data: 'Admin updated successfully.' };
}

export async function addAdmin(adminData: NewAdminData) {
    const currentAdmin = await getCurrentAdminProfile();
    if (!currentAdmin || currentAdmin.role !== 'super_admin') {
        return { error: 'Permission denied: Only Super Admins can add new users.' };
    }

    const supabaseAdmin = getSupabaseAdminClient();
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: adminData.email,
        password: adminData.password_hash,
        email_confirm: true,
    });

    if (authError) {
        return { error: `Auth Error: ${authError.message}` };
    }

    const { error: profileError } = await supabaseAdmin.from('admin_users').insert({
        id: authData.user.id,
        full_name: adminData.full_name,
        email: adminData.email,
        role: adminData.role,
        status: adminData.status,
    });

    if (profileError) {
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
        return { error: `Profile Error: ${profileError.message}` };
    }

    revalidatePath('/dashboard/admins');
    return { data: 'Admin created successfully.' };
}

export async function deleteAdmin(adminId: string) {
    const currentAdmin = await getCurrentAdminProfile();
    if (!currentAdmin || currentAdmin.role !== 'super_admin') {
        return { error: 'Permission denied: Only Super Admins can delete users.' };
    }

    if (await isLastSuperAdmin(adminId)) {
        return { error: 'You cannot delete the last active Super Admin.' };
    }
    
    const supabaseAdmin = getSupabaseAdminClient();
    const { error } = await supabaseAdmin.auth.admin.deleteUser(adminId);

    if (error) {
        return { error: `Failed to delete user: ${error.message}` };
    }

    revalidatePath('/dashboard/admins');
    return { data: 'Admin deleted successfully.' };
}
