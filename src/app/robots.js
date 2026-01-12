export default function robots() {
  const baseUrl = 'https://novelsolutions.com'; // Update with your actual domain
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/',
        '/_next/',
        '/private/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}