'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase, AdminProfile, getAdminProfile } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  adminProfile: AdminProfile | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>(null!)
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user)
        const { data: profile } = await getAdminProfile(session.user.id)
        setAdminProfile(profile)
      } else {
        setUser(null)
        setAdminProfile(null)
      }
      setLoading(false)
    })
    return () => subscription.unsubscribe()
  }, [])

  const value = { user, adminProfile, loading }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
