// Pfad: src/context/AuthContext.tsx

'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import type { Session } from '@supabase/supabase-js'

type AuthContextType = {
  session: Session | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  // ⬇️ HIER wird der Cookie-Token übernommen und Session gesetzt
  useEffect(() => {
    const cookies = document.cookie.split(';').map(c => c.trim().split('='))
    const access = cookies.find(c => c[0] === 'supabase-access-token')?.[1]
    const refresh = cookies.find(c => c[0] === 'supabase-refresh-token')?.[1]

    if (access && refresh) {
      supabase.auth.setSession({
        access_token: access,
        refresh_token: refresh
      }).then(({ data, error }) => {
        if (!error) {
          setSession(data.session ?? null)
        }
        setLoading(false)
      })
    } else {
      setLoading(false)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
