// src/context/AuthContext.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase, AdminProfile, getAdminProfile, updateAdminLastLogin } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  adminProfile: AdminProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  adminProfile: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signOut: async () => {},
  refreshProfile: async () => {}
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // Lade initial Session und Admin-Profil
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadAdminProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen für Auth-Änderungen
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await loadAdminProfile(session.user.id)
          
          // Update last login bei neuer Session
          if (event === 'SIGNED_IN') {
            await updateAdminLastLogin(session.user.id)
          }
        } else {
          setAdminProfile(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const loadAdminProfile = async (userId: string) => {
    try {
      const { data, error } = await getAdminProfile(userId)
      
      if (error) {
        console.error('Error loading admin profile:', error)
        setAdminProfile(null)
      } else {
        setAdminProfile(data)
      }
    } catch (error) {
      console.error('Error loading admin profile:', error)
      setAdminProfile(null)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        return { error }
      }

      // Session wird automatisch durch onAuthStateChange verarbeitet
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      await supabase.auth.signOut()
      // State wird automatisch durch onAuthStateChange gecleared
    } catch (error) {
      console.error('Error signing out:', error)
      setLoading(false)
    }
  }

  const refreshProfile = async () => {
    if (user) {
      await loadAdminProfile(user.id)
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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
