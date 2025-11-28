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
      {/* Blog Header Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Blog</h1>
              <div className="flex justify-center">
                <div className="w-24 h-1 bg-[#6dc1c9] rounded-full"></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              <h2 className="text-xl md:text-2xl font-semibold text-[#6dc1c9] mb-4 text-center">Smart Tech Decisions Start Here</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-4 text-center">
                Expert guides, honest reviews, and practical tips to help you pick the right laptop, desktop, or accessory with confidence.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-6 text-center">
                At Mohit Computers, we believe in empowering our customers with knowledge. Our blog features in-depth reviews, buying guides, and technical comparisons.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="#articles"
                  className="bg-[#6dc1c9] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-teal-700 transition-all inline-flex items-center justify-center"
                >
                  Explore Articles
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
                <Link
                  href="/products"
                  className="border-2 border-[#6dc1c9] text-[#6dc1c9] px-6 py-2.5 rounded-lg font-medium hover:bg-[#6dc1c9] hover:text-white transition-all inline-flex items-center justify-center"
                >
                  Browse Products
                </Link>
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