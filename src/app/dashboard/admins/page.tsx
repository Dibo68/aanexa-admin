'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import AdminTable from './components/AdminTable'
import AddAdminModal from './components/AddAdminModal'
import { AdminProfile } from '@/lib/supabase' // Importiere den korrekten Typ

// Interface für Admin-Daten
// Wir verwenden jetzt direkt AdminProfile, um konsistent zu sein
// Falls du hier eine abweichende Struktur brauchst, können wir das anpassen
// Für jetzt ist es aber sauberer, den Typ aus supabase.ts zu nehmen

export default function AdminsPage() {
  const [admins, setAdmins] = useState<AdminProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [error, setError] = useState('')

  // Mock-Daten für jetzt (später aus Supabase)
  useEffect(() => {
    // Simuliere API-Call
    setTimeout(() => {
      setAdmins([
        {
          id: '1',
          email: 'admin@aanexa.com',
          full_name: 'Dibo Admin', // Geändert von name zu full_name
          role: 'super_admin',
          status: 'active',
          created_at: '2024-07-01T10:00:00Z',
          updated_at: '2024-07-01T10:00:00Z',
          last_login: '2024-07-15T08:30:00Z'
        },
        {
          id: '2',
          email: 'support@aanexa.com',
          full_name: 'Support Team', // Geändert von name zu full_name
          role: 'admin',
          status: 'active',
          created_at: '2024-07-10T14:20:00Z',
          updated_at: '2024-07-10T14:20:00Z',
          last_login: '2024-07-14T16:45:00Z'
        }
      ])
      setLoading(false)
    }, 500)
  }, [])

  const handleAddAdmin = async (adminData: Omit<AdminProfile, 'id' | 'created_at' | 'updated_at' | 'last_login'>) => {
    try {
      // Hier später Supabase API-Call
      const newAdmin: AdminProfile = {
        ...adminData,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      setAdmins(prev => [...prev, newAdmin])
      setShowAddModal(false)
    } catch (error) {
      setError('Failed to add admin')
    }
  }

  const handleDeleteAdmin = async (adminId: string) => {
    if (confirm('Are you sure you want to delete this admin?')) {
      try {
        // Hier später Supabase API-Call
        setAdmins(prev => prev.filter(admin => admin.id !== adminId))
      } catch (error) {
        setError('Failed to delete admin')
      }
    }
  }

  const handleUpdateAdmin = async (adminId: string, updates: Partial<AdminProfile>) => {
    try {
      // Hier später Supabase API-Call
      setAdmins(prev => 
        prev.map(admin => 
          admin.id === adminId ? { ...admin, ...updates } as AdminProfile : admin
        )
      )
    } catch (error) {
      setError('Failed to update admin')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation currentPath="/dashboard/admins" />
      
      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
                  Admin Management
                </h1>
                <p className="text-gray-600">
                  Manage administrator accounts and permissions
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Admin
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-200">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Admins</p>
                    <p className="text-2xl font-bold text-gray-900">{admins.length}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-200">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Active Admins</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {admins.filter(admin => admin.status === 'active').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-200">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Super Admins</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {admins.filter(admin => admin.role === 'super_admin').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Table */}
          <div className="bg-white shadow-lg rounded-xl border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Administrator Accounts</h3>
            </div>
            
            <AdminTable
              admins={admins}
              loading={loading}
              onDelete={handleDeleteAdmin}
              onUpdate={handleUpdateAdmin}
            />
          </div>
        </div>
      </main>

      {/* Add Admin Modal */}
      {showAddModal && (
        <AddAdminModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddAdmin}
        />
      )}
    </div>
  )
}
