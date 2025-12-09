import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import BlogCard from '../../components/BlogCard';
import NewsletterSubscribe from '../../components/NewsletterSubscribe';

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
      {/* Page Header */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Blog</h1>
            <div className="flex justify-center">
              <div className="w-24 h-1 bg-[#6dc1c9] rounded-full"></div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg text-gray-600 leading-relaxed">
              Expert guides, honest reviews, and practical tips to help you pick the right laptop, desktop, or accessory with confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      {blogs.length > 0 && (
        <section id="articles" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            {/* Featured Post */}
            {blogs.filter(blog => blog.is_featured).length > 0 && (
              <div className="mb-16">
                <div className="text-center mb-10">
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">Featured Article</h2>
                  <div className="flex justify-center">
                    <div className="w-24 h-1 bg-[#6dc1c9] rounded-full"></div>
                  </div>
                </div>
                <div className="max-w-4xl mx-auto">
                  <BlogCard post={blogs.find(blog => blog.is_featured)} featured={true} />
                </div>
              </div>
            )}

            {/* All Posts Grid */}
            <div>
              <div className="text-center mb-10">
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">Latest Articles</h2>
                <div className="flex justify-center">
                  <div className="w-24 h-1 bg-[#6dc1c9] rounded-full"></div>
                </div>
              </div>
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
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-md mx-auto">
              <div className="w-20 h-20 bg-[#6dc1c9]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-[#6dc1c9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No Articles Yet</h2>
              <p className="text-gray-600 mb-8">
                We&apos;re working on creating amazing content for you. Check back soon for tech insights and product reviews!
              </p>
              <Link href="/products" className="bg-[#6dc1c9] text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors inline-block">
                Browse Products
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <NewsletterSubscribe />
    </div>
  );
}