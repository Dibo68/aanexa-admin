'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import AdminTable from './components/AdminTable'
import AddAdminModal from './components/AddAdminModal'
import { supabase, AdminProfile } from '@/lib/supabase'

export type NewAdminData = {
  email: string
  full_name: string
  password_hash: string
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

  const handleUpdateAdmin = async (adminId: string, updates: Partial<AdminProfile>) => {
    setError('');
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
      
      await fetchAdmins();

    } catch (err: any) {
      setError(err.message);
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
        {/* ... Rest der Seite ... */}
      </main>
    </div>
  )
}
