'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import AdminTable from './components/AdminTable'
import AddAdminModal from './components/AddAdminModal'
import { AdminProfile } from '@/lib/supabase'

export default function AdminsPage() {
  const [admins, setAdmins] = useState<AdminProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Simulierter API-Call mit korrekten Mock-Daten
    setTimeout(() => {
      setAdmins([
        {
          id: '1',
          email: 'admin@aanexa.com',
          full_name: 'Dibo Admin',
          role: 'super_admin',
          status: 'active',
          created_at: '2024-07-01T10:00:00Z',
          updated_at: '2024-07-01T10:00:00Z',
          last_login: '2024-07-15T08:30:00Z'
        },
        {
          id: '2',
          email: 'support@aanexa.com',
          full_name: 'Support Team',
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
    // window.confirm ist in Coolify nicht sichtbar, daher verwenden wir es nur für die Mock-Phase
    if (window.confirm('Are you sure you want to delete this admin?')) {
      try {
        setAdmins(prev => prev.filter(admin => admin.id !== adminId))
      } catch (error) {
        setError('Failed to delete admin')
      }
    }
  }

  const handleUpdateAdmin = async (adminId: string, updates: Partial<AdminProfile>) => {
    try {
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

      {showAddModal && (
        <AddAdminModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddAdmin}
        />
      )}
    </div>
  )
}
