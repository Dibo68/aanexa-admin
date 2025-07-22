// src/lib/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { createClient as createServerClient } from '@/utils/supabase/server'
import { createClient } from '@supabase/supabase-js'
import { NewAdminData } from './types'
import { AdminProfile } from './supabase'

const getSupabaseAdminClient = () => {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );
}

async function getCurrentAdminProfile(): Promise<AdminProfile | null> {
    const supabase = await createServerClient(); // KORREKTUR: await hinzugefügt
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', user.id)
        .single();
    
    return profile;
}

const isLastSuperAdmin = async (adminId: string): Promise<boolean> => {
    const supabase = await createServerClient(); // KORREKTUR: await hinzugefügt
    const { data, count } = await supabase
        .from('admin_users')
        .select('id', { count: 'exact' })
        .eq('role', 'super_admin')
        .eq('status', 'active');
    
    const isAdminAmongThem = !!data?.some(admin => admin.id === adminId);
    return count === 1 && isAdminAmongThem;
};

export async function updateAdmin(adminId: string, updates: Partial<AdminProfile>): Promise<{ error?: string, data?: any }> {
    const currentAdmin = await getCurrentAdminProfile();
    if (!currentAdmin || currentAdmin.role !== 'super_admin') {
        return { error: 'Permission denied. Please log in again.' };
    }
    
    if (updates.role !== 'super_admin' || updates.status !== 'active') {
        if (await isLastSuperAdmin(adminId)) {
            return { error: 'You cannot change the role or status of the last active Super Admin.' };
        }
    }
    
    const supabaseAdmin = getSupabaseAdminClient();
    const { data, error: profileError } = await supabaseAdmin
      .from('admin_users')
      .update({ full_name: updates.full_name, role: updates.role, status: updates.status, email: updates.email })
      .eq('id', adminId)
      .select();

    if (profileError) { return { error: profileError.message }; }

    if (updates.email) {
        const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(adminId, { email: updates.email }); 
        if (authError) { return { error: `Auth user update failed: ${authError.message}` }; }
    }

    revalidatePath('/dashboard/admins');
    return { data };
}

export async function addAdmin(adminData: NewAdminData): Promise<{ error?: string, data?: any }> {
    const currentAdmin = await getCurrentAdminProfile();
    if (!currentAdmin || currentAdmin.role !== 'super_admin') {
        return { error: 'Permission denied. Please log in again.' };
    }

    const supabaseAdmin = getSupabaseAdminClient();
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: adminData.email,
        password: adminData.password_hash,
        email_confirm: true,
    });

    if (authError) { return { error: `Auth Error: ${authError.message}` }; }

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

export async function deleteAdmin(adminId: string): Promise<{ error?: string, data?: any }> {
    const currentAdmin = await getCurrentAdminProfile();
    if (!currentAdmin || currentAdmin.role !== 'super_admin') {
        return { error: 'Permission denied. Please log in again.' };
    }

    if (await isLastSuperAdmin(adminId)) {
        return { error: 'You cannot delete the last active Super Admin.' };
    }
    
    const supabaseAdmin = getSupabaseAdminClient();
    const { data, error } = await supabaseAdmin.auth.admin.deleteUser(adminId);

    if (error) { return { error: `Failed to delete user: ${error.message}` }; }

    revalidatePath('/dashboard/admins');
    return { data };
}
