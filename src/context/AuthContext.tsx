// src/context/AuthContext.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase, AdminProfile, getAdminProfile, updateAdminLastLogin } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  adminProfile: AdminProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

// Hier wird ein Standardwert gesetzt, der aber nie verwendet wird, wenn der Provider korrekt genutzt wird.
const AuthContext = createContext<AuthContextType>(null!)

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Diese Funktion prüft die Session und aktualisiert den Zustand
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      // Wenn eine Session existiert, lade das Profil
      if (session?.user) {
        setUser(session.user)
        const { data: profile } = await getAdminProfile(session.user.id)
        setAdminProfile(profile)
      } else {
        // Wenn keine Session existiert, setze alles zurück
        setUser(null)
        setAdminProfile(null)
      }
      // WICHTIG: Am Ende der Prüfung immer das Laden beenden
      setLoading(false)
    }

    checkUser()

    // Diese Funktion lauscht auf zukünftige Änderungen (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null)
        setAdminProfile(null)
        setLoading(false)
        router.push('/login')
      } else if (session?.user) {
        setUser(session.user)
        // Lade das Profil nach dem Einloggen
        getAdminProfile(session.user.id).then(({ data: profile }) => {
          setAdminProfile(profile)
          setLoading(false)
        })
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  const signIn = async (email: string, password: string) => {
    return supabase.auth.signInWithPassword({ email, password })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const refreshProfile = async () => {
    if (user) {
      setLoading(true)
      const { data } = await getAdminProfile(user.id)
      setAdminProfile(data)
      setLoading(false)
    }
  }

  const value = {
    user,
    adminProfile,
    loading,
    signIn,
    signOut,
    refreshProfile
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
