'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import AdminTable from './components/AdminTable'
import { supabase, AdminProfile } from '@/lib/supabase'
import { updateAdmin } from '@/lib/actions'

export default function AdminsPage() {
  const [admins, setAdmins] = useState<AdminProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchAdmins = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) setError('Could not fetch admins.');
    else setAdmins(data || []);
    
    setLoading(false);
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation currentPath="/dashboard/admins" />
      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-xl border border-gray-200 p-6">
           <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-4">Admin Management</h1>
          <AdminTable
            admins={admins}
            loading={loading}
            onUpdate={updateAdmin}
            onDataChange={fetchAdmins}
          />
        </div>
      </main>
    </div>
  )
}
