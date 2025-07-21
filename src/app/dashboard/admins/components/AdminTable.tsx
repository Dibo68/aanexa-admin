// src/app/dashboard/admins/components/AdminTable.tsx
'use client'

import { useState } from 'react'
import { AdminProfile } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'

interface AdminTableProps {
  admins: AdminProfile[];
  loading: boolean;
  onUpdate: (adminId: string, updates: Partial<AdminProfile>) => Promise<{ error?: string }>;
  onDelete: (adminId:string) => void;
  onDataChange: () => void;
  currentUserRole?: 'super_admin' | 'admin'; // Eigenschaft für die Rolle hinzugefügt
}

export default function AdminTable({ admins, loading, onUpdate, onDelete, onDataChange, currentUserRole }: AdminTableProps) {
  const { user } = useAuth();
  const [editingAdmin, setEditingAdmin] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<AdminProfile>>({})

  const activeSuperAdmins = admins.filter(admin => admin.role === 'super_admin' && admin.status === 'active');
  const isLastActiveSuperAdmin = (adminId: string) => {
    return activeSuperAdmins.length === 1 && activeSuperAdmins[0].id === adminId;
  };

  const handleEditStart = (admin: AdminProfile) => {
    setEditingAdmin(admin.id)
    setEditForm({ full_name: admin.full_name, email: admin.email, role: admin.role, status: admin.status })
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
  
  if (loading) return <div className="p-6 text-center text-gray-500">Loading...</div>
  if (admins.length === 0) return <div className="p-6 text-center text-gray-500">No administrators found.</div>

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Administrator</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          {/* GEÄNDERT: Spalte "Actions" wird nur für Super-Admins angezeigt */}
          {currentUserRole === 'super_admin' && (
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          )}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {admins.map((admin) => (
          <tr key={admin.id}>
            <td className="px-6 py-4">
              {/* Die Anzeige von Name/Email bleibt für alle sichtbar */}
              <div className="text-sm font-medium text-gray-900">{admin.full_name} {admin.id === user?.id && <span className="text-xs text-indigo-600">(You)</span>}</div>
              <div className="text-sm text-gray-500">{admin.email}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {getRoleDisplayName(admin.role)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <span className="capitalize">{admin.status}</span>
            </td>
            {/* GEÄNDERT: Edit/Delete/Save/Cancel Buttons werden nur für Super-Admins angezeigt */}
            {currentUserRole === 'super_admin' && (
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {editingAdmin === admin.id ? (
                  <div className="flex items-center justify-end gap-4">
                    <button onClick={handleEditSave} className="text-green-600 hover:text-green-800">Save</button>
                    <button onClick={handleEditCancel} className="text-gray-600 hover:text-gray-800">Cancel</button>
                  </div>
                ) : (
                  <div className="flex items-center justify-end gap-4">
                      {/* Eigener Account kann nicht editiert werden */}
                      <button onClick={() => handleEditStart(admin)} disabled={admin.id === user?.id} className="text-indigo-600 hover:text-indigo-800 disabled:text-gray-300 disabled:cursor-not-allowed">Edit</button>
                      <button onClick={() => onDelete(admin.id)} disabled={isLastActiveSuperAdmin(admin.id) || admin.id === user?.id} className="text-red-600 hover:text-red-800 disabled:text-gray-300 disabled:cursor-not-allowed">Delete</button>
                  </div>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
