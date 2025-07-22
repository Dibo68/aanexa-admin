// Pfad: src/context/AuthContext.tsx

'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Session, User } from '@supabase/supabase-js'

export type AuthContextType = {
  user: User | null
  session: Session | null
  adminProfile: any | null
  refreshProfile: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const supabase = createClient()

  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [adminProfile, setAdminProfile] = useState<any | null>(null)

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
    }

    getSession()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
    })

    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [])

  const refreshProfile = async () => {
    if (!user) return
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!error) {
      setAdminProfile(data)
    } else {
      console.error('Error fetching admin profile:', error.message)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    setAdminProfile(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        adminProfile,
        refreshProfile,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
