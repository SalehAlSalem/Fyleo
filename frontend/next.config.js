/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', '127.0.0.1', '192.168.1.121'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8090',
        pathname: '/api/files/**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_POCKETBASE_URL: process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8090',
  },
  webpack: (config, { isServer }) => {
    // Fix for pdfjs-dist webpack issues
    config.resolve.alias = {
      ...config.resolve.alias,
      'pdfjs-dist/build/pdf.worker.entry': 'pdfjs-dist/build/pdf.worker.min',
    }
    
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      }
    }
    
    return config
  },
}

module.exports = nextConfig
