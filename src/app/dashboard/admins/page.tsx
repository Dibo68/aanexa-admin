'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import AdminTable from './components/AdminTable'
import AddAdminModal from './components/AddAdminModal'
import { supabase, AdminProfile } from '@/lib/supabase'
import { updateAdmin, addAdmin } from '@/lib/actions' // NEU: addAdmin importieren
import { NewAdminData } from '@/lib/types'

export default function AdminsPage() {
  const [admins, setAdmins] = useState<AdminProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [error, setError] = useState('')

  const fetchAdmins = async () => {
    try {
      setError('')
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error
      setAdmins(data || []);
      
    } catch (err: any) {
      setError('Could not fetch administrator data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdmins();
  }, []);

  // HIER IST DIE NEUE LOGIK:
  const handleAddAdmin = async (adminData: NewAdminData) => {
    setError('')
    const result = await addAdmin(adminData);

    if (result.error) {
      setError(result.error);
    } else {
      setShowAddModal(false); // Modal bei Erfolg schließen
      await fetchAdmins(); // Liste neu laden, um den neuen Admin anzuzeigen
    }
  }

  const handleDeleteAdmin = async (adminId: string) => {
    // Implementieren wir als Nächstes
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation currentPath="/dashboard/admins" />
      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Admin Management</h1>
              <p className="text-gray-600 mt-2">Manage administrator accounts and permissions.</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Admin
            </button>
          </div>
          
          {error && <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">{error}</div>}

          <div className="bg-white shadow-lg rounded-xl border border-gray-200">
            <AdminTable
              admins={admins}
              loading={loading}
              onUpdate={updateAdmin}
              onDelete={handleDeleteAdmin}
              onDataChange={fetchAdmins}
            />
          </div>
        </div>
      </main>

      {showAddModal && (
        <AddAdminModal
          onClose={() => {
            setShowAddModal(false)
            setError('') // Fehler zurücksetzen, wenn das Modal geschlossen wird
          }}
          onAdd={handleAddAdmin}
        />
      )}
    </div>
  )
}
