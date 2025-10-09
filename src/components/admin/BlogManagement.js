"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Edit, Trash2, Search, FileText, RefreshCw, Calendar } from 'lucide-react';
import BlogEditor from './BlogEditor';

export default function BlogManagement() {
  const [view, setView] = useState('list');
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/blogs');
      if (response.ok) {
        const data = await response.json();
        setBlogs(data.blogs || []);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleCreateNew = () => {
    setSelectedBlog(null);
    setView('editor');
  };

  const handleEdit = (blog) => {
    setSelectedBlog(blog);
    setView('editor');
  };

  const handleDelete = async (blogId) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      try {
        const response = await fetch(`/api/admin/blogs/${blogId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchBlogs();
        }
      } catch (error) {
        console.error('Error deleting blog:', error);
      }
    }
  };

  const handleSave = () => {
    fetchBlogs();
    setView('list');
  };

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (blog.author_name || blog.author || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (view === 'editor') {
    return (
      <BlogEditor
        blog={selectedBlog}
        onSave={handleSave}
        onCancel={() => setView('list')}
      />
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-black">Blog Management</h1>
          <p className="text-gray-600 mt-1">Create and manage your blog posts</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchBlogs}
            className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 font-medium shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={handleCreateNew}
            className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2 font-medium shadow-md"
          >
            <Plus className="w-5 h-5" />
            New Blog Post
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6 border border-gray-200">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search blogs by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-black"
          />
        </div>
      </div>

      {/* Blogs Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading blogs...</p>
          </div>
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-200">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No blog posts found</p>
        </div>
      ) : (
        <div>
          <div className="bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-200">
            <p className="text-sm font-medium text-black">
              Showing <span className="font-bold">{filteredBlogs.length}</span> blog posts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => (
              <div
                key={blog.id || blog._id}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow"
              >
                {/* Featured Image */}
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                  {(blog.featured_image || blog.featuredImage) ? (
                    <Image
                      src={blog.featured_image || blog.featuredImage}
                      alt={blog.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <FileText className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full border-2 ${
                      blog.status === 'published'
                        ? 'bg-green-100 text-green-800 border-green-300'
                        : blog.status === 'draft'
                        ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                        : 'bg-gray-100 text-gray-800 border-gray-300'
                    }`}>
                      {blog.status?.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-lg text-black mb-2 line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {blog.excerpt || 'No excerpt available'}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(blog.created_at || blog.createdAt).toLocaleDateString()}
                    </span>
                    {(blog.gallery_images?.length || blog.images?.length) > 0 && (
                      <span className="text-teal-600 font-medium">
                        📸 {(blog.gallery_images?.length || blog.images?.length)} images
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-gray-600 mb-4">
                    <span className="font-medium">Author:</span> {blog.author_name || blog.author || 'Admin'}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="flex-1 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(blog.id || blog._id)}
                      className="px-4 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
