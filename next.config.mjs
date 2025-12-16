/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fix for Next.js 16 - moved from experimental to top level
  serverExternalPackages: ['@prisma/client'],
  
  images: {
    // Remove deprecated domains, use only remotePatterns
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'uwuuyelynldcpumhcqhn.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  
  // Add empty turbopack config to silence the warning
  turbopack: {},
  
  // Optimize for Vercel deployment
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
