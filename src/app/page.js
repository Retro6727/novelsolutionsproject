'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-neutral-50 via-white to-blue-50/30">
      <Header />
      <main className="flex-grow relative overflow-hidden">
        {/* Enhanced Hero Section - Mobile Responsive */}
        <section className="relative overflow-hidden gradient-hero text-white py-16 sm:py-24 md:py-32 lg:py-40 px-4 sm:px-6">
          {/* Animated background elements - Responsive */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/30" />
            <motion.div
              className="absolute top-10 sm:top-20 left-4 sm:left-20 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-white/5 rounded-full blur-3xl"
              animate={{
                x: [0, 50, 0],
                y: [0, -25, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-10 sm:bottom-20 right-4 sm:right-20 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-purple-400/10 rounded-full blur-3xl"
              animate={{
                x: [0, -40, 0],
                y: [0, 30, 0],
                scale: [1, 0.8, 1]
              }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          
          <div className="relative max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center"
            >
              <div className="space-y-6 md:space-y-8 text-center lg:text-left">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <div className="inline-flex items-center gap-2 sm:gap-3 glass px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-semibold mb-6 sm:mb-8 animate-pulse-glow">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <span className="font-heading">🏛️ GeM Certified Partner</span>
                  </div>
                  
                  <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-4 sm:mb-6 leading-tight">
                    <span className="block bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent animate-gradient">
                      Novel
                    </span>
                    <span className="block bg-gradient-to-r from-purple-200 via-white to-blue-200 bg-clip-text text-transparent animate-gradient">
                      Solutions
                    </span>
                  </h1>
                  
                  <div className="space-y-3 sm:space-y-4">
                    <p className="font-body text-lg sm:text-xl md:text-2xl lg:text-3xl font-light text-blue-100 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                      Transforming B2B Manufacturing with 
                      <span className="font-semibold text-white"> Premium Quality</span> & 
                      <span className="font-semibold text-white"> Innovative Solutions</span>
                    </p>
                    <p className="font-body text-sm sm:text-base md:text-lg text-blue-200/80 max-w-xl mx-auto lg:mx-0">
                      Trusted by enterprises across India for reliable manufacturing, trading, and procurement solutions.
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-4 justify-center lg:justify-start">
                    <Link
                      href="/products"
                      className="group relative bg-white text-blue-600 px-8 sm:px-12 py-4 sm:py-5 rounded-2xl font-heading font-bold text-base sm:text-lg shadow-professional-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 overflow-hidden text-center"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="relative flex items-center justify-center gap-3">
                        Browse Products
                        <motion.span
                          className="text-lg sm:text-xl"
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          →
                        </motion.span>
                      </span>
                    </Link>
                    <Link
                      href="/contact"
                      className="glass border-2 border-white/30 px-8 sm:px-12 py-4 sm:py-5 rounded-2xl font-heading font-bold text-base sm:text-lg hover:bg-white/20 hover:border-white/50 transition-all duration-300 backdrop-blur-xl text-center"
                    >
                      Get Quote
                    </Link>
                  </div>
                </motion.div>
              </div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.4, duration: 1 }}
                className="relative mt-8 lg:mt-0 order-first lg:order-last"
              >
                {/* Main visual element - Responsive */}
                <div className="relative glass rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-professional-xl border border-white/20">
                  {/* Floating icons - Responsive */}
                  <div className="relative h-48 sm:h-64 md:h-80 flex items-center justify-center">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl sm:rounded-3xl"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    />
                    
                    {/* Central icon - Responsive */}
                    <motion.div
                      className="text-4xl sm:text-6xl md:text-8xl z-10 relative"
                      animate={{ 
                        y: [-10, 10, -10],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      🏭
                    </motion.div>
                    
                    {/* Orbiting elements - Responsive */}
                    {['⚙️', '📊', '🚀', '💼', '🔧', '📈'].map((icon, idx) => {
                      // Calculate radius based on screen size (default to desktop for SSR)
                      const getRadius = () => {
                        if (typeof window === 'undefined') return 120; // SSR default
                        if (window.innerWidth < 640) return 60;
                        if (window.innerWidth < 768) return 90;
                        return 120;
                      };
                      const radius = getRadius();
                      
                      return (
                        <motion.div
                          key={idx}
                          className="absolute text-lg sm:text-2xl md:text-3xl"
                          style={{
                            top: '50%',
                            left: '50%',
                            transformOrigin: '0 0'
                          }}
                          animate={{
                            rotate: [0, 360],
                            x: Math.cos((idx * 60) * Math.PI / 180) * radius,
                            y: Math.sin((idx * 60) * Math.PI / 180) * radius,
                          }}
                          transition={{
                            duration: 20 + idx * 2,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                        >
                          {icon}
                        </motion.div>
                      );
                    })}
                  </div>
                  
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shimmer" />
                </div>
                
                {/* Floating stats cards - Responsive */}
                <motion.div
                  className="absolute -top-3 sm:-top-6 -right-3 sm:-right-6 glass px-2 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-white/20"
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <div className="text-center">
                    <div className="text-lg sm:text-2xl font-bold">500+</div>
                    <div className="text-xs text-blue-200">Happy Clients</div>
                  </div>
                </motion.div>
                
                <motion.div
                  className="absolute -bottom-3 sm:-bottom-6 -left-3 sm:-left-6 glass px-2 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-white/20"
                  animate={{ y: [5, -5, 5] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                >
                  <div className="text-center">
                    <div className="text-lg sm:text-2xl font-bold">99%</div>
                    <div className="text-xs text-blue-200">Quality Rate</div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Enhanced Value Proposition - Mobile Responsive */}
        <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 bg-gradient-to-b from-neutral-50 to-white relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>
          
          <div className="max-w-7xl mx-auto relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12 sm:mb-16 md:mb-20"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-block mb-4 sm:mb-6"
              >
                <span className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-heading font-semibold border border-blue-200">
                  Why Choose Us
                </span>
              </motion.div>
              
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-4 sm:mb-6 gradient-text leading-tight">
                Excellence in Every
                <br />
                <span className="relative">
                  Partnership
                  <motion.div
                    className="absolute -bottom-1 sm:-bottom-2 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </span>
              </h2>
              
              <p className="font-body text-base sm:text-lg md:text-xl lg:text-2xl text-neutral-600 max-w-3xl mx-auto leading-relaxed px-4">
                Delivering exceptional value through innovation, quality, and unwavering commitment to your success
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
              {[
                { 
                  icon: "🏛️", 
                  title: "GeM Certified", 
                  desc: "Official government procurement partner with verified credentials and compliance standards",
                  color: "from-green-500 to-emerald-600",
                  bgColor: "from-green-50 to-emerald-50"
                },
                { 
                  icon: "💎", 
                  title: "Transparent Pricing", 
                  desc: "No hidden costs, no surprises. Clear, competitive pricing with detailed breakdowns",
                  color: "from-blue-500 to-cyan-600",
                  bgColor: "from-blue-50 to-cyan-50"
                },
                { 
                  icon: "🏆", 
                  title: "Premium Quality", 
                  desc: "ISO certified processes ensuring industry-leading standards in every product and service",
                  color: "from-purple-500 to-pink-600",
                  bgColor: "from-purple-50 to-pink-50"
                }
              ].map((feature, idx) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: idx * 0.2 }}
                  whileHover={{ y: -15, scale: 1.03 }}
                  className="group relative"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgColor} rounded-3xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300`} />
                  <div className="relative bg-white p-6 sm:p-8 md:p-10 lg:p-12 rounded-2xl sm:rounded-3xl shadow-professional-lg hover:shadow-professional-xl border border-neutral-100 transition-all duration-500">
                    {/* Icon with animated background - Responsive */}
                    <div className="relative mb-6 sm:mb-8">
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-xl sm:rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity`}
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                      <div className={`relative bg-gradient-to-br ${feature.color} w-16 sm:w-20 h-16 sm:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-lg group-hover:shadow-xl transition-shadow`}>
                        {feature.icon}
                      </div>
                    </div>
                    
                    <h3 className="font-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-neutral-800 group-hover:text-neutral-900 transition-colors">
                      {feature.title}
                    </h3>
                    
                    <p className="font-body text-sm sm:text-base md:text-lg text-neutral-600 leading-relaxed group-hover:text-neutral-700 transition-colors">
                      {feature.desc}
                    </p>
                    
                    {/* Hover effect line */}
                    <motion.div
                      className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color} rounded-b-3xl`}
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Stats section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {[
                { number: "500+", label: "Happy Clients" },
                { number: "99%", label: "Quality Rate" },
                { number: "24/7", label: "Support" },
                { number: "10+", label: "Years Experience" }
              ].map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ scale: 0.8 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="text-center group"
                >
                  <div className="font-display text-4xl lg:text-5xl font-black gradient-text mb-2 group-hover:scale-110 transition-transform">
                    {stat.number}
                  </div>
                  <div className="font-body text-neutral-600 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Product Slider Section - Mobile Responsive */}
        <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-gradient-to-b from-blue-50 to-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12 sm:mb-16 md:mb-20"
            >
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black mb-3 sm:mb-4 gradient-text">
                Featured Products
              </h2>
              <p className="font-body text-base sm:text-lg md:text-xl text-neutral-600">Discover our premium manufacturing collection</p>
            </motion.div>
            <ProductSlider />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.3 }}
              className="text-center mt-12 sm:mt-16"
            >
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-3 gradient-primary text-white px-8 sm:px-12 py-4 sm:py-5 rounded-2xl sm:rounded-3xl font-heading font-bold text-sm sm:text-base md:text-lg shadow-professional-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group w-full sm:w-auto"
              >
                View All Products
                <motion.span
                  className="group-hover:translate-x-2 transition-transform text-lg sm:text-xl"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                >
                  →
                </motion.span>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Enhanced Final CTA */}
        <section className="relative py-32 px-6 overflow-hidden">
          <div className="absolute inset-0 gradient-hero" />
          
          {/* Animated background elements */}
          <div className="absolute inset-0">
            <motion.div
              className="absolute top-10 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.4, 0.7, 0.4]
              }}
              transition={{ duration: 10, repeat: Infinity }}
            />
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative max-w-5xl mx-auto text-center text-white"
          >
            {/* Animated icon */}
            <motion.div
              className="relative mb-12"
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="absolute inset-0 bg-white/10 rounded-full blur-2xl"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.div
                animate={{ 
                  y: [-15, 15, -15],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative text-8xl lg:text-9xl"
              >
                🤝
              </motion.div>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-display text-5xl lg:text-7xl font-black mb-8 leading-tight"
            >
              Ready to Transform
              <br />
              <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent animate-gradient">
                Your Business?
              </span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="font-body text-xl lg:text-2xl mb-12 text-blue-100 max-w-3xl mx-auto leading-relaxed"
            >
              Join hundreds of satisfied clients who trust Novel Solutions for their manufacturing and procurement needs. 
              <span className="font-semibold text-white">Let's build something extraordinary together.</span>
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Link
                href="/contact"
                className="group relative bg-white text-blue-600 px-12 py-6 rounded-2xl font-heading font-bold text-xl shadow-professional-xl hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-500 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center gap-3">
                  Get Started Today
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-2xl"
                  >
                    🚀
                  </motion.span>
                </span>
              </Link>
              
              <Link
                href="/products"
                className="glass border-2 border-white/30 px-12 py-6 rounded-2xl font-heading font-bold text-xl hover:bg-white/20 hover:border-white/50 transition-all duration-300 backdrop-blur-xl"
              >
                Browse Catalog
              </Link>
            </motion.div>
            
            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-16 flex flex-wrap justify-center items-center gap-8 text-blue-200"
            >
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="font-body text-sm">ISO Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="font-body text-sm">GeM Registered</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="font-body text-sm">24/7 Support</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="font-body text-sm">Nationwide Delivery</span>
              </div>
            </motion.div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

// Enhanced Product Slider with Proper Image Handling
function ProductSlider() {
  const [featured, setFeatured] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Responsive product count based on screen size
  const getVisibleCount = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 1; // Mobile: 1 product
      if (window.innerWidth < 1024) return 2; // Tablet: 2 products
      return 4; // Desktop: 4 products
    }
    return 4; // SSR default
  };

  const [visibleCount, setVisibleCount] = useState(4);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark as client-side and set initial responsive value
    setIsClient(true);
    const handleResize = () => {
      setVisibleCount(getVisibleCount());
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

   useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const res = await fetch('/api/product')
        if (!res.ok) throw new Error('Failed to fetch products')
        const data = await res.json()
        setFeatured(pickFeatured(data))
      } catch (err) {
        console.error('Error loading products:', err)
        // Set some fallback data or empty array
        setFeatured([])
      } finally {
        setLoading(false);
      }
    }

    loadProducts()
  }, [])

  useEffect(() => {
    if (isHovering || featured.length <= visibleCount) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex = Math.max(0, featured.length - visibleCount);
        return (prev + visibleCount) > maxIndex ? 0 : prev + visibleCount;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [featured.length, isHovering, visibleCount]);

  const visibleProducts = featured.slice(currentIndex, currentIndex + visibleCount);

  // Show loading state - Mobile Responsive
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gradient-to-br from-white to-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl border border-blue-100/50 animate-pulse">
            <div className="h-32 sm:h-40 md:h-48 bg-gray-200 rounded-lg sm:rounded-xl mb-4 sm:mb-6"></div>
            <div className="h-3 sm:h-4 bg-gray-200 rounded mb-2 sm:mb-3"></div>
            <div className="h-2 sm:h-3 bg-gray-200 rounded mb-4 sm:mb-6"></div>
            <div className="flex justify-between items-center">
              <div className="h-4 sm:h-6 bg-gray-200 rounded w-16 sm:w-20"></div>
              <div className="h-8 sm:h-10 bg-gray-200 rounded w-20 sm:w-24"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Show empty state if no products - Mobile Responsive
  if (featured.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-2xl sm:rounded-3xl glass shadow-professional-xl p-8 sm:p-12 md:p-16 border border-white/50">
        <div className="text-center">
          <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">📦</div>
          <h3 className="font-heading text-lg sm:text-xl md:text-2xl font-bold text-neutral-800 mb-2">No Products Available</h3>
          <p className="font-body text-sm sm:text-base text-neutral-600">Products will appear here once they are added to the database.</p>
        </div>
      </div>
    );
  }

  const getProductImage = (product) => {
    if (!product?.image) return null;
    
    // Handle different image formats
    if (typeof product.image === 'string') {
      if (product.image.startsWith('data:') || product.image.startsWith('http')) {
        return product.image;
      }
      // If it's an emoji or icon string, return null for proper image display
      return null;
    }
    
    if (product.image?.url) {
      return product.image.url;
    }
    
    return null;
  };

  const getProductEmoji = (product) => {
    if (!product?.image) return "📦";
    
    if (typeof product.image === 'string') {
      // If it's not a URL, treat it as emoji/icon
      if (!product.image.startsWith('data:') && !product.image.startsWith('http')) {
        return product.image;
      }
    }
    
    return "📦";
  };

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Slider Track - Mobile Responsive */}
      <div className="glass rounded-2xl sm:rounded-3xl shadow-professional-xl p-4 sm:p-6 md:p-8 border border-white/50">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {visibleProducts.map((product, idx) => {
              const imageSrc = getProductImage(product);
              
              return (
                <motion.div
                  key={`${currentIndex}-${product.id}`}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: idx * 0.1, duration: 0.4 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-gradient-to-br from-white to-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-professional hover:shadow-professional-lg border border-blue-100/50 transition-all duration-300 overflow-hidden group relative"
                >
                  {/* Product Image Container - Mobile Responsive */}
                  <div className="relative h-32 sm:h-40 md:h-48 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6 overflow-hidden group">
                    {imageSrc ? (
                      // Real product image
                      <img 
                        src={imageSrc} 
                        alt={product.name}
                        className="w-full h-full object-contain rounded-lg sm:rounded-xl group-hover:scale-110 transition-transform duration-500 shadow-lg"
                        onError={(e) => {
                          // Fallback to emoji if image fails to load
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    
                    {/* Emoji/icon fallback - always show if no image - Mobile Responsive */}
                    <motion.div
                      className={`text-3xl sm:text-4xl md:text-5xl z-10 relative flex items-center justify-center w-full h-full ${imageSrc ? 'hidden' : ''}`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      {getProductEmoji(product)}
                    </motion.div>
                    
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Image shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-shimmer" />
                  </div>

                  {/* Product Info - Mobile Responsive */}
                  <div className="space-y-2 sm:space-y-3">
                    {/* Category Badge */}
                    {product.category && (
                      <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-heading font-semibold">
                        {product.category}
                      </span>
                    )}
                    
                    <h3 className="font-heading text-base sm:text-lg md:text-xl font-bold text-neutral-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                    
                    {product.description && (
                      <p className="font-body text-neutral-600 text-xs sm:text-sm line-clamp-2">
                        {product.description.length > 80 
                          ? `${product.description.substring(0, 80)}...` 
                          : product.description}
                      </p>
                    )}
                    
                    {/* Stock indicator */}
                    {product.stock !== undefined && (
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        <span className={`text-xs font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mt-4 sm:mt-6">
                    <span className="font-display text-xl sm:text-2xl md:text-3xl font-black gradient-text">
                      ₹{product.price?.toLocaleString()}
                    </span>
                    <Link
                      href={`/products/${product.id}`}
                      className="gradient-primary text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-heading font-bold text-xs sm:text-sm shadow-professional hover:shadow-professional-lg hover:-translate-y-1 transition-all duration-300 whitespace-nowrap w-full sm:w-auto text-center"
                    >
                      View Details
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Custom CSS for shimmer effect */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>

      {/* Slider Indicators - Mobile Responsive */}
      {featured.length > visibleCount && (
        <div className="flex justify-center gap-2 mt-6 sm:mt-8">
          {Array.from({ length: Math.ceil(featured.length / visibleCount) }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx * visibleCount)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                Math.floor(currentIndex / visibleCount) === idx 
                  ? 'bg-blue-600 scale-125 shadow-lg' 
                  : 'bg-neutral-300 hover:bg-neutral-400'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function pickFeatured(items) {
  const arr = Array.isArray(items) ? [...items] : [];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, Math.min(12, arr.length));
}
