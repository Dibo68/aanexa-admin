// Pfad: src/app/dashboard/admins/page.tsx

'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/utils/supabase/client'
import { AdminTable } from '@/components/AdminTable'
import { AddAdminModal } from '@/components/AddAdminModal'

export default function AdminPage() {
  const { session } = useAuth()
  const supabase = createClient()

  const [admins, setAdmins] = useState<any[]>([])
  const [refresh, setRefresh] = useState(false)
  const [error, setError] = useState('')

  const fetchAdmins = async () => {
    if (!session) return

    const { data, error } = await supabase.from('admin_users').select('*')

    if (error) {
      console.error('Error fetching admins:', error.message)
      setError('Failed to fetch admins')
    } else {
      setAdmins(data || [])
    }
  }

  useEffect(() => {
    fetchAdmins()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, refresh])

  const handleUpdateAdmin = async (adminId: string, values: any) => {
    try {
      const res = await fetch('/api/admin/update', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: adminId, update: values })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Update failed')
      }

      setRefresh(prev => !prev)
    } catch (err: any) {
      console.error('Update failed:', err.message)
      setError(err.message)
    }
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Administrators</h1>
        <AddAdminModal onSuccess={() => setRefresh(prev => !prev)} />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <AdminTable admins={admins} onUpdate={handleUpdateAdmin} />
    </div>
  )
}
