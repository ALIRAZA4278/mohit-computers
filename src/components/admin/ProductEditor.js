'use client';

import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft, Upload, X } from 'lucide-react';
import { categories, laptopBrands, resolutionOptions, touchOptions, conditionOptions } from '@/lib/data';
import Image from 'next/image';

export default function ProductEditor({ product, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'laptop',
    brand: '',
    price: '',
    originalPrice: '',
    description: '',
    condition: 'Good',
    warranty: '',
    inStock: true,
    active: true,
    featured: false,
    workstation: false,

    // Image fields
    featuredImage: '',
    images: [],

    // Laptop specific fields
    model: '',
    processor: '',
    generation: '',
    ram: '',
    hdd: '',
    displaySize: '',
    resolution: '',
    integratedGraphics: '',
    discreteGraphics: '',
    touchType: '',
    operatingFeatures: '',
    extraFeatures: '',
    battery: '',
    chargerIncluded: false
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const featuredImageInputRef = React.useRef(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category: product.category_id || 'laptop',
        brand: product.brand || '',
        price: product.price || '',
        originalPrice: product.original_price || '',
        description: product.description || '',
        condition: product.condition || 'Good',
        warranty: product.warranty || '',
        inStock: product.in_stock !== false,
        active: product.is_active !== false,
        featured: product.is_featured || false,
        workstation: product.is_workstation || false,

        // Image fields
        featuredImage: product.featured_image || '',
        images: product.images || [],
        
        // Laptop specific fields
        model: product.model || '',
        processor: product.processor || '',
        generation: product.generation || '',
        ram: product.ram || '',
        hdd: product.hdd || '',
        displaySize: product.display_size || '',
        resolution: product.resolution || '',
        integratedGraphics: product.integrated_graphics || '',
        discreteGraphics: product.discrete_graphics || '',
        touchType: product.touch_type || '',
        operatingFeatures: product.operating_features || '',
        extraFeatures: product.extra_features || '',
        battery: product.battery || '',
        chargerIncluded: product.charger_included || false
      });
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Map form data to database field names
      const productData = {
        name: formData.name,
        category_id: formData.category, // Map category to category_id
        brand: formData.brand,
        price: parseFloat(formData.price) || 0,
        in_stock: formData.inStock,
        is_active: formData.active,
        is_featured: formData.featured,
        is_workstation: formData.workstation,

        // Image fields
        featured_image: formData.featuredImage || null,
        images: formData.images || [],
        
        // Laptop specific fields
        processor: formData.processor || null,
        generation: formData.generation || null,
        ram: formData.ram || null,
        hdd: formData.hdd || null,
        display_size: formData.displaySize || null,
        resolution: formData.resolution || null,
        integrated_graphics: formData.integratedGraphics || null,
        discrete_graphics: formData.discreteGraphics || null,
        touch_type: formData.touchType || null,
        operating_features: formData.operatingFeatures || null,
        extra_features: formData.extraFeatures || null,
        condition: formData.condition || 'Good',
        battery: formData.battery || null,
        charger_included: formData.chargerIncluded || false,
        warranty: formData.warranty || null
      };
      
      await onSave(productData);
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const getBrandOptions = () => {
    const category = categories.find(cat => cat.id === formData.category);
    return category ? category.brands : laptopBrands;
  };

  const handleImageUpload = async (e, isFeatured = true) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Convert FileList to Array
    const fileArray = Array.from(files);

    // Validate all files
    for (const file of fileArray) {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is larger than 5MB`);
        return;
      }
    }

    setUploading(true);
    try {
      // Upload files sequentially or in parallel
      const uploadPromises = fileArray.map(async (file) => {
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        uploadFormData.append('bucket', 'products');

        const response = await fetch('/api/supabase/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Upload failed');
        }

        return data.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);

      // Update form data with uploaded URLs
      if (isFeatured) {
        // For featured image, only use the first one
        setFormData(prev => ({ ...prev, featuredImage: uploadedUrls[0] }));
      } else {
        // For gallery, add all uploaded images
        setFormData(prev => ({
          ...prev,
          images: [...(prev.images || []), ...uploadedUrls]
        }));
      }

      alert(`${uploadedUrls.length} image${uploadedUrls.length > 1 ? 's' : ''} uploaded successfully to Supabase!`);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload some images: ' + error.message);
    } finally {
      setUploading(false);
      // Reset the input
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {product ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p className="text-gray-600">
              {product ? 'Update product information' : 'Create a new product listing'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Brand Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand
              </label>
              <select
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Brand</option>
                {getBrandOptions().map(brand => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            {/* Product Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selling Price (Rs)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="0"
                className="w-full px-3 text-black py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Original Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Original Price (Rs)
              </label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="0"
                className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Condition */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condition
              </label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {conditionOptions.map(condition => (
                  <option key={condition} value={condition}>
                    {condition}
                  </option>
                ))}
              </select>
            </div>

            {/* Warranty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Warranty
              </label>
              <input
                type="text"
                name="warranty"
                value={formData.warranty}
                onChange={handleChange}
                placeholder="e.g., 6 months, 1 year"
                className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Enter product description..."
              className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Checkboxes */}
          <div className="mt-6 flex flex-wrap gap-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleChange}
                className="rounded text-black border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Active (Show Product)</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="inStock"
                checked={formData.inStock}
                onChange={handleChange}
                className="rounded text-black border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">In Stock (Allow Orders)</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="rounded text-black border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Featured Product</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="workstation"
                checked={formData.workstation}
                onChange={handleChange}
                className="rounded text-black border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Workstation Product</span>
            </label>
          </div>
        </div>

        {/* Product Images */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Images</h3>
          
          {/* Featured Image */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Featured Image (Main Product Image)
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="url"
                name="featuredImage"
                value={formData.featuredImage || ''}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg or upload below"
                className="flex-1 px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="file"
                ref={featuredImageInputRef}
                onChange={(e) => handleImageUpload(e, true)}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => featuredImageInputRef.current?.click()}
                disabled={uploading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="w-4 h-4" />
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
            {formData.featuredImage && (
              <div className="mt-3">
                <div className="w-32 h-32 relative rounded-lg border border-gray-300 overflow-hidden">
                  <Image
                    src={formData.featuredImage}
                    alt="Featured product"
                    fill
                    sizes="128px"
                    className="object-cover"
                    unoptimized
                    onError={(e) => {
                      try { e.currentTarget.style.display = 'none'; } catch(err){}
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Additional Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Images (Gallery)
            </label>
            <div className="space-y-3">
              {(formData.images || []).map((image, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => {
                      const newImages = [...(formData.images || [])];
                      newImages[index] = e.target.value;
                      setFormData(prev => ({ ...prev, images: newImages }));
                    }}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newImages = (formData.images || []).filter((_, i) => i !== index);
                      setFormData(prev => ({ ...prev, images: newImages }));
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const newImages = [...(formData.images || []), ''];
                    setFormData(prev => ({ ...prev, images: newImages }));
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Add Image URL
                </button>
                <input
                  type="file"
                  id="gallery-upload"
                  onChange={(e) => handleImageUpload(e, false)}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('gallery-upload')?.click()}
                  disabled={uploading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload className="w-4 h-4" />
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </button>
              </div>
            </div>

            {/* Gallery Preview */}
            {formData.images && formData.images.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Gallery Preview:</p>
                <div className="flex flex-wrap gap-3">
                  {formData.images.map((image, index) => (
                    image && (
                      <div key={index} className="w-20 h-20 relative">
                        <Image
                          src={image}
                          alt={`Product ${index + 1}`}
                          width={80}
                          height={80}
                          className="object-cover rounded border border-gray-300"
                          unoptimized
                          onError={(e) => { try { e.currentTarget.style.display = 'none'; } catch(err){} }}
                        />
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Laptop Specific Fields */}
        {formData.category === 'laptop' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Laptop Specifications</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Model */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  placeholder="e.g., EliteBook 840 G5"
                  className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Processor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Processor
                </label>
                <input
                  type="text"
                  name="processor"
                  value={formData.processor}
                  onChange={handleChange}
                  placeholder="e.g., Intel Core i5-8250U"
                  className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Generation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Generation
                </label>
                <input
                  type="text"
                  name="generation"
                  value={formData.generation}
                  onChange={handleChange}
                  placeholder="e.g., 8th Gen, 10th Gen"
                  className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* RAM */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  RAM
                </label>
                <input
                  type="text"
                  name="ram"
                  value={formData.ram}
                  onChange={handleChange}
                  placeholder="e.g., 8GB DDR4, 16GB DDR4"
                  className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* HDD */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  HDD/Storage
                </label>
                <input
                  type="text"
                  name="hdd"
                  value={formData.hdd}
                  onChange={handleChange}
                  placeholder="e.g., 256GB SSD, 1TB HDD"
                  className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Display Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Size
                </label>
                <input
                  type="text"
                  name="displaySize"
                  value={formData.displaySize}
                  onChange={handleChange}
                  placeholder="e.g., 14 inch, 15.6 inch"
                  className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Resolution */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resolution
                </label>
                <select
                  name="resolution"
                  value={formData.resolution}
                  onChange={handleChange}
                  className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Resolution</option>
                  {resolutionOptions.map(resolution => (
                    <option key={resolution} value={resolution}>
                      {resolution}
                    </option>
                  ))}
                </select>
              </div>

              {/* Integrated Graphics */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Integrated Graphics
                </label>
                <input
                  type="text"
                  name="integratedGraphics"
                  value={formData.integratedGraphics}
                  onChange={handleChange}
                  placeholder="e.g., Intel UHD Graphics 620"
                  className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Discrete/Dedicated Graphics */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discrete/Dedicated Graphics
                </label>
                <input
                  type="text"
                  name="discreteGraphics"
                  value={formData.discreteGraphics}
                  onChange={handleChange}
                  placeholder="e.g., NVIDIA GeForce MX250"
                  className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Touch Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Touch / Non-touch / X360
                </label>
                <select
                  name="touchType"
                  value={formData.touchType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Type</option>
                  {touchOptions.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Battery */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Battery
                </label>
                <input
                  type="text"
                  name="battery"
                  value={formData.battery}
                  onChange={handleChange}
                  placeholder="e.g., Up to 8 hours, 50Wh"
                  className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Operating Features */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Operating Features
                </label>
                <input
                  type="text"
                  name="operatingFeatures"
                  value={formData.operatingFeatures}
                  onChange={handleChange}
                  placeholder="e.g., Windows 11 Pro, Fingerprint Reader"
                  className="w-full  text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Extra Features */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Extra Features (Connectivity/Ports/Other)
                </label>
                <textarea
                  name="extraFeatures"
                  value={formData.extraFeatures}
                  onChange={handleChange}
                  rows="3"
                  placeholder="e.g., USB 3.0, HDMI, WiFi 6, Bluetooth 5.0, Backlit Keyboard"
                  className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Charger Included */}
              <div className="md:col-span-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="chargerIncluded"
                    checked={formData.chargerIncluded}
                    onChange={handleChange}
                    className="rounded text-black border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Charger Included</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border  border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
          </button>
        </div>
      </form>
    </div>
  );
}

