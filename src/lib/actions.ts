// src/lib/actions.ts - KEINE ÄNDERUNG NÖTIG

// Diese Funktion ist KORREKT
export async function addAdmin(adminData: NewAdminData) {
  const supabase = getSupabaseAdmin();
  // 1. Erstellt den User im Auth-System
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({ /* ... */ });
  if (authError) return { error: `Auth Error: ${authError.message}` };

  // 2. Erstellt das Profil mit der ID aus dem Auth-System - das ist der entscheidende Teil
  const { error: profileError } = await supabase.from('admin_users').insert({
    id: authData.user.id, // <-- Stellt die Konsistenz sicher
    // ... restliche Daten
  });
  // ...
  return { data: 'Admin created successfully.' };
}

// Diese Funktion ist ebenfalls KORREKT
export async function deleteAdmin(adminId: string) {
  // ...
  // Versucht, den User im Auth-System zu löschen
  const { error } = await supabase.auth.admin.deleteUser(adminId);
  // ...
  return { data: 'Admin deleted successfully.' };
}
