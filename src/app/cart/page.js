'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCart, removeFromCart, updateQuantity, getLastProductPage } from '@/lib/cart';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastProductId, setLastProductId] = useState(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // Load cart initially + listen to cart changes
  useEffect(() => {
    setCart(getCart());
    setLastProductId(getLastProductPage());

    const updateHandler = (e) => {
      setCart(e.detail.cart);
    };

    window.addEventListener('novelsols_cart_changed', updateHandler);

    return () => {
      window.removeEventListener('novelsols_cart_changed', updateHandler);
    };
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleQuantityChange = async (id, newQuantity) => {
    if (newQuantity < 1) return;
    setLoading(true);
    await updateQuantity(id, newQuantity);
    setLoading(false);
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Prepare order data
      const orderData = {
        ...contactData,
        items: cart,
        total: total,
        orderDate: new Date().toISOString(),
        orderNumber: `ORD-${Date.now()}`
      };

      // Submit to contact API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactData.name,
          email: contactData.email,
          phone: contactData.phone,
          company: contactData.company,
          subject: `Order Request - ${orderData.orderNumber}`,
          message: `Order Details:
          
Order Number: ${orderData.orderNumber}
Customer: ${contactData.name}
Email: ${contactData.email}
Phone: ${contactData.phone}
Company: ${contactData.company || 'N/A'}
Address: ${contactData.address || 'N/A'}

Items Ordered:
${cart.map(item => `- ${item.name} (Qty: ${item.quantity}) - ₹${(item.price * item.quantity).toLocaleString()}`).join('\n')}

Total Amount: ₹${total.toLocaleString()}

Additional Message: ${contactData.message || 'None'}

Please process this order and contact the customer for payment and delivery arrangements.`
        })
      });

      if (response.ok) {
        alert('Order submitted successfully! We will contact you shortly to confirm your order and arrange payment.');
        
        // Clear cart and form
        cart.forEach(item => removeFromCart(item.id));
        setContactData({
          name: '',
          email: '',
          phone: '',
          company: '',
          address: '',
          message: ''
        });
        setShowContactForm(false);
      } else {
        throw new Error('Failed to submit order');
      }
    } catch (error) {
      console.error('Order submission error:', error);
      alert('Failed to submit order. Please try again or contact us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 to-purple-50">
        <Header />
        <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
          <div className="w-24 h-24 mx-auto mb-8 bg-white rounded-2xl shadow-xl flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1 4c-.5 2-2.3 3.5-4.5 3.5s-4-1.5-4.5-3.5l-.5-2" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
          <p className="text-xl text-gray-600 mb-8">No items yet. Start shopping to fill your cart!</p>
          <Link 
            href="/products" 
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-3xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1"
          >
            Start Shopping →
          </Link>
        </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
            Your Cart
          </h1>
          <p className="text-xl text-gray-600">Review your items before checkout</p>
        </div>

        {/* Cart Items */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="group bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 hover:shadow-2xl hover:border-indigo-200 transition-all duration-300 overflow-hidden">
                <div className="p-8 flex items-center gap-6">
                  {/* Product Image */}
                  <div className="relative w-24 h-24">
                    {item.image ? (
                      typeof item.image === 'string' && (item.image.startsWith('data:') || item.image.startsWith('http')) ? (
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-contain rounded-2xl shadow-lg group-hover:scale-105 transition-transform duration-300 bg-gradient-to-br from-blue-50 to-blue-100"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg group-hover:scale-105 transition-transform duration-300">
                          {item.image}
                        </div>
                      )
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                        <span className="text-2xl">📦</span>
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-gray-900 mb-1 leading-tight">{item.name}</h3>
                    {item.category && (
                      <p className="text-xs text-blue-600 font-medium mb-1">{item.category}</p>
                    )}
                    {item.sku && (
                      <p className="text-xs text-gray-400 font-mono mb-2">Code: {item.sku}</p>
                    )}
                    <p className="text-sm text-gray-500 mb-4">₹{item.price.toLocaleString()} each</p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <button
                        className="w-12 h-12 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl shadow-md hover:shadow-lg hover:from-gray-200 hover:to-gray-300 transition-all duration-200 flex items-center justify-center text-lg font-semibold disabled:opacity-50"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={loading}
                      >
                        -
                      </button>
                      <span className="w-16 text-center text-2xl font-bold text-gray-900">{item.quantity}</span>
                      <button
                        className="w-12 h-12 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl shadow-md hover:shadow-lg hover:from-gray-200 hover:to-gray-300 transition-all duration-200 flex items-center justify-center text-lg font-semibold disabled:opacity-50"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        disabled={loading}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Price & Remove */}
                  <div className="text-right flex flex-col items-end gap-3">
                    <p className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                    <button
                      className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 flex items-center gap-1 group/remove"
                      onClick={() => removeFromCart(item.id)}
                      disabled={loading}
                    >
                      <svg className="w-4 h-4 group-hover/remove:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-lg">
                  <span>Subtotal ({cart.length} items):</span>
                  <span className="font-semibold">₹{total.toLocaleString()}</span>
                </div>
                {/* <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div> */}
                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              </div>

              <div className="text-3xl font-bold text-gray-900 mb-8 text-center bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent">
                Total: ₹{total.toLocaleString()}
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => setShowContactForm(true)}
                  className="block w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-5 px-6 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 transform hover:-translate-y-1 text-center"
                >
                  📧 Place Order Through Email
                </button>
                
                <Link 
                  href={lastProductId ? `/products/${lastProductId}` : "/products"}
                  className="block w-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 transform hover:-translate-y-0.5 text-center border border-gray-200"
                >
                  {lastProductId ? "Back to Product" : "Continue Shopping"}
                </Link>
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* Contact Form Modal */}
        {showContactForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold text-gray-900">Place Your Order</h2>
                  <button
                    onClick={() => setShowContactForm(false)}
                    className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="mb-6 p-4 bg-blue-50 rounded-2xl border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-2">📋 Order Summary</h3>
                  <div className="text-sm text-blue-800">
                    <p>{cart.length} items • Total: ₹{total.toLocaleString()}</p>
                  </div>
                </div>

                <form onSubmit={handleOrderSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={contactData.name}
                        onChange={(e) => setContactData({...contactData, name: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={contactData.email}
                        onChange={(e) => setContactData({...contactData, email: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Enter your email"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={contactData.phone}
                        onChange={(e) => setContactData({...contactData, phone: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Company/Organization
                      </label>
                      <input
                        type="text"
                        value={contactData.company}
                        onChange={(e) => setContactData({...contactData, company: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Enter company name (optional)"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Delivery Address
                    </label>
                    <textarea
                      value={contactData.address}
                      onChange={(e) => setContactData({...contactData, address: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Enter your delivery address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Additional Message
                    </label>
                    <textarea
                      value={contactData.message}
                      onChange={(e) => setContactData({...contactData, message: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Any special requirements or notes..."
                    />
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-yellow-600 text-xl">💡</span>
                      <div className="text-sm text-yellow-800">
                        <p className="font-semibold mb-1">How it works:</p>
                        <ul className="space-y-1 text-xs">
                          <li>• We'll receive your order details via email</li>
                          <li>• Our team will contact you within 24 hours</li>
                          <li>• We'll confirm availability and arrange payment</li>
                          <li>• Delivery will be scheduled as per your convenience</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setShowContactForm(false)}
                      className="flex-1 px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 px-6 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? '📧 Sending...' : '📧 Submit Order'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>      
      <Footer />
    </div>
  );
}
