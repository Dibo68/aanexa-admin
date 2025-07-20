'use client'

import { useState, useEffect, useCallback } from 'react'
import Navigation from '@/components/Navigation'
import AdminTable from './components/AdminTable'
import AddAdminModal from './components/AddAdminModal'
import { supabase, AdminProfile } from '@/lib/supabase'
import { updateAdmin, addAdmin, deleteAdmin } from '@/lib/actions'
import { NewAdminData } from '@/lib/types'

export default function AdminsPage() {
  const [admins, setAdmins] = useState<AdminProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [error, setError] = useState('')

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('admin_users').select('*').order('created_at');
    if (error) setError(error.message);
    else setAdmins(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const handleAddAdmin = async (adminData: NewAdminData) => {
    const result = await addAdmin(adminData);
    if (result.error) setError(result.error);
    else {
      setShowAddModal(false);
      fetchAdmins();
    }
  }

  const handleDeleteAdmin = async (adminId: string) => {
    if (confirm('Are you sure you want to delete this admin? This action cannot be undone.')) {
      const result = await deleteAdmin(adminId);
      if (result.error) alert(result.error);
      else fetchAdmins();
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation currentPath="/dashboard/admins" />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Management</h1>
            <p className="text-gray-600 mt-1">Manage administrator accounts and permissions.</p>
          </div>
          <button onClick={() => setShowAddModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            Add Admin
          </button>
        </div>
        
        {error && <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">{error}</div>}

        <div className="bg-white shadow-md rounded-lg">
          <AdminTable
            admins={admins}
            loading={loading}
            onUpdate={updateAdmin}
            onDelete={handleDeleteAdmin}
            onDataChange={fetchAdmins}
          />
        </div>
      </main>

      {showAddModal && (
        <AddAdminModal
          key={Date.now()}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddAdmin}
        />
      )}
    </div>
  )
}
