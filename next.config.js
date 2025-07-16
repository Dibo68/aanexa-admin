/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // KORRIGIERT: serverActions muss ein Objekt sein
    serverActions: {
      bodySizeLimit: '2mb', // Beispielwert, kann angepasst werden
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'avatar.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'aanexa.com',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https', 
        hostname: 'www.aanexa.com',
        pathname: '/wp-content/uploads/**',
      }
    ],
  },
  // Die env-Sektion habe ich hier entfernt.
  // Coolify injiziert die Umgebungsvariablen direkt, 
  // daher ist das Eintragen hier nicht nötig und kann zu Problemen führen.
}

module.exports = nextConfig
