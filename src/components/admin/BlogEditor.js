"use client";

import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft, Eye, Upload, X } from 'lucide-react';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// Dynamically import the markdown editor to avoid SSR issues
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

export default function BlogEditor({ blog, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'Tech Guides',
    tags: '',
    status: 'draft',
    featured: false,
    featuredImage: '',
    images: []
  });
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title || '',
        content: blog.content || '',
        excerpt: blog.excerpt || '',
        category: blog.category || 'Tech Guides',
        tags: blog.tags ? blog.tags.join(', ') : '',
        status: blog.status || 'draft',
        featured: blog.featured || false,
        featuredImage: blog.featuredImage || '',
        images: blog.images || []
      });
    }
  }, [blog]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const blogData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      const url = blog ? `/api/admin/blogs/${blog._id}` : '/api/admin/blogs';
      const method = blog ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogData),
      });

      if (response.ok) {
        onSave();
      } else {
        alert('Failed to save blog post');
      }
    } catch (error) {
      console.error('Error saving blog:', error);
      alert('Error saving blog post');
    }

    setSaving(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = async (file, type = 'gallery') => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (type === 'featured') {
          setFormData(prev => ({ ...prev, featuredImage: data.imageUrl }));
        } else {
          setFormData(prev => ({ 
            ...prev, 
            images: [...prev.images, data.imageUrl] 
          }));
        }
      } else {
        alert('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
    }
    setUploading(false);
  };

  const removeImage = async (imageUrl, type = 'gallery') => {
    try {
      // If editing existing blog, remove from database as well
      if (blog && blog._id) {
        const response = await fetch(`/api/admin/blogs/${blog._id}/remove-image?imageUrl=${encodeURIComponent(imageUrl)}&type=${type}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Image removed from database and server successfully');
        } else {
          console.error('Failed to remove image from database');
        }
      } else {
        // For new blog posts, just delete the file
        const response = await fetch(`/api/admin/delete-image?imageUrl=${encodeURIComponent(imageUrl)}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          console.log('Image deleted from server successfully');
        } else {
          console.error('Failed to delete image from server');
        }
      }
    } catch (error) {
      console.error('Error removing image:', error);
    }

    // Remove from local state regardless of server deletion result
    if (type === 'featured') {
      setFormData(prev => ({ ...prev, featuredImage: '' }));
    } else {
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter(img => img !== imageUrl)
      }));
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={onCancel}
            className="mr-4 p-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {blog ? 'Edit Blog Post' : 'Create New Blog Post'}
            </h1>
            <p className="text-gray-600 mt-2">Write and publish your blog content</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setPreview(!preview)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center"
          >
            <Eye className="w-4 h-4 mr-2" />
            {preview ? 'Edit' : 'Preview'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Blog Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your blog title..."
              />
            </div>

            {/* Content Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <MDEditor
                  value={formData.content}
                  onChange={(value) => setFormData(prev => ({ ...prev, content: value || '' }))}
                  preview={preview ? 'preview' : 'edit'}
                  hideToolbar={preview}
                  height={400}
                />
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                rows="3"
                className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description of your blog post..."
              />
            </div>

            {/* Category and Read Time */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Tech Guides">Tech Guides</option>
                  <option value="Reviews">Reviews</option>
                  <option value="News">News</option>
                  <option value="Buying Guide">Buying Guide</option>
                </select>
              </div>

            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Publish Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full  text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="h-4 w-4  text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                    Featured Post
                  </label>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Tags</h3>
              <div>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="technology, laptops, reviews"
                />
                <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
              </div>
            </div>

            {/* Featured Image */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Featured Image</h3>
              <div>
                {formData.featuredImage ? (
                  <div className="relative h-40 w-full">
                    <Image
                      src={formData.featuredImage}
                      alt="Featured"
                      fill
                      className="object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(formData.featuredImage, 'featured')}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400">
                    <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Click to upload featured image</p>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, 'featured');
                      }}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Gallery Images */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Gallery Images</h3>
              <div>
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative h-24 w-full">
                        <Image
                          src={image}
                          alt={`Gallery ${index + 1}`}
                          fill
                          className="object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(image)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {formData.images.length < 10 && (
                  <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 block">
                    <Upload className="w-6 h-6 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Add gallery image ({formData.images.length}/10)</p>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (formData.images.length >= 10) {
                            alert('Maximum 10 images allowed in gallery');
                            return;
                          }
                          handleImageUpload(file, 'gallery');
                        }
                      }}
                    />
                  </label>
                )}
                {formData.images.length >= 10 && (
                  <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-700">Maximum 10 images reached. Delete some images to add more.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : (blog ? 'Update Post' : 'Create Post')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}