// src/app/dashboard/debug/page.tsx
import { createClient } from '@/utils/supabase/server'
import Navigation from '@/components/Navigation'

export default async function DebugPage() {
  const supabase = await createClient()

  // Wir versuchen, den Benutzer und sein Admin-Profil auf dem Server abzurufen.
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  let adminProfile = null;
  let profileError = null;

  if (user) {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', user.id)
      .single()
    adminProfile = data
    profileError = error
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation currentPath="/dashboard/debug" />
      <main className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">Server-Side Auth Debug</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Supabase User-Objekt (vom Server)</h2>
          <pre className="bg-gray-800 text-white p-4 rounded text-sm overflow-x-auto">
            {user ? JSON.stringify(user, null, 2) : `Kein Benutzer gefunden. Fehler: ${userError?.message || 'N/A'}`}
          </pre>
          
          <h2 className="text-lg font-semibold mt-6 mb-2">Admin Profil (aus 'admin_users' Tabelle)</h2>
          <pre className="bg-gray-800 text-white p-4 rounded text-sm overflow-x-auto">
            {adminProfile ? JSON.stringify(adminProfile, null, 2) : `Kein Profil gefunden. Fehler: ${profileError?.message || 'N/A'}`}
          </pre>
        </div>
      </main>
    </div>
  )
}
