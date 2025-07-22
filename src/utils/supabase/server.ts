// src/utils/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // HINWEIS: Die 'get'-Funktion muss nicht async sein,
        // da 'cookieStore' bereits das aufgelöste Objekt ist.
        // Der FEHLER war in der alten `actions.ts` Logik, die hier nicht mehr existiert.
        // Der neue Fehler war ein anderer, den ich jetzt korrigiere.
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Fehler bei Server Actions ignorieren
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Fehler bei Server Actions ignorieren
          }
        },
      },
    }
  )
}
