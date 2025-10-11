import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import BlogCard from '../../components/BlogCard';
import NewsletterSubscribe from '../../components/NewsletterSubscribe';

async function getBlogs() {
  try {
    // For server-side rendering, use Supabase directly
    if (typeof window === 'undefined') {
      // Server-side: Use Supabase directly
      const { blogsAPI } = await import('../../lib/supabase-db');
      
      const { data: blogs, error } = await blogsAPI.getAll(50);
      
      if (error) {
        console.error('Server-side Supabase error:', error);
        return [];
      }
      
      console.log('Server-side fetched blogs:', blogs?.length || 0, 'blogs');
      return blogs || [];
    }
    
    // Client-side fetch - use API route
    const apiUrl = '/api/blogs';
    console.log('Fetching blogs from:', apiUrl);

    const res = await fetch(apiUrl, {
      cache: 'no-store' // Always get fresh data
    });
    
    console.log('Response status:', res.status);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('API Error:', errorText);
      throw new Error(`Failed to fetch blogs: ${res.status}`);
    }
    
    const data = await res.json();
    console.log('Fetched blogs:', data.blogs?.length || 0, 'blogs');
    return data.blogs || [];
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
}

export default async function Blog() {
  const blogs = await getBlogs();
  console.log('Blog page - received blogs:', blogs.length);
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Blog Hero Section - Matching Website Theme */}
      <section className="bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-600/10 to-blue-600/10"></div>
        <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20 relative">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
                Tech Insights & Reviews
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight text-gray-900">
                Smart Tech <span className="text-teal-600">Decisions</span> Start Here
              </h1>
              <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-gray-600 leading-relaxed">
                Expert guides, honest reviews, and practical tips to help you pick the right laptop, desktop, or accessory with confidence. Make informed decisions with our comprehensive tech insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-8">
                <Link 
                  href="#articles" 
                  className="bg-teal-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-teal-700 transition-all duration-300 inline-flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Explore Articles
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
                <Link 
                  href="/products" 
                  className="border-2 border-teal-600 text-teal-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-teal-600 hover:text-white transition-all duration-300 inline-flex items-center justify-center"
                >
                  Browse Products
                </Link>
              </div>
              
              {/* Stats */}
              <div className="flex flex-wrap gap-6 justify-center lg:justify-start text-sm text-gray-600">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mr-2"></div>
                  50+ Expert Reviews
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  Weekly Updates
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Trusted by 1000+ Readers
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                {/* Featured Article Preview Cards */}
                <div className="space-y-4">
                  {/* Article 1 */}
                  <div className="bg-gradient-to-r from-teal-50 to-teal-100 rounded-xl p-4 border border-teal-200">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-gray-900 font-semibold mb-1">Best Laptops Under 50K</h3>
                        <p className="text-gray-600 text-sm">Complete buying guide with top picks...</p>
                        <div className="flex items-center mt-2 text-xs text-teal-600">
                          <span>5 min read</span>
                          <span className="mx-2">•</span>
                          <span>Featured</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Article 2 */}
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-gray-900 font-semibold mb-1">SSD vs HDD Performance</h3>
                        <p className="text-gray-600 text-sm">Speed comparison and recommendations...</p>
                        <div className="flex items-center mt-2 text-xs text-blue-600">
                          <span>8 min read</span>
                          <span className="mx-2">•</span>
                          <span>Technical</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Article 3 */}
                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-gray-900 font-semibold mb-1">Budget Gaming Setup</h3>
                        <p className="text-gray-600 text-sm">Build powerful gaming rig on budget...</p>
                        <div className="flex items-center mt-2 text-xs text-green-600">
                          <span>12 min read</span>
                          <span className="mx-2">•</span>
                          <span>Gaming</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-teal-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                Latest
              </div>
              <div className="absolute -bottom-4 -left-4 bg-blue-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                Expert Tips
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      {blogs.length > 0 && (
        <section id="articles" className="py-16">
          <div className="container mx-auto px-4">
            {/* Featured Post */}
            {blogs.filter(blog => blog.featured).length > 0 && (
              <div className="mb-16">
                <h2 className="text-2xl font-bold text-black mb-8 text-center">Featured Article</h2>
                <div className="max-w-4xl mx-auto">
                  <BlogCard post={blogs.find(blog => blog.featured)} featured={true} />
                </div>
              </div>
            )}

            {/* All Posts Grid */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-black mb-8 text-center">Latest Articles</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {blogs.map((blog) => (
                  <BlogCard key={blog._id} post={blog} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Empty State */}
      {blogs.length === 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-black mb-4">No Articles Yet</h2>
              <p className="text-gray-600 mb-8">
                We&apos;re working on creating amazing content for you. Check back soon for tech insights and product reviews!
              </p>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Subscribe for Updates
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <NewsletterSubscribe />
    </div>
  );
}