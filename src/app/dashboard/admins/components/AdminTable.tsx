// Pfad: src/app/dashboard/admins/components/AdminTable.tsx

'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'

interface AdminProfile {
  id: string
  name: string
  email: string
  role: string
}

interface AdminTableProps {
  admins: AdminProfile[]
  loading?: boolean
  onUpdate: (id: string, update: Partial<AdminProfile>) => Promise<void>
  onDelete?: (id: string) => Promise<void>
  onDataChange?: () => void
  currentUserRole?: string
}

export default function AdminTable({
  admins,
  loading,
  onUpdate,
  onDelete,
  onDataChange,
  currentUserRole
}: AdminTableProps) {
  const { session } = useAuth()
  const user = session?.user ?? null

  const [editingAdmin, setEditingAdmin] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<AdminProfile>>({})

  const handleEditClick = (admin: AdminProfile) => {
    setEditingAdmin(admin.id)
    setEditForm(admin)
  }

  const handleSave = async () => {
    if (editingAdmin) {
      await onUpdate(editingAdmin, editForm)
      setEditingAdmin(null)
    }
  }

  if (loading) return <p>Loading admins...</p>

  return (
    <table className="w-full border-collapse border">
      <thead>
        <tr>
          <th className="border p-2">Name</th>
          <th className="border p-2">Email</th>
          <th className="border p-2">Role</th>
          <th className="border p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {admins.map((admin) => (
          <tr key={admin.id}>
            <td className="border p-2">
              {editingAdmin === admin.id ? (
                <input
                  value={editForm.name ?? ''}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
              ) : (
                admin.name
