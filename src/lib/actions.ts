// src/lib/actions.ts

'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { NewAdminData } from './types' // Wir importieren den Bauplan

interface AdminUpdateData {
  full_name?: string;
  role?: 'admin' | 'super_admin';
  status?: 'active' | 'inactive';
}

export async function updateAdmin(adminId: string, updates: AdminUpdateData) {
  // ... (Diese Funktion existiert bereits und bleibt unverändert)
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data, error } = await supabaseAdmin
      .from('admin_users')
      .update(updates)
      .eq('id', adminId)
      .select()
      .single();
    if (error) {
      return { error: 'Datenbankfehler: Admin konnte nicht aktualisiert werden.' };
    }
    revalidatePath('/dashboard/admins');
    return { data };
  } catch (err) {
    return { error: 'Ein unerwarteter Serverfehler ist aufgetreten.' };
  }
}

// HIER IST DIE NEUE FUNKTION
export async function addAdmin(adminData: NewAdminData) {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Erstelle den Benutzer im sicheren Auth-System
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: adminData.email,
      password: adminData.password_hash,
      email_confirm: true,
    });

    if (authError) {
      if (authError.message.includes('unique constraint')) {
        return { error: 'Ein Admin mit dieser E-Mail existiert bereits.' };
      }
      throw authError;
    }

    // 2. Erstelle den passenden Eintrag in unserer "admin_users" Tabelle
    const { error: profileError } = await supabaseAdmin
      .from('admin_users')
      .insert({
        id: authData.user.id,
        full_name: adminData.full_name,
        email: adminData.email,
        role: adminData.role,
        status: adminData.status,
      });
    
    if (profileError) {
      // Wenn das Profil nicht erstellt werden kann, lösche den Auth-Benutzer wieder
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      throw profileError;
    }

    revalidatePath('/dashboard/admins');
    return { data: 'Admin erfolgreich erstellt.' };

  } catch (err: any) {
    return { error: err.message || 'Ein Serverfehler ist aufgetreten.' };
  }
}
