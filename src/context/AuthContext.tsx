// Pfad: src/context/AuthContext.tsx

'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Session, User } from '@supabase/supabase-js'
import { AdminProfile } from '@/types'

type AuthContextType = {
  session: Session | null
  user: User | null
  adminProfile: AdminProfile | null
  loading: boolean
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  adminProfile: null,
  loading: true,
  refreshProfile: async () => {}
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const supabase = createClient()
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshProfile = async () => {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', user?.id)
      .single()

    if (error) {
      console.error('Error loading profile:', error)
      setAdminProfile(null)
    } else {
      setAdminProfile(data)
    }
  }

  useEffect(() => {
    const cookies = document.cookie.split(';').map(c => c.trim().split('='))
    const access = cookies.find(c => c[0] === 'supabase-access-token')?.[1]
    const refresh = cookies.find(c => c[0] === 'supabase-refresh-token')?.[1]

    if (access && refresh) {
      supabase.auth.setSession({
        access_token: access,
        refresh_token: refresh
      })
    }

    const getSession = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession()
      setSession(session ?? null)
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getSession()
  }, [])

  useEffect(() => {
    if (user) {
      refreshProfile()
    }
  }, [user])

  return (
    <AuthContext.Provider
      value={{ session, user, adminProfile, loading, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
