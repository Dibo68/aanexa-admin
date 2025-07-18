'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase, AdminProfile, getAdminProfile } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  adminProfile: AdminProfile | null
  loading: boolean // Wir behalten 'loading' bei, um eine Ladeanzeige zu ermöglichen
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>(null!)

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null)
  const [loading, setLoading] = useState(true) // Startet immer im Ladezustand
  const router = useRouter()

  useEffect(() => {
    // onAuthStateChange wird einmal beim Laden mit dem initialen Zustand aufgerufen.
    // Das macht eine separate getSession()-Abfrage überflüssig und verhindert Race Conditions.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Wenn ein Benutzer eingeloggt ist
        setUser(session.user);
        const { data: profile } = await getAdminProfile(session.user.id);
        setAdminProfile(profile);
      } else {
        // Wenn kein Benutzer eingeloggt ist
        setUser(null);
        setAdminProfile(null);
      }
      // WICHTIG: Erst nachdem alles geklärt ist, wird der Ladezustand beendet.
      setLoading(false);
    });

    // Aufräumfunktion, wenn die Komponente verlassen wird
    return () => {
      subscription.unsubscribe();
    };
  }, []); // Dieser Hook läuft nur einmal beim Start der App

  const signOut = async () => {
    await supabase.auth.signOut();
    // Der onAuthStateChange Listener oben wird dies erkennen und den Rest erledigen
    router.push('/login');
  };
  
  const refreshProfile = async () => {
    if (user) {
      const { data: profile } = await getAdminProfile(user.id);
      setAdminProfile(profile);
    }
  };

  const value = { user, adminProfile, loading, signOut, refreshProfile };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
