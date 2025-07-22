// src/app/dashboard/profile/page.tsx
'use client'

import { useState } from 'react'
import Navigation from '@/components/Navigation'
import ProfileForm from './components/ProfileForm'
import PasswordChange from './components/PasswordChange'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/utils/supabase/client' // Korrekter Import
import { AdminProfile } from '@/lib/supabase'

export default function ProfilePage() {
  const supabase = createClient() // Korrekte Initialisierung
  const { adminProfile, refreshProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleProfileUpdate = async (updates: Partial<AdminProfile>) => {
    if (!adminProfile) return

    try {
      setLoading(true)
      setError('')
      
      const allowedUpdates: any = {}
      if (updates.full_name !== undefined) allowedUpdates.full_name = updates.full_name
      if (updates.email !== undefined) allowedUpdates.email = updates.email
      
      const { error: updateError } = await supabase
        .from('admin_users')
        .update({
          ...allowedUpdates,
          updated_at: new Date().toISOString()
        })
        .eq('id', adminProfile.id)

      if (updateError) throw updateError;

      if (updates.email && updates.email !== adminProfile.email) {
        const { error: authError } = await supabase.auth.updateUser({
          email: updates.email
        })
        if (authError) throw authError;
      }

      await refreshProfile()
      setSuccess('Profile updated successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (error: any) {
      setError(error.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (passwordData: { newPassword: string }) => {
    try {
      setLoading(true)
      setError('')
      
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      })

      if (error) throw error;
      
      setSuccess('Password changed successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (error: any) {
      setError(error.message || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  if (!adminProfile) {
    return <div>Loading Profile...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation currentPath="/dashboard/profile" />
      
      <main className="max-w-4xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
              My Profile
            </h1>
            <p className="text-gray-600">
              Manage your account settings and preferences
            </p>
          </div>

          {success && <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">{success}</div>}
          {error && <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}

          {/* ... Rest der UI bleibt unverändert */}
          
          <div className="mb-12">
            <ProfileForm
              admin={adminProfile}
              onUpdate={handleProfileUpdate}
              loading={loading}
            />
          </div>

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
