'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, MessageCircle, ArrowRight } from 'lucide-react';

const BlogCard = ({ post, featured = false }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group ${featured ? 'md:flex md:h-80' : ''}`}>
      {/* Blog Image */}
      <div className={`relative overflow-hidden ${featured ? 'md:w-1/2' : ''}`}>
        <Link href={`/blog/${post.slug || post.id || post._id}`}>
          <Image
            src={post.featured_image || post.featuredImage || '/next.png'} // Use featured_image from Supabase
            alt={post.title}
            width={400}
            height={250}
            className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${featured ? 'h-full md:h-80' : 'h-64'}`}
          />
        </Link>
      </div>

      {/* Blog Content */}
      <div className={`p-6 ${featured ? 'md:w-1/2 md:flex md:flex-col md:justify-center' : ''}`}>
        {/* Category & Tags */}
        <div className="mb-4 flex flex-wrap gap-2">
          {post.category && (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              post.category === 'Tech Guides' 
                ? 'bg-blue-100 text-blue-800'
                : post.category === 'Reviews'
                ? 'bg-green-100 text-green-800'
                : post.category === 'News'
                ? 'bg-purple-100 text-purple-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {post.category}
            </span>
          )}
          {post.tags && post.tags.length > 0 && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-black">
              #{post.tags[0]}
            </span>
          )}
        </div>

        {/* Blog Title */}
        <h3 className={`font-bold text-black mb-3 group-hover:text-blue-600 transition-colors duration-200 ${featured ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
          <Link href={`/blog/${post.slug || post.id || post._id}`} className="line-clamp-2">
            {post.title}
          </Link>
        </h3>

        {/* Blog Excerpt */}
        <p className={`text-gray-600 mb-6 leading-relaxed ${featured ? 'text-lg line-clamp-4' : 'text-base line-clamp-3'}`}>
          {post.excerpt}
        </p>

        {/* Read More Link */}
        <div className="mb-4">
          <Link 
            href={`/blog/${post.slug || post.id || post._id}`}
            className="text-blue-600 hover:text-blue-800 font-semibold text-sm uppercase tracking-wide flex items-center group"
          >
            READ MORE
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>

        {/* Blog Meta */}
        <div className="flex items-center justify-between text-sm text-black pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1 text-blue-600" />
              <span>{formatDate(post.created_at || post.createdAt)}</span>
            </div>
            {(post.author_name || post.author) && (
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1 text-green-600" />
                <span>{post.author_name || post.author}</span>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default BlogCard;