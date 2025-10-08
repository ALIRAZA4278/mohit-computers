"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Edit, Trash2, Eye, Search, FileText } from 'lucide-react';
import BlogEditor from './BlogEditor';

export default function BlogManagement() {
  const [view, setView] = useState('list'); // 'list' or 'editor'
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch blogs from API
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-gray-600 mt-2">Create and manage your blog posts</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Blog Post
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Blog List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Blog Posts ({filteredBlogs.length})</h2>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">Loading blogs...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No blog posts found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Blog
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBlogs.map((blog) => (
                  <tr key={blog.id || blog._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {/* Featured Image Preview */}
                        <div className="flex-shrink-0 h-12 w-12 mr-4">
                          {(blog.featured_image || blog.featuredImage) ? (
                            <Image
                              src={blog.featured_image || blog.featuredImage}
                              alt={blog.title}
                              width={48}
                              height={48}
                              className="h-12 w-12 rounded-lg object-cover border-2 border-gray-200"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                              <FileText className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{blog.title}</p>
                          <p className="text-sm text-gray-500">{blog.excerpt || 'No excerpt'}</p>
                          {(blog.gallery_images?.length || blog.images?.length) && (
                            <p className="text-xs text-blue-600 mt-1">
                              📸 {(blog.gallery_images?.length || blog.images?.length || 0)} gallery images
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {blog.author_name || blog.author || 'Admin'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        blog.status === 'published' 
                          ? 'bg-green-100 text-green-800'
                          : blog.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {blog.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(blog.created_at || blog.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(blog)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(blog._id)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}