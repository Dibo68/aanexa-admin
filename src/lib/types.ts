// src/lib/types.ts

import { AdminProfile } from './supabase';

// Dies ist jetzt der zentrale Bauplan für die Daten,
// die zum Erstellen eines neuen Admins benötigt werden.
export type NewAdminData = Omit<AdminProfile, 'id' | 'created_at' | 'updated_at' | 'last_login'> & {
  password_hash: string;
};
