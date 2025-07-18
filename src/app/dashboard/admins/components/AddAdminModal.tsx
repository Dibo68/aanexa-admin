'use client'

import { useState } from 'react'
import { NewAdminData } from '@/lib/types' // NEU: Import vom zentralen Ort

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
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const validateForm = () => {
    // ... (Validierungslogik bleibt unverändert)
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // ... (Submit-Logik bleibt unverändert)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        {/* ... (Das Formular-JSX bleibt unverändert) ... */}
      </div>
    </div>
  )
}
