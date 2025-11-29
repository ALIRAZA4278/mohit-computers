'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Users, Shield, Truck, HeadphonesIcon, CheckCircle } from 'lucide-react';

export default function Corporate() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
    message: '',
    interests: []
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      interests: checked
        ? [...prev.interests, value]
        : prev.interests.filter(item => item !== value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/corporate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: data.message });
        setFormData({
          name: '',
          email: '',
          phone: '',
          whatsapp: '',
          message: '',
          interests: []
        });
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to send inquiry. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Corporate Tech Solutions by Mohit Computers</h1>
            <div className="flex justify-center">
              <div className="w-24 h-1 bg-[#6dc1c9] rounded-full"></div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg text-gray-600 leading-relaxed">
              We specialize in meeting the complex demands of corporate technology procurement, providing customized, reliable, and efficient solutions that align with your organizational needs.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">Why Choose Mohit Computers?</h2>
            <div className="flex justify-center">
              <div className="w-24 h-1 bg-[#6dc1c9] rounded-full"></div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-[#6dc1c9]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-[#6dc1c9]" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Bulk Pricing</h3>
              <p className="text-gray-600 text-sm">
                Special discounts for bulk orders. The more you buy, the more you save.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-[#6dc1c9]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-[#6dc1c9]" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Quality Assured</h3>
              <p className="text-gray-600 text-sm">
                All laptops undergo rigorous testing and come with warranty coverage.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-[#6dc1c9]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-7 h-7 text-[#6dc1c9]" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-600 text-sm">
                Quick delivery across Pakistan with secure packaging and tracking.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-[#6dc1c9]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <HeadphonesIcon className="w-7 h-7 text-[#6dc1c9]" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Dedicated Support</h3>
              <p className="text-gray-600 text-sm">
                Dedicated account manager and 24/7 technical support for corporates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Get Quote Form */}
      <section id="quote" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">Get a Custom Quote</h2>
              <div className="flex justify-center">
                <div className="w-24 h-1 bg-[#6dc1c9] rounded-full"></div>
              </div>
              <p className="text-gray-600 mt-4">
                Tell us about your requirements and we&rsquo;ll create a tailored solution for your business
              </p>
            </div>

            {message.text && (
              <div className={`mb-6 p-4 rounded-lg ${
                message.type === 'success'
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'bg-red-100 text-red-700 border border-red-200'
              }`}>
                {message.text}
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <form onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6dc1c9]"
                      placeholder="Your Name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6dc1c9]"
                      placeholder="your.email@company.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6dc1c9]"
                      placeholder="+92 300 1234567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6dc1c9]"
                      placeholder="+92 300 1234567"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6dc1c9]"
                    placeholder="Tell us about your requirements..."
                  ></textarea>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Interested In
                  </label>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        value="Laptops"
                        checked={formData.interests.includes('Laptops')}
                        onChange={handleCheckboxChange}
                        className="w-4 h-4 text-[#6dc1c9] bg-gray-100 border-gray-300 rounded focus:ring-[#6dc1c9] focus:ring-2"
                      />
                      <span className="ml-2 text-sm text-gray-700">Laptops</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        value="Chromebooks"
                        checked={formData.interests.includes('Chromebooks')}
                        onChange={handleCheckboxChange}
                        className="w-4 h-4 text-[#6dc1c9] bg-gray-100 border-gray-300 rounded focus:ring-[#6dc1c9] focus:ring-2"
                      />
                      <span className="ml-2 text-sm text-gray-700">Chromebooks</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        value="Workstations"
                        checked={formData.interests.includes('Workstations')}
                        onChange={handleCheckboxChange}
                        className="w-4 h-4 text-[#6dc1c9] bg-gray-100 border-gray-300 rounded focus:ring-[#6dc1c9] focus:ring-2"
                      />
                      <span className="ml-2 text-sm text-gray-700">Workstations</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        value="Accessories"
                        checked={formData.interests.includes('Accessories')}
                        onChange={handleCheckboxChange}
                        className="w-4 h-4 text-[#6dc1c9] bg-gray-100 border-gray-300 rounded focus:ring-[#6dc1c9] focus:ring-2"
                      />
                      <span className="ml-2 text-sm text-gray-700">Accessories</span>
                    </label>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#6dc1c9] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Sending...' : 'Submit Inquiry'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#6dc1c9] to-teal-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Contact us today for a customized quote tailored to your business needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:03368900349"
              className="bg-white text-[#6dc1c9] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Call: 0336-8900349
            </a>
            <a
              href="mailto:corporate@mohitcomputers.pk"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#6dc1c9] transition-colors"
            >
              Email Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
