// src/utils/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'

// Wichtiger Hinweis: Dieser Code basiert auf den neuesten Standards für @supabase/ssr
// und Next.js 15.4, wie in der technischen Referenz beschrieben.

export async function createClient(cookieStore?: ReadonlyRequestCookies) {
  // Wenn kein cookieStore übergeben wird, holen wir ihn uns selbst.
  // Das sorgt für maximale Kompatibilität.
  const store = cookieStore || (await cookies())

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Die neue, korrekte Methode: getAll verwenden.
        getAll() {
          return store.getAll()
        },
        // Die neue, korrekte Methode: setAll verwenden.
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              // Die 'as any' Konvertierung ist hier manchmal nötig, 
              // da die Typen zwischen Next.js und Supabase leicht abweichen können.
              store.set(name, value, options as any)
            })
          } catch (error) {
            // Dieser Fehler tritt auf, wenn eine Server Action versucht,
            // ein Cookie zu setzen, nachdem die Header bereits gesendet wurden.
            // In unserem Fall ist das unproblematisch, da die Middleware die Session aktuell hält.
          }
        },
      },
    }
  )
}
