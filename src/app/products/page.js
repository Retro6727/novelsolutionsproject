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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-neutral-50 via-white to-blue-50/30">
      <Header />

      <main className="flex-grow relative overflow-hidden">
        {/* Enhanced Breadcrumb - Mobile Responsive */}
        <div className="glass border-b border-white/20 px-4 sm:px-6 py-3 sm:py-4">
          <div className="max-w-7xl mx-auto">
            <nav className="flex items-center space-x-2 text-xs sm:text-sm">
              <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                Home
              </Link>
              <span className="text-neutral-400">→</span>
              <span className="font-heading font-semibold text-neutral-700">Products</span>
            </nav>
          </div>
        </div>

        {/* Enhanced Page Header - Mobile Responsive */}
        <section className="relative px-4 sm:px-6 py-12 sm:py-16 md:py-20 gradient-hero text-white overflow-hidden">
          {/* Background elements - Responsive */}
          <div className="absolute inset-0">
            <div className="absolute top-5 sm:top-10 right-5 sm:right-10 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-white/5 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-5 sm:bottom-10 left-5 sm:left-10 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-purple-400/10 rounded-full blur-3xl" />
          </div>
          
          <div className="relative max-w-7xl mx-auto text-center">
            <div className="inline-block mb-4 sm:mb-6">
              <span className="glass px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-heading font-semibold border border-white/20">
                🏭 Premium Manufacturing Catalog
              </span>
            </div>
            
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-4 sm:mb-6 leading-tight">
              <span className="block bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent animate-gradient">
                Our Products
              </span>
            </h1>
            
            <p className="font-body text-base sm:text-lg md:text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8 px-4">
              Discover our comprehensive catalog of 
              <span className="font-semibold text-white"> premium manufacturing products</span> designed for professional excellence
            </p>
            
            {/* Stats - Mobile Responsive */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 text-blue-200">
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="font-body text-xs sm:text-sm">Quality Assured</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="font-body text-xs sm:text-sm">Bulk Orders</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="font-body text-xs sm:text-sm">Fast Delivery</span>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">

            {/* Enhanced Sidebar - Mobile Responsive */}
            <div className={`lg:col-span-1 glass p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-professional-lg border border-white/20 ${isSidebarOpen ? 'block' : 'hidden lg:block'}`}>
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden mb-4 w-full gradient-primary text-white py-3 rounded-xl font-heading font-semibold hover:shadow-professional transition-all duration-300"
              >
                {isSidebarOpen ? '✕ Hide Filters' : '⚙️ Show Filters'}
              </button>

              {/* Categories */}
              <div className="mb-8">
                <h3 className="font-heading text-2xl font-bold mb-6 gradient-text">Categories</h3>
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
                <h3 className="font-heading text-2xl font-bold mb-6 gradient-text">Price Range</h3>
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
                <h3 className="font-heading text-2xl font-bold mb-6 gradient-text">Customer Reviews</h3>
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

              {/* Enhanced Search Bar */}
              <div className="mb-8">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-6 py-4 pl-12 glass border border-white/20 rounded-2xl font-body text-lg placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400">
                    🔍
                  </div>
                </div>
              </div>

              {/* Enhanced Sort Bar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 glass p-6 rounded-2xl border border-white/20 shadow-professional">
                <div className="font-body text-neutral-600">
                  Showing <span className="font-heading font-bold text-neutral-800">{sortedProducts.length}</span> products
                  {selectedCategory !== 'All Products' && (
                    <span className="ml-2 text-sm">in <span className="font-semibold">{selectedCategory}</span></span>
                  )}
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="glass border border-white/20 rounded-xl px-4 py-3 font-body focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              {/* Enhanced Category Title */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="font-display text-4xl lg:text-5xl font-black gradient-text">{selectedCategory}</h2>
                
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
              <div className="w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-12 shadow-lg"></div>

              {/* Products Grid - Enhanced with better alignment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                {sortedProducts.map(product => (
                  <Link key={product.id} href={`/products/${product.id}`} className="group">
                    <div className="glass border border-white/20 rounded-2xl overflow-hidden hover:shadow-professional-xl hover:border-blue-300/50 transition-all duration-500 cursor-pointer transform hover:-translate-y-3 hover:scale-105 h-full flex flex-col group-hover:bg-white/80 backdrop-blur-xl">
                      {/* Product Image - Fixed Height */}
                      <div className="bg-gradient-to-br from-blue-50 to-purple-50 h-48 flex items-center justify-center relative overflow-hidden">
                        {product.image ? (
                          typeof product.image === 'string' ? (
                            product.image.startsWith('data:') || product.image.startsWith('http') ? (
                              <img 
                                src={product.image} 
                                alt={product.name} 
                                className="max-h-40 max-w-full object-contain group-hover:scale-110 transition-transform duration-300" 
                              />
                            ) : (
                              <span className="text-6xl group-hover:scale-110 transition-transform duration-300">{product.image}</span>
                            )
                          ) : (
                            product.image.url ? (
                              <img 
                                src={product.image.url} 
                                alt={product.name} 
                                className="max-h-40 max-w-full object-contain group-hover:scale-110 transition-transform duration-300" 
                              />
                            ) : (
                              <span className="text-5xl text-gray-400 group-hover:scale-110 transition-transform duration-300">📦</span>
                            )
                          )
                        ) : (
                          <span className="text-5xl text-gray-400 group-hover:scale-110 transition-transform duration-300">📦</span>
                        )}
                        
                        {/* Category Badge */}
                        <div className="absolute top-3 left-3">
                          <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs px-2 py-1 rounded-full font-medium shadow-sm">
                            {product.category}
                          </span>
                        </div>
                        
                        {/* Stock Badge */}
                        <div className="absolute top-3 right-3">
                          <div className={`text-xs px-2 py-1 rounded-full font-medium shadow-sm ${
                            product.stock > 0 
                              ? 'bg-green-100 text-green-800 border border-green-200' 
                              : 'bg-red-100 text-red-800 border border-red-200'
                          }`}>
                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                          </div>
                        </div>
                      </div>

                      {/* Product Content - Flexible Height */}
                      <div className="p-8 flex flex-col flex-grow">
                        {/* Product Title - Fixed Height */}
                        <div className="mb-3">
                          <h3 className="font-heading text-xl font-bold text-neutral-900 line-clamp-2 min-h-[3.5rem] group-hover:text-blue-600 transition-colors">
                            {product.name}
                          </h3>
                        </div>
                        
                        {/* Product Description - Fixed Height */}
                        <div className="mb-4 flex-grow">
                          <p className="font-body text-neutral-600 text-sm line-clamp-3 min-h-[4.5rem] leading-relaxed">
                            {product.description || 'High-quality product designed for professional use. Contact us for detailed specifications and bulk pricing.'}
                          </p>
                        </div>

                        {/* Rating Section - Fixed Height */}
                        <div className="mb-4 h-6 flex items-center">
                          {product.rating > 0 ? (
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {Array.from({ length: 5 }, (_, i) => (
                                  <span key={i} className={`text-sm ${i < Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                                    ★
                                  </span>
                                ))}
                              </div>
                              <span className="text-sm font-medium text-gray-700">{product.rating}</span>
                              <span className="text-xs text-gray-500">({product.reviewCount} reviews)</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-gray-400">
                              <div className="flex">
                                {Array.from({ length: 5 }, (_, i) => (
                                  <span key={i} className="text-sm text-gray-300">★</span>
                                ))}
                              </div>
                              <span className="text-xs">No reviews yet</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Price Section - Fixed Height */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between">
                            <span className="font-display text-3xl font-black gradient-text">₹{product.price?.toLocaleString()}</span>
                            {product.code && (
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                {product.code}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action Button - Fixed at Bottom */}
                        <div className="mt-auto">
                          <button className="w-full gradient-primary text-white py-4 rounded-xl hover:shadow-professional-lg transition-all duration-300 font-heading font-bold shadow-professional transform group-hover:scale-105 group-hover:-translate-y-1">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {sortedProducts.length === 0 && (
                <div className="col-span-full">
                  <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-300">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No Products Found</h3>
                    <p className="text-gray-500 text-lg mb-6">
                      No products match your current filters. Try adjusting your search criteria.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        onClick={() => {
                          setSelectedCategory('All Products');
                          setPriceFilter(null);
                          setRatingFilter(null);
                          setSearchQuery('');
                        }}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                      >
                        Clear All Filters
                      </button>
                      <Link
                        href="/contact"
                        className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
                      >
                        Request Custom Product
                      </Link>
                    </div>
                  </div>
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
