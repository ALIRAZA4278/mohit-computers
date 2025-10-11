'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Users, Shield, Truck, HeadphonesIcon, CheckCircle, ArrowRight } from 'lucide-react';
import Banner from '../../components/Banner';

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
    <div className="min-h-screen">
      {/* Hero Banner */}
      <Banner
        desktopImage="/banners/coprate c.jpg"
        mobileImage="/banners/coporate mobile banner.jpg"
        alt="Corporate Solutions"
        height="400px"
        priority={true}
      />

      {/* Corporate Content Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Corporate Solutions
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Enterprise Solutions
              <span className="text-blue-600 block">That Scale</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              Equip your business with quality refurbished laptops and technology solutions.
              Trusted by 500+ companies worldwide for bulk orders and enterprise needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="#quote"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors inline-flex items-center shadow-lg hover:shadow-xl"
              >
                Get a Quote
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="#solutions"
                className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-600 hover:text-white transition-colors inline-flex items-center"
              >
                View Solutions
              </Link>
            </div>
            <div className="flex justify-center">
              <div className="w-24 h-1 bg-blue-600 rounded-full"></div>
            </div>
          </div>

          {/* Stats */}
         
        </div>
      </section>

      {/* Why Choose Corporate */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Why Choose Mohit Computers for Corporate?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We understand the unique challenges of corporate technology procurement and offer tailored solutions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-gray-50 rounded-2xl hover:bg-blue-50 transition-colors duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Bulk Pricing</h3>
              <p className="text-gray-600">
                Special discounts for bulk orders. The more you buy, the more you save.
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-2xl hover:bg-blue-50 transition-colors duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Quality Assured</h3>
              <p className="text-gray-600">
                All laptops undergo rigorous testing and come with warranty coverage.
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-2xl hover:bg-blue-50 transition-colors duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Fast Delivery</h3>
              <p className="text-gray-600">
                Quick delivery across Pakistan with secure packaging and tracking.
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-2xl hover:bg-blue-50 transition-colors duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HeadphonesIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Dedicated Support</h3>
              <p className="text-gray-600">
                Dedicated account manager and 24/7 technical support for corporates.
              </p>
            </div>
          </div>
        </div>
      </section>

     
      {/* Get Quote Form */}
      <section id="quote" className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Get a Custom Quote</h2>
              <p className="text-xl text-blue-100">
                Tell us about your requirements and we&rsquo;ll create a tailored solution for your business
              </p>
              <div className="w-24 h-1 bg-white/30 rounded-full mx-auto mt-6"></div>
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

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-8 text-gray-800">
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Tell us about your requirements..."
                ></textarea>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Interested In
                </label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      value="Laptops"
                      checked={formData.interests.includes('Laptops')}
                      onChange={handleCheckboxChange}
                      className="w-4 h-4 text-[#6dc1c9] bg-gray-100 border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
                    />
                    <span className="ml-2 text-sm text-gray-700">Laptops</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      value="Chromebooks"
                      checked={formData.interests.includes('Chromebooks')}
                      onChange={handleCheckboxChange}
                      className="w-4 h-4 text-[#6dc1c9] bg-gray-100 border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
                    />
                    <span className="ml-2 text-sm text-gray-700">Chromebooks</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      value="Workstations"
                      checked={formData.interests.includes('Workstations')}
                      onChange={handleCheckboxChange}
                      className="w-4 h-4 text-[#6dc1c9] bg-gray-100 border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
                    />
                    <span className="ml-2 text-sm text-gray-700">Workstations</span>
                  </label>
                </div>
              </div>

              <div className="mt-8 text-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-teal-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#6dc1c9] transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Submit Inquiry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}