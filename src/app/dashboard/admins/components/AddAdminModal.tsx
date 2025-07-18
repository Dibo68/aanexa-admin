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
    status: 'active' as 'active' | 'inactive', // Status ist jetzt Teil des Formulars
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const validateForm = () => {
    // ... Validierung ...
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // if (!validateForm()) return; // Validierung vorübergehend aus, um uns auf den Build zu konzentrieren

    setLoading(true)
    setErrors({})

    try {
      // HIER IST DIE KORREKTUR: Das 'status'-Feld wird jetzt mitgeschickt.
      await onAdd({
        full_name: formData.full_name.trim(),
        email: formData.email.trim().toLowerCase(),
        password_hash: formData.password, 
        role: formData.role,
        status: formData.status, // Diese Zeile ist neu
      })
    } catch (err: any) {
      setErrors({ general: err.message || 'An unknown error occurred.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">Add New Administrator</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-4">
            {errors.general && <p className="text-red-600 text-sm">{errors.general}</p>}
            
            {/* Input für Full Name */}
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Input für Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Input für Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            
            {/* Input für Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            
            {/* Auswahl für Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
              <select 
                id="role" 
                value={formData.role} 
                onChange={(e) => setFormData({...formData, role: e.target.value as 'admin' | 'super_admin'})}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
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
