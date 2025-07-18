// src/app/login/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Image from 'next/image'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { signIn, user, adminProfile, loading: authLoading } = useAuth()
  const router = useRouter()

  // Redirect wenn bereits eingeloggt
  useEffect(() => {
    if (!authLoading && user && adminProfile) {
      router.push('/dashboard')
    }
  }, [user, adminProfile, authLoading, router])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setErrors({})

    try {
      const { error } = await signIn(formData.email, formData.password)
      
      if (error) {
        // Handle different Supabase error types
        if (error.message.includes('Invalid login credentials')) {
          setErrors({ general: 'Invalid email or password' })
        } else if (error.message.includes('Email not confirmed')) {
          setErrors({ general: 'Please check your email and confirm your account' })
        } else if (error.message.includes('Too many requests')) {
          setErrors({ general: 'Too many login attempts. Please try again later.' })
        } else {
          setErrors({ general: error.message || 'Login failed. Please try again.' })
        }
      }
      // Success wird durch AuthContext + useEffect redirect gehandelt
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field] || errors.general) {
      setErrors({})
    }
  }

  // Show loading während Auth-Check
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="https://aanexa.com/wp-content/uploads/2025/07/Copy-of-Logo-001-1-color-removebg-preview.png"
            alt="Aanexa Logo"
            width={180}
            height={60}
            className="h-12 w-auto"
            priority
          />
        </div>
        
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
          Admin Dashboard
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to access the Aanexa management system
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-xl sm:px-10 border border-gray-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* ... rest of the form ... */}
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            © 2025 Aanexa. Secure admin access for AI service management.
          </p>
        </div>
      </div>
    </div>
  )
}
