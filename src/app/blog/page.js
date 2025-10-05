import React from 'react';
import Image from 'next/image';
import { blogPosts } from '../../lib/data';
import BlogCard from '../../components/BlogCard';

export default function Blog() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-teal-500 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="mb-8">
              <Image
                src="/next.png"
                alt="Blog"
                width={300}
                height={200}
                className="mx-auto"
              />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white">BLOG</h1>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>


    </div>
  );
}