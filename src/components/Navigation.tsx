'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface NavigationProps {
  currentPath?: string
}

export default function Navigation({ currentPath }: NavigationProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setIsLoggingOut(true)
    
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST'
      })
      
      if (response.ok) {
        router.push('/login')
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">Aanexa Admin</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                currentPath === '/dashboard' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Dashboard
            </Link>
            
            <Link
              href="/dashboard/customers"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                currentPath === '/dashboard/customers' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Customers
            </Link>
            
            <Link
              href="/dashboard/collections"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                currentPath === '/dashboard/collections' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Collections
            </Link>
            
            <Link
              href="/dashboard/upload"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                currentPath === '/dashboard/upload' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Upload
            </Link>

            <Link
              href="/dashboard/admins"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                currentPath === '/dashboard/admins' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Admins
            </Link>
            
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 disabled:opacity-50"
            >
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
