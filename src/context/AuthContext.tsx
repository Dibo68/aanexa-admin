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

const AuthContext = createContext<AuthContextType>(null!)
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user
      setUser(currentUser ?? null)
      if (currentUser) {
        const { data: profile } = await getAdminProfile(currentUser.id)
        setAdminProfile(profile)
      } else {
        setAdminProfile(null)
      }
      setLoading(false)
    })
    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }
  
  const refreshProfile = async () => {
    if (user) {
      const { data: profile } = await getAdminProfile(user.id)
      setAdminProfile(profile)
    }
  }

  const value = { user, adminProfile, loading, signOut, refreshProfile }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
