'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

import { CATEGORIES as CATEGORY_TREE, CATEGORY_OPTIONS } from '@/lib/products';

const CATEGORIES = CATEGORY_OPTIONS;

// Helper functions for reviews
const initializeSampleReviews = () => {
  const savedReviews = localStorage.getItem('novelsols_reviews');
  if (!savedReviews) {
    const sampleReviews = [
      {
        id: 1,
        productId: 1,
        productName: 'Multi-Purpose Cleaning Supplies Kit',
        customerName: 'Rajesh Kumar',
        customerEmail: 'rajesh.k@email.com',
        rating: 5,
        title: 'Excellent Quality Products',
        comment: 'Very satisfied with the cleaning supplies. Good quality and long-lasting. Highly recommended for office use.',
        date: new Date('2024-12-10').toISOString(),
        status: 'approved',
        helpful: 12,
        adminReply: null,
        verified: true
      },
      {
        id: 2,
        productId: 2,
        productName: 'LED Emergency Lighting System',
        customerName: 'Priya Sharma',
        customerEmail: 'priya.s@email.com',
        rating: 4,
        title: 'Good Emergency Lighting',
        comment: 'Works well during power cuts. Battery backup is decent. Installation was easy.',
        date: new Date('2024-12-08').toISOString(),
        status: 'approved',
        helpful: 8,
        adminReply: 'Thank you for your feedback! We\'re glad the installation was easy.',
        verified: true
      },
      {
        id: 3,
        productId: 1,
        productName: 'Multi-Purpose Cleaning Supplies Kit',
        customerName: 'Anita Singh',
        customerEmail: 'anita.s@email.com',
        rating: 4,
        title: 'Good Value for Money',
        comment: 'Decent cleaning supplies for the price. Would recommend for small offices.',
        date: new Date('2024-12-06').toISOString(),
        status: 'approved',
        helpful: 5,
        adminReply: null,
        verified: true
      },
      {
        id: 4,
        productId: 5,
        productName: 'Desktop Computer Hardware Bundle',
        customerName: 'Sneha Gupta',
        customerEmail: 'sneha.g@email.com',
        rating: 5,
        title: 'Perfect for Office Work',
        comment: 'Excellent computer bundle. Fast performance and all components work perfectly. Great value for money.',
        date: new Date('2024-12-12').toISOString(),
        status: 'approved',
        helpful: 15,
        adminReply: null,
        verified: true
      },
      {
        id: 5,
        productId: 4,
        productName: 'Ergonomic Office Chair',
        customerName: 'Amit Patel',
        customerEmail: 'amit.p@email.com',
        rating: 4,
        title: 'Comfortable Chair',
        comment: 'Good chair for long working hours. Assembly was straightforward. Worth the price.',
        date: new Date('2024-12-05').toISOString(),
        status: 'approved',
        helpful: 6,
        adminReply: 'Thank you for choosing our ergonomic chair! We\'re happy it\'s working well for you.',
        verified: true
      },
      {
        id: 6,
        productId: 2,
        productName: 'LED Emergency Lighting System',
        customerName: 'Ravi Kumar',
        customerEmail: 'ravi.k@email.com',
        rating: 5,
        title: 'Excellent Emergency Light',
        comment: 'Very bright and long-lasting battery. Perfect for power outages.',
        date: new Date('2024-12-03').toISOString(),
        status: 'approved',
        helpful: 9,
        adminReply: null,
        verified: true
      },
      {
        id: 7,
        productId: 3,
        productName: 'Complete Safety Equipment Bundle',
        customerName: 'Meera Joshi',
        customerEmail: 'meera.j@email.com',
        rating: 4,
        title: 'Good Safety Kit',
        comment: 'Comprehensive safety equipment. Good quality helmets and gloves.',
        date: new Date('2024-12-01').toISOString(),
        status: 'approved',
        helpful: 4,
        adminReply: null,
        verified: true
      }
    ];
    localStorage.setItem('novelsols_reviews', JSON.stringify(sampleReviews));
  }
};

const getProductReviewStats = (productId, reviews) => {
  const productReviews = reviews.filter(review => 
    review.productId === productId && review.status === 'approved'
  );
  
  if (productReviews.length === 0) {
    return { averageRating: 0, reviewCount: 0 };
  }
  
  const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / productReviews.length;
  
  return {
    averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
    reviewCount: productReviews.length
  };
};

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [sortBy, setSortBy] = useState('newest');
  const [priceFilter, setPriceFilter] = useState(null);
  const [ratingFilter, setRatingFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Initialize sample reviews if none exist
        initializeSampleReviews();
        
        // Load reviews
        const savedReviews = localStorage.getItem('novelsols_reviews');
        const reviewsData = savedReviews ? JSON.parse(savedReviews) : [];
        setReviews(reviewsData);
        
        const res = await fetch('/api/product');
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        
        // Normalize data and add review stats
        const normalized = (Array.isArray(data) ? data : []).map(p => {
          const reviewStats = getProductReviewStats(p.id, reviewsData);
          return {
            ...p,
            price: Number(p.price ?? 0),
            rating: reviewStats.averageRating || Number(p.rating ?? 0),
            reviewCount: reviewStats.reviewCount || 0,
          };
        });
        setProducts(normalized);
      } catch (e) {
        console.error('Products fetch error:', e);
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const sync = async () => {
      try {
        const res = await fetch('/api/product');
        if (!res.ok) return;
        const data = await res.json();
        const normalized = (Array.isArray(data) ? data : []).map(p => ({
          ...p,
          price: Number(p.price ?? 0),
          rating: Number(p.rating ?? 0),
        }));
        setProducts(normalized);
      } catch {}
    };

    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  // Filter by category
  let filteredProducts = selectedCategory === 'All Products'
    ? products
    : products.filter(p => p.category === selectedCategory || p.subcategory === selectedCategory);

  // Price filter
  if (priceFilter) {
    filteredProducts = filteredProducts.filter(p => {
      switch (priceFilter) {
        case 'under-1000': return p.price < 1000;
        case '1000-5000': return p.price >= 1000 && p.price <= 5000;
        case '5000-10000': return p.price > 5000 && p.price <= 10000;
        case 'above-10000': return p.price > 10000;
        default: return true;
      }
    });
  }

  // Rating filter
  if (ratingFilter) {
    if (ratingFilter === 'rated') {
      filteredProducts = filteredProducts.filter(p => p.rating > 0);
    } else {
      filteredProducts = filteredProducts.filter(p => p.rating >= ratingFilter);
    }
  }

  // Search
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filteredProducts = filteredProducts.filter(p =>
      p.name.toLowerCase().includes(q)
    );
  }

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      case 'newest': return b.id - a.id; // Assuming higher ID means newer
      default: return 0;
    }
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow">
        {/* Breadcrumb */}
        <div className="bg-white px-6 py-4 shadow-sm">
          <div className="max-w-7xl mx-auto">
            <Link href="/" className="text-blue-600 hover:underline">Home</Link>
            <span className="text-gray-500 mx-2">/</span>
            <span className="text-gray-700">Products</span>
          </div>
        </div>

        {/* Page Header */}
        <section className="px-6 py-12 bg-white border-b">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-5xl font-bold mb-4 text-gray-900">Our Products</h1>
            <p className="text-gray-600 text-xl">Browse our comprehensive catalog of high-quality manufacturing products</p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

            {/* SIDEBAR (unchanged) */}
            <div className={`lg:col-span-1 bg-white p-6 rounded-lg shadow-md ${isSidebarOpen ? 'block' : 'hidden lg:block'}`}>
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden mb-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                {isSidebarOpen ? 'Hide Filters' : 'Show Filters'}
              </button>

              {/* Categories */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">Categories</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory('All Products')}
                    className={`block w-full text-left px-4 py-3 rounded-lg ${
                      selectedCategory === 'All Products'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    All Products
                  </button>

                  {CATEGORY_TREE.map(group => (
                    <div key={group.name} className="mt-4">
                      <div className="px-4 py-2 bg-gray-100 rounded text-sm font-semibold">
                        {group.name}
                      </div>
                      <div className="pl-4">
                        <button
                          onClick={() => setSelectedCategory(group.name)}
                          className={`block w-full text-left px-4 py-2 rounded-lg ${
                            selectedCategory === group.name
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {group.name}
                        </button>

                        {group.subs.map(sub => (
                          <button
                            key={sub}
                            onClick={() => setSelectedCategory(sub)}
                            className={`block w-full text-left px-6 py-2 rounded-lg ${
                              selectedCategory === sub
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {sub}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">Price Range</h3>
                <div className="space-y-3">
                  {[
                    { label: "All Prices", value: null },
                    { label: "Under ₹1,000", value: "under-1000" },
                    { label: "₹1,000 - ₹5,000", value: "1000-5000" },
                    { label: "₹5,000 - ₹10,000", value: "5000-10000" },
                    { label: "Above ₹10,000", value: "above-10000" }
                  ].map(item => (
                    <label key={item.label} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="price"
                        checked={priceFilter === item.value}
                        onChange={() => setPriceFilter(item.value)}
                        className="mr-3"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <h3 className="text-xl font-bold mb-4">Customer Reviews</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={ratingFilter === null}
                      onChange={() => setRatingFilter(null)}
                      className="mr-3"
                    />
                    <span>All Ratings</span>
                  </label>

                  {[5, 4, 3].map(stars => (
                    <label key={stars} className="flex items-center">
                      <input
                        type="radio"
                        checked={ratingFilter === stars}
                        onChange={() => setRatingFilter(stars)}
                        className="mr-3"
                      />
                      <span className="flex items-center gap-1">
                        <div className="flex">
                          {Array.from({ length: stars }, (_, i) => (
                            <span key={i} className="text-yellow-400 text-xs">★</span>
                          ))}
                        </div>
                        <span>{stars}+ Stars</span>
                      </span>
                    </label>
                  ))}
                  
                  {/* Show products with ratings */}
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={ratingFilter === 'rated'}
                      onChange={() => setRatingFilter('rated')}
                      className="mr-3"
                    />
                    <span className="flex items-center gap-1">
                      <span>⭐</span>
                      <span>Has Ratings</span>
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* MAIN CONTENT WITH NEW SECTION */}
            <div className="lg:col-span-3">

              {/* Search Bar */}
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg"
                />
              </div>

              {/* Sort Bar */}
              <div className="flex justify-between items-center mb-8 pb-4 border-b bg-white p-4 rounded-lg shadow-sm">
                <p className="text-gray-600">
                  Showing <span className="font-bold">{sortedProducts.length}</span> products
                </p>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border rounded-lg px-4 py-2"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              {/* ⭐ SELECTED CATEGORY TITLE + DIVIDER */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold">{selectedCategory}</h2>
                
                {/* Review Statistics */}
                {sortedProducts.length > 0 && (
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <span>⭐</span>
                      <span>
                        {(() => {
                          const productsWithRatings = sortedProducts.filter(p => p.rating > 0);
                          if (productsWithRatings.length === 0) return 'No ratings';
                          const avgRating = productsWithRatings.reduce((sum, p) => sum + p.rating, 0) / productsWithRatings.length;
                          return `${avgRating.toFixed(1)} avg rating`;
                        })()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="w-full h-1 bg-gray-200 mb-8"></div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map(product => (
                  <Link key={product.id} href={`/products/${product.id}`}>
                    <div className="bg-white border rounded-xl overflow-hidden hover:shadow-xl transition cursor-pointer transform hover:-translate-y-1">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 h-48 flex items-center justify-center">
                        {product.image ? (
                          typeof product.image === 'string' ? (
                            product.image.startsWith('data:') || product.image.startsWith('http') ? (
                              <img src={product.image} alt={product.name} className="max-h-40 object-contain" />
                            ) : (
                              <span className="text-6xl">{product.image}</span>
                            )
                          ) : (
                            product.image.url ? (
                              <img src={product.image.url} alt={product.name} className="max-h-40 object-contain" />
                            ) : (
                              <span className="text-5xl">📦</span>
                            )
                          )
                        ) : (
                          <span className="text-5xl">📦</span>
                        )}
                      </div>

                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                        <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {product.description || 'No description available'}
                        </p>

                        <div className="flex items-center justify-between mb-3">
                          <span className="text-3xl font-bold text-blue-600">₹{product.price?.toLocaleString()}</span>
                          {product.rating > 0 && (
                            <div className="text-sm text-yellow-500 flex items-center gap-1">
                              <div className="flex">
                                {Array.from({ length: 5 }, (_, i) => (
                                  <span key={i} className={`text-sm ${i < Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                                    ★
                                  </span>
                                ))}
                              </div>
                              <span className="font-medium">{product.rating}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Stock Status */}
                        <div className="flex justify-end mb-4">
                          <div className={`text-xs px-2 py-1 rounded-full font-medium ${
                            product.stock > 0 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                          </div>
                        </div>

                        <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
                          View Product
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {sortedProducts.length === 0 && (
                <div className="text-center py-12 text-gray-500 text-lg">
                  No products found matching your criteria.
                </div>
              )}
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
