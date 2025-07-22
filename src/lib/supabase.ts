// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Zurückgesetzt auf die einfache, stabile Standard-Initialisierung.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);


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

// Admin-spezifische Funktionen
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
