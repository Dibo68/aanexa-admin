'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import AdminTable from './components/AdminTable'
import { supabase, AdminProfile } from '@/lib/supabase'
import { updateAdmin } from '@/lib/actions' // Wir importieren die Server Action

export default function AdminsPage() {
  const [admins, setAdmins] = useState<AdminProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAdmins = async () => {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) setError('Could not fetch admins.');
      else setAdmins(data || []);
      
      setLoading(false);
    };
    fetchAdmins();
  }, []);

  // Die handleUpdateAdmin wird jetzt direkt in die AdminTable übergeben
  // und ruft die sichere Server Action auf.

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation currentPath="/dashboard/admins" />
      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Admin Management</h1>
            <p className="text-gray-600 mt-2">Manage administrator accounts and permissions.</p>
          </div>
          
          {error && <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">{error}</div>}

          <div className="bg-white shadow-lg rounded-xl border border-gray-200">
            <AdminTable
              admins={admins}
              loading={loading}
              onUpdate={updateAdmin} // Wir übergeben die Server Action direkt
            />
          </div>
        </div>
      </main>
    </div>
  )
}
