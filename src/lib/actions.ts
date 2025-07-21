// src/lib/actions.ts
'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { NewAdminData } from './types'
import { AdminProfile } from './supabase'

const getSupabaseAdmin = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) {
        throw new Error('Supabase URL or Service Role Key is not configured.');
    }
    return createClient(supabaseUrl, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false }
    });
}

const isLastSuperAdmin = async (adminId: string): Promise<boolean> => {
    const supabase = getSupabaseAdmin();
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

// GEÄNDERT: Nimmt jetzt Partial<AdminProfile> an und kann E-Mails aktualisieren
export async function updateAdmin(adminId: string, updates: Partial<AdminProfile>) {
    const supabase = getSupabaseAdmin();

    if (updates.role !== 'super_admin' || updates.status !== 'active') {
        if (await isLastSuperAdmin(adminId)) {
            return { error: 'You cannot change the role or status of the last active Super Admin.' };
        }
    }
    
    // 1. Update der admin_users Tabelle
    const { error: profileError } = await supabase
      .from('admin_users')
      .update({
        full_name: updates.full_name,
        role: updates.role,
        status: updates.status,
        email: updates.email
      })
      .eq('id', adminId);

    if (profileError) {
        console.error('Update admin profile error:', profileError);
        return { error: profileError.message };
    }

    // 2. Wenn die E-Mail geändert wurde, aktualisiere sie auch im Auth-System
    if (updates.email) {
        const { error: authError } = await supabase.auth.admin.updateUserById(
            adminId,
            { email: updates.email }
        );
        if (authError) {
            console.error('Update auth user error:', authError);
            // WICHTIG: Wenn Auth fehlschlägt, sollten wir idealerweise die Profiländerung zurückrollen.
            // Fürs Erste geben wir einen klaren Fehler zurück.
            return { error: `Auth user update failed: ${authError.message}` };
        }
    }

    revalidatePath('/dashboard/admins');
    return { data: 'Admin updated successfully.' };
}

export async function addAdmin(adminData: NewAdminData) {
    const supabase = getSupabaseAdmin();
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: adminData.email,
        password: adminData.password_hash,
        email_confirm: true,
    });
    if (authError) {
        console.error('Auth creation error:', authError);
        return { error: `Auth Error: ${authError.message}` };
    }
    const { error: profileError } = await supabase.from('admin_users').insert({
        id: authData.user.id,
        full_name: adminData.full_name,
        email: adminData.email,
        role: adminData.role,
        status: adminData.status,
    });
    if (profileError) {
        console.error('Profile creation error:', profileError);
        await supabase.auth.admin.deleteUser(authData.user.id);
        return { error: `Profile Error: ${profileError.message}` };
    }
    revalidatePath('/dashboard/admins');
    return { data: 'Admin created successfully.' };
}

export async function deleteAdmin(adminId: string) {
    if (await isLastSuperAdmin(adminId)) {
        return { error: 'You cannot delete the last active Super Admin.' };
    }
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.auth.admin.deleteUser(adminId);
    if (error) {
        console.error('Delete admin error:', error);
        return { error: `Failed to delete user: ${error.message}` };
    }
    revalidatePath('/dashboard/admins');
    return { data: 'Admin deleted successfully.' };
}
