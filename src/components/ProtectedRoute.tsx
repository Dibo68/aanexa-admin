'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Nur wenn das Laden abgeschlossen ist UND kein Benutzer da ist,
    // leiten wir zur Login-Seite weiter.
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  // Solange die Authentifizierung geprüft wird, zeige einen Ladebildschirm.
  // Das verhindert das "Blinken".
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Wenn das Laden fertig ist und ein Benutzer da ist, zeige die Seite.
  if (user) {
    return <>{children}</>
  }

  // Ansonsten zeige nichts (da der Redirect läuft).
  return null
}
