'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, MessageCircle, ArrowRight } from 'lucide-react';

const BlogCard = ({ post }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      {/* Blog Image */}
      <div className="relative overflow-hidden">
        <Link href={`/blog/${post.id}`}>
          <Image
            src={post.image || '/next.png'} // Fallback image
            alt={post.title}
            width={400}
            height={250}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
      </div>

      {/* Blog Content */}
      <div className="p-6">
        {/* Category Badge */}
        {post.category && (
          <div className="mb-3">
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
          </div>
        )}

        {/* Blog Title */}
        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-200">
          <Link href={`/blog/${post.id}`} className="line-clamp-2">
            {post.title}
          </Link>
        </h3>

        {/* Blog Excerpt */}
        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
          {post.excerpt}
        </p>

        {/* Read More Link */}
        <div className="mb-4">
          <Link 
            href={`/blog/${post.id}`}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm uppercase tracking-wide flex items-center group"
          >
            READ MORE
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>

        {/* Blog Meta */}
        <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{formatDate(post.date)}</span>
            </div>
            {post.author && (
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                <span>{post.author}</span>
              </div>
            )}
          </div>
          <div className="flex items-center">
            <MessageCircle className="w-4 h-4 mr-1" />
            <span>No Comments</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;