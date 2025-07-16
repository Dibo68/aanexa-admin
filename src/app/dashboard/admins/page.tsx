'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import AdminTable from './components/AdminTable'
import AddAdminModal from './components/AddAdminModal'
import { supabase, AdminProfile } from '@/lib/supabase'

export default function AdminsPage() {
  const [admins, setAdmins] = useState<AdminProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [error, setError] = useState('')

  // NEU: Funktion, um Admins aus Supabase zu laden
  const fetchAdmins = async () => {
    try {
      setLoading(true)
      setError('')
      
      const { data, error } = await supabase
        .from('admin_users')
        .select('*') // Holt alle Spalten, die wir brauchen
        .order('created_at', { ascending: false }); // Sortiert die neusten zuerst

      if (error) {
        throw error
      }

      setAdmins(data || [])

    } catch (err: any) {
      console.error('Error fetching admins:', err)
      setError('Could not fetch administrator data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // useEffect Hook, der die neue Funktion beim Laden der Seite aufruft
  useEffect(() => {
    fetchAdmins()
  }, [])

  const handleAddAdmin = async (adminData: Omit<AdminProfile, 'id' | 'created_at' | 'updated_at' | 'last_login'>) => {
    // Diese Funktion passen wir im nächsten Schritt an
    console.log("Neuer Admin soll hinzugefügt werden:", adminData)
    // Zur Demonstration fügen wir ihn zur lokalen Liste hinzu und laden dann neu
    const newAdmin: AdminProfile = {
      ...adminData,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    setAdmins(prev => [newAdmin, ...prev])
    setShowAddModal(false)
  }

  const handleDeleteAdmin = async (adminId: string) => {
    console.log("Admin löschen:", adminId)
    // Logik folgt
  }

  const handleUpdateAdmin = async (adminId: string, updates: Partial<AdminProfile>) => {
    console.log("Admin updaten:", adminId, updates)
    // Logik folgt
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

          {error && (
            <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
              <span className="font-medium">Error!</span> {error}
            </div>
          )}

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
