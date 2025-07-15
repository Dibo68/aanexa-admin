'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import ProfileForm from './components/ProfileForm'
import PasswordChange from './components/PasswordChange'

// Interface für Admin-Profil
interface AdminProfile {
  id: string
  email: string
  name: string
  role: 'super_admin' | 'admin'
  status: 'active' | 'inactive'
  created_at: string
  last_login?: string
}

export default function ProfilePage() {
  const [currentAdmin, setCurrentAdmin] = useState<AdminProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Mock - später aus Session/Token holen
  useEffect(() => {
    // Simuliere API-Call zum aktuellen User
    setTimeout(() => {
      setCurrentAdmin({
        id: '1',
        email: 'admin@aanexa.com',
        name: 'Dibo Admin',
        role: 'super_admin',
        status: 'active',
        created_at: '2024-07-01T10:00:00Z',
        last_login: '2024-07-15T08:30:00Z'
      })
      setLoading(false)
    }, 500)
  }, [])

  const handleProfileUpdate = async (updates: Partial<AdminProfile>) => {
    try {
      setLoading(true)
      setError('')
      
      // Hier später echte API-Calls
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API
      
      setCurrentAdmin(prev => prev ? { ...prev, ...updates } : null)
      setSuccess('Profile updated successfully!')
      
      // Success message nach 3 Sekunden ausblenden
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      setError('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (passwordData: { currentPassword: string, newPassword: string }) => {
    try {
      setLoading(true)
      setError('')
      
      // Hier später echte API-Calls mit Password-Verification
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API
      
      setSuccess('Password changed successfully!')
      
      // Success message nach 3 Sekunden ausblenden
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      setError('Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  if (loading && !currentAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navigation currentPath="/dashboard/profile" />
        <main className="max-w-4xl mx-auto py-8 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!currentAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navigation currentPath="/dashboard/profile" />
        <main className="max-w-4xl mx-auto py-8 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0 text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.768 0L3.056 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h3 className="text-lg font-medium text-red-800 mb-2">Profile Not Found</h3>
              <p className="text-red-600">Unable to load your profile information. Please try logging in again.</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation currentPath="/dashboard/profile" />
      
      <main className="max-w-4xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
              My Profile
            </h1>
            <p className="text-gray-600">
              Manage your account settings and preferences
            </p>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {success}
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}

          {/* Profile Information Card */}
          <div className="bg-white shadow-lg rounded-xl border border-gray-200 mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Account Information
              </h3>
            </div>
            
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    currentAdmin.role === 'super_admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {currentAdmin.role === 'super_admin' ? 'Super Administrator' : 'Administrator'}
                  </span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Status
                  </label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    currentAdmin.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {currentAdmin.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Member Since
                  </label>
                  <p className="text-gray-900">
                    {new Date(currentAdmin.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Login
                  </label>
                  <p className="text-gray-900">
                    {currentAdmin.last_login 
                      ? new Date(currentAdmin.last_login).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'Never'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form Card */}
          <div className="bg-white shadow-lg rounded-xl border border-gray-200 mb-12">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Edit Profile
              </h3>
            </div>
            <div className="p-6">
              <ProfileForm
                admin={currentAdmin}
                onUpdate={handleProfileUpdate}
                loading={loading}
              />
              {/* Platz für zukünftige Features wie Avatar, Aktivitäten etc. */}
            </div>
          </div>

          {/* Passwort-Bereich GANZ UNTEN mit großem Abstand */}
          <div id="password" className="bg-white shadow-lg rounded-xl border border-gray-200 mt-16 mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-1.104.896-2 2-2s2 .896 2 2m-6 0c0-1.104.896-2 2-2s2 .896 2 2m-6 0a2 2 0 012 2v2a2 2 0 01-2 2H6m6 0v2m0 0h2m-2 0h-2" />
                </svg>
                Change Password
              </h3>
            </div>
            <div className="p-6">
              <PasswordChange
                onPasswordChange={handlePasswordChange}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
