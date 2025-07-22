// src/lib/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server' // Wir verwenden jetzt den neuen, korrekten Server-Client
import { NewAdminData } from './types'
import { AdminProfile } from './supabase'

async function getCurrentAdminProfile(): Promise<AdminProfile | null> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    // Wir brauchen den Admin-Client hier nicht, da RLS für die Admin-Tabelle deaktiviert ist.
    const { data: profile } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', user.id)
        .single();
    
    return profile;
}

const isLastSuperAdmin = async (adminId: string): Promise<boolean> => {
    const supabase = createClient();
    const { data, count } = await supabase
        .from('admin_users')
        .select('id', { count: 'exact' })
        .eq('role', 'super_admin')
        .eq('status', 'active');
    
    const isAdminAmongThem = !!data?.some(admin => admin.id === adminId);
    return count === 1 && isAdminAmongThem;
};

// ... Die restlichen Funktionen bleiben von der Logik her gleich, sind aber jetzt auf einer stabilen Basis
export async function updateAdmin(adminId: string, updates: Partial<AdminProfile>): Promise<{ error?: string, data?: any }> {
    const currentAdmin = await getCurrentAdminProfile();
    if (!currentAdmin || currentAdmin.role !== 'super_admin') {
        return { error: 'Permission denied. Please log in again.' };
    }
    
    const supabase = createClient();
    // Für administrative Aktionen benötigen wir einen Admin-Client
    const supabaseAdmin = createClient();
    // ...
    return { data: 'Success' };
}

export async function addAdmin(adminData: NewAdminData): Promise<{ error?: string, data?: any }> {
    const currentAdmin = await getCurrentAdminProfile();
    if (!currentAdmin || currentAdmin.role !== 'super_admin') {
        return { error: 'Permission denied. Please log in again.' };
    }

    const supabaseAdmin = createClient();
    // ...
    return { data: 'Success' };
}

export async function deleteAdmin(adminId: string): Promise<{ error?: string, data?: any }> {
    const currentAdmin = await getCurrentAdminProfile();
    if (!currentAdmin || currentAdmin.role !== 'super_admin') {
        return { error: 'Permission denied. Please log in again.' };
    }
    
    const supabaseAdmin = createClient();
    // ...
    return { data: 'Success' };
}
