import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Aanexa Admin Dashboard',
  description: 'Professional admin interface for managing customers, AI collections, and business operations',
  keywords: ['Aanexa', 'Admin', 'Dashboard', 'AI', 'Management'],
  authors: [{ name: 'Aanexa Team' }],
  creator: 'Aanexa',
  publisher: 'Aanexa',
  icons: {
    icon: [
      {
        url: 'https://aanexa.com/wp-content/uploads/2025/07/Copy-of-Logo-001-1-color-removebg-preview.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: 'https://aanexa.com/wp-content/uploads/2025/07/Copy-of-Logo-001-1-color-removebg-preview.png',
        sizes: '16x16',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: 'https://aanexa.com/wp-content/uploads/2025/07/Copy-of-Logo-001-1-color-removebg-preview.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'Aanexa Admin Dashboard',
    description: 'Professional admin interface for managing customers and AI collections',
    url: 'https://admin.aanexa.com',
    siteName: 'Aanexa Admin',
    images: [
      {
        url: 'https://aanexa.com/wp-content/uploads/2025/07/Copy-of-Logo-001-1-color-removebg-preview.png',
        width: 1200,
        height: 630,
        alt: 'Aanexa Admin Dashboard',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aanexa Admin Dashboard',
    description: 'Professional admin interface for managing customers and AI collections',
    images: ['https://aanexa.com/wp-content/uploads/2025/07/Copy-of-Logo-001-1-color-removebg-preview.png'],
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#3B82F6" />
        <meta name="msapplication-TileColor" content="#3B82F6" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <link rel="preconnect" href="https://aanexa.com" />
        <link rel="dns-prefetch" href="https://aanexa.com" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div id="root" className="min-h-screen bg-gray-50">
          {children}
        </div>
        
        {/* Performance Monitoring (optional) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Performance monitoring
              if (typeof window !== 'undefined') {
                window.addEventListener('load', function() {
                  console.log('🚀 Aanexa Admin Dashboard loaded successfully');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
