// Pfad: src/app/dashboard/admins/page.tsx

'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { AddAdminModal } from './components/AddAdminModal'
import { AdminTable } from './components/AdminTable'

export default function AdminPage() {
  const { session, loading } = useAuth()
  const [admins, setAdmins] = useState<any[]>([])
  const [refresh, setRefresh] = useState(false)

  // Fetch admin list
  useEffect(() => {
    const fetchAdmins = async () => {
      const res = await fetch('/api/admin/list', {
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        }
      })

      const data = await res.json()
      setAdmins(data.admins ?? [])
    }

    if (session && !loading) fetchAdmins()
  }, [session, loading, refresh])

  async function handleUpdateAdmin(adminId: string, values: any) {
    const res = await fetch('/api/admin/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.access_token}`
      },
      body: JSON.stringify({
        id: adminId,
        update: values
      })
    })

    if (!res.ok) {
      const error = await res.json()
      alert('Error: ' + error.message)
      return
    }

    alert('Admin updated successfully')
    setRefresh(prev => !prev)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Administrators</h1>
        <AddAdminModal onSuccess={() => setRefresh(prev => !prev)} />
      </div>
      <AdminTable admins={admins} onUpdate={handleUpdateAdmin} />
    </div>
  )
}
