// src/lib/supabase.ts
// Diese Datei wird nicht mehr für die Client-Initialisierung genutzt,
// sondern nur noch für die AdminProfile-Typendefinition und einfache, nicht-authentifizierte Abfragen.

import { createClient } from "@supabase/supabase-js";

// Wir exportieren hier einen einfachen Client für den Fall, dass er an einer Stelle ohne
// Benutzer-Kontext benötigt wird, und stellen so die Kompatibilität wieder her.
export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface AdminProfile {
  id: string
  email: string
  full_name: string
  role: 'super_admin' | 'admin'
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
  last_login?: string
}

// Diese Funktion wird im AuthContext benötigt
export const getAdminProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .eq('id', userId)
    .single()
  
  return { data, error }
}
