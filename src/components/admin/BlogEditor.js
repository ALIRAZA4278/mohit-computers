"use client";

import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft, Eye, Upload, X } from 'lucide-react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import ImageUploader from '@/components/ImageUploader';
import MarkdownImageInserter from '@/components/MarkdownImageInserter';

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
        tags: blog.tags ? (Array.isArray(blog.tags) ? blog.tags.join(', ') : blog.tags) : '',
        status: blog.status || 'draft',
        featured: blog.is_featured || blog.featured || false,
        featuredImage: blog.featured_image || blog.featuredImage || '',
        images: blog.gallery_images || blog.images || []
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

      const url = blog ? `/api/admin/blogs/${blog.id || blog._id}` : '/api/admin/blogs';
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

  // Supabase image upload handler for featured image
  const handleFeaturedImageUpload = (imageData) => {
    setFormData(prev => ({ 
      ...prev, 
      featuredImage: imageData.url 
    }));
  };

  // Supabase image upload handler for gallery images
  const handleGalleryImageUpload = (imagesData) => {
    const imageUrls = Array.isArray(imagesData) 
      ? imagesData.map(img => img.url)
      : [imagesData.url];
    
    setFormData(prev => ({ 
      ...prev, 
      images: [...prev.images, ...imageUrls] 
    }));
  };

  // Handle markdown image insertion
  const handleMarkdownImageInsert = (markdownImage) => {
    setFormData(prev => ({
      ...prev,
      content: prev.content + '\n\n' + markdownImage + '\n\n'
    }));
  };

  const removeImage = async (imageUrl, type = 'gallery') => {
    try {
      console.log('🗑️ Removing image:', imageUrl);
      
      // Show confirmation dialog
      const confirmDelete = window.confirm(
        `Are you sure you want to delete this ${type === 'featured' ? 'featured image' : 'gallery image'}?\n\nThis will permanently remove it from Supabase storage.`
      );
      
      if (!confirmDelete) {
        return;
      }

      // First remove from local state (immediate UI update)
      if (type === 'featured') {
        setFormData(prev => ({ ...prev, featuredImage: '' }));
      } else {
        setFormData(prev => ({
          ...prev,
          images: prev.images.filter(img => img !== imageUrl)
        }));
      }

      console.log('🔄 Deleting from Supabase storage...');
      
      // Then delete from Supabase storage
      const response = await fetch('/api/admin/delete-image', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Failed to delete image from storage:', errorData);
        alert('Warning: Image removed from UI but may still exist in storage. Check console for details.');
      } else {
        const successData = await response.json();
        console.log('✅ Image deleted successfully from Supabase storage:', successData);
        
        // Show success message
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50';
        notification.textContent = `${type === 'featured' ? 'Featured image' : 'Gallery image'} deleted successfully!`;
        document.body.appendChild(notification);
        
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 3000);
      }
    } catch (error) {
      console.error('❌ Error removing image:', error);
      alert('Error deleting image. Please try again.');
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
              
              {/* Quick Image Insert */}
              <MarkdownImageInserter onImageInsert={handleMarkdownImageInsert} />
              
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <MDEditor
                  value={formData.content}
                  onChange={(value) => setFormData(prev => ({ ...prev, content: value || '' }))}
                  preview={preview ? 'preview' : 'edit'}
                  hideToolbar={preview}
                  height={400}
                />
              </div>
              
              <div className="mt-2 text-xs text-gray-500">
                💡 Tip: Use the &quot;Insert Image&quot; button above to upload images directly to Supabase and insert them in your content.
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
                  <div className="mb-4">
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
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-lg transition-all hover:scale-105"
                        title="Delete featured image from Supabase storage"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-2 left-2 right-2 bg-gradient-to-t from-black to-transparent text-white text-xs p-2 rounded">
                        <p className="font-medium">✅ Featured Image</p>
                        <p className="text-gray-300">Stored in Supabase</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 break-all">
                      🔗 Supabase URL: {formData.featuredImage}
                    </p>
                  </div>
                ) : (
                  <ImageUploader
                    onImageUploaded={handleFeaturedImageUpload}
                    bucket="blogs"
                    multiple={false}
                    className="mb-2"
                  />
                )}
              </div>
            </div>

            {/* Gallery Images */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Gallery Images ({formData.images.length}/10)
              </h3>
              <div>
                {/* Current Gallery Images */}
                {formData.images.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Current Images:</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                            <Image
                              src={image}
                              alt={`Gallery ${index + 1}`}
                              width={100}
                              height={100}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(image)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            title="Delete image from Supabase storage"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="truncate font-medium">✅ Supabase Storage</p>
                            <p className="truncate text-gray-300">Click ✕ to delete</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add New Images */}
                {formData.images.length < 10 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Add New Images:</h4>
                    <ImageUploader
                      onImageUploaded={handleGalleryImageUpload}
                      bucket="blogs"
                      multiple={true}
                      maxFiles={10 - formData.images.length}
                    />
                  </div>
                )}

                {formData.images.length >= 10 && (
                  <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-700">
                      Maximum 10 images reached. Delete some images to add more.
                    </p>
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