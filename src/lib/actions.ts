// src/lib/actions.ts

'use server' // Diese Zeile sagt Next.js: "Code in dieser Datei läuft nur sicher auf dem Server"

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache' // Ein Werkzeug von Next.js, um Seiten neu zu laden

// Definieren, welche Daten wir für ein Update erwarten
interface AdminUpdateData {
  full_name?: string;
  role?: 'admin' | 'super_admin';
  status?: 'active' | 'inactive';
}

// Dies ist unsere sichere Server-Funktion zum Aktualisieren eines Admins
export async function updateAdmin(adminId: string, updates: AdminUpdateData) {
  try {
    // 1. Erstelle einen sicheren Supabase-Client, der Admin-Rechte hat
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 2. Führe den Update-Befehl in der Datenbank aus
    const { data, error } = await supabaseAdmin
      .from('admin_users')
      .update(updates)
      .eq('id', adminId)
      .select()
      .single();

    // 3. Wenn ein Fehler auftritt, gib ihn zurück
    if (error) {
      console.error('Supabase Update Error:', error);
      return { error: 'Datenbankfehler: Admin konnte nicht aktualisiert werden.' };
    }

    // 4. Bei Erfolg: Sage Next.js, dass die Admin-Seite neu geladen werden muss,
    //    damit die Änderungen sichtbar werden.
    revalidatePath('/dashboard/admins');

    // 5. Gib die erfolgreiche Antwort zurück
    return { data };

  } catch (err) {
    return { error: 'Ein unerwarteter Serverfehler ist aufgetreten.' };
  }
}
