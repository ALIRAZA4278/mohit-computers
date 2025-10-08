import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, ArrowLeft, Tag, Facebook, Twitter, Linkedin, Share2, MessageCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import BlogCard from '../../../components/BlogCard';

async function getBlog(slug) {
  try {
    // For server-side rendering, bypass Vercel protection by calling database directly
    if (typeof window === 'undefined') {
      const { connectDB } = await import('../../../lib/mongodb');
      const Blog = await import('../../../models/Blog');
      
      await connectDB();
      const blog = await Blog.default.findOne({ 
        $or: [
          { slug: slug },
          { _id: slug }
        ],
        status: 'published'
      }).lean();
      
      if (!blog) return null;
      
      return {
        ...blog,
        _id: blog._id.toString(),
        createdAt: blog.createdAt.toISOString(),
        updatedAt: blog.updatedAt?.toISOString() || blog.createdAt.toISOString()
      };
    }
    
    // Client-side fetch - use relative URL to work on any domain
    const apiUrl = `/api/blogs/${slug}`;

    const res = await fetch(apiUrl, {
      cache: 'no-store'
    });
    
    if (!res.ok) {
      return null;
    }
    
    const data = await res.json();
    return data.blog;
  } catch (error) {
    console.error('Error fetching blog:', error);
    return null;
  }
}

async function getRelatedBlogs(currentBlogId, tags) {
  try {
    // For server-side rendering, bypass Vercel protection by calling database directly
    if (typeof window === 'undefined') {
      const connectToDatabase = (await import('../../../lib/mongodb')).default;
      const Blog = await import('../../../models/Blog');
      
      await connectToDatabase();
      const blogs = await Blog.default.find({ 
        _id: { $ne: currentBlogId },
        status: 'published',
        tags: { $in: tags || [] }
      })
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();
      
      return blogs.map(blog => ({
        ...blog,
        _id: blog._id.toString(),
        createdAt: blog.createdAt.toISOString(),
        updatedAt: blog.updatedAt?.toISOString() || blog.createdAt.toISOString()
      }));
    }
    
    // Client-side fetch - use relative URL to work on any domain
    const apiUrl = '/api/blogs';

    const res = await fetch(apiUrl, {
      cache: 'no-store'
    });
    
    if (!res.ok) {
      return [];
    }
    
    const data = await res.json();
    return data.blogs
      .filter(blog => 
        blog._id !== currentBlogId && 
        blog.status === 'published' &&
        blog.tags.some(tag => tags.includes(tag))
      )
      .slice(0, 3);
  } catch (error) {
    console.error('Error fetching related blogs:', error);
    return [];
  }
}

export default async function BlogDetail({ params }) {
  const post = await getBlog(params.id);
  
  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
          <p className="text-gray-600 mb-8">The blog post you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/blog" className="text-blue-600 hover:text-blue-800">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const relatedPosts = await getRelatedBlogs(post._id, post.tags || []);

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
              {post.featuredImage && (
                <div className="relative h-64 md:h-96">
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Article Content */}
              <div className="p-8">
                {/* Category and Tags */}
                <div className="mb-6 flex flex-wrap gap-3 items-center">
                  {post.category && (
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
                  )}
                  {post.tags && post.tags.length > 0 && (
                    post.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 text-black rounded-full text-sm">
                        #{tag}
                      </span>
                    ))
                  )}
                </div>

                {/* Article Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-black mb-6 leading-tight">
                  {post.title}
                </h1>

                {/* Article Meta */}
                <div className="flex flex-wrap items-center gap-6 text-black mb-8 pb-6 border-b-2 border-gray-100">
                  <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
                    <User className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="font-medium text-black">By {post.author}</span>
                  </div>
                  <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
                    <Calendar className="w-4 h-4 mr-2 text-green-600" />
                    <span className="text-black">{formatDate(post.createdAt)}</span>
                  </div>
                  <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
                    <span className="text-black font-medium">{post.views || 0} Views</span>
                  </div>
                </div>

                {/* Article Excerpt */}
                {post.excerpt && (
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 rounded-r-lg">
                    <p className="text-lg text-black font-medium leading-relaxed italic">
                      {post.excerpt}
                    </p>
                  </div>
                )}

                {/* Article Content */}
                <div className="prose prose-lg max-w-none prose-headings:text-black prose-p:text-black prose-strong:text-black prose-li:text-black prose-img:rounded-lg prose-img:shadow-md prose-blockquote:text-black prose-code:text-black">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-black mt-8 mb-4" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-black mt-6 mb-4" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-xl font-semibold text-black mt-4 mb-3" {...props} />,
                      p: ({node, ...props}) => <p className="text-black mb-4 leading-relaxed" {...props} />,
                      li: ({node, ...props}) => <li className="text-black" {...props} />,
                      strong: ({node, ...props}) => <strong className="text-black font-bold" {...props} />,
                      em: ({node, ...props}) => <em className="text-black italic" {...props} />,
                      blockquote: ({node, ...props}) => (
                        <blockquote className="border-l-4 border-gray-300 pl-4 py-2 bg-gray-50 text-black italic my-4" {...props} />
                      ),
                      code: ({node, inline, ...props}) => (
                        inline 
                          ? <code className="bg-gray-100 text-black px-2 py-1 rounded text-sm font-mono" {...props} />
                          : <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto my-4"><code {...props} /></pre>
                      ),
                      table: ({node, ...props}) => (
                        <div className="overflow-x-auto my-6">
                          <table className="min-w-full border border-gray-300 bg-white" {...props} />
                        </div>
                      ),
                      th: ({node, ...props}) => (
                        <th className="border border-gray-300 px-4 py-3 bg-gray-100 font-bold text-black text-left" {...props} />
                      ),
                      td: ({node, ...props}) => (
                        <td className="border border-gray-300 px-4 py-3 text-black" {...props} />
                      ),
                          img: ({node, alt, ...props}) => {
                            // eslint-disable-next-line @next/next/no-img-element
                            return <img {...props} alt={alt || props.alt || 'blog image'} className="w-full h-auto rounded-lg shadow-lg my-6" />
                          }
                    }}
                  >
                    {post.content || ''}
                  </ReactMarkdown>
                </div>

                {/* Gallery Images */}
                {post.images && post.images.length > 0 && (
                  <div className="mt-10 bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-2xl font-bold text-black mb-6 flex items-center">
                      <span className="w-1 h-6 bg-blue-500 mr-3"></span>
                      Gallery
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {post.images.map((image, index) => (
                        <div key={index} className="relative h-64 rounded-lg overflow-hidden shadow-lg group">
                          <Image
                            src={image}
                            alt={`Gallery image ${index + 1}`}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Share Buttons */}
                <div className="mt-10 pt-8 border-t-2 border-gray-100">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-black mb-4 text-center">Share this article</h3>
                    <div className="flex items-center justify-center space-x-4">
                      <button className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300 hover:scale-110 shadow-lg">
                        <Facebook className="w-5 h-5" />
                      </button>
                      <button className="p-3 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-all duration-300 hover:scale-110 shadow-lg">
                        <Twitter className="w-5 h-5" />
                      </button>
                      <button className="p-3 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-all duration-300 hover:scale-110 shadow-lg">
                        <Linkedin className="w-5 h-5" />
                      </button>
                      <button className="p-3 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-all duration-300 hover:scale-110 shadow-lg">
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-lg shadow-lg p-8 mt-8 border-t-4 border-blue-500">
              <h3 className="text-2xl font-bold text-black mb-6 flex items-center">
                <MessageCircle className="w-6 h-6 mr-3 text-blue-600" />
                Comments
              </h3>
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-black mb-6 font-medium">No comments yet. Be the first to share your thoughts!</p>
                <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  Leave a Comment
                </button>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="space-y-8">
              {/* Search */}
              <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-green-500">
                <h3 className="text-lg font-bold text-black mb-4">Search Articles</h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search articles..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-500"
                  />
                  <button className="absolute right-2 top-2 p-2 text-gray-400 hover:text-blue-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Categories */}
              <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-purple-500">
                <h3 className="text-lg font-bold text-black mb-4">Categories</h3>
                <ul className="space-y-3">
                  <li><Link href="/blog?category=tech-guides" className="text-black hover:text-blue-600 font-medium transition-colors block py-1">Tech Guides</Link></li>
                  <li><Link href="/blog?category=reviews" className="text-black hover:text-blue-600 font-medium transition-colors block py-1">Reviews</Link></li>
                  <li><Link href="/blog?category=news" className="text-black hover:text-blue-600 font-medium transition-colors block py-1">News</Link></li>
                  <li><Link href="/blog?category=buying-guide" className="text-black hover:text-blue-600 font-medium transition-colors block py-1">Buying Guide</Link></li>
                </ul>
              </div>

              {/* Recent Posts */}
              <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-orange-500">
                <h3 className="text-lg font-bold text-black mb-4">Recent Posts</h3>
                <div className="space-y-4">
                  <p className="text-black text-sm bg-gray-50 p-3 rounded">Recent posts will appear here</p>
                </div>
              </div>

              {/* Popular Tags */}
              <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-red-500">
                <h3 className="text-lg font-bold text-black mb-4">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {['Laptops', 'Reviews', 'Tech Tips', 'Buying Guide', 'Hardware', 'Software'].map((tag) => (
                    <span 
                      key={tag}
                      className="px-3 py-2 bg-gray-100 text-black rounded-full text-sm hover:bg-blue-100 hover:text-blue-700 cursor-pointer transition-all duration-300 font-medium hover:shadow-md"
                    >
                      #{tag}
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
        <section className="py-16 bg-gradient-to-r from-gray-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-black mb-4 flex items-center justify-center">
                <span className="w-2 h-8 bg-blue-500 mr-4"></span>
                Related Articles
                <span className="w-2 h-8 bg-blue-500 ml-4"></span>
              </h2>
              <p className="text-black text-lg">Discover more content you might find interesting</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <BlogCard key={relatedPost._id} post={relatedPost} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}