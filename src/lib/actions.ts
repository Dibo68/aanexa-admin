// src/lib/actions.ts
'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { NewAdminData } from './types'
import { AdminProfile } from './supabase'
import { jwtVerify } from 'jose'

// Helper-Funktion, um den Supabase-Client mit Admin-Rechten zu erstellen
const getSupabaseAdminClient = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) {
        throw new Error('Supabase URL or Service Role Key is not configured in environment variables.');
    }
    return createClient(supabaseUrl, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false }
    });
}

// Helper-Funktion mit erweitertem Debugging
async function getCurrentAdminProfile(): Promise<AdminProfile | null> {
    console.log("--- DEBUG: Starting getCurrentAdminProfile ---");
    const cookieStore = await cookies();
    
    // Loggt ALLE Cookies, die der Server empfängt
    const allCookies = cookieStore.getAll();
    console.log("DEBUG: All cookies received by server:", allCookies);

    const tokenCookie = cookieStore.get('sb-oorpduqkhfsuqerlcubo-auth-token');

    if (!tokenCookie) {
        console.log("DEBUG: Auth token cookie ('sb-oorpduqkhfsuqerlcubo-auth-token') was NOT FOUND.");
        console.log("--- DEBUG: Ending getCurrentAdminProfile ---");
        return null;
    }

    console.log("DEBUG: Auth token cookie FOUND. Value:", tokenCookie.value);

    try {
        const supabaseJwtSecret = process.env.SUPABASE_JWT_SECRET;
        if (!supabaseJwtSecret) {
            throw new Error('SUPABASE_JWT_SECRET is not set in environment variables.');
        }

        const tokenData = JSON.parse(tokenCookie.value);
        const accessToken = Array.isArray(tokenData) ? tokenData[0]?.access_token : tokenData.access_token;
        
        if (!accessToken) {
            console.log("DEBUG: Access token NOT FOUND inside cookie JSON.");
            console.log("--- DEBUG: Ending getCurrentAdminProfile ---");
            return null;
        }

        console.log("DEBUG: Access token FOUND.");

        const secret = new TextEncoder().encode(supabaseJwtSecret);
        const { payload } = await jwtVerify(accessToken, secret);
        const userId = payload.sub;

        if (!userId) {
            console.log("DEBUG: User ID (sub) NOT FOUND in JWT payload.");
            console.log("--- DEBUG: Ending getCurrentAdminProfile ---");
            return null;
        }

        console.log("DEBUG: User ID from token is:", userId);

        const supabase = getSupabaseAdminClient();
        const { data: profile, error } = await supabase
            .from('admin_users')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            console.error("DEBUG: Error fetching profile from DB:", error.message);
        }
        
        console.log("DEBUG: Profile fetched from DB:", profile);
        console.log("--- DEBUG: Ending getCurrentAdminProfile ---");
        return profile;
    } catch (e: any) {
        console.error('DEBUG: An error occurred in the try-catch block:', e.message);
        console.log("--- DEBUG: Ending getCurrentAdminProfile ---");
        return null;
    }
}


const isLastSuperAdmin = async (adminId: string): Promise<boolean> => {
    // ... (unverändert)
};
export async function updateAdmin(adminId: string, updates: Partial<AdminProfile>) {
    // ... (unverändert)
};
export async function addAdmin(adminData: NewAdminData) {
    // ... (unverändert)
};
export async function deleteAdmin(adminId: string) {
    // ... (unverändert)
};
