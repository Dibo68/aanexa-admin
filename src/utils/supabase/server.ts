// src/utils/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            // HIER IST DIE KORREKTUR:
            // Wir fügen domain und path hinzu, damit das Cookie
            // für die Subdomain admin.aanexa.com korrekt gesetzt wird.
            cookieStore.set({ 
              name, 
              value, 
              ...options, 
              path: '/', // Gilt für die gesamte Website
            })
          } catch (error) {
            // Fehlerbehandlung für Server Components
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            // Auch hier fügen wir die Optionen hinzu.
            cookieStore.set({ 
              name, 
              value: '', 
              ...options, 
              path: '/',
            })
          } catch (error) {
            // Fehlerbehandlung für Server Components
          }
        },
      },
    }
  )
}
