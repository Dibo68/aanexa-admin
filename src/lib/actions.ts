// Pfad: src/lib/actions.ts

'use server'

import { createClient } from '@/utils/supabase/server'

export async function updateAdmin(adminId: string, newData: any) {
  const supabase = await createClient()

  // ⬇️ Benutzer vom Token laden
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error('Nicht eingeloggt')
  }

  // ⬇️ Adminrolle prüfen
  const { data: profile, error: profileError } = await supabase
    .from('admin_users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    throw new Error('Adminprofil nicht gefunden')
  }

  if (profile.role !== 'super_admin') {
    throw new Error('Keine Berechtigung')
  }

  // ✅ Änderung vornehmen
  const { error: updateError } = await supabase
    .from('admin_users')
    .update(newData)
    .eq('id', adminId)

  if (updateError) {
    throw new Error('Fehler beim Speichern')
  }

  return { success: true }
}
