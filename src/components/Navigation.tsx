// src/components/Navigation.tsx
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

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: /* ... icon ... */ },
    { name: 'Admins', href: '/dashboard/admins', icon: /* ... icon ... */ },
    { name: 'Customers', href: '/dashboard/customers', icon: /* ... icon ... */ },
    { name: 'Settings', href: '/dashboard/settings', icon: /* ... icon ... */ }
  ]

  // ... other functions ...

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
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

            {/* Hauptnavigation */}
            <div className="hidden md:ml-10 md:flex md:space-x-1">
              {/* ... menu items ... */}
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* ... user menu ... */}
          </div>
        </div>
      </div>

      {/* Mobile Menu Button - für später */}
      {/* ... mobile menu ... */}

      {/* Overlay um Dropdown zu schließen */}
      {/* ... overlay ... */}
    </nav>
  )
}
