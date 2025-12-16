'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { addToCart, setLastProductPage } from '@/lib/cart';

export default function ProductDetail() {
  const params = useParams();
  const productId = parseInt(params.id);


  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState('');
  const [activeTab, setActiveTab] = useState('details');
  const [mainImage, setMainImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Review states
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: '',
    customerName: '',
    customerEmail: ''
  });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Initialize sample reviews if none exist
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
          id: 6,
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
        }
      ];
      localStorage.setItem('novelsols_reviews', JSON.stringify(sampleReviews));
    }
  };

  // Load reviews for this product
  const loadReviews = () => {
    try {
      // Initialize sample reviews if none exist
      initializeSampleReviews();
      
      const savedReviews = localStorage.getItem('novelsols_reviews');
      const allReviews = savedReviews ? JSON.parse(savedReviews) : [];
      const productReviews = allReviews.filter(review => 
        review.productId === productId && review.status === 'approved'
      );
      setReviews(productReviews);
    } catch (error) {
      console.error('Error loading reviews:', error);
      setReviews([]);
    }
  };

  // Submit new review
  const submitReview = () => {
    if (!newReview.customerName.trim() || !newReview.comment.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const savedReviews = localStorage.getItem('novelsols_reviews');
      const allReviews = savedReviews ? JSON.parse(savedReviews) : [];
      
      const review = {
        id: Date.now() + Math.random(),
        productId: productId,
        productName: product.name,
        customerName: newReview.customerName.trim(),
        customerEmail: newReview.customerEmail.trim(),
        rating: newReview.rating,
        title: newReview.title.trim(),
        comment: newReview.comment.trim(),
        date: new Date().toISOString(),
        status: 'approved', // Auto-approve for demo, in real app would be 'pending'
        helpful: 0,
        adminReply: null,
        verified: false
      };

      const updatedReviews = [...allReviews, review];
      localStorage.setItem('novelsols_reviews', JSON.stringify(updatedReviews));
      
      // Reset form
      setNewReview({
        rating: 5,
        title: '',
        comment: '',
        customerName: '',
        customerEmail: ''
      });
      
      setShowReviewForm(false);
      setReviewSubmitted(true);
      loadReviews(); // Reload reviews
      
      // Hide success message after 3 seconds
      setTimeout(() => setReviewSubmitted(false), 3000);
      
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review. Please try again.');
    }
  };

  // Calculate average rating
  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  // Get rating distribution
  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  // Mark review as helpful
  const markHelpful = (reviewId) => {
    try {
      const savedReviews = localStorage.getItem('novelsols_reviews');
      const allReviews = savedReviews ? JSON.parse(savedReviews) : [];
      
      const updatedReviews = allReviews.map(review => 
        review.id === reviewId 
          ? { ...review, helpful: (review.helpful || 0) + 1 }
          : review
      );
      
      localStorage.setItem('novelsols_reviews', JSON.stringify(updatedReviews));
      loadReviews(); // Reload reviews to show updated count
    } catch (error) {
      console.error('Error marking review as helpful:', error);
    }
  };

  // Generate comprehensive WhatsApp message with product details
  const generateWhatsAppMessage = () => {
    const currentUrl = window.location.href;
    const productImage = product.image;
    
    // Create a detailed message with product information
    let message = `🛒 *PRODUCT INQUIRY*\n\n`;
    message += `📦 *Product:* ${product.name}\n`;
    message += `🏷️ *Code:* ${product.code || 'N/A'}\n`;
    message += `📂 *Category:* ${product.category}\n`;
    if (product.subcategory) {
      message += `📁 *Subcategory:* ${product.subcategory}\n`;
    }
    message += `💰 *Price:* ₹${product.price?.toLocaleString()}\n`;
    message += `📊 *Quantity Needed:* ${quantity} units\n`;
    message += `⭐ *Rating:* ${reviews.length > 0 ? getAverageRating() : (product.rating || 'N/A')}/5\n\n`;
    
    // Add product description if available
    if (product.description) {
      message += `📝 *Description:*\n${product.description.substring(0, 100)}${product.description.length > 100 ? '...' : ''}\n\n`;
    }
    
    // Add key specifications
    if (product.specifications && product.specifications.length > 0) {
      message += `🔧 *Key Specifications:*\n`;
      product.specifications.slice(0, 3).forEach(spec => {
        message += `• ${spec}\n`;
      });
      message += `\n`;
    }
    
    // Add stock information
    message += `📦 *Stock Status:* ${product.stock > 0 ? `${product.stock} units available` : 'Please check availability'}\n`;
    message += `🛡️ *Warranty:* ${product.warranty || '1 Year'}\n\n`;
    
    // Add product link for reference
    message += `🔗 *Product Link:* ${currentUrl}\n\n`;
    
    // Add image reference
    if (productImage) {
      if (typeof productImage === 'string' && (productImage.startsWith('data:') || productImage.startsWith('http'))) {
        message += `📸 *Product Image:* Available on the product page\n`;
      } else {
        message += `📸 *Product Image:* ${productImage} (See product page for details)\n`;
      }
      message += `\n`;
    }
    
    message += `💬 *Request:*\nHello! I'm interested in the above product. Please share:\n`;
    message += `• Final pricing for ${quantity} units\n`;
    message += `• Current availability\n`;
    message += `• Delivery timeline\n`;
    message += `• Any bulk discounts available\n\n`;
    message += `Thank you! 🙏`;
    
    return message;
  };

  // Generate product details for copying/sharing
  const generateProductDetails = () => {
    const currentUrl = window.location.href;
    const productImage = product.image;
    
    let details = `📦 PRODUCT DETAILS\n\n`;
    details += `Name: ${product.name}\n`;
    details += `Code: ${product.code || 'N/A'}\n`;
    details += `Category: ${product.category}\n`;
    if (product.subcategory) {
      details += `Subcategory: ${product.subcategory}\n`;
    }
    details += `Price: ₹${product.price?.toLocaleString()}\n`;
    details += `Rating: ${reviews.length > 0 ? getAverageRating() : (product.rating || 'N/A')}/5\n`;
    details += `Stock: ${product.stock > 0 ? `${product.stock} units` : 'Check availability'}\n`;
    details += `Warranty: ${product.warranty || '1 Year'}\n\n`;
    
    if (product.description) {
      details += `Description:\n${product.description}\n\n`;
    }
    
    if (product.specifications && product.specifications.length > 0) {
      details += `Specifications:\n`;
      product.specifications.forEach(spec => {
        details += `• ${spec}\n`;
      });
      details += `\n`;
    }
    
    // Add image reference
    if (productImage) {
      if (typeof productImage === 'string' && (productImage.startsWith('data:') || productImage.startsWith('http'))) {
        details += `Image: Available at product page\n`;
      } else {
        details += `Image: ${productImage}\n`;
      }
    }
    
    details += `\nProduct Link: ${currentUrl}`;
    
    return details;
  };

  // Generate category-specific specifications
  const getCategorySpecifications = (product) => {
    const baseSpecs = [
      { label: 'Product Code', value: product.code || 'N/A' },
      { label: 'Category', value: product.category },
      { label: 'Subcategory', value: product.subcategory || 'N/A' },
      { label: 'Stock', value: `${product.stock} units` }
    ];

    // Category-specific specifications
    const categorySpecs = [];
    
    if (product.category === 'Furniture & Fixtures' || product.category === 'Furniture and Fixtures') {
      // Furniture specifications
      if (product.subcategory?.toLowerCase().includes('sofa') || product.name.toLowerCase().includes('sofa')) {
        categorySpecs.push(
          { label: 'Fabric Type', value: 'Premium Synthetic Leather' },
          { label: 'Frame Material', value: 'Hardwood with Metal Reinforcement' },
          { label: 'Cushion Fill', value: 'High-Density Foam' },
          { label: 'Dimensions (L×W×H)', value: '180×85×90 cm' },
          { label: 'Seating Capacity', value: '3 Persons' },
          { label: 'Weight Capacity', value: '300 kg' },
          { label: 'Color Options', value: 'Black, Brown, Grey' },
          { label: 'Assembly Required', value: 'Minimal (Legs only)' }
        );
      } else if (product.subcategory?.toLowerCase().includes('chair') || product.name.toLowerCase().includes('chair')) {
        categorySpecs.push(
          { label: 'Material', value: 'High-Quality Mesh & Fabric' },
          { label: 'Frame', value: 'Heavy-Duty Metal Base' },
          { label: 'Adjustable Height', value: '45-55 cm' },
          { label: 'Seat Dimensions', value: '50×50 cm' },
          { label: 'Backrest Height', value: '65 cm' },
          { label: 'Weight Capacity', value: '150 kg' },
          { label: 'Armrests', value: 'Adjustable Padded' },
          { label: 'Wheels', value: '5-Point Caster Base' }
        );
      } else if (product.subcategory?.toLowerCase().includes('table') || product.name.toLowerCase().includes('table')) {
        categorySpecs.push(
          { label: 'Table Top Material', value: 'Engineered Wood with Laminate' },
          { label: 'Frame Material', value: 'Steel Powder Coated' },
          { label: 'Dimensions (L×W×H)', value: '120×60×75 cm' },
          { label: 'Thickness', value: '25mm Table Top' },
          { label: 'Weight Capacity', value: '50 kg' },
          { label: 'Finish', value: 'Scratch Resistant' },
          { label: 'Assembly Required', value: 'Yes (Tools Included)' }
        );
      }
    } else if (product.category === 'Electronic Items') {
      // Electronics specifications
      if (product.name.toLowerCase().includes('led') || product.name.toLowerCase().includes('light')) {
        categorySpecs.push(
          { label: 'Power Rating', value: '20W LED' },
          { label: 'Input Voltage', value: '220V AC, 50Hz' },
          { label: 'Battery Backup', value: '8 Hours' },
          { label: 'Charging Time', value: '6 Hours' },
          { label: 'Light Output', value: '2000 Lumens' },
          { label: 'Color Temperature', value: '6500K (Cool White)' },
          { label: 'Operating Temperature', value: '-10°C to 50°C' },
          { label: 'Certifications', value: 'ISO, CE Approved' }
        );
      } else {
        categorySpecs.push(
          { label: 'Power Rating', value: 'As per specifications' },
          { label: 'Input Voltage', value: '220V AC' },
          { label: 'Operating Temperature', value: '0°C to 40°C' },
          { label: 'Certifications', value: 'ISO Certified' }
        );
      }
    } else if (product.category === 'IT' || product.category === 'Computer Hardwares') {
      // IT/Computer specifications
      if (product.name.toLowerCase().includes('computer') || product.name.toLowerCase().includes('desktop')) {
        categorySpecs.push(
          { label: 'Processor', value: 'Intel i5 Equivalent' },
          { label: 'RAM', value: '8GB DDR4' },
          { label: 'Storage', value: '256GB SSD' },
          { label: 'Graphics', value: 'Integrated Graphics' },
          { label: 'Monitor', value: '21.5" LED Display' },
          { label: 'Operating System', value: 'Windows 11 Ready' },
          { label: 'Connectivity', value: 'WiFi, Bluetooth, USB 3.0' },
          { label: 'Warranty', value: '3 Years Comprehensive' }
        );
      } else {
        categorySpecs.push(
          { label: 'Compatibility', value: 'Universal' },
          { label: 'Interface', value: 'USB/Wireless' },
          { label: 'Operating System', value: 'Windows, Mac, Linux' },
          { label: 'Warranty', value: '1 Year' }
        );
      }
    } else if (product.category === 'Safety Items') {
      // Safety equipment specifications
      categorySpecs.push(
        { label: 'Material', value: 'Industrial Grade Synthetic' },
        { label: 'Standards Compliance', value: 'ISI Certified' },
        { label: 'Size Range', value: 'Universal/Adjustable' },
        { label: 'Color', value: 'High Visibility Orange/Yellow' },
        { label: 'Durability', value: 'Heavy Duty Construction' },
        { label: 'Temperature Range', value: '-20°C to 60°C' },
        { label: 'Certifications', value: 'ISI, CE Approved' }
      );
    } else if (product.category === 'Clinical Items') {
      // Medical/Clinical specifications
      categorySpecs.push(
        { label: 'Material', value: 'Medical Grade Stainless Steel' },
        { label: 'Sterilization', value: 'Autoclave Compatible' },
        { label: 'Standards', value: 'Medical Grade Quality' },
        { label: 'Packaging', value: 'Sterile Individual Packing' },
        { label: 'Shelf Life', value: '5 Years' },
        { label: 'Certifications', value: 'FDA Approved' }
      );
    } else if (product.category === 'Cleaning & Housekeeping Items' || product.category === 'Cleaning and Housekeeping Items') {
      // Cleaning supplies specifications
      categorySpecs.push(
        { label: 'Composition', value: 'Eco-Friendly Formula' },
        { label: 'pH Level', value: 'Neutral (6.5-7.5)' },
        { label: 'Packaging', value: 'Recyclable Containers' },
        { label: 'Shelf Life', value: '2 Years' },
        { label: 'Usage', value: 'Commercial & Domestic' },
        { label: 'Safety', value: 'Non-Toxic Formula' },
        { label: 'Certifications', value: 'Eco-Friendly Certified' }
      );
    }

    return [...baseSpecs, ...categorySpecs];
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Track this product page visit
        setLastProductPage(productId);
        
        // Fetch all products from API
        const response = await fetch('/api/product');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const products = await response.json();
        const found = products?.find(p => Number(p.id) === Number(productId));
        
        if (found) {
          setProduct(found);
          setMainImage(found.image);
          
          // Find related products with intelligent matching
          // Priority: 1. Same subcategory, 2. Same category only (no other categories)
          const sameSubcategory = products.filter(p => 
            p.subcategory === found.subcategory && p.id !== found.id
          );
          
          const sameCategory = products.filter(p => 
            p.category === found.category && 
            p.subcategory !== found.subcategory && 
            p.id !== found.id
          );
          
          // Only show products from same category/subcategory - no unrelated products
          const related = [
            ...sameSubcategory.slice(0, 6),  // Prioritize same subcategory
            ...sameCategory.slice(0, 6)      // Then same category
          ].slice(0, 8);  // Limit to 8 total
          
          setRelatedProducts(related);
          
          // Load reviews for this product
          loadReviews();
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <main className="flex-grow flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <span className="text-3xl">⏳</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Loading Product...</h2>
            <p className="text-gray-600">Please wait while we fetch the product details.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <main className="flex-grow flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🔍</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {error || 'Product Not Found'}
            </h2>
            <p className="text-gray-600 mb-8">
              {error === 'Product not found' 
                ? "The product you're looking for doesn't exist." 
                : "There was an error loading the product."}
            </p>
            <Link href="/products" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl">
              ← Back to Products
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const renderImage = (image) => {
    if (!image) return <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center"><span className="text-4xl">📦</span></div>;
    
    if (typeof image === 'string') {
      return (image.startsWith('data:') || image.startsWith('http')) ? 
        <img src={image} alt={product.name} className="w-full h-full object-contain rounded-xl" /> :
        <div className="w-full h-full flex items-center justify-center text-6xl rounded-xl bg-gradient-to-br from-blue-50 to-blue-100">{image}</div>;
    }
    return image?.url ? <img src={image.url} alt={product.name} className="w-full h-full object-contain rounded-xl" /> : 
      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center"><span className="text-4xl">📦</span></div>;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <main className="flex-grow pt-4">
        {/* Enhanced Breadcrumb */}
        <nav className="px-6 pb-8 max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600 transition-colors">🏠 Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-blue-600 transition-colors">Products</Link>
            <span>/</span>
            <span className="font-medium text-gray-900 truncate max-w-[200px]">{product.name}</span>
          </div>
        </nav>

        {/* Main Product Section - Improved Layout */}
        <section className="max-w-7xl mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            
            {/* Image Gallery - 1 Column */}
            <div className="lg:col-span-1 space-y-4">
              {/* Main Image */}
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 aspect-[4/5]">
                {renderImage(mainImage)}
              </div>
              
              {/* Thumbnail Gallery (if multiple images available) */}
              {product.images?.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(0, 4).map((img, idx) => (
                    <div 
                      key={idx}
                      className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-4 transition-all duration-200 hover:scale-105 ${
                        mainImage === img ? 'border-blue-500 shadow-md' : 'border-transparent hover:border-blue-300'
                      }`}
                      onClick={() => setMainImage(img)}
                    >
                      {renderImage(img)}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details - 1 Column */}
            <div className="lg:col-span-1 space-y-6">
              <div>
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                  {product.category}
                </span>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-4">
                  {product.name}
                </h1>
                
                {/* Rating */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center gap-1">
                    <span className="text-2xl">⭐</span>
                    <span className="text-2xl font-bold text-yellow-500">
                      {reviews.length > 0 ? getAverageRating() : (product.rating ?? '-')}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
                    </span>
                  </div>
                  {reviews.length > 0 && (
                    <div className="flex">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span key={i} className={`text-lg ${i < Math.round(getAverageRating()) ? 'text-yellow-400' : 'text-gray-300'}`}>
                          ★
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Description Preview */}
                <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-2xl">
                  {product.description?.substring(0, 200)}...
                </p>
                {product.code && (
                <div className="text-m">
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded-md">Code: {product.code}</span>
                </div>
              )}
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 pb-6">
                <div className="flex flex-wrap gap-4 lg:gap-6 border-b overflow-x-auto">
                  {['details', 'specifications', 'reviews'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-4 px-2 lg:px-1 font-semibold text-xs lg:text-sm uppercase tracking-wide transition-all duration-200 whitespace-nowrap ${
                        activeTab === tab
                          ? 'border-b-2 border-blue-600 text-blue-600 shadow-md'
                          : 'text-gray-500 hover:text-gray-900 hover:border-gray-300 border-b-2 border-transparent'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="pt-4">
                {activeTab === 'details' && (
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-gray-900">Product Description</h3>
                    <p className="text-gray-700 leading-relaxed">{product.description || 'No description available.'}</p>
                    {product.features?.length > 0 && (
                      <>
                        <h4 className="text-xl font-bold text-gray-900 mt-8 mb-4">Key Features</h4>
                        <ul className="space-y-3">
                          {product.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-3 p-3 bg-white/50 rounded-xl backdrop-blur-sm hover:bg-white transition-all">
                              <span className="text-blue-600 font-bold text-xl mt-0.5 flex-shrink-0">✓</span>
                              <span className="text-gray-700">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                )}
                
                {activeTab === 'specifications' && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-gray-900">Product Specifications</h3>
                    
                    {/* Category-specific specifications */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {getCategorySpecifications(product).map((spec, idx) => (
                        <div key={idx} className="p-4 bg-white/50 rounded-xl backdrop-blur-sm hover:bg-white/70 transition-all">
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-900 text-sm uppercase tracking-wide mb-1">
                              {spec.label}
                            </span>
                            <span className="text-gray-700 font-medium">
                              {spec.value}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Additional technical specifications from product data */}
                    {product.specifications?.length > 0 && (
                      <>
                        <h4 className="text-xl font-bold text-gray-900 mt-8 mb-4">Additional Technical Details</h4>
                        <div className="bg-white/50 rounded-xl backdrop-blur-sm p-6">
                          <ul className="space-y-3">
                            {product.specifications.map((spec, idx) => (
                              <li key={idx} className="flex items-start gap-3 p-3 bg-white/30 rounded-lg">
                                <span className="text-blue-600 font-bold text-xl mt-0.5 flex-shrink-0">•</span>
                                <span className="text-gray-700">{spec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    )}

                    {/* Care and Maintenance Instructions */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                      <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span>🛠️</span>
                        Care & Maintenance
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        {product.category === 'Furniture & Fixtures' || product.category === 'Furniture and Fixtures' ? (
                          <>
                            <div className="flex items-start gap-2">
                              <span className="text-green-600">✓</span>
                              <span>Clean with dry cloth regularly</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="text-green-600">✓</span>
                              <span>Avoid direct sunlight exposure</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="text-green-600">✓</span>
                              <span>Use furniture polish monthly</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="text-green-600">✓</span>
                              <span>Check screws and joints periodically</span>
                            </div>
                          </>
                        ) : product.category === 'Electronic Items' ? (
                          <>
                            <div className="flex items-start gap-2">
                              <span className="text-green-600">✓</span>
                              <span>Keep away from moisture</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="text-green-600">✓</span>
                              <span>Regular voltage check recommended</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="text-green-600">✓</span>
                              <span>Clean with dry cloth only</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="text-green-600">✓</span>
                              <span>Professional servicing annually</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex items-start gap-2">
                              <span className="text-green-600">✓</span>
                              <span>Store in dry, cool place</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="text-green-600">✓</span>
                              <span>Follow usage instructions</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="text-green-600">✓</span>
                              <span>Regular inspection recommended</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="text-green-600">✓</span>
                              <span>Replace if damaged</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Warranty Information */}
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-100">
                      <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span>🛡️</span>
                        Warranty & Support
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        <div className="text-center p-3 bg-white/50 rounded-lg">
                          <div className="text-2xl mb-2">📅</div>
                          <div className="font-semibold">Warranty Period</div>
                          <div className="text-gray-600">{product.warranty || '1 Year'}</div>
                        </div>
                        <div className="text-center p-3 bg-white/50 rounded-lg">
                          <div className="text-2xl mb-2">🔧</div>
                          <div className="font-semibold">Service Support</div>
                          <div className="text-gray-600">On-site Available</div>
                        </div>
                        <div className="text-center p-3 bg-white/50 rounded-lg">
                          <div className="text-2xl mb-2">📞</div>
                          <div className="font-semibold">Support Hotline</div>
                          <div className="text-gray-600">24/7 Available</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-2xl font-bold text-gray-900">Customer Reviews</h3>
                      <button
                        onClick={() => setShowReviewForm(!showReviewForm)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        {showReviewForm ? 'Cancel' : '✍️ Write Review'}
                      </button>
                    </div>

                    {/* Review Success Message */}
                    {reviewSubmitted && (
                      <div className="bg-green-100 border border-green-200 text-green-800 p-4 rounded-xl">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">✅</span>
                          <span className="font-semibold">Thank you for your review!</span>
                        </div>
                        <p className="text-sm mt-1">Your review has been submitted and will appear below.</p>
                      </div>
                    )}

                    {/* Review Statistics */}
                    {reviews.length > 0 && (
                      <div className="bg-white/50 rounded-xl backdrop-blur-sm p-6 border border-white/50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Average Rating */}
                          <div className="text-center">
                            <div className="text-4xl font-bold text-yellow-500 mb-2">{getAverageRating()}</div>
                            <div className="flex justify-center mb-2">
                              {Array.from({ length: 5 }, (_, i) => (
                                <span key={i} className={`text-2xl ${i < Math.round(getAverageRating()) ? 'text-yellow-400' : 'text-gray-300'}`}>
                                  ★
                                </span>
                              ))}
                            </div>
                            <p className="text-gray-600">Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
                          </div>

                          {/* Rating Distribution */}
                          <div className="space-y-2">
                            {Object.entries(getRatingDistribution()).reverse().map(([rating, count]) => (
                              <div key={rating} className="flex items-center gap-3">
                                <span className="text-sm font-medium w-8">{rating}★</span>
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                                    style={{ width: reviews.length > 0 ? `${(count / reviews.length) * 100}%` : '0%' }}
                                  ></div>
                                </div>
                                <span className="text-sm text-gray-600 w-8">{count}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Review Form */}
                    {showReviewForm && (
                      <div className="bg-white/50 rounded-xl backdrop-blur-sm p-6 border border-white/50">
                        <h4 className="text-xl font-bold text-gray-900 mb-4">Write Your Review</h4>
                        <div className="space-y-4">
                          {/* Rating */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Rating *</label>
                            <div className="flex gap-1">
                              {Array.from({ length: 5 }, (_, i) => (
                                <button
                                  key={i}
                                  onClick={() => setNewReview({...newReview, rating: i + 1})}
                                  className={`text-3xl transition-colors ${
                                    i < newReview.rating ? 'text-yellow-400 hover:text-yellow-500' : 'text-gray-300 hover:text-gray-400'
                                  }`}
                                >
                                  ★
                                </button>
                              ))}
                              <span className="ml-2 text-sm text-gray-600 self-center">({newReview.rating}/5)</span>
                            </div>
                          </div>

                          {/* Name and Email */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name *</label>
                              <input
                                type="text"
                                value={newReview.customerName}
                                onChange={(e) => setNewReview({...newReview, customerName: e.target.value})}
                                placeholder="Enter your name"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Email (Optional)</label>
                              <input
                                type="email"
                                value={newReview.customerEmail}
                                onChange={(e) => setNewReview({...newReview, customerEmail: e.target.value})}
                                placeholder="Enter your email"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                              />
                            </div>
                          </div>

                          {/* Review Title */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Review Title (Optional)</label>
                            <input
                              type="text"
                              value={newReview.title}
                              onChange={(e) => setNewReview({...newReview, title: e.target.value})}
                              placeholder="Summarize your review"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                          </div>

                          {/* Review Comment */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Your Review *</label>
                            <textarea
                              value={newReview.comment}
                              onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                              placeholder="Share your experience with this product..."
                              rows={4}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                              required
                            />
                          </div>

                          {/* Submit Button */}
                          <div className="flex gap-3">
                            <button
                              onClick={submitReview}
                              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                              Submit Review
                            </button>
                            <button
                              onClick={() => setShowReviewForm(false)}
                              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Reviews List */}
                    {reviews.length === 0 ? (
                      <div className="text-center py-12 bg-white/50 rounded-xl backdrop-blur-sm">
                        <span className="text-4xl mb-4 block">⭐</span>
                        <h4 className="text-xl font-semibold text-gray-900 mb-2">No Reviews Yet</h4>
                        <p className="text-gray-600 mb-4">Be the first to review this product!</p>
                        <button
                          onClick={() => setShowReviewForm(true)}
                          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                          Write First Review
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {reviews.map(review => (
                          <div key={review.id} className="bg-white/50 rounded-xl backdrop-blur-sm p-6 border border-white/50">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <div className="flex items-center gap-3 mb-2">
                                  {review.title && (
                                    <h5 className="font-semibold text-lg text-gray-900">{review.title}</h5>
                                  )}
                                  {review.verified && (
                                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                      ✓ Verified Purchase
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                  {Array.from({ length: 5 }, (_, i) => (
                                    <span key={i} className={`text-lg ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                                      ★
                                    </span>
                                  ))}
                                  <span className="text-sm text-gray-600">({review.rating}/5)</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                  <span className="font-medium">{review.customerName}</span>
                                  <span>•</span>
                                  <span>{new Date(review.date).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                            
                            <p className="text-gray-700 leading-relaxed mb-4">{review.comment}</p>
                            
                            {review.adminReply && (
                              <div className="bg-blue-50 p-4 rounded-lg mt-4 border-l-4 border-blue-400">
                                <p className="text-sm font-medium text-blue-800 mb-1">Response from Vendor:</p>
                                <p className="text-sm text-blue-700">{review.adminReply}</p>
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span>👍 {review.helpful || 0} found this helpful</span>
                              </div>
                              <button 
                                onClick={() => markHelpful(review.id)}
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors flex items-center gap-1"
                              >
                                👍 Helpful?
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Action Panel - 1 Column */}
            <div className="lg:col-span-1 sticky top-24 lg:top-32 self-start">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 lg:p-8 shadow-2xl border border-white/50 hover:shadow-3xl transition-all duration-300">
                <div className="space-y-4 lg:space-y-6">
                  {/* Price */}
                  <div className="text-center lg:text-left">
                    <span className="text-sm text-gray-500 tracking-wide uppercase font-medium">Price</span>
                    <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-2 break-words">
                      ₹{product.price?.toLocaleString()}
                    </div>
                    {product.bulkDiscount && (
                      <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold mt-2">
                        {product.bulkDiscount}
                      </span>
                    )}
                  </div>

                  {/* Stock */}
                  <div className={`p-3 rounded-xl ${product.stock > 0 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <span className={`font-semibold text-sm uppercase tracking-wide ${
                      product.stock > 0 ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {product.stock > 0 ? `✓ In Stock (${product.stock})` : '✗ Out of Stock'}
                    </span>
                  </div>

                  {/* SKU */}
                  {product.code && (
                    <div className="text-xs text-gray-500">
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded-md">Code: {product.code}</span>
                    </div>
                  )}

                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Quantity</label>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <div className="flex bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all w-full sm:w-auto">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="px-3 lg:px-4 py-2 lg:py-3 hover:bg-gray-50 font-bold text-lg lg:text-xl transition-colors flex-shrink-0"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          value={quantity}
                          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-16 lg:w-20 py-2 lg:py-3 text-center text-base lg:text-lg font-semibold border-0 focus:outline-none"
                          min="1"
                        />
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="px-3 lg:px-4 py-2 lg:py-3 hover:bg-gray-50 font-bold text-lg lg:text-xl transition-colors flex-shrink-0"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm text-gray-500">Min: 1</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        addToCart(product, quantity);
                        setAddedMessage(`Added ${quantity} × ${product.name} to cart!`);
                        setTimeout(() => setAddedMessage(''), 3000);
                      }}
                      disabled={product.stock === 0}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 lg:py-4 rounded-2xl font-bold text-base lg:text-lg shadow-xl hover:shadow-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                    >
                      {product.stock > 0 ? '🛒 Add to Cart' : 'Out of Stock'}
                    </button>

                    {addedMessage && (
                      <div className="p-4 bg-green-100 border border-green-200 text-green-800 rounded-xl backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{addedMessage}</span>
                          <Link 
                            href="/cart"
                            className="ml-3 bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
                          >
                            View Cart
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* WhatsApp */}
                  <div className="relative group">
                    <a
                      href={`https://wa.me/918779502710?text=${encodeURIComponent(generateWhatsAppMessage())}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-6 rounded-xl font-semibold shadow-xl hover:shadow-2xl hover:from-green-700 hover:to-green-800 transition-all duration-200 transform hover:-translate-y-0.5"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.52 3.48A11.92 11.92 0 0 0 12 0C5.373 0 .105 5.268.105 11.895c0 2.095.545 4.14 1.574 5.94L0 24l6.3-1.645A11.873 11.873 0 0 0 12 23.79c6.627 0 11.895-5.268 11.895-11.895 0-3.174-1.24-6.158-3.375-8.415zM12 21.79c-1.63 0-3.23-.41-4.64-1.187l-.33-.185-3.74.976.999-3.648-.214-.37A8.06 8.06 0 0 1 3.105 11.9c0-4.41 3.585-8 8-8 4.415 0 8 3.59 8 8 0 4.414-3.585 8-8 8z"/>
                      </svg>
                      📱 WhatsApp Inquiry
                    </a>
                    
                    {/* Tooltip showing what will be sent */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                      Includes product details, image reference & specifications
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>

                  {/* Share Product Button */}
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: product.name,
                          text: `Check out this product: ${product.name} - ₹${product.price?.toLocaleString()}`,
                          url: window.location.href
                        });
                      } else {
                        // Fallback: copy to clipboard
                        const shareText = `${product.name}\n₹${product.price?.toLocaleString()}\n${window.location.href}`;
                        navigator.clipboard.writeText(shareText).then(() => {
                          alert('Product details copied to clipboard!');
                        });
                      }
                    }}
                    className="w-full inline-flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 transform hover:-translate-y-0.5"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    📤 Share Product
                  </button>

                  {/* WhatsApp Message Info */}
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-green-600">📱</span>
                      <span className="font-semibold text-green-800">WhatsApp Message Includes:</span>
                    </div>
                    <ul className="space-y-1 text-green-700 text-xs">
                      <li>✓ Complete product details & specifications</li>
                      <li>✓ Product image reference & link</li>
                      <li>✓ Pricing, quantity & availability request</li>
                      <li>✓ Direct link to this product page</li>
                    </ul>
                  </div>

                  {/* Info Box */}
                  <div className="pt-6 border-t border-gray-200 space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span className="font-semibold">Warranty:</span> {product.warranty || '1 Year'}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="font-semibold">Bulk Orders:</span> Special pricing available
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products - Enhanced with better categorization */}
        <section className="bg-white/50 backdrop-blur-sm py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-4xl font-bold text-gray-900 mb-4">
                {product.subcategory ? `More ${product.subcategory} Products` : `More ${product.category} Products`}
              </h3>
              <p className="text-gray-600 text-lg">
                {product.subcategory 
                  ? `Explore other ${product.subcategory} products in our ${product.category} collection`
                  : `Discover more products in the ${product.category} category`
                }
              </p>
            </div>
            
            {relatedProducts.length > 0 ? (
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                {relatedProducts.map(relatedProduct => (
                  <div key={relatedProduct.id} className="group">
                    <Link href={`/products/${relatedProduct.id}`}>
                      <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-white/50 hover:border-blue-100">
                        <div className="aspect-[4/3] bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl overflow-hidden mb-6 group-hover:scale-105 transition-transform duration-300">
                          {renderImage(relatedProduct.image)}
                        </div>
                        
                        {/* Category Badge */}
                        {relatedProduct.subcategory && (
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mb-3 ${
                            relatedProduct.subcategory === product.subcategory 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {relatedProduct.subcategory}
                          </span>
                        )}
                        
                        <h4 className="font-bold text-xl text-gray-900 mb-3 line-clamp-2">{relatedProduct.name}</h4>
                        <p className="text-2xl font-bold text-blue-600 mb-4">₹{relatedProduct.price?.toLocaleString()}</p>
                        
                        {/* Stock indicator */}
                        <div className="flex items-center justify-between mb-4">
                          <span className={`text-sm font-medium ${
                            relatedProduct.stock > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {relatedProduct.stock > 0 ? `${relatedProduct.stock} in stock` : 'Out of stock'}
                          </span>
                          <span className="text-sm text-blue-600 font-semibold group-hover:underline">
                            View Details →
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
              
              {/* View All Products Link */}
              <div className="text-center mt-12">
                <Link 
                  href={`/products?category=${encodeURIComponent(product.category)}`}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1"
                >
                  View All {product.category} Products
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            ) : (
              /* No Related Products Found */
              <div className="text-center py-16">
                <div className="text-6xl mb-6">🔍</div>
                <h4 className="text-2xl font-bold text-gray-900 mb-4">No Related Products Found</h4>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  We don't have other products in the {product.subcategory || product.category} category at the moment.
                </p>
                <Link 
                  href="/products"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1"
                >
                  Browse All Products
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
