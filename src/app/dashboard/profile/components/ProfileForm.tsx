'use client'

import { useState, useEffect } from 'react'

interface AdminProfile {
  id: string
  email: string
  full_name: string  // ← KORRIGIERT: war 'name'
  role: 'super_admin' | 'admin'
  status: 'active' | 'inactive'
  created_at: string
  last_login?: string
}

interface ProfileFormProps {
  admin: AdminProfile
  onUpdate: (updates: Partial<AdminProfile>) => Promise<void>
  loading: boolean
}

export default function ProfileForm({ admin, onUpdate, loading }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    full_name: admin.full_name,  // ← KORRIGIERT: war 'name'
    email: admin.email
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [hasChanges, setHasChanges] = useState(false)

  // Reset form when admin changes
  useEffect(() => {
    setFormData({
      full_name: admin.full_name,  // ← KORRIGIERT: war 'name'
      email: admin.email
    })
    setHasChanges(false)
    setErrors({})
  }, [admin])

  // Track changes
  useEffect(() => {
    const changed = formData.full_name !== admin.full_name || formData.email !== admin.email  // ← KORRIGIERT
    setHasChanges(changed)
  }, [formData, admin])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Name validation
    if (!formData.full_name.trim()) {  // ← KORRIGIERT: war 'name'
      newErrors.full_name = 'Name is required'  // ← KORRIGIERT
    } else if (formData.full_name.trim().length < 2) {  // ← KORRIGIERT
      newErrors.full_name = 'Name must be at least 2 characters long'  // ← KORRIGIERT
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      await onUpdate({
        full_name: formData.full_name.trim(),  // ← KORRIGIERT: war 'name'
        email: formData.email.trim().toLowerCase()
      })
    } catch (error) {
      setErrors({ general: 'Failed to update profile' })
    }
  }

  const handleReset = () => {
    setFormData({
      full_name: admin.full_name,  // ← KORRIGIERT: war 'name'
      email: admin.email
    })
    setErrors({})
    setHasChanges(false)
  }

  return (
    <div className="bg-white shadow-lg rounded-xl border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit Profile
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {/* General Error */}
        {errors.general && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {errors.general}
          </div>
        )}

        {/* Name Field */}
        <div>
          <label htmlFor="profile-name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="profile-name"
            value={formData.full_name}  {/* ← KORRIGIERT: war 'name' */}
            onChange={(e) => handleInputChange('full_name', e.target.value)}  {/* ← KORRIGIERT */}
            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              errors.full_name ? 'border-red-300 bg-red-50' : 'border-gray-300'  // ← KORRIGIERT
            }`}
            placeholder="Enter your full name"
            disabled={loading}
          />
          {errors.full_name && (  /* ← KORRIGIERT: war 'name' */
            <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="profile-email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="profile-email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Enter your email address"
            disabled={loading}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            This email will be used for login and notifications
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={handleReset}
            disabled={!hasChanges || loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Reset Changes
          </button>
          
          <button
            type="submit"
            disabled={!hasChanges || loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Changes
              </>
            )}
          </button>
        </div>

        {/* Changes Indicator */}
        {hasChanges && !loading && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center text-yellow-800">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">You have unsaved changes</span>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
