export default function sitemap() {
  const baseUrl = 'https://novelsolutions.com'; // Update with your actual domain
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/policies`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    }
  ];

  // You can add dynamic product pages here
  // const productPages = products.map(product => ({
  //   url: `${baseUrl}/products/${product.id}`,
  //   lastModified: new Date(product.updatedAt),
  //   changeFrequency: 'weekly',
  //   priority: 0.8,
  // }));

  return [
    ...staticPages,
    // ...productPages
  ];
}