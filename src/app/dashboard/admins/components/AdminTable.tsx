'use client'

import { useState } from 'react'
import { AdminProfile } from '@/lib/supabase'

interface AdminTableProps {
  admins: AdminProfile[]
  loading: boolean
  onUpdate: (adminId: string, updates: Partial<AdminProfile>) => Promise<{ error?: string }>
  onDataChange: () => void;
}

export default function AdminTable({ admins, loading, onUpdate, onDataChange }: AdminTableProps) {
  const [editingAdmin, setEditingAdmin] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<AdminProfile>>({})

  const handleEditStart = (admin: AdminProfile) => {
    setEditingAdmin(admin.id)
    setEditForm({ full_name: admin.full_name, role: admin.role, status: admin.status })
  }

  const handleEditSave = async () => {
    if (!editingAdmin) return;
    const result = await onUpdate(editingAdmin, editForm);
    setEditingAdmin(null);
    if (result.error) {
      alert(`Error: ${result.error}`);
    } else {
      onDataChange(); // Hier wird die Liste neu geladen
    }
  }

  if (loading) return <div className="p-4">Loading...</div>

  return (
    <table className="min-w-full divide-y divide-gray-200">
      {/* ... (Tabelle wie gehabt) ... */}
    </table>
  )
}
