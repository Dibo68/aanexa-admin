// src/app/dashboard/profile/page.tsx
'use client'

import { useState } from 'react'
import Navigation from '@/components/Navigation'
import ProfileForm from './components/ProfileForm'
import PasswordChange from './components/PasswordChange'
import { useAuth } from '@/context/AuthContext'
import { supabase, AdminProfile } from '@/lib/supabase'

export default function ProfilePage() {
  const { adminProfile, refreshProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleProfileUpdate = async (updates: Partial<AdminProfile>) => {
    if (!adminProfile) return

    try {
      setLoading(true)
      setError('')
      
      // Nur name und email updates erlauben
      const allowedUpdates: any = {}
      if (updates.name !== undefined) allowedUpdates.name = updates.name
      if (updates.email !== undefined) allowedUpdates.email = updates.email
      
      // Update admin profile in database
      const { error: updateError } = await supabase
        .from('admin_users')  // ← KORRIGIERT: admin_users statt admins
        .update({
          ...allowedUpdates,
          updated_at: new Date().toISOString()
        })
        .eq('id', adminProfile.id)

      if (updateError) {
        throw updateError
      }

      // Update auth user email if changed
      if (updates.email && updates.email !== adminProfile.email) {
        const { error: authError } = await supabase.auth.updateUser({
          email: updates.email
        })
        
        if (authError) {
          throw authError
        }
      }

      // Refresh profile data
      await refreshProfile()
      
      setSuccess('Profile updated successfully!')
      
      // Success message nach 3 Sekunden ausblenden
      setTimeout(() => setSuccess(''), 3000)
    } catch (error: any) {
      console.error('Profile update error:', error)
      setError(error.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (passwordData: { currentPassword: string, newPassword: string }) => {
    try {
      setLoading(true)
      setError('')
      
      // Update password in Supabase Auth
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      })

      if (error) {
        throw error
      }
      
      setSuccess('Password changed successfully!')
      
      // Success message nach 3 Sekunden ausblenden
      setTimeout(() => setSuccess(''), 3000)
    } catch (error: any) {
      console.error('Password change error:', error)
      setError(error.message || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  // Loading state während adminProfile lädt
  if (!adminProfile) {
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
                    adminProfile.role === 'super_admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {adminProfile.role === 'super_admin' ? 'Super Administrator' : 'Administrator'}
                  </span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Status
                  </label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    adminProfile.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {adminProfile.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Member Since
                  </label>
                  <p className="text-gray-900">
                    {new Date(adminProfile.created_at).toLocaleDateString('en-US', {
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
                    {adminProfile.last_login 
                      ? new Date(adminProfile.last_login).toLocaleDateString('en-US', {
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
          <div className="mb-12">
            <ProfileForm
              admin={adminProfile}
              onUpdate={handleProfileUpdate}
              loading={loading}
            />
          </div>

          {/* Passwort-Bereich GANZ UNTEN mit großem Abstand */}
          <div id="password" className="mt-16 mb-8">
            <PasswordChange
              onPasswordChange={handlePasswordChange}
              loading={loading}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
