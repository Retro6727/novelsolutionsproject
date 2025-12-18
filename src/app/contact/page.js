'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitForm();
  };

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const submitForm = async () => {
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const body = await res.json();
      if (!res.ok) {
        console.error('Contact submit error', body);
        setErrorMessage(body?.error || 'Failed to submit. Please try again later.');
        setIsLoading(false);
        return;
      }

      setSuccessMessage('Thank you — your message has been sent. We will get back to you soon.');
      setFormData({ name: '', email: '', phone: '', company: '', subject: '', message: '' });
    } catch (err) {
      console.error('Submit error', err);
      setErrorMessage('Network error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-neutral-50 via-white to-blue-50/30">
      <Header />
      
      <main className="flex-grow relative overflow-hidden">
        {/* Enhanced Hero - Mobile Responsive */}
        <section className="relative gradient-hero text-white py-16 sm:py-24 md:py-32 px-4 sm:px-6 overflow-hidden">
          {/* Background elements - Responsive */}
          <div className="absolute inset-0">
            <div className="absolute top-10 sm:top-20 right-10 sm:right-20 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-white/5 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-10 sm:bottom-20 left-10 sm:left-20 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-purple-400/10 rounded-full blur-3xl" />
          </div>
          
          <div className="relative max-w-7xl mx-auto text-center">
            <div className="inline-block mb-6 sm:mb-8">
              <span className="glass px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-heading font-semibold border border-white/20">
                💬 Let's Connect
              </span>
            </div>
            
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-6 sm:mb-8 leading-tight">
              <span className="block bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent animate-gradient">
                Get in Touch
              </span>
            </h1>
            
            <p className="font-body text-lg sm:text-xl md:text-2xl lg:text-3xl text-blue-100 max-w-4xl mx-auto leading-relaxed mb-6 sm:mb-8 px-4">
              Ready to discuss your 
              <span className="font-semibold text-white"> manufacturing needs</span>? 
              We're here to help you succeed.
            </p>
            
            {/* Quick contact options - Mobile Responsive */}
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-6 text-blue-200">
              <div className="flex items-center justify-center gap-2">
                <span className="text-green-400">📞</span>
                <span className="font-body text-xs sm:text-sm">Call: +91-9867473095</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-green-400">✉️</span>
                <span className="font-body text-xs sm:text-sm">Email: novelsolution.trade@gmail.com</span>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
            {/* Enhanced Contact Info - Mobile Responsive */}
            <div className="glass p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/20 shadow-professional-lg h-fit order-2 lg:order-1">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold gradient-text mb-6 sm:mb-8">Contact Information</h2>
              
              <div className="space-y-6 sm:space-y-8">
                <div className="group">
                  <h4 className="font-heading font-bold mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3 text-base sm:text-lg">
                    <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform">📍</span> 
                    <span className="gradient-text">Address</span>
                  </h4>
                  <div className="ml-8 sm:ml-12 font-body text-neutral-700 leading-relaxed text-sm sm:text-base">
                    <strong>Novel Solutions</strong><br />
                    Kalyan West, India<br />
                    PIN: 421301
                  </div>
                </div>
                
                <div className="group">
                  <h4 className="font-heading font-bold mb-4 flex items-center gap-3 text-lg">
                    <span className="text-3xl group-hover:scale-110 transition-transform">📞</span> 
                    <span className="gradient-text">Phone</span>
                  </h4>
                  <div className="ml-12 font-body text-neutral-700">
                    <a href="tel:+919867473095" className="text-blue-600 hover:text-blue-800 font-semibold transition-colors">
                      +91-9867473095
                    </a>
                    <br />
                    <a href="tel:+918779502710" className="text-blue-600 hover:text-blue-800 font-semibold transition-colors">
                      +91-8779502710
                    </a>
                  </div>
                </div>

                <div className="group">
                  <h4 className="font-heading font-bold mb-4 flex items-center gap-3 text-lg">
                    <span className="text-3xl group-hover:scale-110 transition-transform">✉️</span> 
                    <span className="gradient-text">Email</span>
                  </h4>
                  <div className="ml-12 font-body">
                    <a href="mailto:novelsolution.trade@gmail.com" className="text-blue-600 hover:text-blue-800 font-semibold transition-colors">
                      novelsolution.trade@gmail.com
                    </a>
                  </div>
                </div>

                <div className="group">
                  <h4 className="font-heading font-bold mb-4 flex items-center gap-3 text-lg">
                    <span className="text-3xl group-hover:scale-110 transition-transform">🕐</span> 
                    <span className="gradient-text">Business Hours</span>
                  </h4>
                  <div className="ml-12 font-body text-neutral-700 leading-relaxed">
                    <div className="flex justify-between">
                      <span>Monday - Friday:</span>
                      <span className="font-semibold">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday:</span>
                      <span className="font-semibold">10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday:</span>
                      <span className="font-semibold text-red-600">Closed</span>
                    </div>
                  </div>
                </div>

                <div className="glass p-6 rounded-2xl border border-blue-200/50 bg-gradient-to-br from-blue-50/50 to-cyan-50/50">
                  <h4 className="font-heading font-bold mb-3 flex items-center gap-2 text-blue-700">
                    <span className="text-2xl">🎯</span> Quick Support
                  </h4>
                  <p className="font-body text-sm text-blue-600 leading-relaxed">
                    For urgent queries, call our sales team directly during business hours for immediate assistance.
                  </p>
                </div>
              </div>
            </div>

            {/* Enhanced Contact Form - Mobile Responsive */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <div className="glass p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl border border-white/20 shadow-professional-lg">
                <h2 className="font-heading text-2xl sm:text-3xl font-bold gradient-text mb-6 sm:mb-8">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-8">
                {successMessage && (
                  <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded mb-2">{successMessage}</div>
                )}
                {errorMessage && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded mb-2">{errorMessage}</div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-heading font-semibold mb-3 text-neutral-700">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-4 glass border border-white/20 rounded-xl font-body focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder-neutral-400"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block font-heading font-semibold mb-3 text-neutral-700">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-4 glass border border-white/20 rounded-xl font-body focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder-neutral-400"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-heading font-semibold mb-3 text-neutral-700">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-6 py-4 glass border border-white/20 rounded-xl font-body focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder-neutral-400"
                      placeholder="+91-XXXXXXXXXX"
                    />
                  </div>
                  <div>
                    <label className="block font-heading font-semibold mb-3 text-neutral-700">Company Name</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-6 py-4 glass border border-white/20 rounded-xl font-body focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder-neutral-400"
                      placeholder="Your company"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-heading font-semibold mb-3 text-neutral-700">Subject</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-6 py-4 glass border border-white/20 rounded-xl font-body focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  >
                    <option value="">Select a subject</option>
                    <option value="inquiry">Product Inquiry</option>
                    <option value="bulk">Bulk Order</option>
                    <option value="support">Technical Support</option>
                    <option value="partnership">Partnership</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-heading font-semibold mb-3 text-neutral-700">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full px-6 py-4 glass border border-white/20 rounded-xl font-body focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder-neutral-400 resize-none"
                    placeholder="Tell us about your inquiry..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full gradient-primary text-white py-5 rounded-2xl font-heading font-bold text-lg hover:shadow-professional-lg transition-all duration-300 disabled:opacity-60 transform hover:-translate-y-1 shadow-professional"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Sending Message...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-3">
                      Send Message
                      <span className="text-xl">🚀</span>
                    </span>
                  )}
                </button>
                </form>
              </div>
            </div>
          </div>

          {/* Enhanced FAQ Section */}
          <section className="mt-24 pt-16">
            <div className="text-center mb-16">
              <h2 className="font-display text-5xl lg:text-6xl font-black gradient-text mb-6">Frequently Asked Questions</h2>
              <p className="font-body text-xl text-neutral-600 max-w-3xl mx-auto">
                Quick answers to common questions about our services and processes
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  question: "What is your minimum order quantity?",
                  answer: "Most products have a minimum order of 1 unit. However, bulk orders (50+ units) qualify for special discounts.",
                  icon: "📦"
                },
                {
                  question: "Do you offer international shipping?",
                  answer: "Currently, we serve customers across India. International shipping is available upon request.",
                  icon: "🌍"
                },
                {
                  question: "What is your return policy?",
                  answer: "We offer a 30-day return policy for unused items in original packaging. Custom orders are non-returnable.",
                  icon: "🔄"
                },
                {
                  question: "How do I request a bulk quote?",
                  answer: "Use the contact form above or email novelsolution.trade@gmail.com with your requirements for a customized quote.",
                  icon: "💰"
                }
              ].map((faq, idx) => (
                <div key={idx} className="group">
                  <div className="glass p-8 rounded-2xl border border-white/20 shadow-professional hover:shadow-professional-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-start gap-4 mb-4">
                      <span className="text-3xl group-hover:scale-110 transition-transform">{faq.icon}</span>
                      <h4 className="font-heading font-bold text-lg gradient-text group-hover:scale-105 transition-transform">
                        {faq.question}
                      </h4>
                    </div>
                    <p className="font-body text-neutral-700 leading-relaxed ml-16">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
