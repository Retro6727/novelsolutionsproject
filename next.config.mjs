/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'uwuuyelynldcpumhcqhn.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  
  // Turbopack configuration - clean setup for Next.js 16
  turbopack: {},
  
  // Performance optimizations
  poweredByHeader: false,
  compress: true,
  
  // Next.js 16 experimental features
  experimental: {
    // Only include stable experimental features
    optimizePackageImports: ['@prisma/client'],
  },
  
  // React compiler (moved from experimental in Next.js 16)
  reactCompiler: false,
};

export default nextConfig;
