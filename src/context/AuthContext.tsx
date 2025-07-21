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
    const checkInitialSession = async () => {
      try {
        // Prüfe die initiale Session beim allerersten Laden der App
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          const { data: profile } = await getAdminProfile(session.user.id);
          setAdminProfile(profile || null);
        } else {
          setUser(null);
          setAdminProfile(null);
        }
      } catch (e) {
        console.error("Error checking initial session:", e);
        setUser(null);
        setAdminProfile(null);
      } finally {
        // Dies ist der wichtigste Teil: Beende den Ladevorgang in jedem Fall.
        setLoading(false);
      }
    };

    // Führe die initiale Prüfung aus
    checkInitialSession();

    // Richte danach den Listener ein, der auf zukünftige Änderungen reagiert (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const currentUser = session?.user;
        setUser(currentUser ?? null);

        if (currentUser) {
          // Lade das Profil nur, wenn es sich vom aktuellen Zustand unterscheidet
          if (currentUser.id !== adminProfile?.id) {
            getAdminProfile(currentUser.id).then(({ data: profile }) => {
              setAdminProfile(profile || null);
            });
          }
        } else {
          setAdminProfile(null);
        }
        // Setze Loading hier auch auf false, falls die App während einer Auth-Änderung lädt
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []); // Leeres Array stellt sicher, dass dies nur einmal beim Start läuft

  const signOut = async () => {
    await supabase.auth.signOut();
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
