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
  refreshProfile: () => Promise<void> // Funktion wieder hinzugefügt
}

const AuthContext = createContext<AuthContextType>(null!)

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        const { data: profile } = await getAdminProfile(session.user.id);
        setAdminProfile(profile);
      }
      setLoading(false);
    };
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        getAdminProfile(session.user.id).then(({ data }) => setAdminProfile(data));
      } else {
        setAdminProfile(null);
        router.push('/login');
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };
  
  // Funktion wieder vollständig implementiert
  const refreshProfile = async () => {
    if (user) {
      const { data: profile } = await getAdminProfile(user.id);
      setAdminProfile(profile);
    }
  };

  const value = { user, adminProfile, loading, signOut, refreshProfile };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
