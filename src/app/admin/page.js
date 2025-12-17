'use client';

import { useState, useEffect } from 'react';
// import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [sessionToken, setSessionToken] = useState('');

  // Check for existing session on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem('adminSessionToken');
    if (storedToken) {
      verifySession(storedToken);
    }
  }, []);

  const verifySession = async (token) => {
    try {
      const response = await fetch('/api/admin/verify-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionToken: token })
      });

      const data = await response.json();
      if (data.valid) {
        setAdminLoggedIn(true);
        setSessionToken(token);
        console.log('✅ Session verified, auto-login successful');
      } else {
        localStorage.removeItem('adminSessionToken');
        console.log('❌ Session invalid, please login again');
      }
    } catch (error) {
      console.error('Session verification failed:', error);
      localStorage.removeItem('adminSessionToken');
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setPasswordError('');

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPassword })
      });

      const data = await response.json();
      
      if (response.ok && data.ok) {
        setAdminLoggedIn(true);
        setSessionToken(data.sessionToken);
        localStorage.setItem('adminSessionToken', data.sessionToken);
        setAdminPassword('');
        console.log('✅ Admin login successful');
      } else {
        setPasswordError(data.error || 'Authentication failed');
        console.log('❌ Admin login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setPasswordError('Network error. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/verify-session', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionToken })
      });
    } catch (error) {
      console.error('Logout error:', error);
    }

    setAdminLoggedIn(false);
    setSessionToken('');
    setActiveTab('overview');
    localStorage.removeItem('adminSessionToken');
    console.log('✅ Logged out successfully');
  };

  if (!adminLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <main className="flex-grow flex items-center justify-center py-12 px-6">
          <div className="w-full max-w-md">
            <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-8">
              <h1 className="text-3xl font-bold mb-2 text-center text-gray-800">Admin Access</h1>
              <p className="text-center text-gray-600 mb-8">Enter admin password to continue</p>

              {passwordError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                  {passwordError}
                </div>
              )}

              <form onSubmit={handleAdminLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Admin Password
                  </label>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? '🔐 Authenticating...' : '🔒 Secure Login'}
                </button>
              </form>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Admin Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              🔒 Secure Logout
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-md mb-8">
            <div className="flex border-b">
              {['overview', 'products', 'inquiries'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                    activeTab === tab
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {tab === 'inquiries' ? 'Contact Inquiries' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'products' && <ProductsTab />}
          {activeTab === 'inquiries' && <InquiriesTab />}
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Overview Tab Component
function OverviewTab() {
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    totalStock: 0,
    totalValue: 0,
    categories: 0,
    lowStockItems: 0,
    reviews: 0,
    averageRating: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch products data
        const productsRes = await fetch('/api/product');
        const products = productsRes.ok ? await productsRes.json() : [];
        const normalizedProducts = Array.isArray(products) ? products : [];

        // Load reviews data
        const savedReviews = localStorage.getItem('novelsols_reviews');
        const reviews = savedReviews ? JSON.parse(savedReviews) : [];
        const approvedReviews = reviews.filter(r => r.status === 'approved');

        // Calculate statistics
        const totalProducts = normalizedProducts.length;
        const totalStock = normalizedProducts.reduce((sum, p) => sum + (Number(p.stock) || 0), 0);
        const totalValue = normalizedProducts.reduce((sum, p) => {
          const price = Number(p.price) || 0;
          const stock = Number(p.stock) || 0;
          const itemValue = price * stock;
          console.log(`📊 Product: ${p.name}, Price: ₹${price}, Stock: ${stock}, Value: ₹${itemValue}`);
          return sum + itemValue;
        }, 0);
        const categories = [...new Set(normalizedProducts.map(p => p.category))].filter(Boolean).length;
        const lowStockItems = normalizedProducts.filter(p => (Number(p.stock) || 0) < 10).length;
        
        console.log(`💰 Total Inventory Value: ₹${totalValue} (₹${(totalValue / 100000).toFixed(1)}L)`);
        const totalReviews = approvedReviews.length;
        const averageRating = totalReviews > 0 
          ? (approvedReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
          : 0;

        setDashboardData({
          totalProducts,
          totalStock,
          totalValue,
          categories,
          lowStockItems,
          reviews: totalReviews,
          averageRating
        });

        // Generate recent activity
        const activity = [];
        if (totalProducts > 0) {
          activity.push({
            icon: '📦',
            text: `${totalProducts} products in inventory`,
            time: 'Current'
          });
        }
        if (lowStockItems > 0) {
          activity.push({
            icon: '⚠️',
            text: `${lowStockItems} items need restocking`,
            time: 'Alert'
          });
        }
        if (totalReviews > 0) {
          activity.push({
            icon: '⭐',
            text: `${totalReviews} customer reviews (${averageRating}/5 avg)`,
            time: 'Recent'
          });
        }
        activity.push({
          icon: '💰',
          text: `₹${(totalValue / 100000).toFixed(1)}L total inventory value`,
          time: 'Current'
        });

        setRecentActivity(activity);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { 
      label: 'Total Products', 
      value: loading ? '...' : dashboardData.totalProducts.toString(), 
      color: 'blue',
      icon: '📦'
    },
    { 
      label: 'Total Stock Units', 
      value: loading ? '...' : dashboardData.totalStock.toLocaleString(), 
      color: 'green',
      icon: '📊'
    },
    { 
      label: 'Categories', 
      value: loading ? '...' : dashboardData.categories.toString(), 
      color: 'purple',
      icon: '📂'
    },
    { 
      label: 'Inventory Value', 
      value: loading ? '...' : dashboardData.totalValue >= 100000 
        ? `₹${(dashboardData.totalValue / 100000).toFixed(1)}L` 
        : `₹${dashboardData.totalValue.toLocaleString('en-IN')}`, 
      color: 'orange',
      icon: '💰'
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Dashboard Overview</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm transition-colors flex items-center gap-1"
          >
            <span>🔄</span>
            Refresh
          </button>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className={`bg-white p-6 rounded-lg shadow-md border-l-4 border-${stat.color}-500 hover:shadow-lg transition-shadow`}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm">{stat.label}</p>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
            {stat.label === 'Inventory Value' && !loading && (
              <p className="text-xs text-gray-500 mt-1">
                Total value of all products (Price × Stock)
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Alert Cards */}
      {!loading && dashboardData.lowStockItems > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-yellow-600">⚠️</span>
            <span className="font-semibold text-yellow-800">Stock Alert</span>
          </div>
          <p className="text-yellow-700 text-sm mt-1">
            {dashboardData.lowStockItems} items have low stock (less than 10 units)
          </p>
        </div>
      )}

      {!loading && dashboardData.reviews > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-blue-600">⭐</span>
            <span className="font-semibold text-blue-800">Customer Feedback</span>
          </div>
          <p className="text-blue-700 text-sm mt-1">
            Average rating: {dashboardData.averageRating}/5 from {dashboardData.reviews} reviews
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">System Status</h3>
          {loading ? (
            <div className="space-y-3">
              <div className="animate-pulse bg-gray-200 h-4 rounded"></div>
              <div className="animate-pulse bg-gray-200 h-4 rounded"></div>
              <div className="animate-pulse bg-gray-200 h-4 rounded"></div>
            </div>
          ) : (
            <ul className="space-y-3">
              {recentActivity.map((activity, idx) => (
                <li key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{activity.icon}</span>
                    <span className="text-gray-700">{activity.text}</span>
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {activity.time}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={() => setActiveTab('products')}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <span>📦</span>
              Manage Products
            </button>
            <button 
              onClick={() => window.open('/products', '_blank')}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <span>🛍️</span>
              View Store
            </button>
            <button 
              onClick={() => {
                const data = `Dashboard Export - ${new Date().toLocaleDateString()}\n\nTotal Products: ${dashboardData.totalProducts}\nTotal Stock: ${dashboardData.totalStock}\nCategories: ${dashboardData.categories}\nInventory Value: ₹${(dashboardData.totalValue / 100000).toFixed(1)}L\nReviews: ${dashboardData.reviews}\nAverage Rating: ${dashboardData.averageRating}/5`;
                const blob = new Blob([data], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `dashboard-${new Date().toISOString().split('T')[0]}.txt`;
                a.click();
              }}
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
            >
              <span>📊</span>
              Export Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Products Tab Component
import { CATEGORY_OPTIONS, CATEGORIES as CATEGORY_TREE } from '@/lib/products';

// Enhanced search helper functions
function calculateEditDistance(str1, str2) {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
  
  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,     // deletion
        matrix[j - 1][i] + 1,     // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      );
    }
  }
  
  return matrix[str2.length][str1.length];
}

function calculateSearchScore(product, searchTerms) {
  let score = 0;
  const fields = {
    name: { value: product.name || '', weight: 10 },
    code: { value: product.code || '', weight: 8 },
    category: { value: product.category || '', weight: 6 },
    subcategory: { value: product.subcategory || '', weight: 4 },
    description: { value: product.description || '', weight: 3 },
    price: { value: String(product.price || ''), weight: 2 },
    stock: { value: String(product.stock || ''), weight: 1 }
  };

  searchTerms.forEach(term => {
    Object.entries(fields).forEach(([fieldName, field]) => {
      const fieldValue = field.value.toLowerCase();
      
      // Exact match bonus
      if (fieldValue === term) {
        score += field.weight * 5;
      }
      // Starts with bonus
      else if (fieldValue.startsWith(term)) {
        score += field.weight * 3;
      }
      // Contains bonus
      else if (fieldValue.includes(term)) {
        score += field.weight * 2;
      }
      // Fuzzy match
      else if (term.length >= 3) {
        const words = fieldValue.split(/\s+/);
        words.forEach(word => {
          const distance = calculateEditDistance(term, word);
          if (distance <= (term.length <= 4 ? 1 : 2)) {
            score += field.weight * 1;
          }
        });
      }
    });
  });

  return score;
}

function highlightSearchTerms(text, searchTerms) {
  if (!searchTerms || searchTerms.length === 0 || !text) return text;
  
  let highlightedText = text;
  searchTerms.forEach(term => {
    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    highlightedText = highlightedText.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
  });
  
  return highlightedText;
}

// Category helper functions
function getCategoryStats(products, categories) {
  const stats = {};
  
  categories.forEach(category => {
    const categoryProducts = products.filter(p => p.category === category.name);
    stats[category.name] = {
      total: categoryProducts.length,
      subcategories: {}
    };
    
    category.subs.forEach(sub => {
      const subProducts = categoryProducts.filter(p => p.subcategory === sub);
      stats[category.name].subcategories[sub] = subProducts.length;
    });
  });
  
  return stats;
}

function getCategoryIcon(categoryName) {
  const icons = {
    'Cleaning & Housekeeping Items': '🧹',
    'Electronic Items': '⚡',
    'Safety Items': '🛡️',
    'Furniture & Fixtures': '🪑',
    'IT': '💻',
    'Clinical Items': '⚕️',
    'Bags': '👜',
    'Thermal Papers & Stickers': '🖨️',
    'Waste & Bins': '🗑️'
  };
  return icons[categoryName] || '📦';
}

function ProductsTab() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterSubcategory, setFilterSubcategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showCategoryManager, setShowCategoryManager] = useState(false);

  // Load products from API on mount
  useEffect(() => {
      const loadProducts = async () => {
      try {
        const res = await fetch('/api/product');
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        const normalized = (Array.isArray(data) ? data : []).map(p => ({
          ...p,
          price: Number(p.price ?? 0),
          stock: Number(p.stock ?? 0),
        }));
        setProducts(normalized);
        setFilteredProducts(normalized);
      } catch (err) {
        console.error(err);
        setProducts([]);
        setFilteredProducts([]);
      }
    };
    loadProducts();
  }, []);

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];

    // Apply enhanced search filter
    if (searchTerm) {
      const searchTerms = searchTerm.toLowerCase().trim().split(/\s+/).filter(term => term.length > 0);
      
      filtered = filtered.filter(product => {
        // Create searchable text from all product fields
        const searchableFields = [
          product.name || '',
          product.category || '',
          product.subcategory || '',
          product.code || '',
          product.description || '',
          String(product.price || ''),
          String(product.stock || ''),
          String(product.id || '')
        ].join(' ').toLowerCase();

        // Check if all search terms are found (AND logic)
        return searchTerms.every(term => {
          // Exact match
          if (searchableFields.includes(term)) return true;
          
          // Fuzzy match for typos (simple Levenshtein-like approach)
          const words = searchableFields.split(/\s+/);
          return words.some(word => {
            if (word.includes(term)) return true;
            
            // Allow 1-2 character differences for fuzzy matching
            if (term.length >= 3) {
              const maxDistance = term.length <= 4 ? 1 : 2;
              return calculateEditDistance(term, word) <= maxDistance;
            }
            
            return false;
          });
        });
      });

      // Sort by relevance score
      filtered = filtered.map(product => ({
        ...product,
        _searchScore: calculateSearchScore(product, searchTerms)
      })).sort((a, b) => b._searchScore - a._searchScore);
    }

    // Apply category filter
    if (filterCategory) {
      filtered = filtered.filter(product => product.category === filterCategory);
    }

    // Apply subcategory filter
    if (filterSubcategory) {
      filtered = filtered.filter(product => product.subcategory === filterSubcategory);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'price' || sortBy === 'stock') {
        aValue = Number(aValue) || 0;
        bValue = Number(bValue) || 0;
      } else {
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredProducts(filtered);
  }, [products, sortBy, sortOrder, filterCategory, filterSubcategory, searchTerm]);

  // Generate search suggestions
  const generateSearchSuggestions = (term) => {
    if (!term || term.length < 2) {
      setSearchSuggestions([]);
      return;
    }

    const suggestions = new Set();
    const termLower = term.toLowerCase();

    products.forEach(product => {
      // Add matching product names
      if (product.name && product.name.toLowerCase().includes(termLower)) {
        suggestions.add(product.name);
      }
      
      // Add matching categories
      if (product.category && product.category.toLowerCase().includes(termLower)) {
        suggestions.add(product.category);
      }
      
      // Add matching codes
      if (product.code && product.code.toLowerCase().includes(termLower)) {
        suggestions.add(product.code);
      }
      
      // Add matching subcategories
      if (product.subcategory && product.subcategory.toLowerCase().includes(termLower)) {
        suggestions.add(product.subcategory);
      }
    });

    setSearchSuggestions(Array.from(suggestions).slice(0, 8)); // Limit to 8 suggestions
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    generateSearchSuggestions(value);
    setShowSuggestions(value.length >= 2);
    
    // Add to search history when user stops typing
    if (value.trim() && value.length >= 3) {
      setTimeout(() => {
        setSearchHistory(prev => {
          const newHistory = [value, ...prev.filter(item => item !== value)].slice(0, 5);
          return newHistory;
        });
      }, 1000);
    }
  };

  const selectSuggestion = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    setSearchSuggestions([]);
    
    // Add to search history
    setSearchHistory(prev => {
      const newHistory = [suggestion, ...prev.filter(item => item !== suggestion)].slice(0, 5);
      return newHistory;
    });
  };

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subcategory: '',
    price: '',
    stock: '',
    image: '',
    description: '',
    code: '',
    specifications: ''
  });
  const [editingId, setEditingId] = useState(null);
  // Import file states
  const [importOpen, setImportOpen] = useState(false);
  const [importPreview, setImportPreview] = useState([]);
  const [importErrors, setImportErrors] = useState([]);
  const [addAndMore, setAddAndMore] = useState(false);

  const categoryGroups = Array.isArray(CATEGORY_TREE) ? CATEGORY_TREE : [];

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await fetch('/api/product', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, id: editingId }),
        })
        if (!res.ok) throw new Error('Update failed')
        const updatedItem = await res.json()
        const updatedProducts = products.map(p => p.id === editingId ? updatedItem : p);
        setProducts(updatedProducts);
        setEditingId(null)
      } else {
        const res = await fetch('/api/product', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
        if (!res.ok) throw new Error('Create failed')
        const newItem = await res.json()
        const updatedProducts = [...products, newItem];
        setProducts(updatedProducts);
      }
    } catch (err) {
      console.error(err)
    }

    const reset = { name: '', category: '', subcategory: '', price: '', stock: '', image: '', description: '', code: '', specifications: '' };
    setFormData(reset);
    if (addAndMore) {
      setShowAddForm(true);
    } else {
      setShowAddForm(false);
    }
    setAddAndMore(false);
  };

  // Handle image file input and convert to data URL
  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setFormData((prev) => ({ ...prev, image: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  // === Import file handling ===
  const handleFileInput = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setImportErrors([]);
    setImportStatus({ loading: true, message: 'Processing file...', type: 'info' });
    
    try {
      const name = file.name.toLowerCase();
      if (name.endsWith('.pdf')) {
        try {
          const pdfjs = await import('pdfjs-dist/legacy/build/pdf');
          const arrayBuffer = await file.arrayBuffer();
          const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
          const doc = await loadingTask.promise;
          let fullText = '';
          for (let i = 1; i <= doc.numPages; i++) {
            const page = await doc.getPage(i);
            const content = await page.getTextContent();
            const strings = content.items.map(it => it.str);
            fullText += strings.join(' ') + '\n';
          }
          parseTextToPreview(fullText);
        } catch (err) {
          setImportErrors([`PDF parsing requires the package 'pdfjs-dist'. Run: npm install pdfjs-dist`]);
        }
      } else if (name.endsWith('.docx') || name.endsWith('.doc')) {
        try {
          const mammoth = await import('mammoth');
          const arrayBuffer = await file.arrayBuffer();
          const result = await mammoth.extractRawText({ arrayBuffer });
          parseTextToPreview(result.value || '');
        } catch (err) {
          setImportErrors([`DOCX parsing requires the package 'mammoth'. Run: npm install mammoth`]);
        }
      } else {
        // treat as text / csv
        const text = await file.text();
        parseTextToPreview(text);
      }
    } catch (err) {
      setImportErrors([String(err)]);
    }
  };

  function parseTextToPreview(text) {
    if (!text || !text.trim()) {
      setImportErrors(['No text extracted from file']);
      setImportStatus({ loading: false, message: '❌ No text found in file', type: 'error' });
      return;
    }

    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) {
      setImportErrors(['No items parsed from file']);
      setImportStatus({ loading: false, message: '❌ No content found to parse', type: 'error' });
      return;
    }

    // Enhanced product detection patterns
    const productPatterns = {
      price: /(?:₹|rs\.?|inr|price|cost|amount)\s*:?\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/i,
      code: /(?:code|sku|id|item\s*no|product\s*no|model)\s*:?\s*([a-z0-9\-_]+)/i,
      category: /(?:category|type|class|group|section)\s*:?\s*([a-z\s&]+)/i,
      stock: /(?:stock|qty|quantity|units?|available)\s*:?\s*(\d+)/i,
      description: /(?:desc|description|details|info|about)\s*:?\s*(.+)/i,
      name: /(?:name|title|product)\s*:?\s*(.+)/i
    };

    // Check if it's a structured format (CSV/TSV)
    const first = lines[0].toLowerCase();
    let headerCols = null;
    let startIdx = 0;
    
    // Enhanced header detection for product-specific fields
    if (first.includes('name') || first.includes('price') || first.includes('category') || 
        first.includes('code') || first.includes('sku') || first.includes('stock')) {
      headerCols = lines[0].split(/,|\t|\||;/).map(c => c.trim().toLowerCase());
      startIdx = 1;
    }

    const items = [];
    
    if (headerCols) {
      // Structured data parsing (CSV/TSV format)
      for (let i = startIdx; i < lines.length; i++) {
        const line = lines[i];
        const cols = line.split(/,|\t|\||;/).map(c => c.trim());
        if (cols.length === 0) continue;

        let item = { image: '', name: '', price: 0, category: '', subcategory: '', code: '', description: '', stock: 0, specifications: '', include: true };

        headerCols.forEach((header, idx) => {
          const val = (cols[idx] || '').trim();
          if (!val) return;

          // Enhanced header matching
          if (header.includes('name') || header.includes('title') || header.includes('product')) {
            item.name = val;
          } else if (header.includes('subcategory') || header.includes('sub-category') || header.includes('subcat')) {
            item.subcategory = val;
          } else if (header.includes('category') || header.includes('type') || header.includes('class')) {
            item.category = val;
          } else if (header.includes('price') || header.includes('cost') || header.includes('amount')) {
            item.price = parseFloat(val.replace(/[^0-9.]/g, '')) || 0;
          } else if (header.includes('code') || header.includes('sku') || header.includes('id') || header.includes('model')) {
            item.code = val;
          } else if (header.includes('desc') || header.includes('detail') || header.includes('info')) {
            item.description = val;
          } else if (header.includes('stock') || header.includes('qty') || header.includes('quantity')) {
            item.stock = parseInt(val.replace(/[^0-9]/g, '')) || 0;
          } else if (header.includes('image') || header.includes('img') || header.includes('photo')) {
            item.image = val;
          } else if (header.includes('spec') || header.includes('specification')) {
            item.specifications = val;
          }
        });

        // Only add if it looks like a product (has name and either price or category)
        if (item.name && (item.price > 0 || item.category)) {
          items.push(item);
        }
      }
    } else {
      // Unstructured text parsing - look for product patterns
      let currentProduct = null;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Skip obviously non-product lines
        if (line.length < 3 || 
            /^(page|chapter|section|\d+\s*$|table|figure|image)/i.test(line) ||
            /^(the|and|or|but|with|from|this|that|these|those)\s/i.test(line)) {
          continue;
        }

        // Check for product patterns
        let foundPattern = false;
        
        // Price pattern - strong indicator of a product
        const priceMatch = line.match(productPatterns.price);
        if (priceMatch) {
          if (!currentProduct) currentProduct = { image: '', name: '', price: 0, category: '', subcategory: '', code: '', description: '', stock: 0, specifications: '', include: true };
          currentProduct.price = parseFloat(priceMatch[1].replace(/,/g, '')) || 0;
          foundPattern = true;
        }

        // Code/SKU pattern
        const codeMatch = line.match(productPatterns.code);
        if (codeMatch) {
          if (!currentProduct) currentProduct = { image: '', name: '', price: 0, category: '', subcategory: '', code: '', description: '', stock: 0, specifications: '', include: true };
          currentProduct.code = codeMatch[1];
          foundPattern = true;
        }

        // Category pattern
        const categoryMatch = line.match(productPatterns.category);
        if (categoryMatch) {
          if (!currentProduct) currentProduct = { image: '', name: '', price: 0, category: '', subcategory: '', code: '', description: '', stock: 0, specifications: '', include: true };
          currentProduct.category = categoryMatch[1].trim();
          foundPattern = true;
        }

        // Stock pattern
        const stockMatch = line.match(productPatterns.stock);
        if (stockMatch) {
          if (!currentProduct) currentProduct = { image: '', name: '', price: 0, category: '', subcategory: '', code: '', description: '', stock: 0, specifications: '', include: true };
          currentProduct.stock = parseInt(stockMatch[1]) || 0;
          foundPattern = true;
        }

        // Description pattern
        const descMatch = line.match(productPatterns.description);
        if (descMatch) {
          if (!currentProduct) currentProduct = { image: '', name: '', price: 0, category: '', subcategory: '', code: '', description: '', stock: 0, specifications: '', include: true };
          currentProduct.description = descMatch[1].trim();
          foundPattern = true;
        }

        // Name pattern or potential product name
        const nameMatch = line.match(productPatterns.name);
        if (nameMatch) {
          if (!currentProduct) currentProduct = { image: '', name: '', price: 0, category: '', subcategory: '', code: '', description: '', stock: 0, specifications: '', include: true };
          currentProduct.name = nameMatch[1].trim();
          foundPattern = true;
        } else if (!foundPattern && line.length > 5 && line.length < 100) {
          // Potential product name if it's reasonable length and no other pattern matched
          // Check if it looks like a product name (not a sentence, has some product-like words)
          const productWords = /(?:chair|table|sofa|desk|cabinet|shelf|lamp|bed|mattress|cushion|pillow|frame|stand|rack|storage|organizer|furniture|equipment|tool|device|machine|appliance)/i;
          
          if (productWords.test(line) || (!line.includes('.') && !line.includes('?') && !line.includes('!'))) {
            // If we have an existing product, save it first
            if (currentProduct && currentProduct.name && (currentProduct.price > 0 || currentProduct.category)) {
              items.push(currentProduct);
            }
            // Start new product
            currentProduct = { 
              image: '', 
              name: line, 
              price: 0, 
              category: '', 
              subcategory: '',
              code: '', 
              description: '', 
              stock: 0, 
              specifications: '',
              include: true 
            };
            foundPattern = true;
          }
        }

        // If we found a price or multiple patterns, this might complete a product
        if (currentProduct && (priceMatch || (foundPattern && currentProduct.name && currentProduct.price > 0))) {
          // Check if this product is complete enough to add
          if (currentProduct.name && (currentProduct.price > 0 || currentProduct.category)) {
            items.push(currentProduct);
            currentProduct = null;
          }
        }
      }

      // Add the last product if it exists and is valid
      if (currentProduct && currentProduct.name && (currentProduct.price > 0 || currentProduct.category)) {
        items.push(currentProduct);
      }
    }

    // Filter out items that don't look like products
    const validItems = items.filter(item => {
      // Must have a name
      if (!item.name || item.name.length < 2) return false;
      
      // Must have either price, category, or code
      if (!item.price && !item.category && !item.code) return false;
      
      // Skip items that look like headers or metadata
      if (/^(total|subtotal|tax|shipping|discount|page|chapter|section)/i.test(item.name)) return false;
      
      return true;
    });

    if (validItems.length === 0) {
      setImportErrors(['No valid product information detected. Please ensure your file contains product names, prices, categories, or product codes.']);
      return;
    }

    setImportPreview(validItems);
    setImportOpen(true);
    setImportStatus({ 
      loading: false, 
      message: `✅ Found ${validItems.length} products ready for import. Review and click "Import Selected".`, 
      type: 'success' 
    });
  }

  const updatePreviewItem = (idx, field, value) => {
    setImportPreview(prev => prev.map((it, i) => i === idx ? ({ ...it, [field]: value }) : it));
  };

  // Read a preview-row image file and update the preview item's image as a data URL
  const handlePreviewImageFile = (idx, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setImportPreview(prev => prev.map((it, i) => i === idx ? ({ ...it, image: dataUrl }) : it));
    };
    reader.readAsDataURL(file);
  };

  const [importStatus, setImportStatus] = useState({ loading: false, message: '', type: '' });

  const importSelectedItems = async () => {
    console.log('🚀 Import button clicked, starting import process...');
    const toImport = importPreview.filter(it => it.include !== false);
    console.log('📦 Items to import:', toImport.length, toImport);
    
    if (!toImport.length) {
      setImportStatus({ loading: false, message: 'No items selected for import', type: 'warning' });
      return;
    }

    // Simple test - just show an alert to confirm the function is called
    alert(`Import function called with ${toImport.length} items. Check console for details.`);
    console.log('🔍 First item to import:', toImport[0]);

    setImportStatus({ loading: true, message: `Importing ${toImport.length} items...`, type: 'info' });
    
    try {
      const created = [];
      const failed = [];
      
      for (let i = 0; i < toImport.length; i++) {
        const item = toImport[i];
        setImportStatus({ 
          loading: true, 
          message: `Importing item ${i + 1} of ${toImport.length}: ${item.name}...`, 
          type: 'info' 
        });

        try {
          // Validate required fields
          if (!item.name || !item.category) {
            failed.push({ item: item.name || 'Unnamed item', error: 'Missing name or category' });
            continue;
          }

          const productData = {
            name: item.name.trim(),
            category: item.category.trim(),
            subcategory: (item.subcategory || item.category || 'General').trim(),
            price: Number(item.price) || 0,
            stock: Number(item.stock) || 0,
            code: item.code || item.sku || `AUTO-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            image: item.image || null,
            description: (item.description || '').trim() || null,
            specifications: (item.specifications || '').trim() || null,
          };
          
          console.log('📤 Sending product data:', productData);
          
          const res = await fetch('/api/product', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData),
          });

          console.log('📥 API Response status:', res.status, res.statusText);
          
          if (res.ok) {
            const newProduct = await res.json();
            created.push(newProduct);
            console.log('✅ Successfully imported:', item.name, newProduct);
          } else {
            const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
            console.error('❌ Failed to import:', item.name, 'Status:', res.status, 'Error:', errorData);
            failed.push({ item: item.name, error: errorData.error || `HTTP ${res.status}` });
          }
        } catch (itemError) {
          failed.push({ item: item.name, error: itemError.message });
          console.error('❌ Import error for item:', item.name, itemError);
        }

        // Small delay to prevent overwhelming the server
        if (i < toImport.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      // Update products list with successfully created items
      if (created.length > 0) {
        const updatedProducts = [...products, ...created];
        setProducts(updatedProducts);
      }

      // Show final status
      let finalMessage = '';
      let finalType = 'success';

      if (created.length > 0 && failed.length === 0) {
        finalMessage = `✅ Successfully imported all ${created.length} items!`;
        finalType = 'success';
      } else if (created.length > 0 && failed.length > 0) {
        finalMessage = `⚠️ Imported ${created.length} items successfully, ${failed.length} failed.`;
        finalType = 'warning';
      } else if (failed.length > 0) {
        finalMessage = `❌ Failed to import all ${failed.length} items.`;
        finalType = 'error';
      }

      // Show detailed errors if any
      if (failed.length > 0) {
        console.error('Import failures:', failed);
        finalMessage += ` Errors: ${failed.map(f => `${f.item}: ${f.error}`).join('; ')}`;
      }

      setImportStatus({ loading: false, message: finalMessage, type: finalType });

      // Auto-hide success message after 3 seconds
      if (finalType === 'success') {
        setTimeout(() => {
          setImportStatus({ loading: false, message: '', type: '' });
          setImportPreview([]);
          setImportOpen(false);
        }, 3000);
      }

    } catch (e) {
      console.error('❌ Import process failed:', e);
      setImportStatus({ 
        loading: false, 
        message: `❌ Import failed: ${e.message}`, 
        type: 'error' 
      });
    }

    setImportStatus({ loading: true, message: `Importing ${toImport.length} items...`, type: 'info' });
    
    try {
      const created = [];
      const failed = [];
      
      for (let i = 0; i < toImport.length; i++) {
        const item = toImport[i];
        setImportStatus({ 
          loading: true, 
          message: `Importing item ${i + 1} of ${toImport.length}: ${item.name}...`, 
          type: 'info' 
        });

        try {
          // Validate required fields
          if (!item.name || !item.category) {
            failed.push({ item: item.name || 'Unnamed item', error: 'Missing name or category' });
            continue;
          }

          const productData = {
            name: item.name.trim(),
            category: item.category.trim(),
            subcategory: (item.subcategory || item.category || 'General').trim(),
            price: Number(item.price) || 0,
            stock: Number(item.stock) || 0,
            code: item.code || item.sku || `AUTO-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            image: item.image || null,
            description: (item.description || '').trim() || null,
            specifications: (item.specifications || '').trim() || null,
          };
          
          console.log('📤 Sending product data:', productData);
          
          const res = await fetch('/api/product', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData),
          });

          console.log('📥 API Response status:', res.status, res.statusText);
          
          if (res.ok) {
            const newProduct = await res.json();
            created.push(newProduct);
            console.log('✅ Successfully imported:', item.name, newProduct);
          } else {
            const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
            console.error('❌ Failed to import:', item.name, 'Status:', res.status, 'Error:', errorData);
            failed.push({ item: item.name, error: errorData.error || `HTTP ${res.status}` });
          }
        } catch (itemError) {
          failed.push({ item: item.name, error: itemError.message });
          console.error('❌ Import error for item:', item.name, itemError);
        }

        // Small delay to prevent overwhelming the server
        if (i < toImport.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      // Update products list with successfully created items
      if (created.length > 0) {
        const updatedProducts = [...products, ...created];
        setProducts(updatedProducts);
      }

      // Show final status
      let finalMessage = '';
      let finalType = 'success';

      if (created.length > 0 && failed.length === 0) {
        finalMessage = `✅ Successfully imported all ${created.length} items!`;
        finalType = 'success';
      } else if (created.length > 0 && failed.length > 0) {
        finalMessage = `⚠️ Imported ${created.length} items successfully, ${failed.length} failed.`;
        finalType = 'warning';
      } else if (failed.length > 0) {
        finalMessage = `❌ Failed to import all ${failed.length} items.`;
        finalType = 'error';
      }

      // Show detailed errors if any
      if (failed.length > 0) {
        console.error('Import failures:', failed);
        finalMessage += ` Errors: ${failed.map(f => `${f.item}: ${f.error}`).join('; ')}`;
      }

      setImportStatus({ loading: false, message: finalMessage, type: finalType });

      // Auto-hide success message after 3 seconds
      if (finalType === 'success') {
        setTimeout(() => {
          setImportStatus({ loading: false, message: '', type: '' });
          setImportPreview([]);
          setImportOpen(false);
        }, 3000);
      }

    } catch (e) {
      console.error('❌ Import process failed:', e);
      setImportStatus({ 
        loading: false, 
        message: `❌ Import failed: ${e.message}`, 
        type: 'error' 
      });
    }
  };




  const handleDeleteProduct = async (id) => {
    try {
      const res = await fetch(`/api/product?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      const updatedProducts = products.filter(p => p.id !== id);
      setProducts(updatedProducts);
    } catch (e) {
      console.error(e)
    }
  };

  const handleEditProduct = (product) => {
    setFormData(product);
    setEditingId(product.id);
    setShowAddForm(true);
    // Scroll to form after a brief delay to ensure it's rendered
    setTimeout(() => {
      const formElement = document.querySelector('#product-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // No localStorage sync in DB mode

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Product Management</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setShowCategoryManager(!showCategoryManager)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            📂 Categories
          </button>
          <button
            onClick={() => setImportOpen(!importOpen)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Import List
          </button>
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              if (editingId) {
                setEditingId(null);
                setFormData({ name: '', category: '', subcategory: '', price: '', stock: '', code: '', image: '', description: '', specifications: '' });
              }
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showAddForm ? 'Cancel' : '+ Add Product'}
          </button>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <label className="block text-sm font-semibold mb-2">Search Products</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setShowSuggestions(false);
                  e.target.blur();
                } else if (e.key === 'Enter' && searchSuggestions.length > 0) {
                  selectSuggestion(searchSuggestions[0]);
                }
              }}
              placeholder="Search by name, category, code, description... (Press Esc to close)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            
            {/* Search Suggestions Dropdown */}
            {showSuggestions && (searchSuggestions.length > 0 || searchHistory.length > 0) && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                {/* Search History */}
                {searchHistory.length > 0 && searchTerm.length < 2 && (
                  <>
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-b">
                      Recent Searches
                    </div>
                    {searchHistory.map((historyItem, index) => (
                      <button
                        key={`history-${index}`}
                        onClick={() => selectSuggestion(historyItem)}
                        className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none flex items-center gap-2"
                      >
                        <span className="text-gray-400">🕒</span>
                        <span className="text-sm text-gray-700">{historyItem}</span>
                      </button>
                    ))}
                  </>
                )}
                
                {/* Live Suggestions */}
                {searchSuggestions.length > 0 && (
                  <>
                    {searchHistory.length > 0 && searchTerm.length < 2 && (
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-b border-t">
                        Suggestions
                      </div>
                    )}
                    {searchSuggestions.map((suggestion, index) => (
                      <button
                        key={`suggestion-${index}`}
                        onClick={() => selectSuggestion(suggestion)}
                        className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none flex items-center gap-2"
                      >
                        <span className="text-gray-400">🔍</span>
                        <span className="text-sm text-gray-700">{suggestion}</span>
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
            
            {/* Search Tips */}
            <div className="mt-1 text-xs text-gray-500">
              💡 Try: "chair red", "₹500", "office furniture", or product codes
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Filter by Category</label>
            <select
              value={filterCategory}
              onChange={(e) => {
                setFilterCategory(e.target.value);
                setFilterSubcategory(''); // Reset subcategory when category changes
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">All Categories</option>
              {categoryGroups.map(category => {
                const categoryProducts = products.filter(p => p.category === category.name);
                return (
                  <option key={category.name} value={category.name}>
                    {getCategoryIcon(category.name)} {category.name} ({categoryProducts.length})
                  </option>
                );
              })}
            </select>
            
            {/* Subcategory Filter */}
            {filterCategory && (
              <div className="mt-2">
                <label className="block text-sm font-medium mb-1 text-gray-600">Subcategory</label>
                <select
                  value={filterSubcategory}
                  onChange={(e) => setFilterSubcategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                >
                  <option value="">All Subcategories</option>
                  {(() => {
                    const selectedCategoryGroup = categoryGroups.find(c => c.name === filterCategory);
                    if (!selectedCategoryGroup) return null;
                    
                    return selectedCategoryGroup.subs.map(sub => {
                      const subProducts = products.filter(p => p.category === filterCategory && p.subcategory === sub);
                      return (
                        <option key={sub} value={sub}>
                          {sub} ({subProducts.length})
                        </option>
                      );
                    });
                  })()}
                </select>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="name">Name</option>
              <option value="category">Category</option>
              <option value="price">Price</option>
              <option value="stock">Stock</option>
              <option value="code">Code</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Sort Order</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold">{filteredProducts.length}</span> of <span className="font-semibold">{products.length}</span> products
            {searchTerm && (
              <span className="ml-2">
                for "<span className="font-medium text-blue-600">{searchTerm}</span>"
              </span>
            )}
            {filterCategory && (
              <span className="ml-2">
                in <span className="font-medium text-green-600">{filterCategory}</span>
                {filterSubcategory && (
                  <span> → <span className="font-medium text-purple-600">{filterSubcategory}</span></span>
                )}
              </span>
            )}
          </div>
          
          {(searchTerm || filterCategory || filterSubcategory) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterCategory('');
                setFilterSubcategory('');
                setShowSuggestions(false);
                setSearchSuggestions([]);
              }}
              className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center gap-1"
            >
              <span>✕</span> Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Category Manager */}
      {showCategoryManager && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Category Management</h3>
            <button
              onClick={() => setShowCategoryManager(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Statistics */}
            <div>
              <h4 className="font-semibold mb-3 text-gray-700">Category Overview</h4>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {categoryGroups.map(category => {
                  const categoryProducts = products.filter(p => p.category === category.name);
                  return (
                    <div key={category.name} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getCategoryIcon(category.name)}</span>
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                          {categoryProducts.length} products
                        </span>
                      </div>
                      
                      {/* Subcategories */}
                      <div className="ml-6 space-y-1">
                        {category.subs.map(sub => {
                          const subProducts = categoryProducts.filter(p => p.subcategory === sub);
                          return (
                            <div key={sub} className="flex justify-between items-center text-sm text-gray-600">
                              <span>• {sub}</span>
                              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                                {subProducts.length}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Category Actions */}
            <div>
              <h4 className="font-semibold mb-3 text-gray-700">Quick Actions</h4>
              <div className="space-y-3">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="font-medium text-blue-800 mb-2">📊 Category Statistics</h5>
                  <div className="text-sm text-blue-700 space-y-1">
                    <div>Total Categories: <span className="font-medium">{categoryGroups.length}</span></div>
                    <div>Total Subcategories: <span className="font-medium">{categoryGroups.reduce((sum, cat) => sum + cat.subs.length, 0)}</span></div>
                    <div>Most Popular: <span className="font-medium">
                      {(() => {
                        const categoryCounts = categoryGroups.map(cat => ({
                          name: cat.name,
                          count: products.filter(p => p.category === cat.name).length
                        }));
                        const mostPopular = categoryCounts.reduce((max, cat) => cat.count > max.count ? cat : max, { count: 0, name: 'None' });
                        return `${mostPopular.name} (${mostPopular.count})`;
                      })()}
                    </span></div>
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h5 className="font-medium text-green-800 mb-2">🎯 Category Tips</h5>
                  <div className="text-sm text-green-700 space-y-1">
                    <div>• Use specific subcategories for better organization</div>
                    <div>• Keep category names consistent</div>
                    <div>• Regular cleanup helps maintain quality</div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h5 className="font-medium text-yellow-800 mb-2">⚠️ Category Health</h5>
                  <div className="text-sm text-yellow-700 space-y-1">
                    {(() => {
                      const emptyCats = categoryGroups.filter(cat => 
                        products.filter(p => p.category === cat.name).length === 0
                      );
                      const uncategorized = products.filter(p => !p.category || p.category === '').length;
                      
                      return (
                        <>
                          <div>Empty Categories: <span className="font-medium">{emptyCats.length}</span></div>
                          <div>Uncategorized Products: <span className="font-medium">{uncategorized}</span></div>
                          {uncategorized > 0 && (
                            <div className="text-red-600 font-medium">⚠️ Some products need categories!</div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <div id="product-form" className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-bold mb-4">{editingId ? 'Edit Product' : 'Add New Product'}</h3>
          <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Product Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Product name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => {
                  const newCat = e.target.value;
                  const group = categoryGroups.find(g => g.name === newCat);
                  setFormData({ ...formData, category: newCat, subcategory: group && group.subs && group.subs.length ? group.subs[0] : '' });
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              >
                <option value="">Select Category</option>
                {categoryGroups.map(g => (
                  <option key={g.name} value={g.name}>{g.name}</option>
                ))}
              </select>

              <label className="block text-sm font-semibold mt-3 mb-2">Subcategory</label>
              <select
                value={formData.subcategory}
                onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              >
                <option value="">Select Subcategory</option>
                {(() => {
                  const grp = categoryGroups.find(g => g.name === formData.category);
                  if (!grp) return null;
                  return grp.subs.map(sub => <option key={sub} value={sub}>{sub}</option>);
                })()}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Price (₹)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="Price"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Stock Quantity</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="Stock"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Product Code</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="Product code"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Product Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-2 py-1 border border-gray-300 rounded-lg"
              />
              {formData.image && (
                <img src={formData.image} alt="Preview" className="mt-2 h-24 object-contain rounded border" />
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Short product description"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                rows={3}
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2">
                Specifications 
                <span className="text-xs text-gray-500 font-normal ml-2">(One specification per line)</span>
              </label>
              
              {/* Formatting Toolbar */}
              <div className="mb-3 flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border">
                <div className="text-xs font-semibold text-gray-600 mr-2">Quick Format:</div>
                
                <button
                  type="button"
                  onClick={() => {
                    const textarea = document.querySelector('textarea[placeholder*="specifications"]');
                    const cursorPos = textarea.selectionStart;
                    const textBefore = formData.specifications.substring(0, cursorPos);
                    const textAfter = formData.specifications.substring(cursorPos);
                    const newText = textBefore + (textBefore.endsWith('\n') || textBefore === '' ? '' : '\n') + '• ';
                    setFormData({ ...formData, specifications: newText + textAfter });
                    setTimeout(() => {
                      textarea.focus();
                      textarea.setSelectionRange(newText.length, newText.length);
                    }, 10);
                  }}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition-colors flex items-center gap-1"
                >
                  <span>•</span> Bullet Point
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    const textarea = document.querySelector('textarea[placeholder*="specifications"]');
                    const cursorPos = textarea.selectionStart;
                    const textBefore = formData.specifications.substring(0, cursorPos);
                    const textAfter = formData.specifications.substring(cursorPos);
                    
                    // Count existing numbered items to get next number
                    const lines = formData.specifications.split('\n');
                    const numberedLines = lines.filter(line => /^\d+\./.test(line.trim()));
                    const nextNumber = numberedLines.length + 1;
                    
                    const newText = textBefore + (textBefore.endsWith('\n') || textBefore === '' ? '' : '\n') + `${nextNumber}. `;
                    setFormData({ ...formData, specifications: newText + textAfter });
                    setTimeout(() => {
                      textarea.focus();
                      textarea.setSelectionRange(newText.length, newText.length);
                    }, 10);
                  }}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200 transition-colors flex items-center gap-1"
                >
                  <span>1.</span> Numbered
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    const textarea = document.querySelector('textarea[placeholder*="specifications"]');
                    const cursorPos = textarea.selectionStart;
                    const textBefore = formData.specifications.substring(0, cursorPos);
                    const textAfter = formData.specifications.substring(cursorPos);
                    const newText = textBefore + (textBefore.endsWith('\n') || textBefore === '' ? '' : '\n') + '- ';
                    setFormData({ ...formData, specifications: newText + textAfter });
                    setTimeout(() => {
                      textarea.focus();
                      textarea.setSelectionRange(newText.length, newText.length);
                    }, 10);
                  }}
                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded text-xs hover:bg-purple-200 transition-colors flex items-center gap-1"
                >
                  <span>-</span> Dash
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    const commonSpecs = [
                      '• Material: ',
                      '• Dimensions: ',
                      '• Weight: ',
                      '• Color: ',
                      '• Warranty: ',
                      '• Power: ',
                      '• Capacity: ',
                      '• Features: '
                    ].join('\n');
                    
                    const currentSpecs = formData.specifications.trim();
                    const newSpecs = currentSpecs ? currentSpecs + '\n' + commonSpecs : commonSpecs;
                    setFormData({ ...formData, specifications: newSpecs });
                  }}
                  className="px-3 py-1 bg-orange-100 text-orange-700 rounded text-xs hover:bg-orange-200 transition-colors flex items-center gap-1"
                >
                  <span>📋</span> Template
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    // Renumber all numbered items
                    const lines = formData.specifications.split('\n');
                    let counter = 1;
                    const renumberedLines = lines.map(line => {
                      if (/^\d+\./.test(line.trim())) {
                        return line.replace(/^\d+\./, `${counter++}.`);
                      }
                      return line;
                    });
                    setFormData({ ...formData, specifications: renumberedLines.join('\n') });
                  }}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 transition-colors flex items-center gap-1"
                >
                  <span>🔢</span> Renumber
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, specifications: '' });
                  }}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200 transition-colors flex items-center gap-1"
                >
                  <span>🗑️</span> Clear
                </button>
              </div>
              
              <textarea
                value={formData.specifications}
                onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                placeholder="Enter product specifications, one per line:&#10;• Material: Stainless Steel&#10;• Dimensions: 120x60x75 cm&#10;• Weight: 25 kg&#10;• Warranty: 2 Years&#10;• Color: Black/Silver&#10;&#10;Or use the formatting buttons above for quick entry!"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                rows={8}
              />
              
              <div className="mt-2 text-xs text-gray-500 space-y-1">
                <div>💡 <strong>Formatting Options:</strong></div>
                <div className="ml-4 space-y-1">
                  <div><span className="font-mono bg-gray-100 px-1 rounded">• Text</span> - Bullet points</div>
                  <div><span className="font-mono bg-gray-100 px-1 rounded">1. Text</span> - Numbered list</div>
                  <div><span className="font-mono bg-gray-100 px-1 rounded">- Text</span> - Dash points</div>
                </div>
                <div className="mt-2 text-blue-600">
                  <strong>Tip:</strong> Use the buttons above for quick formatting, or type manually. Each line becomes a separate specification.
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2 flex gap-4 items-center">
              <button
                type="submit"
                onClick={() => setAddAndMore(false)}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                {editingId ? 'Update Product' : 'Add Product'}
              </button>

              <button
                type="submit"
                onClick={() => setAddAndMore(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Add &amp; add another
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Import UI & Preview */}
      {importOpen && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-bold mb-4">Import Products From File</h3>
          <p className="text-sm text-gray-600 mb-2">Supported: .csv, .txt, .pdf, .docx files containing product information.</p>
          <div className="text-xs text-gray-500 mb-4 bg-blue-50 p-3 rounded-lg">
            <strong>What we look for:</strong>
            <ul className="mt-1 space-y-1">
              <li>• <strong>Product Names:</strong> Item titles or product names</li>
              <li>• <strong>Prices:</strong> ₹500, Rs. 1000, Price: 250, etc.</li>
              <li>• <strong>Categories:</strong> Furniture, Electronics, Office Supplies, etc.</li>
              <li>• <strong>Product Codes:</strong> SKU, Item No, Model numbers</li>
              <li>• <strong>Stock:</strong> Quantity, Units available</li>
              <li>• <strong>Descriptions:</strong> Product details and specifications</li>
            </ul>
            <p className="mt-2 text-blue-600"><strong>Tip:</strong> For best results, use structured formats like CSV with headers (Name, Price, Category, Code, Stock, Description)</p>
          </div>
          <input type="file" accept=".csv,.txt,.pdf,.doc,.docx" onChange={handleFileInput} className="mb-4" />
          
          {/* Import Status Display */}
          {importStatus.message && (
            <div className={`mb-4 p-4 rounded-lg border ${
              importStatus.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
              importStatus.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
              importStatus.type === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
              'bg-blue-50 border-blue-200 text-blue-800'
            }`}>
              <div className="flex items-center gap-2">
                {importStatus.loading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                )}
                <span className="font-medium">{importStatus.message}</span>
              </div>
            </div>
          )}
          
          {importErrors.length > 0 && (
            <div className="mb-4">
              {importErrors.map((err, i) => (
                <div key={i} className="text-red-600 bg-red-50 p-2 rounded border border-red-200 mb-2">{err}</div>
              ))}
            </div>
          )}

          {importPreview.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Preview ({importPreview.length} items)</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2">Include</th>
                      <th className="p-2">Image</th>
                      <th className="p-2">Name</th>
                      <th className="p-2">Price</th>
                      <th className="p-2">Category</th>
                      <th className="p-2">Code</th>
                      <th className="p-2">Description</th>
                      <th className="p-2">Specifications</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importPreview.map((it, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="p-2 text-center">
                          <input type="checkbox" checked={it.include !== false} onChange={(e) => updatePreviewItem(idx, 'include', e.target.checked)} />
                        </td>
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            {it.image ? (
                              (typeof it.image === 'string' && (it.image.startsWith('data:') || it.image.startsWith('http'))) ? (
                                <img src={it.image} alt={it.name} className="h-12 w-12 object-contain rounded border" />
                              ) : (
                                <div className="h-12 w-12 flex items-center justify-center border rounded">{it.image}</div>
                              )
                            ) : (
                              <div className="h-12 w-12 flex items-center justify-center border rounded text-gray-400">—</div>
                            )}
                            <div className="flex-1">
                              <input className="w-full mb-1" placeholder="Image URL or emoji" value={it.image || ''} onChange={(e) => updatePreviewItem(idx, 'image', e.target.value)} />
                              <input type="file" accept="image/*" onChange={(e) => handlePreviewImageFile(idx, e.target.files && e.target.files[0])} className="text-xs" />
                            </div>
                          </div>
                        </td>
                        <td className="p-2"><input className="w-full" value={it.name} onChange={(e) => updatePreviewItem(idx, 'name', e.target.value)} /></td>
                        <td className="p-2"><input className="w-full" value={it.price} onChange={(e) => updatePreviewItem(idx, 'price', e.target.value)} /></td>
                        <td className="p-2"><input className="w-full" value={it.category} onChange={(e) => updatePreviewItem(idx, 'category', e.target.value)} /></td>
                        <td className="p-2"><input className="w-full" value={it.code || ''} onChange={(e) => updatePreviewItem(idx, 'code', e.target.value)} /></td>
                        <td className="p-2"><input className="w-full" value={it.description || ''} onChange={(e) => updatePreviewItem(idx, 'description', e.target.value)} /></td>
                        <td className="p-2"><textarea className="w-full text-xs" rows={2} value={it.specifications || ''} onChange={(e) => updatePreviewItem(idx, 'specifications', e.target.value)} placeholder="One spec per line" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('🔥 Button clicked!');
                    console.log('📊 Import status:', importStatus);
                    console.log('📋 Import preview:', importPreview);
                    
                    // Test API connectivity first
                    try {
                      console.log('🧪 Testing API connectivity...');
                      const testRes = await fetch('/api/product', { method: 'GET' });
                      console.log('🧪 API Test Response:', testRes.status, testRes.statusText);
                      if (testRes.ok) {
                        const testData = await testRes.json();
                        console.log('🧪 API Test Data:', testData);
                      } else {
                        console.error('🧪 API Test Failed:', await testRes.text());
                      }
                    } catch (testError) {
                      console.error('🧪 API Test Error:', testError);
                    }
                    
                    importSelectedItems();
                  }} 
                  disabled={importStatus.loading}
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                    importStatus.loading 
                      ? 'bg-gray-400 text-white cursor-not-allowed' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {importStatus.loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Importing...
                    </div>
                  ) : (
                    `Import Selected (${importPreview.filter(it => it.include !== false).length})`
                  )}
                </button>
                <button 
                  onClick={() => { 
                    setImportPreview([]); 
                    setImportOpen(false); 
                    setImportStatus({ loading: false, message: '', type: '' });
                  }} 
                  disabled={importStatus.loading}
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                    importStatus.loading 
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick Category Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h4 className="font-semibold mb-3 text-gray-700">Quick Category Filters</h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setFilterCategory('');
              setFilterSubcategory('');
            }}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              !filterCategory 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({products.length})
          </button>
          
          {categoryGroups.map(category => {
            const categoryProducts = products.filter(p => p.category === category.name);
            const isActive = filterCategory === category.name;
            
            return (
              <button
                key={category.name}
                onClick={() => {
                  setFilterCategory(isActive ? '' : category.name);
                  setFilterSubcategory('');
                }}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${
                  isActive
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{getCategoryIcon(category.name)}</span>
                <span>{category.name.split(' ')[0]} ({categoryProducts.length})</span>
              </button>
            );
          })}
        </div>
        
        {/* Subcategory Quick Filters */}
        {filterCategory && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterSubcategory('')}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  !filterSubcategory 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                }`}
              >
                All Subcategories
              </button>
              
              {(() => {
                const selectedCategoryGroup = categoryGroups.find(c => c.name === filterCategory);
                if (!selectedCategoryGroup) return null;
                
                return selectedCategoryGroup.subs.map(sub => {
                  const subProducts = products.filter(p => p.category === filterCategory && p.subcategory === sub);
                  const isActive = filterSubcategory === sub;
                  
                  return (
                    <button
                      key={sub}
                      onClick={() => setFilterSubcategory(isActive ? '' : sub)}
                      className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-purple-600 text-white' 
                          : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                      }`}
                    >
                      {sub} ({subProducts.length})
                    </button>
                  );
                });
              })()}
            </div>
          </div>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Image</th>
              <th className="px-6 py-3 text-left font-semibold">Product Name</th>
              <th className="px-6 py-3 text-left font-semibold">Category</th>
              <th className="px-6 py-3 text-left font-semibold">Price</th>
              <th className="px-6 py-3 text-left font-semibold">Code</th>
              <th className="px-6 py-3 text-left font-semibold">Stock</th>
              <th className="px-6 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                  {products.length === 0 ? 'No products found. Add your first product!' : 'No products match your search criteria.'}
                </td>
              </tr>
            ) : (
              filteredProducts.map(product => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="h-12 w-12 object-contain rounded border" />
                    ) : (
                      <span className="text-2xl">📦</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div dangerouslySetInnerHTML={{ 
                      __html: searchTerm ? highlightSearchTerms(product.name, searchTerm.toLowerCase().trim().split(/\s+/)) : product.name 
                    }} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div dangerouslySetInnerHTML={{ 
                      __html: searchTerm ? highlightSearchTerms(product.category, searchTerm.toLowerCase().trim().split(/\s+/)) : product.category 
                    }} />
                  </td>
                  <td className="px-6 py-4 font-semibold">₹{product.price}</td>
                  <td className="px-6 py-4">
                    <div dangerouslySetInnerHTML={{ 
                      __html: searchTerm ? highlightSearchTerms(product.code, searchTerm.toLowerCase().trim().split(/\s+/)) : product.code 
                    }} />
                  </td>
                  <td className="px-6 py-4">{product.stock} units</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 text-sm transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 text-sm transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Contact Inquiries Tab Component
function InquiriesTab() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dataSource, setDataSource] = useState('unknown');
  const [supabaseStatus, setSupabaseStatus] = useState('checking');

  useEffect(() => {
    fetchInquiries();
    checkSupabaseStatus();
  }, []);

  const checkSupabaseStatus = async () => {
    try {
      const response = await fetch('/api/admin/supabase-status');
      if (response.ok) {
        const data = await response.json();
        setSupabaseStatus(data.status);
      } else {
        setSupabaseStatus('error');
      }
    } catch (error) {
      console.error('Failed to check Supabase status:', error);
      setSupabaseStatus('error');
    }
  };

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/inquiries');
      if (response.ok) {
        const data = await response.json();
        setInquiries(data.inquiries || []);
        setDataSource(data.source || 'unknown');
        console.log(`📊 Loaded ${data.count || 0} inquiries from ${data.source || 'unknown'}`);
      }
    } catch (error) {
      console.error('Failed to fetch inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateInquiryStatus = async (id, status) => {
    try {
      const response = await fetch('/api/admin/inquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      
      if (response.ok) {
        setInquiries(prev => prev.map(inquiry => 
          inquiry.id === id ? { ...inquiry, status } : inquiry
        ));
        if (selectedInquiry?.id === id) {
          setSelectedInquiry(prev => ({ ...prev, status }));
        }
      }
    } catch (error) {
      console.error('Failed to update inquiry status:', error);
    }
  };

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesStatus = statusFilter === 'all' || inquiry.status === statusFilter;
    const matchesSearch = !searchTerm || 
      inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.company?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'replied': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'new': return '🆕';
      case 'replied': return '💬';
      case 'resolved': return '✅';
      default: return '📋';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading inquiries...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Inquiries Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Inquiries</p>
              <p className="text-2xl font-bold text-gray-900">{inquiries.length}</p>
            </div>
            <div className="text-3xl">📧</div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">New Inquiries</p>
              <p className="text-2xl font-bold text-blue-600">
                {inquiries.filter(i => i.status === 'new').length}
              </p>
            </div>
            <div className="text-3xl">🆕</div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Replied</p>
              <p className="text-2xl font-bold text-yellow-600">
                {inquiries.filter(i => i.status === 'replied').length}
              </p>
            </div>
            <div className="text-3xl">💬</div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-green-600">
                {inquiries.filter(i => i.status === 'resolved').length}
              </p>
            </div>
            <div className="text-3xl">✅</div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-4 items-center">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="replied">Replied</option>
              <option value="resolved">Resolved</option>
            </select>
            
            <input
              type="text"
              placeholder="Search inquiries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          
          <button
            onClick={fetchInquiries}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Inquiries List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Contact Inquiries ({filteredInquiries.length})
            </h3>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                dataSource === 'prisma' ? 'bg-blue-100 text-blue-800' :
                dataSource === 'supabase' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {dataSource === 'prisma' ? '🗄️ Prisma DB' :
                 dataSource === 'supabase' ? '⚡ Supabase DB' :
                 '❓ Unknown Source'}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                supabaseStatus === 'ready' ? 'bg-green-100 text-green-800' :
                supabaseStatus === 'setup-needed' ? 'bg-yellow-100 text-yellow-800' :
                supabaseStatus === 'error' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {supabaseStatus === 'ready' ? '✅ Supabase Ready' :
                 supabaseStatus === 'setup-needed' ? '⚠️ Setup Needed' :
                 supabaseStatus === 'error' ? '❌ Supabase Error' :
                 '🔄 Checking...'}
              </span>
            </div>
          </div>
        </div>
        
        {filteredInquiries.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="text-4xl mb-4">📭</div>
            <p>No inquiries found matching your criteria.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredInquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => setSelectedInquiry(inquiry)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-900">{inquiry.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(inquiry.status)}`}>
                        {getStatusIcon(inquiry.status)} {inquiry.status.toUpperCase()}
                      </span>
                      {inquiry.emailSent && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          📧 Email Sent
                        </span>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Email:</strong> {inquiry.email}</p>
                      {inquiry.phone && <p><strong>Phone:</strong> {inquiry.phone}</p>}
                      {inquiry.company && <p><strong>Company:</strong> {inquiry.company}</p>}
                      <p><strong>Subject:</strong> {inquiry.subject}</p>
                      <p><strong>Message:</strong> {inquiry.message.substring(0, 100)}...</p>
                    </div>
                  </div>
                  
                  <div className="text-right text-sm text-gray-500">
                    <p>{new Date(inquiry.createdAt).toLocaleDateString()}</p>
                    <p>{new Date(inquiry.createdAt).toLocaleTimeString()}</p>
                  </div>
                </div>
                
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateInquiryStatus(inquiry.id, 'replied');
                    }}
                    className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm hover:bg-yellow-200 transition-colors"
                  >
                    Mark as Replied
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateInquiryStatus(inquiry.id, 'resolved');
                    }}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200 transition-colors"
                  >
                    Mark as Resolved
                  </button>
                  <a
                    href={`mailto:${inquiry.email}?subject=Re: ${encodeURIComponent(inquiry.subject)}`}
                    onClick={(e) => e.stopPropagation()}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200 transition-colors"
                  >
                    📧 Reply via Email
                  </a>
                  {inquiry.phone && (
                    <a
                      href={`tel:${inquiry.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200 transition-colors"
                    >
                      📞 Call
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Inquiry Details</h3>
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedInquiry.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedInquiry.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedInquiry.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedInquiry.company || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Subject</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedInquiry.subject}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedInquiry.status)}`}>
                    {getStatusIcon(selectedInquiry.status)} {selectedInquiry.status.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Message</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedInquiry.message}</p>
                </div>
              </div>
              
              <div className="text-sm text-gray-500">
                <p><strong>Received:</strong> {new Date(selectedInquiry.createdAt).toLocaleString()}</p>
                <p><strong>Email Sent:</strong> {selectedInquiry.emailSent ? 'Yes ✅' : 'No ❌'}</p>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => updateInquiryStatus(selectedInquiry.id, 'replied')}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Mark as Replied
              </button>
              <button
                onClick={() => updateInquiryStatus(selectedInquiry.id, 'resolved')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Mark as Resolved
              </button>
              <a
                href={`mailto:${selectedInquiry.email}?subject=Re: ${encodeURIComponent(selectedInquiry.subject)}`}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                📧 Reply via Email
              </a>
              {selectedInquiry.phone && (
                <a
                  href={`tel:${selectedInquiry.phone}`}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  📞 Call
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}