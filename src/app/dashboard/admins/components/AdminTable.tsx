'use client'

import { useState } from 'react'
import { AdminProfile } from '@/lib/supabase'
import { updateAdmin } from '@/lib/actions' // NEU: Wir importieren unsere Server Action

interface AdminTableProps {
  admins: AdminProfile[]
  loading: boolean
  onDelete: (adminId: string) => void
  // onUpdate wird nicht mehr benötigt, da die Komponente sich selbst aktualisiert
}

export default function AdminTable({ admins, loading, onDelete }: AdminTableProps) {
  const [editingAdmin, setEditingAdmin] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<AdminProfile>>({})

  // ... (isLastActiveSuperAdmin, handleDeleteAdmin, formatDate, handleEditStart, handleEditCancel bleiben gleich)
  const superAdmins = admins.filter(admin => admin.role === 'super_admin' && admin.status === 'active')
  const isLastActiveSuperAdmin = (admin: AdminProfile) => {
    return admin.role === 'super_admin' && admin.status === 'active' && superAdmins.length === 1
  }
  const handleDeleteAdmin = (admin: AdminProfile) => {
    if (!isLastActiveSuperAdmin(admin)) {
      onDelete(admin.id)
    } else {
      alert('Cannot delete the last active Super Admin.')
    }
  }
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }
  const handleEditStart = (admin: AdminProfile) => {
    setEditingAdmin(admin.id)
    setEditForm({ full_name: admin.full_name, role: admin.role, status: admin.status })
  }
  const handleEditCancel = () => {
    setEditingAdmin(null)
    setEditForm({})
  }

  // NEUE LOGIK FÜR handleEditSave
  const handleEditSave = async () => {
    if (!editingAdmin) return;

    // Rufe die sichere Server Action auf
    const result = await updateAdmin(editingAdmin, editForm);

    if (result.error) {
      alert('Fehler beim Speichern: ' + result.error);
    }

    // Schließe den Bearbeitungsmodus
    setEditingAdmin(null);
    // Die Seite wird durch "revalidatePath" in der Server Action automatisch aktualisiert.
  }

  if (loading) {
    return <div className="p-6 text-center">Loading administrators...</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        {/* ... (thead bleibt unverändert) ... */}
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Administrator</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {admins.map((admin) => (
            <tr key={admin.id}>
              {/* ... (<td>s für Administrator, Role, Status, Last Login bleiben gleich) ... */}
              <td className="px-6 py-4 whitespace-nowrap">
                {editingAdmin === admin.id ? (
                  <input
                    type="text"
                    value={editForm.full_name}
                    onChange={(e) => setEditForm({...editForm, full_name: e.target.value})}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md"
                  />
                ) : (
                  <div>
                    <div className="text-sm font-medium text-gray-900">{admin.full_name}</div>
                    <div className="text-sm text-gray-500">{admin.email}</div>
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingAdmin === admin.id ? (
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({...editForm, role: e.target.value as 'super_admin' | 'admin'})}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md"
                    disabled={isLastActiveSuperAdmin(admin)}
                  >
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                ) : (
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${admin.role === 'super_admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                    {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingAdmin === admin.id ? (
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({...editForm, status: e.target.value as 'active' | 'inactive'})}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md"
                    disabled={isLastActiveSuperAdmin(admin)}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                ) : (
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${admin.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {admin.status}
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(admin.last_login)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {editingAdmin === admin.id ? (
                  <div className="flex gap-2">
                    <button onClick={handleEditSave} className="text-green-600 hover:text-green-900">Save</button>
                    <button onClick={handleEditCancel} className="text-gray-600 hover:text-gray-900">Cancel</button>
                  </div>
                ) : (
                  <div className="flex gap-4">
                    <button onClick={() => handleEditStart(admin)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                    <button onClick={() => handleDeleteAdmin(admin)} className="text-red-600 hover:text-red-900" disabled={isLastActiveSuperAdmin(admin)}>Delete</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
