// src/lib/actions.ts
'use server'

import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import { jwtVerify } from 'jose'
import { AdminProfile } from './supabase'
import { NewAdminData } from './types' // KORRIGIERT: Fehlender Import
import { revalidatePath } from 'next/cache'

async function getAdminProfileForVerification(): Promise<{ profile: AdminProfile | null, debugInfo: any }> {
    const debugInfo: { [key: string]: any } = {};
    try {
        const cookieStore = await cookies();
        
        const allCookies = cookieStore.getAll();
        debugInfo.allCookies = allCookies.map(c => ({ name: c.name, value: c.value.substring(0, 15) + '...' }));

        if (!allCookies || allCookies.length === 0) {
            debugInfo.error = "No cookies received by server.";
            return { profile: null, debugInfo };
        }

        const tokenCookie = cookieStore.get('sb-oorpduqkhfsuqerlcubo-auth-token');
        if (!tokenCookie) {
            const cookieNames = allCookies.map(c => c.name).join(', ');
            debugInfo.error = `Auth cookie 'sb-oorpduqkhfsuqerlcubo-auth-token' not found. Available cookies: [${cookieNames}]`;
            return { profile: null, debugInfo };
        }
        
        debugInfo.cookieFound = { name: tokenCookie.name, value: tokenCookie.value.substring(0, 15) + '...'};

        const supabaseJwtSecret = process.env.SUPABASE_JWT_SECRET;
        if (!supabaseJwtSecret) {
            debugInfo.error = "SUPABASE_JWT_SECRET is not set on server.";
            return { profile: null, debugInfo };
        }
        debugInfo.jwtSecretFound = true;

        const tokenData = JSON.parse(tokenCookie.value);
        const accessToken = Array.isArray(tokenData) ? tokenData[0]?.access_token : tokenData.access_token;
        if (!accessToken) {
            debugInfo.error = "Access token not found in cookie JSON.";
            return { profile: null, debugInfo };
        }
        debugInfo.accessTokenFound = true;

        const secret = new TextEncoder().encode(supabaseJwtSecret);
        const { payload } = await jwtVerify(accessToken, secret);
        debugInfo.jwtVerified = true;
        
        const userId = payload.sub;
        if (!userId) {
            debugInfo.error = "User ID (sub) not found in JWT.";
            return { profile: null, debugInfo };
        }
        debugInfo.userId = userId;

        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
        const { data: profile, error } = await supabase
            .from('admin_users')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            debugInfo.dbError = `DB error for user ${userId}: ${error.message}`;
        }
        
        debugInfo.profileFromDB = profile;
        return { profile, debugInfo };
    } catch (e: any) {
        debugInfo.catchError = `An error occurred: ${e.message}`;
        return { profile: null, debugInfo };
    }
}

// Neue, simple Debug-Funktion
export async function runServerDebug(): Promise<{ error?: string, data?: string }> {
    const { profile, debugInfo } = await getAdminProfileForVerification();
    
    const result = {
        detectedProfile: profile,
        debugTrace: debugInfo
    };
    
    return { data: JSON.stringify(result, null, 2) };
}

// Funktionen, die ein korrektes Objekt zurückgeben
export async function updateAdmin(adminId: string, updates: Partial<AdminProfile>): Promise<{ error?: string, data?: any }> { 
    const { profile: currentAdmin, debugInfo } = await getAdminProfileForVerification();
    if (!currentAdmin || currentAdmin.role !== 'super_admin') {
        return { error: `Permission Denied. Debug: ${JSON.stringify(debugInfo)}` };
    }
    // ... Hier würde die echte Logik stehen
    revalidatePath('/dashboard/admins');
    return { data: "Update successful (simulation)" } 
}

export async function addAdmin(adminData: NewAdminData): Promise<{ error?: string, data?: any }> { 
    const { profile: currentAdmin, debugInfo } = await getAdminProfileForVerification();
    if (!currentAdmin || currentAdmin.role !== 'super_admin') {
        return { error: `Permission Denied. Debug: ${JSON.stringify(debugInfo)}` };
    }
    // ... Hier würde die echte Logik stehen
    revalidatePath('/dashboard/admins');
    return { data: "Add successful (simulation)" } 
}

export async function deleteAdmin(adminId: string): Promise<{ error?: string, data?: any }> { 
    const { profile: currentAdmin, debugInfo } = await getAdminProfileForVerification();
    if (!currentAdmin || currentAdmin.role !== 'super_admin') {
        return { error: `Permission Denied. Debug: ${JSON.stringify(debugInfo)}` };
    }
    // ... Hier würde die echte Logik stehen
    revalidatePath('/dashboard/admins');
    return { data: "Delete successful (simulation)" } 
}
