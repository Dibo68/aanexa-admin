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

  const handleEditCancel = () => {
    setEditingAdmin(null)
  }

  const handleEditSave = async () => {
    if (!editingAdmin) return;
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
              {editingAdmin === admin.id ? (
                <input
                  type="text"
                  value={editForm.full_name}
                  onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                  className="w-full px-2 py-1 border rounded"
                />
              ) : (
                <div>
                  <div>{admin.full_name}</div>
                  <div className="text-sm text-gray-500">{admin.email}</div>
                </div>
              )}
            </td>
            <td className="px-6 py-4">
               {editingAdmin === admin.id ? (
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value as any })}
                  className="w-full px-2 py-1 border rounded"
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
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                  className="w-full px-2 py-1 border rounded"
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
