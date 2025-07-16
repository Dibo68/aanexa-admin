'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import AdminTable from './components/AdminTable'
import AddAdminModal from './components/AddAdminModal'
import { supabase, AdminProfile } from '@/lib/supabase'

export type NewAdminData = {
  email: string
  full_name: string
  password_hash: string // This is a temporary name for the password field from the form
  role: 'super_admin' | 'admin'
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState<AdminProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [error, setError] = useState('')

  const fetchAdmins = async () => {
    try {
      setLoading(true)
      setError('')
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error
      setAdmins(data || [])
    } catch (err: any) {
      setError('Could not fetch administrator data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdmins()
  }, [])

  const handleAddAdmin = async (adminData: NewAdminData) => {
    // Diese Funktion implementieren wir als Nächstes
  }

  // HIER IST DIE ÄNDERUNG: Die Funktion ist jetzt mit Logik gefüllt
  const handleUpdateAdmin = async (adminId: string, updates: Partial<AdminProfile>) => {
    setError(''); // Fehler vom letzten Versuch zurücksetzen
    try {
      const response = await fetch(`/api/admins/${adminId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update admin');
      }
      
      // Lade die Admin-Liste neu, um die Änderungen sofort zu sehen
      await fetchAdmins();

    } catch (err: any) {
      console.error("Update failed:", err);
      setError(err.message);
      // Optional: Lade die Liste neu, um die alten Daten wiederherzustellen, falls der Server-Call fehlschlägt
      await fetchAdmins();
    }
  }


  const handleDeleteAdmin = async (adminId: string) => {
    // Implementieren wir später
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
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
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
          onClose={() => {
            setShowAddModal(false)
            setError('') 
          }}
          onAdd={handleAddAdmin}
        />
      )}
    </div>
  )
}
