'use client'

import { useState } from 'react'
import { AdminProfile } from '@/lib/supabase'

interface AdminTableProps {
  admins: AdminProfile[]
  loading: boolean
  onUpdate: (adminId: string, updates: Partial<AdminProfile>) => Promise<{ error?: string }>
  onDelete: (adminId: string) => void
  onDataChange: () => void;
}

export default function AdminTable({ admins, loading, onUpdate, onDelete, onDataChange }: AdminTableProps) {
  const [editingAdmin, setEditingAdmin] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<AdminProfile>>({})

  // FIX: Logik zur Erkennung des letzten Super Admins
  const activeSuperAdmins = admins.filter(admin => admin.role === 'super_admin' && admin.status === 'active');
  const isLastActiveSuperAdmin = (adminId: string) => {
    return activeSuperAdmins.length === 1 && activeSuperAdmins[0].id === adminId;
  };

  const handleEditStart = (admin: AdminProfile) => {
    setEditingAdmin(admin.id)
    setEditForm({ full_name: admin.full_name, role: admin.role, status: admin.status })
  }

  const handleEditCancel = () => setEditingAdmin(null)

  const handleEditSave = async () => {
    if (!editingAdmin) return;
    if (isLastActiveSuperAdmin(editingAdmin) && (editForm.role !== 'super_admin' || editForm.status !== 'active')) {
      alert('Error: You cannot change the role or status of the last active Super Admin.');
      setEditingAdmin(null);
      return;
    }
    const result = await onUpdate(editingAdmin, editForm);
    setEditingAdmin(null);
    if (result.error) alert(`Error: ${result.error}`);
    else onDataChange();
  }
  
  const getRoleDisplayName = (role: string) => role === 'super_admin' ? 'Super Admin' : 'Admin'

  if (loading) return <div className="p-4 text-center">Loading...</div>

  return (
    <table className="min-w-full divide-y divide-gray-200">
      {/* ... (Tabelle wie gehabt, Logik ist jetzt im Edit-Modus) ... */}
    </table>
  )
}
