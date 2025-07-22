// Pfad: src/utils/supabase/server.ts

import { createServerClient } from '@supabase/ssr'
import { cookies, headers } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  const headerStore = headers()
  const authHeader = headerStore.get('authorization') // z. B. "Bearer abc123..."

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      headers: {
        Authorization: authHeader ?? '',
      },
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch (err) {
            console.warn('[Supabase Server Client] Cookie setzen fehlgeschlagen:', err)
          }
        },
      }
    }
  )
}
