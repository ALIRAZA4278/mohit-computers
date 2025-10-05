'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, Clock, MessageCircle, Tag, Share2, Facebook, Twitter, Linkedin, ArrowLeft } from 'lucide-react';
import { blogPosts } from '../../../lib/data';
import BlogCard from '../../../components/BlogCard';

export default function BlogDetail() {
  const params = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    if (params.id) {
      const foundPost = blogPosts.find(p => p.id === parseInt(params.id));
      setPost(foundPost);
      
      if (foundPost) {
        // Get related posts from same category
        const related = blogPosts
          .filter(p => p.category === foundPost.category && p.id !== foundPost.id)
          .slice(0, 3);
        setRelatedPosts(related);
      }
    }
  }, [params.id]);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blog post...</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">&gt;</span>
            <Link href="/blog" className="hover:text-blue-600">Blog</Link>
            <span className="mx-2">&gt;</span>
            <span className="text-gray-800">{post.title}</span>
          </nav>
        </div>
      </div>

      {/* Back to Blog */}
      <div className="container mx-auto px-4 py-6">
        <Link 
          href="/blog"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Link>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Article */}
          <article className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Featured Image */}
              <div className="relative h-64 md:h-96">
                <Image
                  src={post.image || '/next.png'}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Article Content */}
              <div className="p-8">
                {/* Category Badge */}
                <div className="mb-4">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${
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

                {/* Article Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 leading-tight">
                  {post.title}
                </h1>

                {/* Article Meta */}
                <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8 pb-8 border-b border-gray-200">
                  <div className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    <span className="font-medium">By {post.author}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    <span>{formatDate(post.date)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    <span>{post.readTime}</span>
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    <span>0 Comments</span>
                  </div>
                </div>

                {/* Article Content */}
                <div className="prose prose-lg max-w-none">
                  <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <div className="text-gray-700 leading-relaxed space-y-6">
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    
                    <p>
                      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Key Features</h2>
                    
                    <ul className="list-disc list-inside space-y-2">
                      <li>High-performance components for better productivity</li>
                      <li>Excellent build quality and durability</li>
                      <li>Cost-effective solution for budget-conscious buyers</li>
                      <li>Comprehensive warranty and support</li>
                    </ul>

                    <p>
                      Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Conclusion</h2>
                    
                    <p>
                      Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.
                    </p>
                  </div>
                </div>

                {/* Tags */}
                {post.tags && (
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <div className="flex items-center flex-wrap gap-2">
                      <Tag className="w-5 h-5 text-gray-400" />
                      {post.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 cursor-pointer"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Share Buttons */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">Share this article</h3>
                    <div className="flex items-center space-x-3">
                      <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Facebook className="w-5 h-5" />
                      </button>
                      <button className="p-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors">
                        <Twitter className="w-5 h-5" />
                      </button>
                      <button className="p-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors">
                        <Linkedin className="w-5 h-5" />
                      </button>
                      <button className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Comments</h3>
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No comments yet. Be the first to share your thoughts!</p>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Leave a Comment
                </button>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="space-y-8">
              {/* Search */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Search</h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search articles..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="absolute right-2 top-2 p-1 text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Categories */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Categories</h3>
                <ul className="space-y-2">
                  <li><Link href="/blog?category=tech-guides" className="text-gray-600 hover:text-blue-600">Tech Guides</Link></li>
                  <li><Link href="/blog?category=reviews" className="text-gray-600 hover:text-blue-600">Reviews</Link></li>
                  <li><Link href="/blog?category=news" className="text-gray-600 hover:text-blue-600">News</Link></li>
                  <li><Link href="/blog?category=buying-guide" className="text-gray-600 hover:text-blue-600">Buying Guide</Link></li>
                </ul>
              </div>

              {/* Recent Posts */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Posts</h3>
                <div className="space-y-4">
                  {blogPosts.slice(0, 3).map((recentPost) => (
                    <div key={recentPost.id} className="flex space-x-3">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0">
                        <Image
                          src={recentPost.image || '/next.png'}
                          alt={recentPost.title}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <Link href={`/blog/${recentPost.id}`} className="text-sm font-medium text-gray-800 hover:text-blue-600 line-clamp-2">
                          {recentPost.title}
                        </Link>
                        <p className="text-xs text-gray-500 mt-1">{formatDate(recentPost.date)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Popular Tags */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {['Laptops', 'Reviews', 'Tech Tips', 'Buying Guide', 'Hardware', 'Software'].map((tag) => (
                    <span 
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-blue-100 hover:text-blue-700 cursor-pointer transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <BlogCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}