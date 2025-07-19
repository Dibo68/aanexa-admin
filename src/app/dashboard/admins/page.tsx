'use client'

import { useState, useEffect, useCallback } from 'react'
import Navigation from '@/components/Navigation'
import AdminTable from './components/AdminTable'
import { supabase, AdminProfile } from '@/lib/supabase'
import { updateAdmin } from '@/lib/actions'

export default function AdminsPage() {
  const [admins, setAdmins] = useState<AdminProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // useCallback sorgt dafür, dass die Funktion stabil bleibt
  // und nicht bei jedem Re-Render neu erstellt wird.
  const fetchAdmins = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const { data, error: fetchError } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setAdmins(data || []);
    } catch (err: any) {
      setError('Could not fetch administrator data.');
    } finally {
      // Dieser Block garantiert, dass das Laden immer beendet wird.
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation currentPath="/dashboard/admins" />
      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-xl border border-gray-200 p-6">
           <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-4">Admin Management</h1>
          {error && <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">{error}</div>}
          <AdminTable
            admins={admins}
            loading={loading}
            onUpdate={updateAdmin}
            onDataChange={fetchAdmins} // Die stabile fetchAdmins-Funktion wird übergeben
          />
        </div>
      </main>
    </div>
  )
}
