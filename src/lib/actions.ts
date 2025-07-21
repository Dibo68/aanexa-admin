// src/lib/actions.ts
'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { NewAdminData } from './types'

// Helper-Funktion, um einen Supabase-Client mit Admin-Rechten zu erstellen
const getSupabaseAdmin = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase URL or Service Role Key is not configured in environment variables.')
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Helper-Funktion, um zu prüfen, ob es der letzte Super-Admin ist
const isLastSuperAdmin = async (adminId: string): Promise<boolean> => {
  const supabase = getSupabaseAdmin()
  const { data, count, error } = await supabase
    .from('admin_users')
    .select('id', { count: 'exact' })
    .eq('role', 'super_admin')
    .eq('status', 'active')
  
  if (error) {
    console.error('Error checking last super admin:', error)
    // Im Fehlerfall auf Nummer sicher gehen und die Aktion verhindern
    return true
  }

  const isAdminAmongThem = !!data?.some(admin => admin.id === adminId)
  return count === 1 && isAdminAmongThem
}

// AKTION: Details eines Administrators aktualisieren
export async function updateAdmin(adminId: string, updates: Partial<NewAdminData>) {
  // Verhindern, dass der letzte Super-Admin seine Rolle oder seinen Status ändert
  if (updates.role !== 'super_admin' || updates.status !== 'active') {
    if (await isLastSuperAdmin(adminId)) {
      return { error: 'You cannot change the role or status of the last active Super Admin.' }
    }
  }

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('admin_users')
    .update(updates)
    .eq('id', adminId)
    .select()

  if (error) {
    console.error('Update admin error:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard/admins')
  return { data }
}

// AKTION: Einen neuen Administrator hinzufügen
export async function addAdmin(adminData: NewAdminData) {
  const supabase = getSupabaseAdmin()

  // 1. Benutzer im Auth-System erstellen
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: adminData.email,
    password: adminData.password_hash,
    email_confirm: true, // E-Mail automatisch bestätigen
  })

  if (authError) {
    console.error('Auth creation error:', authError)
    return { error: `Auth Error: ${authError.message}` }
  }

  // 2. Zugehöriges Profil in unserer öffentlichen Tabelle erstellen
  const { error: profileError } = await supabase.from('admin_users').insert({
    id: authData.user.id, // Die ID vom erstellten Auth-Benutzer verwenden
    full_name: adminData.full_name,
    email: adminData.email,
    role: adminData.role,
    status: adminData.status,
  })

  // Wenn die Profilerstellung fehlschlägt, müssen wir den Auth-Benutzer löschen
  if (profileError) {
    console.error('Profile creation error:', profileError)
    await supabase.auth.admin.deleteUser(authData.user.id)
    return { error: `Profile Error: ${profileError.message}` }
  }

  revalidatePath('/dashboard/admins')
  return { data: 'Admin created successfully.' }
}

// AKTION: Einen Administrator löschen
export async function deleteAdmin(adminId: string) {
  // Löschen des letzten Super-Admins verhindern
  if (await isLastSuperAdmin(adminId)) {
    return { error: 'You cannot delete the last active Super Admin.' }
  }

  const supabase = getSupabaseAdmin()
  
  // Das Löschen im Auth-System sollte automatisch den Eintrag in der
  // admin_users Tabelle löschen, wenn "ON DELETE CASCADE" gesetzt ist.
  const { error } = await supabase.auth.admin.deleteUser(adminId)

  if (error) {
    console.error('Delete admin error:', error)
    return { error: `Failed to delete user: ${error.message}` }
  }

  revalidatePath('/dashboard/admins')
  return { data: 'Admin deleted successfully.' }
}
