'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import AdminTable from './components/AdminTable'
import AddAdminModal from './components/AddAdminModal'
import { supabase, AdminProfile } from '@/lib/supabase'

// Dieser Typ wird für das Hinzufügen-Modal benötigt
export type NewAdminData = {
  email: string
  full_name: string
  password_hash: string
  role: 'super_admin' | 'admin'
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState<AdminProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [error, setError] = useState('')

  const fetchAdmins = async () => {
    try {
      setLoading(true)
      setError('')
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error
      setAdmins(data || [])
    } catch (err: any) {
      setError('Could not fetch administrator data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdmins()
  }, [])

  const handleAddAdmin = async (adminData: NewAdminData) => {
    // Diese Funktion implementieren wir, sobald das Bearbeiten funktioniert.
    console.log("Add admin wird als nächstes implementiert.", adminData)
  }

  // HIER IST DIE NEUE LOGIK:
  const handleUpdateAdmin = async (adminId: string, updates: Partial<AdminProfile>) => {
    setError(''); // Fehler zurücksetzen
    try {
      const response = await fetch(`/api/admins/${adminId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update admin');
      }
      
      // Lade die Admin-Liste neu, um die Änderungen sofort zu sehen
      await fetchAdmins();

    } catch (err: any)
