// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// KORREKTUR: Wir erstellen den Supabase-Client mit der korrekten Cookie-Konfiguration für Ihre Domain.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Diese Einstellung sorgt dafür, dass Cookies für `.aanexa.com` gesetzt werden,
    // was sie auch für den Server auf `admin.aanexa.com` sichtbar macht.
    cookieOptions: {
      name: 'aanexa-admin-auth-token', // Eigener Cookie-Name zur Sicherheit
      domain: '.aanexa.com',
      path: '/',
      sameSite: 'lax',
      secure: true
    },
  },
});


// Type definitions für unsere Admin-Tabelle
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

// Admin-spezifische Funktionen (unverändert)
export const getAdminProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .eq('id', userId)
    .single()
  
  return { data, error }
}

export const updateAdminLastLogin = async (userId: string) => {
  const { error } = await supabase
    .from('admin_users')
    .update({ last_login: new Date().toISOString() })
    .eq('id', userId)
  
  return { error }
}
