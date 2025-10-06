import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Users, Shield, Truck, HeadphonesIcon, CheckCircle, ArrowRight } from 'lucide-react';

export default function Corporate() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                Corporate Solutions
                <span className="text-yellow-400"> That Scale</span>
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Equip your business with quality refurbished laptops and technology solutions. 
                Trusted by 500+ companies across India for bulk orders and enterprise needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="#quote" 
                  className="bg-yellow-400 text-black px-8 py-4 rounded-lg font-semibold hover:bg-yellow-500 transition-colors flex items-center justify-center"
                >
                  Get a Quote
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link 
                  href="#solutions" 
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-colors flex items-center justify-center"
                >
                  View Solutions
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <Image
                  src="/next.png" // Placeholder
                  alt="Corporate Solutions"
                  width={500}
                  height={400}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

    

 


      {/* Get Quote Form */}
      <section id="quote" className="py-16 bg-white text-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Get a Custom Quote</h2>
              <p className="text-xl text-black">
                Tell us about your requirements and we&rsquo;ll create a tailored solution for your business
              </p>
            </div>

            <form className="bg-white rounded-lg p-8 text-gray-800">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your Company Name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your Name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="your@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+92 336 8900349"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Laptops Required *
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>5-10</option>
                    <option>11-25</option>
                    <option>26-50</option>
                    <option>51-100</option>
                    <option>100+</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget Range
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Under Rs:2 Lakhs</option>
                    <option>Rs:2-5 Lakhs</option>
                    <option>Rs:5-10 Lakhs</option>
                    <option>Rs:10-25 Lakhs</option>
                    <option>Above Rs:25 Lakhs</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specific Requirements
                </label>
                <textarea
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell us about your specific requirements, preferred configurations, timeline, etc."
                ></textarea>
              </div>
              
              <div className="mt-8 text-center">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Submit Quote Request
                </button>
                <p className="text-sm text-gray-500 mt-4">
                  We&rsquo;ll get back to you within 24 hours with a detailed quote
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}