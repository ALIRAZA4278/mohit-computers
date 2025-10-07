import React from 'react';
import Image from 'next/image';
import BlogCard from '../../components/BlogCard';

async function getBlogs() {
  try {
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://your-domain.com' 
      : 'http://localhost:3000';
    
    console.log('Fetching blogs from:', `${baseUrl}/api/blogs`);
    
    const res = await fetch(`${baseUrl}/api/blogs`, {
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
      {/* Simple Hero Section */}
    <section className="bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-600/10 to-blue-600/10"></div>
        <div className="container mx-auto px-4 py-20 relative">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
+              From the Lab
            </div>
+
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-gray-900 leading-tight">
+
              Insights & Reviews <span className="text-teal-600">for Smart Shoppers</span>
+
            </h1>
+
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
+
              Expert guides, honest reviews, and practical tips to help you pick the right laptop, desktop, or accessory with confidence.
+
            </p>
            <div className="flex justify-center">
              <div className="w-24 h-1 bg-teal-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      {blogs.length > 0 && (
        <section className="py-16">
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
      <section className="bg-white py-16 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-black mb-4">Stay Updated</h3>
            <p className="text-gray-600 mb-8">
              Get the latest tech news and product recommendations delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}