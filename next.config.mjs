/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js 16 - External packages for server components
  serverExternalPackages: ['@prisma/client', 'pg'],
  
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
    // Next.js 16 optimizations
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  
  // Turbopack configuration (Next.js 16 default)
  turbopack: {
    // Enable experimental features if needed
  },
  
  // Performance optimizations
  poweredByHeader: false,
  compress: true,
  
  // Next.js 16 specific optimizations
  experimental: {
    // Enable optimized package imports
    optimizePackageImports: ['@prisma/client'],
    // Enable React compiler if available
    reactCompiler: false,
  },
  
  // Build optimizations
  swcMinify: true,
  
  // Environment variables (if needed)
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

export default nextConfig;
