'use client'

import { useState } from 'react'

interface Admin {
  id: string
  email: string
  name: string
  role: 'super_admin' | 'admin'
  status: 'active' | 'inactive'
  created_at: string
  last_login?: string
}

interface AdminTableProps {
  admins: Admin[]
  loading: boolean
  onDelete: (adminId: string) => void
  onUpdate: (adminId: string, updates: Partial<Admin>) => void
}

export default function AdminTable({ admins, loading, onDelete, onUpdate }: AdminTableProps) {
  const [editingAdmin, setEditingAdmin] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Admin>>({})

  // Super Admin Protection Logic
  const superAdmins = admins.filter(admin => admin.role === 'super_admin' && admin.status === 'active')
  const isLastActiveSuperAdmin = (admin: Admin) => {
    return admin.role === 'super_admin' && admin.status === 'active' && superAdmins.length === 1
  }

  const canDeleteAdmin = (admin: Admin) => {
    return !isLastActiveSuperAdmin(admin)
  }

  const canChangeRole = (admin: Admin) => {
    return !isLastActiveSuperAdmin(admin)
  })

  const handleDeleteAdmin = (admin: Admin) => {
    if (!canDeleteAdmin(admin)) {
      alert('Cannot delete the last active Super Admin. At least one Super Admin must remain active.')
      return
    }
    
    if (confirm(`Are you sure you want to delete "${admin.name}"? This action cannot be undone.`)) {
      onDelete(admin.id)
    }
  }
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleEditStart = (admin: Admin) => {
    setEditingAdmin(admin.id)
    setEditForm({
      name: admin.name,
      email: admin.email,
      role: admin.role,
      status: admin.status
    })
  }

  const handleEditSave = () => {
    if (editingAdmin) {
      onUpdate(editingAdmin, editForm)
      setEditingAdmin(null)
      setEditForm({})
    }
  }

  const handleEditCancel = () => {
    setEditingAdmin(null)
    setEditForm({})
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  if (admins.length === 0) {
    return (
      <div className="p-12 text-center">
        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
        <p className="text-gray-500 text-lg">No administrators found</p>
        <p className="text-gray-400 text-sm mt-2">Click "Add Admin" to create the first administrator account</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Administrator
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Login
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {admins.map((admin) => (
            <tr key={admin.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                {editingAdmin === admin.id ? (
                  <div className="space-y-2 min-w-[200px]">
                    <input
                      type="text"
                      value={editForm.name || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Full Name"
                    />
                    <input
                      type="email"
                      value={editForm.email || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Email Address"
                    />
                  </div>
                ) : (
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900 flex items-center">
                        {admin.name}
                        {isLastActiveSuperAdmin(admin) && (
                          <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800" title="Protected: Last Active Super Admin">
                            🔒 Protected
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{admin.email}</div>
                    </div>
                  </div>
                )}
              </td>
              <td className="px-6 py-4">
                {editingAdmin === admin.id ? (
                  <select
                    value={editForm.role || admin.role}
                    onChange={(e) => setEditForm(prev => ({ ...prev, role: e.target.value as 'super_admin' | 'admin' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={!canChangeRole(admin)}
                  >
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                ) : (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    admin.role === 'super_admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                  </span>
                )}
              </td>
              <td className="px-6 py-4">
                {editingAdmin === admin.id ? (
                  <select
                    value={editForm.status || admin.status}
                    onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isLastActiveSuperAdmin(admin)}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                ) : (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    admin.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {admin.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {admin.last_login ? formatDate(admin.last_login) : 'Never'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(admin.created_at)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {editingAdmin === admin.id ? (
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={handleEditSave}
                      className="text-green-600 hover:text-green-900 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    <button
                      onClick={handleEditCancel}
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => handleEditStart(admin)}
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                      title="Edit Admin"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteAdmin(admin)}
                      disabled={!canDeleteAdmin(admin)}
                      className={`transition-colors ${
                        canDeleteAdmin(admin)
                          ? 'text-red-600 hover:text-red-900'
                          : 'text-gray-300 cursor-not-allowed'
                      }`}
                      title={
                        canDeleteAdmin(admin) 
                          ? 'Delete Admin' 
                          : 'Cannot delete last active Super Admin'
                      }
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
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
