// Pfad: src/context/AuthContext.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/client'

type AdminRole = 'admin' | 'super_admin' | null

type AuthContextType = {
  user: User | null
  session: Session | null
  adminProfile: {
    role: AdminRole
  } | null
  refreshProfile: () => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const supabase = createClient()
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [adminProfile, setAdminProfile] = useState<{ role: AdminRole } | null>(null)

  useEffect(() => {
    const cookies = document.cookie.split(';').map(c => c.trim().split('='))
    const access = cookies.find(c => c[0] === 'supabase-access-token')?.[1]
    const refresh = cookies.find(c => c[0] === 'supabase-refresh-token')?.[1]

    if (access && refresh) {
      supabase.auth.setSession({ access_token: access, refresh_token: refresh })
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setUser(data.session?.user ?? null)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const refreshProfile = async () => {
    if (!user) return
    const { data, error } = await supabase
      .from('admin_users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!error && data) {
      setAdminProfile({ role: data.role })
    } else {
      setAdminProfile(null)
    }
  }

  const signOut = () => {
    supabase.auth.signOut()
    setUser(null)
    setSession(null)
    setAdminProfile(null)
  }

  return (
    <AuthContext.Provider value={{ user, session, adminProfile, refreshProfile, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
