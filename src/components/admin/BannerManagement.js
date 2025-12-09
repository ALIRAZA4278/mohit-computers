'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Image as ImageIcon, Smartphone, Monitor, Eye, EyeOff } from 'lucide-react';

export default function BannerManagement() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    desktop_image_url: '',
    mobile_image_url: '',
    link_url: '',
    display_order: 0,
    is_active: true
  });
  const [uploadingDesktop, setUploadingDesktop] = useState(false);
  const [uploadingMobile, setUploadingMobile] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/banners');
      const data = await response.json();
      if (data.success) {
        setBanners(data.banners);
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
      alert('Failed to fetch banners');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.desktop_image_url) {
      alert('Desktop image URL is required');
      return;
    }

    try {
      const method = editingBanner ? 'PUT' : 'POST';
      const body = editingBanner
        ? { ...formData, id: editingBanner.id }
        : formData;

      const response = await fetch('/api/admin/banners', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        fetchBanners();
        resetForm();
      } else {
        alert(data.error || 'Failed to save banner');
      }
    } catch (error) {
      console.error('Error saving banner:', error);
      alert('Failed to save banner');
    }
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      desktop_image_url: banner.desktop_image_url || '',
      mobile_image_url: banner.mobile_image_url || '',
      link_url: banner.link_url || '',
      display_order: banner.display_order || 0,
      is_active: banner.is_active !== false
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;

    try {
      const response = await fetch(`/api/admin/banners?id=${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        fetchBanners();
      } else {
        alert(data.error || 'Failed to delete banner');
      }
    } catch (error) {
      console.error('Error deleting banner:', error);
      alert('Failed to delete banner');
    }
  };

  const handleImageUpload = async (file, type) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    try {
      if (type === 'desktop') {
        setUploadingDesktop(true);
      } else {
        setUploadingMobile(true);
      }

      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('bucket', 'banners'); // Use Supabase Storage banners bucket

      const response = await fetch('/api/supabase/upload', {
        method: 'POST',
        body: formDataUpload
      });

      const data = await response.json();

      if (data.success) {
        if (type === 'desktop') {
          setFormData({ ...formData, desktop_image_url: data.url });
        } else {
          setFormData({ ...formData, mobile_image_url: data.url });
        }
        alert('Image uploaded successfully to Supabase Storage!');
      } else {
        alert(data.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      if (type === 'desktop') {
        setUploadingDesktop(false);
      } else {
        setUploadingMobile(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      desktop_image_url: '',
      mobile_image_url: '',
      link_url: '',
      display_order: 0,
      is_active: true
    });
    setEditingBanner(null);
    setShowForm(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Hero Banners</h1>
            <p className="text-gray-600 mt-1">Manage homepage slider banners</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-[#6dc1c9] text-white px-6 py-3 rounded-lg hover:bg-[#5db0b8] transition-colors"
          >
            <Plus className="w-5 h-5" />
            {showForm ? 'Close Form' : 'Add Banner'}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {editingBanner ? 'Edit Banner' : 'Add New Banner'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6dc1c9]"
                    placeholder="Banner title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subtitle (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6dc1c9]"
                    placeholder="Banner subtitle"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Monitor className="w-4 h-4" />
                  Desktop Image *
                </label>

                {/* Upload Button */}
                <div className="mb-2">
                  <input
                    type="file"
                    id="desktop-image-upload"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) handleImageUpload(file, 'desktop');
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor="desktop-image-upload"
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                      uploadingDesktop
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" />
                    {uploadingDesktop ? 'Uploading...' : 'Upload Image'}
                  </label>
                  <span className="ml-3 text-sm text-gray-500">or paste URL below</span>
                </div>

                {/* URL Input */}
                <input
                  type="text"
                  value={formData.desktop_image_url}
                  onChange={(e) => setFormData({ ...formData, desktop_image_url: e.target.value })}
                  className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6dc1c9]"
                  placeholder="https://example.com/banner-desktop.jpg or /images/banner.jpg"
                  required
                />
                {formData.desktop_image_url && (
                  <img
                    src={formData.desktop_image_url}
                    alt="Desktop preview"
                    className="mt-2 w-full max-w-md h-32 object-cover rounded-lg border"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  Mobile Image (Optional)
                </label>

                {/* Upload Button */}
                <div className="mb-2">
                  <input
                    type="file"
                    id="mobile-image-upload"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) handleImageUpload(file, 'mobile');
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor="mobile-image-upload"
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                      uploadingMobile
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" />
                    {uploadingMobile ? 'Uploading...' : 'Upload Image'}
                  </label>
                  <span className="ml-3 text-sm text-gray-500">or paste URL below</span>
                </div>

                {/* URL Input */}
                <input
                  type="text"
                  value={formData.mobile_image_url}
                  onChange={(e) => setFormData({ ...formData, mobile_image_url: e.target.value })}
                  className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6dc1c9]"
                  placeholder="https://example.com/banner-mobile.jpg"
                />
                {formData.mobile_image_url && (
                  <img
                    src={formData.mobile_image_url}
                    alt="Mobile preview"
                    className="mt-2 w-full max-w-xs h-32 object-cover rounded-lg border"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Link URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.link_url}
                    onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                    className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6dc1c9]"
                    placeholder="/products?category=laptop"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6dc1c9]"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="rounded text-[#6dc1c9] focus:ring-[#6dc1c9]"
                  />
                  <span className="text-sm font-medium text-gray-700">Active (Show on website)</span>
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-[#6dc1c9] text-white px-6 py-2 rounded-lg hover:bg-[#5db0b8] transition-colors"
                >
                  {editingBanner ? 'Update Banner' : 'Create Banner'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Banners List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#6dc1c9] border-t-transparent mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading banners...</p>
        </div>
      ) : banners.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow">
          <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No banners found. Add your first banner!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {banners.map((banner) => (
            <div key={banner.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="md:flex">
                {/* Images */}
                <div className="md:w-2/3">
                  <div className="relative">
                    <div className="absolute top-2 left-2 bg-gray-900 bg-opacity-75 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                      <Monitor className="w-3 h-3" />
                      Desktop
                    </div>
                    <img
                      src={banner.desktop_image_url}
                      alt={banner.title || 'Banner'}
                      className="w-full h-48 object-cover"
                      onError={(e) => e.target.src = '/placeholder.png'}
                    />
                  </div>
                  {banner.mobile_image_url && (
                    <div className="relative border-t">
                      <div className="absolute top-2 left-2 bg-gray-900 bg-opacity-75 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                        <Smartphone className="w-3 h-3" />
                        Mobile
                      </div>
                      <img
                        src={banner.mobile_image_url}
                        alt={banner.title || 'Banner mobile'}
                        className="w-full h-32 object-cover"
                        onError={(e) => e.target.src = '/placeholder.png'}
                      />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="md:w-1/3 p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      {banner.title && (
                        <h3 className="font-bold text-lg text-gray-800">{banner.title}</h3>
                      )}
                      {banner.subtitle && (
                        <p className="text-gray-600 text-sm">{banner.subtitle}</p>
                      )}
                    </div>
                    {banner.is_active ? (
                      <Eye className="w-5 h-5 text-green-500" title="Active" />
                    ) : (
                      <EyeOff className="w-5 h-5 text-gray-400" title="Inactive" />
                    )}
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    {banner.link_url && (
                      <div>
                        <span className="font-medium">Link:</span>{' '}
                        <span className="text-[#6dc1c9]">{banner.link_url}</span>
                      </div>
                    )}
                    <div>
                      <span className="font-medium">Order:</span> {banner.display_order}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span>{' '}
                      <span className={banner.is_active ? 'text-green-600' : 'text-gray-400'}>
                        {banner.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(banner)}
                      className="flex items-center gap-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(banner.id)}
                      className="flex items-center gap-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
