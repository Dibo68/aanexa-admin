// src/app/dashboard/admins/components/AddAdminModal.tsx
'use client'

import { useState } from 'react'
import { NewAdminData } from '@/lib/types'

interface AddAdminModalProps {
  onClose: () => void
  onAdd: (adminData: NewAdminData) => Promise<void>
}

export default function AddAdminModal({ onClose, onAdd }: AddAdminModalProps) {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    role: 'admin' as 'super_admin' | 'admin',
    password: '',
    confirmPassword: '',
    status: 'active' as 'active' | 'inactive',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.full_name.trim()) newErrors.full_name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email address'
    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters long'
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    await onAdd({
      full_name: formData.full_name.trim(),
      email: formData.email.trim().toLowerCase(),
      password_hash: formData.password,
      role: formData.role,
      status: formData.status,
    })
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">Add New Administrator</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-4">
            <div>
              <label htmlFor="full_name" className="text-sm font-medium text-gray-700">Full Name</label>
              <input id="full_name" type="text" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="mt-1 w-full px-3 py-2 border rounded"/>
              {errors.full_name && <p className="text-sm text-red-600">{errors.full_name}</p>}
            </div>
            <div>
              <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
              <input id="email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="mt-1 w-full px-3 py-2 border rounded"/>
              {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label> 
              <input id="password" type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="mt-1 w-full px-3 py-2 border rounded"/>
              {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password</label>
              <input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} className="mt-1 w-full px-3 py-2 border rounded"/>
              {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>
            <div>
              <label htmlFor="role" className="text-sm font-medium text-gray-700">Role</label>
              <select id="role" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as any})} className="mt-1 w-full px-3 py-2 border rounded">
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
          </div>
          <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
              {loading ? 'Creating...' : 'Create Admin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
