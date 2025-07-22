// Pfad: src/app/dashboard/admins/components/AddAdminModal.tsx

'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'

interface AddAdminModalProps {
  onSuccess: () => void
}

export default function AddAdminModal({ onSuccess }: AddAdminModalProps) {
  const { session } = useAuth()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin'
  })

  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = async () => {
    const res = await fetch('/api/admin/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.access_token}`
      },
      body: JSON.stringify(form)
    })

    if (res.ok) {
      alert('Admin created successfully')
      setIsOpen(false)
      setForm({ name: '', email: '', password: '', role: 'admin' })
      onSuccess()
    } else {
      const data = await res.json()
      alert(data.message || 'Failed to create admin')
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Add Admin
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg space-y-4 w-full max-w-md">
            <h2 className="text-xl font-semibold">Create New Admin</h2>

            <input
              type="text"
              placeholder="Name"
              className="w-full border px-3 py-2 rounded"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full border px-3 py-2 rounded"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full border px-3 py-2 rounded"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <select
              className="w-full border px-3 py-2 rounded"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
