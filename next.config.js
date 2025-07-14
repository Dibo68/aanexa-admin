/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: [
      'avatar.githubusercontent.com',
      'aanexa.com',
      'www.aanexa.com'
    ],
    // Alternative: Moderne remotePatterns (falls domains deprecated wird)
    remotePatterns: [
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
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    QDRANT_URL: process.env.QDRANT_URL,
    QDRANT_API_KEY: process.env.QDRANT_API_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
}

module.exports = nextConfig
