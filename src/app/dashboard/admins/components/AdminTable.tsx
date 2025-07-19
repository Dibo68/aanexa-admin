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

  // NEU: Logik zur Erkennung des letzten Super Admins
  const activeSuperAdmins = admins.filter(admin => admin.role === 'super_admin' && admin.status === 'active');
  const isLastActiveSuperAdmin = (adminId: string) => {
    // Prüft, ob der aktuelle Admin der einzige aktive Super Admin ist
    return activeSuperAdmins.length === 1 && activeSuperAdmins[0].id === adminId;
  };

  const handleEditStart = (admin: AdminProfile) => {
    setEditingAdmin(admin.id)
    setEditForm({ full_name: admin.full_name, role: admin.role, status: admin.status })
  }

  const handleEditCancel = () => {
    setEditingAdmin(null)
  }

  const handleEditSave = async () => {
    if (!editingAdmin) return;

    // NEU: Zusätzliche Sicherheitsprüfung vor dem Speichern
    if (isLastActiveSuperAdmin(editingAdmin) && (editForm.role !== 'super_admin' || editForm.status !== 'active')) {
      alert('Error: You cannot change the role or status of the last active Super Admin.');
      setEditingAdmin(null);
      return;
    }

    const result = await onUpdate(editingAdmin, editForm);
    setEditingAdmin(null);
    if (result.error) {
      alert(`Error: ${result.error}`);
    } else {
      onDataChange();
    }
  }
  
  const getRoleDisplayName = (role: string) => role === 'super_admin' ? 'Super Admin' : 'Admin'
  const getRoleBadgeColor = (role: string) => role === 'super_admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
  const getStatusBadgeColor = (status: string) => status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'


  if (loading) return <div className="p-4 text-center">Loading...</div>
  if (admins.length === 0) return <div className="p-4 text-center">No administrators found.</div>

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Administrator</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {admins.map((admin) => (
          <tr key={admin.id}>
            <td className="px-6 py-4">
              {/* ... (bleibt gleich) ... */}
            </td>
            <td className="px-6 py-4">
               {editingAdmin === admin.id ? (
                <select
                  value={editForm.role}
                  // NEU: Deaktiviert, wenn es der letzte Super Admin ist
                  disabled={isLastActiveSuperAdmin(admin.id)}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value as any })}
                  className="w-full px-2 py-1 border rounded disabled:bg-gray-100"
                >
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
               ) : (
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(admin.role)}`}>
                  {getRoleDisplayName(admin.role)}
                </span>
               )}
            </td>
            <td className="px-6 py-4">
              {editingAdmin === admin.id ? (
                <select
                  value={editForm.status}
                  // NEU: Deaktiviert, wenn es der letzte Super Admin ist
                  disabled={isLastActiveSuperAdmin(admin.id)}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                  className="w-full px-2 py-1 border rounded disabled:bg-gray-100"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              ) : (
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getStatusBadgeColor(admin.status)}`}>
                  {admin.status}
                </span>
              )}
            </td>
            <td className="px-6 py-4 text-right">
              {editingAdmin === admin.id ? (
                <>
                  <button onClick={handleEditSave} className="text-green-600 mr-4">Save</button>
                  <button onClick={handleEditCancel} className="text-gray-600">Cancel</button>
                </>
              ) : (
                <button onClick={() => handleEditStart(admin)} className="text-indigo-600">Edit</button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
