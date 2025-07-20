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
  const isAdminAmongThem = data?.some(admin => admin.id === adminId);
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

// NEUE, ROBUSTERE DELETE-FUNKTION
export async function deleteAdmin(adminId: string) {
  if (await isLastSuperAdmin(adminId)) {
    return { error: 'You cannot delete the last active Super Admin.' };
  }
  const supabase = getSupabaseAdmin();
  
  // Schritt 1: Lösche das Profil aus unserer öffentlichen Tabelle
  const { error: profileError } = await supabase.from('admin_users').delete().eq('id', adminId);
  if (profileError) {
    return { error: `Failed to delete admin profile: ${profileError.message}` };
  }

  // Schritt 2: Lösche den Benutzer aus dem sicheren Auth-System
  const { error: authError } = await supabase.auth.admin.deleteUser(adminId);
  if (authError) {
    // Falls dies fehlschlägt, ist das ein Problem, aber das Profil ist schon weg.
    return { error: `Failed to delete auth user: ${authError.message}` };
  }
  
  revalidatePath('/dashboard/admins');
  return { data: 'Admin deleted successfully.' };
}
