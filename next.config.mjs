/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Enable Next.js image optimization and allow remote telegram images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.telegram.org',
        port: '',
        pathname: '/**',
      },
      // add other remote image hosts if you use them (Firebase Storage domain, etc.)
    ],
    // Prefer modern formats
    formats: ['image/avif', 'image/webp'],
    // keep unoptimized false so Next can optimize images
    unoptimized: false,
  },
}

export default nextConfig
