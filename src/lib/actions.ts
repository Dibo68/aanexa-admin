// src/lib/actions.ts
'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { NewAdminData } from './types'
import { AdminProfile } from './supabase'
import { jwtVerify } from 'jose'

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

// Diese Funktion gibt jetzt ein Objekt zurück, das entweder das Profil oder eine Debug-Info enthält.
async function getAdminProfileForVerification(): Promise<{ profile: AdminProfile | null, debugError: string | null }> {
    try {
        const cookieStore = await cookies();
        
        const allCookies = cookieStore.getAll();
        if (!allCookies || allCookies.length === 0) {
            return { profile: null, debugError: "No cookies received by server." };
        }

        const tokenCookie = cookieStore.get('sb-oorpduqkhfsuqerlcubo-auth-token');
        if (!tokenCookie) {
            const cookieNames = allCookies.map(c => c.name).join(', ');
            return { profile: null, debugError: `Auth cookie not found. Available cookies: [${cookieNames}]` };
        }

        const supabaseJwtSecret = process.env.SUPABASE_JWT_SECRET;
        if (!supabaseJwtSecret) {
            return { profile: null, debugError: "SUPABASE_JWT_SECRET is not set on server." };
        }

        const tokenData = JSON.parse(tokenCookie.value);
        const accessToken = Array.isArray(tokenData) ? tokenData[0]?.access_token : tokenData.access_token;
        if (!accessToken) {
            return { profile: null, debugError: "Access token not found in cookie JSON." };
        }

        const secret = new TextEncoder().encode(supabaseJwtSecret);
        const { payload } = await jwtVerify(accessToken, secret);
        const userId = payload.sub;
        if (!userId) {
            return { profile: null, debugError: "User ID (sub) not found in JWT." };
        }

        const supabase = getSupabaseAdminClient();
        const { data: profile, error } = await supabase
            .from('admin_users')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            return { profile: null, debugError: `DB error fetching profile for user ${userId}: ${error.message}` };
        }
        
        return { profile, debugError: null };
    } catch (e: any) {
        return { profile: null, debugError: `An error occurred: ${e.message}` };
    }
}

// Die exportierten Funktionen bleiben gleich, rufen aber die neue Verifizierungs-Funktion auf.
// Wichtig: Die updateAdmin Funktion wurde angepasst, um die Debug-Info auszugeben.
export async function updateAdmin(adminId: string, updates: Partial<AdminProfile>) {
    const { profile: currentAdmin, debugError } = await getAdminProfileForVerification();
    
    if (debugError || !currentAdmin || currentAdmin.role !== 'super_admin') {
        const errorMessage = debugError ? `Debug Info: ${debugError}` : 'Permission denied: User is not a Super Admin.';
        return { error: errorMessage };
    }
    
    // ... Rest der Funktion ...
}
export async function addAdmin(adminData: NewAdminData) {
    const { profile: currentAdmin, debugError } = await getAdminProfileForVerification();
    if (debugError || !currentAdmin || currentAdmin.role !== 'super_admin') {
        const errorMessage = debugError ? `Debug Info: ${debugError}` : 'Permission denied: User is not a Super Admin.';
        return { error: errorMessage };
    }

    // ... Rest der Funktion ...
}
export async function deleteAdmin(adminId: string) {
    const { profile: currentAdmin, debugError } = await getAdminProfileForVerification();
    if (debugError || !currentAdmin || currentAdmin.role !== 'super_admin') {
        const errorMessage = debugError ? `Debug Info: ${debugError}` : 'Permission denied: User is not a Super Admin.';
        return { error: errorMessage };
    }
    
    // ... Rest der Funktion ...
}
