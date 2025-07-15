// src/components/ProtectedRoute.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'super_admin' | 'admin'
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, adminProfile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Wenn Loading fertig ist und kein User da ist → Login
    if (!loading && !user) {
      router.push('/login')
      return
    }

    // Wenn User da ist aber kein Admin-Profil → Error/Login
    if (!loading && user && !adminProfile) {
      console.error('User found but no admin profile')
      router.push('/login')
      return
    }

    // Rolle prüfen falls requiredRole gesetzt
    if (!loading && user && adminProfile && requiredRole) {
      const hasRequiredRole = 
        requiredRole === 'admin' 
          ? ['admin', 'super_admin'].includes(adminProfile.role)
          : adminProfile.role === 'super_admin'

      if (!hasRequiredRole) {
        // Nicht genug Berechtigung
        console.error('Insufficient permissions')
        router.push('/dashboard') // Redirect zu Dashboard (oder eine "Access Denied" Seite)
        return
      }
    }

    // Status prüfen - inaktive Admins ausloggen
    if (!loading && user && adminProfile && adminProfile.status === 'inactive') {
      console.error('Admin account is inactive')
      router.push('/login')
      return
    }
  }, [user, adminProfile, loading, router, requiredRole])

  // Loading anzeigen während Auth-Check
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

  // Nicht eingeloggt → nichts anzeigen (redirect läuft)
  if (!user || !adminProfile) {
    return null
  }

  // Inaktiver Admin → nichts anzeigen
  if (adminProfile.status === 'inactive') {
    return null
  }

  // Rolle prüfen
  if (requiredRole) {
    const hasRequiredRole = 
      requiredRole === 'admin' 
        ? ['admin', 'super_admin'].includes(adminProfile.role)
        : adminProfile.role === 'super_admin'

    if (!hasRequiredRole) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <div className="text-center">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.768 0L3.056 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">
              You don't have permission to access this area.
              {requiredRole === 'super_admin' ? ' Super Admin access required.' : ''}
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )
    }
  }

  // Alles OK → Seite anzeigen
  return <>{children}</>
}
