// src/context/AuthContext.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase, AdminProfile, getAdminProfile } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  adminProfile: AdminProfile | null
  loading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

// Einen Standardkontext mit leeren Funktionen und initialen Werten erstellen
const AuthContext = createContext<AuthContextType>({
  user: null,
  adminProfile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {}
});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Diese Funktion wird bei jeder Änderung des Authentifizierungsstatus aufgerufen (Login, Logout, Initialisierung)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user;
      setUser(currentUser ?? null);

      if (currentUser) {
        // Wenn ein Benutzer angemeldet ist, lade sein Admin-Profil
        const { data: profile } = await getAdminProfile(currentUser.id);
        setAdminProfile(profile || null);
      } else {
        // Wenn kein Benutzer angemeldet ist, setze das Profil auf null
        setAdminProfile(null);
      }
      
      // WICHTIG: Beende den Ladezustand, egal was passiert
      setLoading(false);
    });

    // Aufräumfunktion: Beendet den Listener, wenn die Komponente nicht mehr verwendet wird
    return () => {
      subscription.unsubscribe();
    };
  }, []); // Leeres Array sorgt dafür, dass dieser Effekt nur einmal beim Start ausgeführt wird

  const signOut = async () => {
    await supabase.auth.signOut();
    // Die Weiterleitung wird durch den onAuthStateChange-Listener oben automatisch ausgelöst
    router.push('/login'); 
  };
  
  const refreshProfile = async () => {
    if (user) {
      setLoading(true);
      const { data: profile } = await getAdminProfile(user.id);
      setAdminProfile(profile || null);
      setLoading(false);
    }
  };

  const value = { user, adminProfile, loading, signOut, refreshProfile };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
