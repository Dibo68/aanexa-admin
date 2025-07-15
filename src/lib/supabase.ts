// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type definitions für unsere Admin-Tabelle
export interface AdminProfile {
  id: string
  email: string
  full_name: string  // ← KORRIGIERT: war vorher 'name'
  role: 'super_admin' | 'admin'
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
  last_login?: string
}

// Auth helper functions
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
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
