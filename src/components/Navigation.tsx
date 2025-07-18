'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/context/AuthContext'

interface NavigationProps {
  currentPath?: string
}

export default function Navigation({ currentPath }: NavigationProps) {
  const { adminProfile, signOut } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await signOut()
    // setIsLoggingOut(false) ist nicht nötig, da die Seite neu lädt
  }

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Admins', href: '/dashboard/admins' },
    { name: 'Customers', href: '/dashboard/customers' },
    { name: 'Settings', href: '/dashboard/settings' }
  ]

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <Image
                src="https://aanexa.com/wp-content/uploads/2025/07/Copy-of-Logo-001-1-color-removebg-preview.png"
                alt="Aanexa Logo"
                width={120}
                height={40}
                className="h-8 w-auto"
                priority
              />
              <span className="text-xl font-semibold text-gray-900">Admin</span>
            </Link>
          </div>

          <div className="flex items-center">
            {adminProfile && (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 rounded-lg"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {adminProfile?.full_name?.charAt(0)?.toUpperCase() || 'A'}
                    </span>
                  </div>
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border z-50">
                    <div className="px-4 py-3 border-b">
                      <p className="text-sm font-medium">{adminProfile.full_name}</p>
                      <p className="text-sm text-gray-500">{adminProfile.email}</p>
                    </div>
                    <div className="py-1">
                      <Link href="/dashboard/profile" onClick={() => setShowUserMenu(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        My Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        {isLoggingOut ? 'Signing out...' : 'Sign Out'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
