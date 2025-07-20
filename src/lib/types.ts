// src/lib/types.ts

import { AdminProfile } from './supabase';

// Der 'password_hash' wird nicht mehr benötigt, da er nur für die Auth-Erstellung relevant ist
export type NewAdminData = Omit<AdminProfile, 'id' | 'created_at' | 'updated_at' | 'last_login'> & {
  password_hash: string;
};
