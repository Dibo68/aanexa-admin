'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import AdminTable from './components/AdminTable'
import { supabase, AdminProfile } from '@/lib/supabase'
import { updateAdmin } from '@/lib/actions'

export default function AdminsPage() {
  const [admins, setAdmins] = useState<AdminProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAdmins = async () => {
      setLoading(true);
      setError(''); // Fehler zurücksetzen

      try {
        const { data, error: fetchError } = await supabase
          .from('admin_users')
          .select('*')
          .order('created_at', { ascending: false });

        if (fetchError) {
          // Wenn Supabase einen Fehler meldet, werfen wir ihn,
          // damit er im catch-Block landet.
          throw fetchError;
        }

        setAdmins(data || []);

      } catch (err: any) {
        console.error("Error fetching admins:", err.message);
        setError('Could not fetch administrator data. ' + err.message);
      } finally {
        // Der finally-Block wird IMMER ausgeführt, egal ob es einen Fehler gab oder nicht.
        // Das stellt sicher, dass der Lade-Spinner immer verschwindet.
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []); // Dieser Hook läuft nur einmal, wenn die Seite geladen wird.

  // handleUpdate wird von der AdminTable aufgerufen
  const handleDataChange = () => {
    // Diese Funktion wird nach dem Speichern aufgerufen, um die Daten neu zu laden.
    // Wir rufen hier nicht fetchAdmins direkt auf, da dies in AdminTable.tsx selbst geschieht
    // Wir können diese Logik später verfeinern, aber für den Moment ist es so korrekt.
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation currentPath="/dashboard/admins" />
      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-xl border border-gray-200 p-6">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-4">Admin Management</h1>
          
          {error && <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">{error}</div>}

          <AdminTable
            admins={admins}
            loading={loading}
            onUpdate={updateAdmin}
            onDataChange={handleDataChange} // Hier wird die Funktion übergeben
          />
        </div>
      </main>
    </div>
  )
}
