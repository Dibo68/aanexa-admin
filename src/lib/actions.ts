// src/lib/actions.ts
'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { NewAdminData } from './types'

const getSupabaseAdmin = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const isLastSuperAdmin = async (adminId: string): Promise<boolean> => {
  const supabase = getSupabaseAdmin();
  const { data, count } = await supabase
    .from('admin_users')
    .select('id', { count: 'exact' })
    .eq('role', 'super_admin')
    .eq('status', 'active');
  
  const isAdminAmongThem = !!data?.some(admin => admin.id === adminId);
  return count === 1 && isAdminAmongThem;
};

export async function updateAdmin(adminId: string, updates: Partial<NewAdminData>) {
  if (await isLastSuperAdmin(adminId) && (updates.role !== 'super_admin' || updates.status !== 'active')) {
    return { error: 'You cannot change the role or status of the last active Super Admin.' };
  }
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from('admin_users').update(updates).eq('id', adminId);
  if (error) return { error: error.message };
  revalidatePath('/dashboard/admins');
  return { data };
}

export async function addAdmin(adminData: NewAdminData) {
  const supabase = getSupabaseAdmin();
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: adminData.email,
    password: adminData.password_hash,
    email_confirm: true,
  });
  if (authError) return { error: authError.message };

  const { error: profileError } = await supabase.from('admin_users').insert({
    id: authData.user.id,
    full_name: adminData.full_name,
    email: adminData.email,
    role: adminData.role,
    status: adminData.status,
  });
  if (profileError) {
    await supabase.auth.admin.deleteUser(authData.user.id);
    return { error: profileError.message };
  }
  revalidatePath('/dashboard/admins');
  return { data: 'Admin created successfully.' };
}

export async function deleteAdmin(adminId: string) {
  if (await isLastSuperAdmin(adminId)) {
    return { error: 'You cannot delete the last active Super Admin.' };
  }
  const supabase = getSupabaseAdmin();
  
  // KORREKTUR: Supabase löscht den 'admin_users' Eintrag automatisch mit,
  // wenn die Foreign-Key-Beziehung mit "ON DELETE CASCADE" eingerichtet ist.
  // Wir führen NUR diesen einen Befehl aus.
  const { error } = await supabase.auth.admin.deleteUser(adminId);
  
  if (error) {
    // Wenn dieser Fehler auftritt, bedeutet das, dass die Verknüpfung in der DB fehlt.
    // Wir löschen dann nur den Profileintrag als Fallback.
    if (error.message.toLowerCase().includes('not found')) {
        const { error: profileDeleteError } = await supabase.from('admin_users').delete().eq('id', adminId);
        if (profileDeleteError) return { error: `User not found in Auth, and failed to delete profile: ${profileDeleteError.message}`};
        revalidatePath('/dashboard/admins');
        return { data: 'Orphaned admin profile deleted.' };
    }
    return { error: `Failed to delete user: ${error.message}` };
  }

  revalidatePath('/dashboard/admins');
  return { data: 'Admin deleted successfully.' };
}
