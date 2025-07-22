// src/middleware.ts
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function middleware(request: NextRequest) {
  try {
    // Dieser Response wird benötigt, um die Cookies nach der Überprüfung
    // an den Browser zurückzugeben.
    const response = NextResponse.next({
      request: {
        headers: new Headers(request.headers),
      },
    })

    // Wir erstellen einen Supabase-Client, der speziell für die
    // Middleware-Umgebung konfiguriert ist.
    const supabase = await createClient(request.cookies)

    // Dies ist der wichtigste Schritt: Wir prüfen die aktuelle Session.
    // Dieser Aufruf aktualisiert automatisch das Auth-Token, wenn es abgelaufen ist.
    await supabase.auth.getSession()

    return response
  } catch (e) {
    // Falls ein Fehler auftritt, leiten wir die Anfrage einfach weiter.
    return NextResponse.next({
      request: {
        headers: new Headers(request.headers),
      },
    })
  }
}

// Hier legen wir fest, für welche Routen die Middleware aktiv sein soll.
// Wir lassen sie für alle Routen laufen, um eine konsistente Session zu gewährleisten.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
