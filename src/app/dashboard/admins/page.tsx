// Pfad: src/app/dashboard/admins/page.tsx

import { useAuth } from '@/context/AuthContext'

async function handleSaveAdmin(adminId: string, values: any) {
  const { session } = useAuth()

  const res = await fetch('/api/admin/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.access_token}` // Token mitgeben
    },
    body: JSON.stringify({
      id: adminId,
      update: values
    })
  })

  if (!res.ok) {
    const error = await res.json()
    alert('Fehler: ' + error.message)
    return
  }

  alert('Admin erfolgreich gespeichert')
}
