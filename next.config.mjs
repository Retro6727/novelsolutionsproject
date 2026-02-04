/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize for smaller builds
  experimental: {
    optimizeCss: true,
  },
  
  // Compress images
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  
  // Enable compression
  compress: true,
  
  // Optimize bundle
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    
    // Optimize bundle size
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    };
    
    return config;
  },
  
  // Reduce output size
  output: 'standalone',
  
  // Optimize static generation
  trailingSlash: false,
  
  // Remove unused code
  swcMinify: true,
};

export default nextConfig;