'use client';

import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft, Upload, X, Plus } from 'lucide-react';
import { categories, laptopBrands, resolutionOptions, touchOptions, conditionOptions, filterOptions } from '@/lib/data';
import { getRAMOptionsByGeneration, getSSDUpgradeOptions, getRAMTypeByGeneration } from '@/lib/upgradeOptions';
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

    // Clearance fields
    clearance: false,
    clearanceReason: '',

    // Discount fields
    discounted: false,
    discountPercentage: '',

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
    chargerIncluded: false,

    // RAM specific fields
    ramType: '',
    ramCapacity: '',
    ramSpeed: '',
    ramFormFactor: '',
    ramCondition: '',
    ramWarranty: '',

    // Upgrade Options
    upgradeOptions: {
      ssd256: { enabled: false, price: '' },
      ssd512: { enabled: false, price: '' },
      ram8gb: { enabled: false, price: '' },
      ram16gb: { enabled: false, price: '' },
      ram32gb: { enabled: false, price: '' }
    },

    // Custom Upgrade Options
    customUpgrades: []
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [availableRAMOptions, setAvailableRAMOptions] = useState([]);
  const [availableSSDOptions, setAvailableSSDOptions] = useState([]);
  const [enableCustomUpgrades, setEnableCustomUpgrades] = useState(false);
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

        // Clearance fields
        clearance: product.is_clearance || false,
        clearanceReason: product.clearance_reason || '',

        // Discount fields
        discounted: product.is_discounted || false,
        discountPercentage: product.discount_percentage || '',

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
        chargerIncluded: product.charger_included || false,

        // RAM specific fields
        ramType: product.ram_type || '',
        ramCapacity: product.ram_capacity || '',
        ramSpeed: product.ram_speed || '',
        ramFormFactor: product.ram_form_factor || '',
        ramCondition: product.ram_condition || '',
        ramWarranty: product.ram_warranty || '',

        // Upgrade Options
        upgradeOptions: product.upgrade_options || {
          ssd256: { enabled: false, price: '' },
          ssd512: { enabled: false, price: '' },
          ram8gb: { enabled: false, price: '' },
          ram16gb: { enabled: false, price: '' },
          ram32gb: { enabled: false, price: '' }
        },

        // Custom Upgrade Options
        customUpgrades: product.custom_upgrades || []
      });

      // Check if product has custom upgrades enabled
      if (product.custom_upgrades && product.custom_upgrades.length > 0) {
        setEnableCustomUpgrades(true);
      }
    }
  }, [product]);

  // Update available RAM options based on processor generation
  useEffect(() => {
    if (formData.generation && formData.category === 'laptop') {
      const ramOptions = getRAMOptionsByGeneration(formData.generation);
      setAvailableRAMOptions(ramOptions);
    }
  }, [formData.generation, formData.category]);

  // Update available SSD options based on current storage
  useEffect(() => {
    if (formData.hdd && formData.category === 'laptop') {
      const ssdOptions = getSSDUpgradeOptions(formData.hdd);
      setAvailableSSDOptions(ssdOptions);
    }
  }, [formData.hdd, formData.category]);

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
        is_clearance: formData.clearance,
        clearance_reason: formData.clearance ? formData.clearanceReason : null,
        clearance_date: formData.clearance && !product?.is_clearance ? new Date().toISOString() : (product?.clearance_date || null),
        is_discounted: formData.discounted,
        discount_percentage: formData.discounted && formData.discountPercentage ? parseInt(formData.discountPercentage) : null,

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

      // Only add RAM specific fields if category is 'ram'
      if (formData.category === 'ram') {
        productData.ram_type = formData.ramType || null;
        productData.ram_capacity = formData.ramCapacity || null;
        productData.ram_speed = formData.ramSpeed || null;
        productData.ram_form_factor = formData.ramFormFactor || null;
        productData.ram_condition = formData.ramCondition || null;
        productData.ram_warranty = formData.ramWarranty || null;
      }

      // Only add upgrade options if category is 'laptop'
      if (formData.category === 'laptop') {
        productData.upgrade_options = formData.upgradeOptions;
        productData.custom_upgrades = formData.customUpgrades || [];
      }

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

  const handleUpgradeOptionChange = (optionKey, field, value) => {
    setFormData(prev => ({
      ...prev,
      upgradeOptions: {
        ...prev.upgradeOptions,
        [optionKey]: {
          ...prev.upgradeOptions[optionKey],
          [field]: value
        }
      }
    }));
  };

  const addCustomUpgrade = () => {
    setFormData(prev => ({
      ...prev,
      customUpgrades: [
        ...(prev.customUpgrades || []),
        { type: 'storage', label: '', capacity: '', price: '' }
      ]
    }));
  };

  const removeCustomUpgrade = (index) => {
    setFormData(prev => ({
      ...prev,
      customUpgrades: (prev.customUpgrades || []).filter((_, i) => i !== index)
    }));
  };

  const updateCustomUpgrade = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      customUpgrades: (prev.customUpgrades || []).map((upgrade, i) =>
        i === index ? { ...upgrade, [field]: value } : upgrade
      )
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
                className="rounded text-black border-gray-300  focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Active (Show Product)</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="inStock"
                checked={formData.inStock}
                onChange={handleChange}
                className="rounded text-black border-gray-300  focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">In Stock (Allow Orders)</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="rounded text-black border-gray-300  focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Featured Product</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="workstation"
                checked={formData.workstation}
                onChange={handleChange}
                className="rounded text-black border-gray-300  focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Workstation Product</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="clearance"
                checked={formData.clearance}
                onChange={handleChange}
                className="rounded text-black border-gray-300  focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Clearance Item</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="discounted"
                checked={formData.discounted}
                onChange={handleChange}
                className="rounded text-black border-gray-300  focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Discounted Product</span>
            </label>
          </div>
          
          {/* Clearance Reason */}
          {formData.clearance && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Clearance Reason (Optional)
              </label>
              <select
                name="clearanceReason"
                value={formData.clearanceReason}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select a reason...</option>
                <option value="End of line">End of line</option>
                <option value="Overstock">Overstock</option>
                <option value="Damaged box">Damaged box (product fine)</option>
                <option value="Display model">Display model</option>
                <option value="Refurbished">Refurbished</option>
                <option value="Discontinued">Discontinued</option>
                <option value="Seasonal clearance">Seasonal clearance</option>
                <option value="Store closing">Store closing</option>
              </select>
            </div>
          )}

          {/* Discount Percentage */}
          {formData.discounted && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Percentage (Optional)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  name="discountPercentage"
                  value={formData.discountPercentage}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  placeholder="e.g. 25"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <span className="text-gray-500">%</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                This helps track and display discount badges. Leave empty for auto-calculation.
              </p>
            </div>
          )}
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
                  multiple
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('gallery-upload')?.click()}
                  disabled={uploading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload className="w-4 h-4" />
                  {uploading ? 'Uploading...' : 'Upload Images'}
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

        {/* RAM Specific Fields */}
        {formData.category === 'ram' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">RAM Specifications</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* RAM Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type *
                </label>
                <select
                  name="ramType"
                  value={formData.ramType}
                  onChange={handleChange}
                  required
                  className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select RAM Type</option>
                  {filterOptions.ramType.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* RAM Capacity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capacity *
                </label>
                <select
                  name="ramCapacity"
                  value={formData.ramCapacity}
                  onChange={handleChange}
                  required
                  className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Capacity</option>
                  {filterOptions.ramCapacity.map(capacity => (
                    <option key={capacity} value={capacity}>
                      {capacity}
                    </option>
                  ))}
                </select>
              </div>

              {/* RAM Speed */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Speed (Frequency) *
                </label>
                <select
                  name="ramSpeed"
                  value={formData.ramSpeed}
                  onChange={handleChange}
                  required
                  className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Speed</option>
                  {filterOptions.ramSpeed.map(speed => (
                    <option key={speed} value={speed}>
                      {speed}
                    </option>
                  ))}
                </select>
              </div>

              {/* RAM Form Factor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Form Factor *
                </label>
                <select
                  name="ramFormFactor"
                  value={formData.ramFormFactor}
                  onChange={handleChange}
                  required
                  className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Form Factor</option>
                  {filterOptions.ramFormFactor.map(formFactor => (
                    <option key={formFactor} value={formFactor}>
                      {formFactor}
                    </option>
                  ))}
                </select>
              </div>

              {/* RAM Condition */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition *
                </label>
                <select
                  name="ramCondition"
                  value={formData.ramCondition}
                  onChange={handleChange}
                  required
                  className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Condition</option>
                  {filterOptions.ramCondition.map(condition => (
                    <option key={condition} value={condition}>
                      {condition}
                    </option>
                  ))}
                </select>
              </div>

              {/* RAM Warranty */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Warranty *
                </label>
                <select
                  name="ramWarranty"
                  value={formData.ramWarranty}
                  onChange={handleChange}
                  required
                  className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Warranty</option>
                  {filterOptions.ramWarranty.map(warranty => (
                    <option key={warranty} value={warranty}>
                      {warranty}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

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

        {/* Upgrade Options - Only for Laptop category */}
        {formData.category === 'laptop' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upgrade Options</h3>
            <p className="text-sm text-gray-600 mb-6">
              Customize upgrade options based on processor generation and current storage.
              These options will be automatically calculated for customers.
            </p>

            {/* Info Box for Dynamic Pricing */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Automatic Pricing System
              </h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>Generation:</strong> {formData.generation || 'Not set - enter generation above'}</p>
                <p><strong>Current Storage:</strong> {formData.hdd || 'Not set - enter storage above'}</p>
                {formData.generation && (
                  <p><strong>RAM Type:</strong> {getRAMTypeByGeneration(formData.generation)}</p>
                )}
              </div>
            </div>

            <div className="space-y-6">
              {/* Dynamic RAM Upgrade Options */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-800">Memory (RAM) Upgrade Options</h4>
                  {!formData.generation && (
                    <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                      Set processor generation above
                    </span>
                  )}
                </div>

                {formData.generation && availableRAMOptions.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {availableRAMOptions.map((ramOption, index) => (
                      <div key={index} className="border-2 border-teal-200 bg-teal-50 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-gray-900">{ramOption.label}</p>
                            <p className="text-2xl font-bold text-teal-600">Rs {ramOption.price.toLocaleString()}</p>
                          </div>
                          <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p className="text-xs text-gray-600">Auto-calculated based on {formData.generation}</p>
                      </div>
                    ))}
                  </div>
                ) : formData.generation ? (
                  <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                    <p>No RAM upgrade options available for {formData.generation}</p>
                  </div>
                ) : (
                  <div className="text-center py-6 text-amber-600 bg-amber-50 rounded-lg border border-amber-200">
                    <p>Please enter processor generation in Laptop Specifications section above</p>
                  </div>
                )}
              </div>

              {/* Dynamic SSD Upgrade Options */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-800">SSD Storage Upgrade Options</h4>
                  {!formData.hdd && (
                    <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                      Set current storage above
                    </span>
                  )}
                </div>

                {formData.hdd && availableSSDOptions.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {availableSSDOptions.map((ssdOption, index) => (
                      <div key={index} className="border-2 border-purple-200 bg-purple-50 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-gray-900">{ssdOption.label}</p>
                            <p className="text-xs text-gray-600 mb-1">From {ssdOption.from} → {ssdOption.capacity}</p>
                            <p className="text-2xl font-bold text-purple-600">Rs {ssdOption.price.toLocaleString()}</p>
                          </div>
                          <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p className="text-xs text-gray-600">Auto-calculated upgrade path</p>
                      </div>
                    ))}
                  </div>
                ) : formData.hdd ? (
                  <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                    <p>No SSD upgrade paths available from {formData.hdd}</p>
                    <p className="text-xs mt-1">Current storage may already be at maximum upgrade tier</p>
                  </div>
                ) : (
                  <div className="text-center py-6 text-amber-600 bg-amber-50 rounded-lg border border-amber-200">
                    <p>Please enter current HDD/Storage in Laptop Specifications section above</p>
                  </div>
                )}
              </div>

              {/* Custom/Manual Upgrade Options */}
              <div className="mt-8 pt-6 border-t-2 border-gray-300">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                      Custom Upgrade Options
                      <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded">Optional</span>
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Add custom storage or memory options beyond the automatic ones
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addCustomUpgrade}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Custom Option
                  </button>
                </div>

                {formData.customUpgrades && formData.customUpgrades.length > 0 && (
                  <div className="space-y-4">
                    {formData.customUpgrades.map((upgrade, index) => (
                      <div key={index} className="border-2 border-gray-300 rounded-lg p-4 bg-gradient-to-r from-gray-50 to-white">
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-sm font-semibold text-gray-700 bg-gray-200 px-3 py-1 rounded">
                            Custom Option #{index + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeCustomUpgrade(index)}
                            className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="Remove this option"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          {/* Type Selection */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Type *
                            </label>
                            <select
                              value={upgrade.type}
                              onChange={(e) => updateCustomUpgrade(index, 'type', e.target.value)}
                              className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                            >
                              <option value="storage">SSD Storage</option>
                              <option value="memory">Memory (RAM)</option>
                            </select>
                          </div>

                          {/* Label/Name */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Label/Name *
                            </label>
                            <input
                              type="text"
                              value={upgrade.label}
                              onChange={(e) => updateCustomUpgrade(index, 'label', e.target.value)}
                              placeholder="e.g., Premium, Ultimate"
                              className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                          </div>

                          {/* Capacity */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Capacity *
                            </label>
                            <input
                              type="text"
                              value={upgrade.capacity}
                              onChange={(e) => updateCustomUpgrade(index, 'capacity', e.target.value)}
                              placeholder={upgrade.type === 'storage' ? 'e.g., 2TB SSD' : 'e.g., 32GB DDR5'}
                              className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                          </div>

                          {/* Price */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Price (Rs) *
                            </label>
                            <input
                              type="number"
                              value={upgrade.price}
                              onChange={(e) => updateCustomUpgrade(index, 'price', e.target.value)}
                              min="0"
                              step="1"
                              placeholder="e.g., 15000"
                              className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {(!formData.customUpgrades || formData.customUpgrades.length === 0) && (
                  <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <p className="font-medium">No custom upgrade options added yet</p>
                    <p className="text-sm mt-1">Click &quot;Add Custom Option&quot; to create a new upgrade option</p>
                  </div>
                )}
              </div>

              {/* Summary Section */}
              {(availableRAMOptions.length > 0 || availableSSDOptions.length > 0 || (formData.customUpgrades && formData.customUpgrades.length > 0)) && (
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-teal-50 border-2 border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Upgrade Options Summary</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">RAM Options:</p>
                      <p className="font-bold text-teal-700">{availableRAMOptions.length} available</p>
                    </div>
                    <div>
                      <p className="text-gray-600">SSD Options:</p>
                      <p className="font-bold text-purple-700">{availableSSDOptions.length} available</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Custom Options:</p>
                      <p className="font-bold text-green-700">{formData.customUpgrades?.length || 0} added</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-3 border-t border-blue-200 pt-2">
                    These upgrade options will be displayed to customers on the product detail page
                  </p>
                </div>
              )}
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
