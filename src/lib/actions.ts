// src/lib/actions.ts
'use server'

import { createClient } from '@/utils/supabase/server' // Sicherer Server-Client
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { NewAdminData } from './types'
import { AdminProfile } from './supabase'

// Diese Funktion ist neu und zentral für die Sicherheit.
// Sie holt den aktuellen User und sein Profil serverseitig.
async function getCurrentAdmin() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore) // Verwendet den sicheren Server-Client

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { user: null, profile: null, error: 'Not authenticated' }
  }

  const { data: profile, error: profileError } = await supabase
    .from('admin_users')
    .select('*')
    .eq('id', user.id)
    .single()
  
  if (profileError || !profile) {
    return { user, profile: null, error: 'Admin profile not found.' }
  }

  return { user, profile, error: null }
}


const isLastSuperAdmin = async (adminId: string): Promise<boolean> => {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
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
    const { profile: currentAdmin, error: authError } = await getCurrentAdmin();
    if (authError || currentAdmin?.role !== 'super_admin') {
        return { error: 'Permission denied: Only Super Admins can update users.' };
    }
    
    const supabase = createClient(cookies());
    // ... (Rest der Funktion bleibt gleich)
}

export async function addAdmin(adminData: NewAdminData) {
    const { profile: currentAdmin, error: authError } = await getCurrentAdmin();
    if (authError || currentAdmin?.role !== 'super_admin') {
        return { error: 'Permission denied: Only Super Admins can add new users.' };
    }

    const supabase = createClient(cookies());
    // ... (Rest der Funktion bleibt gleich)
}

export async function deleteAdmin(adminId: string) {
    const { profile: currentAdmin, error: authError } = await getCurrentAdmin();
    if (authError || currentAdmin?.role !== 'super_admin') {
        return { error: 'Permission denied: Only Super Admins can delete users.' };
    }

    if (await isLastSuperAdmin(adminId)) {
        return { error: 'You cannot delete the last active Super Admin.' };
    }
    const supabase = createClient(cookies());
    // ... (Rest der Funktion bleibt gleich)
}
