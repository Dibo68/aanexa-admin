// src/lib/supabase.ts
// Diese Datei wird für die Client-Initialisierung nicht mehr aktiv genutzt,
// aber wir behalten sie für die AdminProfile-Typendefinition.

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
