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

const AuthContext = createContext<AuthContextType>(null!)
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // 1. Prüfe die Session einmalig beim Laden der App
    const checkInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        const { data: profile } = await getAdminProfile(session.user.id);
        setAdminProfile(profile);
      }
      setLoading(false); // Beende das Laden, nachdem die erste Prüfung abgeschlossen ist
    };

    checkInitialSession();

    // 2. Lausche auf zukünftige Änderungen (z.B. Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setAdminProfile(null);
        router.push('/login');
      } else if (event === 'SIGNED_IN' && session) {
        // Dieser Teil wird nach einem erfolgreichen Login ausgeführt
        setUser(session.user);
        getAdminProfile(session.user.id).then(({ data }) => setAdminProfile(data));
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const signOut = async () => {
    await supabase.auth.signOut();
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
