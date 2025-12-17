'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-neutral-50 via-white to-blue-50/30">
      <Header />
      
      <main className="flex-grow relative overflow-hidden">
        {/* Enhanced Hero */}
        <section className="relative gradient-hero text-white py-32 px-6 overflow-hidden">
          {/* Background elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />
          </div>
          
          <div className="relative max-w-7xl mx-auto text-center">
            <div className="inline-block mb-8">
              <span className="glass px-6 py-3 rounded-full text-sm font-heading font-semibold border border-white/20">
                🏭 Established Excellence Since 2014
              </span>
            </div>
            
            <h1 className="font-display text-6xl lg:text-7xl font-black mb-8 leading-tight">
              <span className="block bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent animate-gradient">
                About Novel
              </span>
              <span className="block bg-gradient-to-r from-purple-200 via-white to-blue-200 bg-clip-text text-transparent animate-gradient">
                Solutions
              </span>
            </h1>
            
            <p className="font-body text-2xl lg:text-3xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              Your trusted manufacturing partner for 
              <span className="font-semibold text-white"> B2B excellence</span> and 
              <span className="font-semibold text-white"> premium quality</span>
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 py-20">
          {/* Enhanced Company Overview */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="font-display text-5xl lg:text-6xl font-black gradient-text mb-6">Our Story</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto"></div>
            </div>
            
            <div className="glass p-12 rounded-3xl border border-white/20 shadow-professional-lg">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <p className="font-body text-neutral-700 text-lg leading-relaxed">
                    <span className="font-heading font-bold text-blue-600">NOVEL SOLUTIONS</span> is a trusted GeM-supported B2B manufacturer, supplier & distributor offering high-quality products at competitive prices. We serve businesses, institutions, and government buyers with quality products, best pricing, and timely delivery.
                  </p>
                  <p className="font-body text-neutral-700 text-lg leading-relaxed">
                    As a GeM-registered business, we're committed to supporting government and institutional procurement while maintaining the same premium standards for all our customers.
                  </p>
                  <p className="font-body text-neutral-700 text-lg leading-relaxed">
                    Our extensive experience in manufacturing and procurement has enabled us to build a network of trusted suppliers and deliver exceptional value to our B2B customers.
                  </p>
                </div>
                
                <div className="relative">
                  <div className="glass p-8 rounded-2xl border border-white/20">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🏭</div>
                      <h3 className="font-heading text-2xl font-bold gradient-text mb-4">Manufacturing Excellence</h3>
                      <p className="font-body text-neutral-600">Delivering quality products with precision and reliability since our establishment.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Enhanced Mission & Vision */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300"></div>
              <div className="relative glass p-10 rounded-3xl border border-white/20 shadow-professional-lg hover:shadow-professional-xl transition-all duration-300">
                <div className="text-5xl mb-6">🎯</div>
                <h3 className="font-heading text-3xl font-bold mb-6 gradient-text">Our Mission</h3>
                <p className="font-body text-neutral-700 text-lg leading-relaxed">
                  To be the most trusted source for high-quality manufacturing products, delivering consistent value through transparency, reliability, and exceptional customer service.
                </p>
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl transform -rotate-1 group-hover:-rotate-2 transition-transform duration-300"></div>
              <div className="relative glass p-10 rounded-3xl border border-white/20 shadow-professional-lg hover:shadow-professional-xl transition-all duration-300">
                <div className="text-5xl mb-6">🚀</div>
                <h3 className="font-heading text-3xl font-bold mb-6 gradient-text">Our Vision</h3>
                <p className="font-body text-neutral-700 text-lg leading-relaxed">
                  To empower businesses across India with access to premium manufacturing products at fair prices, enabling economic growth and industrial excellence.
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Core Values */}
          <section className="mb-20">
            <div className="text-center mb-16">
              <h2 className="font-display text-5xl lg:text-6xl font-black gradient-text mb-6">Core Values</h2>
              <p className="font-body text-xl text-neutral-600 max-w-3xl mx-auto">
                The principles that guide every decision and drive our commitment to excellence
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: "🏆",
                  title: "Quality First",
                  desc: "Every product undergoes rigorous quality checks before delivery",
                  color: "from-blue-500 to-cyan-600"
                },
                {
                  icon: "💎",
                  title: "Transparency",
                  desc: "Clear pricing and honest communication at every step",
                  color: "from-purple-500 to-pink-600"
                },
                {
                  icon: "🤝",
                  title: "Reliability",
                  desc: "Consistent service and timely delivery you can depend on",
                  color: "from-green-500 to-emerald-600"
                }
              ].map((value, idx) => (
                <div key={value.title} className="group text-center">
                  <div className="glass p-10 rounded-3xl border border-white/20 shadow-professional-lg hover:shadow-professional-xl transition-all duration-500 hover:-translate-y-2">
                    <div className="relative mb-8">
                      <div className={`absolute inset-0 bg-gradient-to-br ${value.color} rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity`} />
                      <div className="relative text-6xl group-hover:scale-110 transition-transform duration-300">
                        {value.icon}
                      </div>
                    </div>
                    <h4 className="font-heading text-2xl font-bold mb-4 gradient-text group-hover:scale-105 transition-transform">
                      {value.title}
                    </h4>
                    <p className="font-body text-neutral-700 leading-relaxed">
                      {value.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Enhanced Stats */}
          <section className="relative gradient-hero text-white rounded-3xl p-16 mb-20 overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0">
              <div className="absolute top-10 right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-float" />
              <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />
            </div>
            
            <div className="relative">
              <div className="text-center mb-12">
                <h2 className="font-display text-4xl lg:text-5xl font-black mb-4">By The Numbers</h2>
                <p className="font-body text-xl text-blue-100">Our track record speaks for itself</p>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                {[
                  { number: "500+", label: "Products Available", icon: "📦" },
                  { number: "2500+", label: "Happy Customers", icon: "😊" },
                  { number: "10K+", label: "Orders Fulfilled", icon: "✅" },
                  { number: "99%", label: "Customer Satisfaction", icon: "⭐" }
                ].map((stat, idx) => (
                  <div key={stat.label} className="group">
                    <div className="glass p-6 rounded-2xl border border-white/20 hover:bg-white/10 transition-all duration-300">
                      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                        {stat.icon}
                      </div>
                      <div className="font-display text-4xl lg:text-5xl font-black mb-2 group-hover:scale-105 transition-transform">
                        {stat.number}
                      </div>
                      <p className="font-body text-blue-100 group-hover:text-white transition-colors">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Team */}
          <section>
            <h2 className="text-3xl font-bold mb-8">Why Partner With Us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <span className="text-3xl">✅</span>
                <div>
                  <h4 className="font-bold text-lg mb-2">GeM Registered</h4>
                  <p className="text-gray-700">Approved for government and institutional procurement</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="text-3xl">📦</span>
                <div>
                  <h4 className="font-bold text-lg mb-2">Fast Shipping</h4>
                  <p className="text-gray-700">Efficient logistics network across India</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="text-3xl">💰</span>
                <div>
                  <h4 className="font-bold text-lg mb-2">Bulk Discounts</h4>
                  <p className="text-gray-700">Special pricing for large volume orders</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="text-3xl">🛡️</span>
                <div>
                  <h4 className="font-bold text-lg mb-2">Quality Guarantee</h4>
                  <p className="text-gray-700">24-month warranty on all products</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
