// src/lib/actions.ts
'use server'

import { createServerClient } from '@supabase/ssr'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { NewAdminData } from './types'
import { AdminProfile } from './supabase'

// Helper-Funktion, um einen sicheren Server-Client zu erstellen
const createSupabaseServerClient = () => {
    const cookieStore = cookies();
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
            },
        }
    );
}

// Helper-Funktion, um das Profil des aktuellen Benutzers zu holen
async function getCurrentAdminProfile(): Promise<AdminProfile | null> {
    const supabase = createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', user.id)
        .single();
    
    return profile;
}

// ... (Rest der Datei bleibt gleich, hier zur Vollständigkeit)
const isLastSuperAdmin = async (adminId: string): Promise<boolean> => {
    // ...
};

export async function updateAdmin(adminId: string, updates: Partial<AdminProfile>): Promise<{ error?: string, data?: any }> {
    const currentAdmin = await getCurrentAdminProfile();
    if (!currentAdmin || currentAdmin.role !== 'super_admin') {
        return { error: 'Permission denied. Please log in again.' };
    }
    // ... Echte Update-Logik ...
    revalidatePath('/dashboard/admins');
    return { data: "Update successful" };
}

export async function addAdmin(adminData: NewAdminData): Promise<{ error?: string, data?: any }> {
    const currentAdmin = await getCurrentAdminProfile();
    if (!currentAdmin || currentAdmin.role !== 'super_admin') {
        return { error: 'Permission denied. Please log in again.' };
    }
    // ... Echte Add-Logik ...
    revalidatePath('/dashboard/admins');
    return { data: "Add successful" };
}

export async function deleteAdmin(adminId: string): Promise<{ error?: string, data?: any }> {
    const currentAdmin = await getCurrentAdminProfile();
    if (!currentAdmin || currentAdmin.role !== 'super_admin') {
        return { error: 'Permission denied. Please log in again.' };
    }
    // ... Echte Delete-Logik ...
    revalidatePath('/dashboard/admins');
    return { data: "Delete successful" };
}

// Wir lassen die leere Debug-Funktion da, damit der Build nicht fehlschlägt
export async function runServerDebug(): Promise<{ error?: string, data?: string }> {
    return { data: "Debug page is now disabled. Please remove it." };
}
