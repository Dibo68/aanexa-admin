// src/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Wir erstellen eine leere Antwort, die wir im Laufe des Prozesses anpassen.
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Erstellen des Supabase-Clients direkt in der Middleware mit einer
  // speziellen Konfiguration, die Cookies manuell handhabt.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options) {
          // Wichtig: Wir müssen sowohl das Cookie in der eingehenden Anfrage
          // für den nächsten Client-Aufruf aktualisieren, als auch in der
          // ausgehenden Antwort, die an den Browser gesendet wird.
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options) {
          // Dasselbe gilt für das Löschen von Cookies.
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.remove(name, options)
        },
      },
    }
  )

  // Dieser Aufruf ist entscheidend. Er prüft die Session des Benutzers.
  // Wenn das Token abgelaufen ist, wird es hier automatisch aktualisiert.
  // Die 'set'-Funktion oben sorgt dann dafür, dass das neue Token an den Browser gesendet wird.
  await supabase.auth.getUser()

  return response
}

// Der Konfigurationsblock bleibt derselbe.
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
