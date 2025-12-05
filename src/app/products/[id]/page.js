'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Heart, ShoppingCart, GitCompare, Truck, Shield, RotateCcw, CheckCircle, Phone, Mail, MapPin, ZoomIn, X } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';
import { useCompare } from '../../../context/CompareContext';
import ProductCard from '../../../components/ProductCard';
import ReviewSection from '../../../components/ReviewSection';
import LaptopCustomizer from '../../../components/LaptopCustomizer';
import ChromebookCustomizer from '../../../components/ChromebookCustomizer';
import RAMCustomizer from '../../../components/RAMCustomizer';
import AppleCustomizer from '../../../components/AppleCustomizer';
import { getRAMOptionsByGeneration, getSSDUpgradeOptions, getRAMTypeByGeneration, getAllSSDOptions } from '../../../lib/upgradeOptions';

export default function ProductDetail() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageZoom, setImageZoom] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [customUpgradePrice, setCustomUpgradePrice] = useState(0);
  const [availableRAMOptions, setAvailableRAMOptions] = useState([]);
  const [availableSSDOptions, setAvailableSSDOptions] = useState([]);
  const [laptopCustomization, setLaptopCustomization] = useState({
    customizations: { ramUpgrade: null, ssdUpgrade: null },
    additionalCost: 0,
    totalPrice: 0,
    updatedSpecs: null
  });
  const [ramCustomization, setRamCustomization] = useState({
    brand: null,
    speed: null,
    totalPrice: 0,
    additionalCost: 0,
    specs: null
  });
  const [chromebookCustomization, setChromebookCustomization] = useState({
    customizations: { ramUpgrade: null, ssdUpgrade: null },
    additionalCost: 0,
    totalPrice: 0,
    updatedSpecs: null
  });
  const [appleCustomization, setAppleCustomization] = useState({
    customizations: { ssdUpgrade: null },
    additionalCost: 0,
    totalPrice: 0,
    updatedSpecs: null
  });

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCompare, isInCompare } = useCompare();

  // Helper function to check product availability
  const checkProductAvailability = (product) => {
    if (!product) return { isAvailable: false, stockQuantity: 0, inStock: false };

    const stockQuantity = product.stock_quantity !== undefined && product.stock_quantity !== null
      ? product.stock_quantity
      : 999;

    const inStock = product.in_stock !== undefined && product.in_stock !== null
      ? product.in_stock
      : (product.inStock !== undefined && product.inStock !== null ? product.inStock : true);

    const isActive = product.is_active !== undefined ? product.is_active : true;

    const isAvailable = isActive && inStock === true && stockQuantity > 0;

    return { isAvailable, stockQuantity, inStock, isActive };
  };

  // Define handlers with useCallback to prevent infinite loops
  const handleCustomizationChange = useCallback((customizationData) => {
    console.log('Customization data received:', customizationData);
    console.log('Updated specs:', customizationData.updatedSpecs);
    setLaptopCustomization(customizationData);
  }, []);

  const handleRAMCustomizationChange = useCallback((customizationData) => {
    console.log('RAM Customization data received:', customizationData);
    setRamCustomization(customizationData);
  }, []);

  const handleChromebookCustomizationChange = useCallback((customizationData) => {
    console.log('Chromebook Customization data received:', customizationData);
    console.log('Updated specs:', customizationData.updatedSpecs);
    setChromebookCustomization(customizationData);
  }, []);

  const handleAppleCustomizationChange = useCallback((customizationData) => {
    console.log('Apple Customization data received:', customizationData);
    setAppleCustomization(customizationData);
  }, []);

  useEffect(() => {
    if (params.id) {
      fetchProduct();
    }
  }, [params.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Initialize laptopCustomization totalPrice when product loads
  useEffect(() => {
    if (product?.price && laptopCustomization.totalPrice === 0 && laptopCustomization.additionalCost === 0) {
      setLaptopCustomization(prev => ({
        ...prev,
        totalPrice: product.price
      }));
    }
  }, [product?.price]); // eslint-disable-line react-hooks/exhaustive-deps

  // Initialize chromebookCustomization totalPrice when product loads
  useEffect(() => {
    if (product?.price && product?.category_id === 'chromebook' && chromebookCustomization.totalPrice === 0 && chromebookCustomization.additionalCost === 0) {
      setChromebookCustomization(prev => ({
        ...prev,
        totalPrice: product.price
      }));
    }
  }, [product?.price, product?.category_id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Calculate available RAM options based on processor generation and processor type (Intel/AMD)
  useEffect(() => {
    if ((product?.generation || product?.processor) && product?.category_id === 'laptop') {
      const ramOptions = getRAMOptionsByGeneration(product.generation, product.processor);
      setAvailableRAMOptions(ramOptions);
    }
  }, [product]);

  // Show all SSD options for every laptop (not dependent on current storage)
  useEffect(() => {
    if (product?.category_id === 'laptop') {
      const ssdOptions = getAllSSDOptions();
      setAvailableSSDOptions(ssdOptions);
    }
  }, [product]);

  useEffect(() => {
    // Calculate custom upgrade price
    let totalUpgradePrice = 0;
    if (selectedStorage) {
      totalUpgradePrice += parseFloat(selectedStorage.price || 0);
    }
    if (selectedMemory) {
      totalUpgradePrice += parseFloat(selectedMemory.price || 0);
    }
    setCustomUpgradePrice(totalUpgradePrice);
  }, [selectedStorage, selectedMemory]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${params.id}`);
      const data = await response.json();

      if (data.success) {
        setProduct(data.product);

        if (data.product.category_id) {
          fetchRelatedProducts(data.product.category_id);
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (categoryId) => {
    try {
      const response = await fetch(`/api/products?category=${categoryId}&limit=20`);
      const data = await response.json();

      if (data.success) {
        // Filter out current product
        const filtered = data.products.filter(p => p.id !== params.id);

        // Shuffle array to get random products
        const shuffled = filtered.sort(() => 0.5 - Math.random());

        // Get first 4 random products
        setRelatedProducts(shuffled.slice(0, 4));
      }
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  };

  if (loading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#6dc1c9] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading product details...</p>
        </div>
      </div>
    );
  }

  // Parse product images safely
  let productImages = [];

  try {
    // Priority 1: Check featured_image first (most reliable)
    if (product.featured_image && typeof product.featured_image === 'string' && product.featured_image.trim() !== '') {
      productImages.push(product.featured_image.trim());
    }

    // Priority 2: Check images array
    if (product.images) {
      const parsedImages = typeof product.images === 'string'
        ? JSON.parse(product.images)
        : product.images;

      // Filter out null/undefined/empty values and ensure we have valid image paths
      if (Array.isArray(parsedImages)) {
        const validImages = parsedImages
          .filter(img => img && typeof img === 'string' && img.trim() !== '')
          .map(img => img.trim());

        // Add images that aren't already in productImages
        validImages.forEach(img => {
          if (!productImages.includes(img)) {
            productImages.push(img);
          }
        });
      }
    }

    // If no images found, use placeholder
    if (productImages.length === 0) {
      productImages = ['/placeholder-laptop.png'];
      console.warn('No product images found, using placeholder for:', product.name);
    } else {
      console.log('✅ Found', productImages.length, 'image(s) for:', product.name);
    }
  } catch (error) {
    console.error('Error parsing product images:', error);
    console.error('Product data:', product);
    // Fallback to featured_image or placeholder
    if (product.featured_image && product.featured_image.trim() !== '') {
      productImages = [product.featured_image];
    } else {
      productImages = ['/placeholder-laptop.png'];
    }
  }

  const handleAddToCart = () => {
    console.log('handleAddToCart called - Adding product without customization');
    console.log('Product price:', product.price);

    // Check stock availability using helper function
    const { isAvailable, stockQuantity } = checkProductAvailability(product);

    if (!isAvailable) {
      alert('Sorry, this product is currently out of stock.');
      return;
    }

    if (quantity > stockQuantity) {
      alert(`Sorry, only ${stockQuantity} items are available in stock.`);
      return;
    }

    // Handle RAM customization
    if (product.category_id === 'ram' && ramCustomization.specs) {
      const productWithRAMCustomization = {
        ...product,
        ramCustomization: ramCustomization,
        finalPrice: ramCustomization.totalPrice || product.price,
        customizationCost: ramCustomization.additionalCost || 0,
        displayName: `${product.name} - ${ramCustomization.specs.brand} ${ramCustomization.specs.speed}`,
        hasRAMCustomization: true
      };

      for (let i = 0; i < quantity; i++) {
        addToCart(productWithRAMCustomization);
      }
      setQuantity(1);
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setQuantity(1);
  };

  const handleWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleCompare = () => {
    addToCompare(product);
  };

  const handleImageError = (index) => {
    console.error(`Image failed to load at index ${index}:`, productImages[index]);
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  const getImageSrc = (index) => {
    if (imageErrors[index]) {
      return '/placeholder-laptop.png';
    }
    return productImages[index] || '/placeholder-laptop.png';
  };

  const handleAddToCartWithCustomization = () => {
    // Check if there are actual customizations
    const hasActualCustomizations = laptopCustomization.additionalCost > 0;

    if (!hasActualCustomizations) {
      // No customizations, use regular add to cart
      handleAddToCart();
      return;
    }

    // Ensure all prices are numbers
    const basePrice = parseFloat(product.price) || 0;
    const totalPrice = parseFloat(laptopCustomization.totalPrice) || basePrice;
    const customCost = parseFloat(laptopCustomization.additionalCost) || 0;

    const productWithCustomization = {
      ...product,
      customizations: laptopCustomization.customizations,
      originalPrice: basePrice,
      finalPrice: totalPrice,
      customizationCost: customCost,
      hasCustomizations: true,
      displayName: product.name
    };

    console.log('Adding customized product to cart:', productWithCustomization);
    console.log('Base price:', basePrice);
    console.log('Final price:', totalPrice);
    console.log('Customization cost:', customCost);
    console.log('laptopCustomization object:', laptopCustomization);

    // Add to cart with customization
    addToCart(productWithCustomization);
    setQuantity(1);
  };

  const handleAddToCartWithChromebookCustomization = () => {
    // Check if there are actual customizations
    const hasActualCustomizations = chromebookCustomization.additionalCost > 0;

    if (!hasActualCustomizations) {
      // No customizations, use regular add to cart
      handleAddToCart();
      return;
    }

    // Ensure all prices are numbers
    const basePrice = parseFloat(product.price) || 0;
    const totalPrice = parseFloat(chromebookCustomization.totalPrice) || basePrice;
    const customCost = parseFloat(chromebookCustomization.additionalCost) || 0;

    const productWithCustomization = {
      ...product,
      customizations: chromebookCustomization.customizations,
      originalPrice: basePrice,
      finalPrice: totalPrice,
      customizationCost: customCost,
      hasCustomizations: true,
      displayName: product.name
    };

    console.log('Adding customized Chromebook to cart:', productWithCustomization);
    console.log('Base price:', basePrice);
    console.log('Final price:', totalPrice);
    console.log('Customization cost:', customCost);
    console.log('chromebookCustomization object:', chromebookCustomization);

    // Add to cart with customization
    addToCart(productWithCustomization);
    setQuantity(1);
  };

  const discountPercentage = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  // Check if there are any upgrade options available (dynamic options)
  const hasUpgradeOptions = () => {
    // Check if there are dynamic RAM options from generation
    if (availableRAMOptions && availableRAMOptions.length > 0) {
      return true;
    }

    // Check if there are dynamic SSD options from current storage
    if (availableSSDOptions && availableSSDOptions.length > 0) {
      return true;
    }

    // Check if there are custom upgrades
    if (product.custom_upgrades && product.custom_upgrades.length > 0) {
      return true;
    }

    return false;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center text-sm text-gray-600">
            <Link href="/" className="hover:text-[#6dc1c9] transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/products" className="hover:text-[#6dc1c9] transition-colors">Products</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium truncate">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="container mx-auto px-4 py-4 sm:py-6">
        <div className="grid lg:grid-cols-2 gap-4 lg:gap-6">

          {/* Left: Image Gallery */}
          <div>
            <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 sticky top-4">
              {/* Main Image */}
              <div className="relative bg-gray-50 rounded-lg overflow-hidden group mb-3">
                <div className="aspect-square flex items-center justify-center p-4">
                  <Image
                    src={getImageSrc(selectedImage)}
                    alt={product.name || 'Product'}
                    width={800}
                    height={600}
                    className="object-contain w-full h-full cursor-zoom-in transition-transform group-hover:scale-105"
                    onClick={() => setShowImageModal(true)}
                    onError={() => handleImageError(selectedImage)}
                    unoptimized
                    priority
                  />
                </div>
                {/* Zoom Icon */}
                <button
                  onClick={() => setShowImageModal(true)}
                  className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ZoomIn className="w-4 h-4 text-gray-700" />
                </button>

                {/* Discount Badge */}
                {discountPercentage > 0 && (
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full font-bold shadow-lg text-xs">
                    {discountPercentage}% OFF
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {productImages.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {productImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? 'border-[#6dc1c9] ring-2 ring-teal-100 shadow-md'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Image
                        src={getImageSrc(index)}
                        alt={`${product.name} - ${index + 1}`}
                        fill
                        className="object-cover"
                        onError={() => handleImageError(index)}
                        unoptimized
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Product Info */}
          <div>
            <div className="bg-white rounded-xl shadow-sm p-4 space-y-3">
              {/* Brand & Category Badges */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {product.brand && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-[#6dc1c9]/10 text-[#6dc1c9]">
                    {product.brand}
                  </span>
                )}
                {product.category_id && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 capitalize">
                    {product.category_id.replace('-', ' ')}
                  </span>
                )}
                {checkProductAvailability(product).isAvailable ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-600">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
                    In Stock
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Product Title */}
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                {product.name || 'Product Name'}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-xs text-gray-500">5.0 (Reviews)</span>
              </div>

              {/* Price Section */}
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Rs {(
                      product.category_id === 'ram' && ramCustomization.totalPrice > 0
                        ? ramCustomization.totalPrice
                        : (laptopCustomization.totalPrice > 0 ? laptopCustomization.totalPrice : parseInt(product.price))
                    ).toLocaleString()}
                  </span>
                  {product.original_price && (
                    <span className="text-sm text-gray-400 line-through">
                      Rs {parseInt(product.original_price).toLocaleString()}
                    </span>
                  )}
                  {discountPercentage > 0 && (
                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                      Save {discountPercentage}%
                    </span>
                  )}
                </div>
                {laptopCustomization.additionalCost > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Base: Rs {parseInt(product.price).toLocaleString()} + Upgrades: Rs {laptopCustomization.additionalCost.toLocaleString()}
                  </p>
                )}
              </div>

              {/* Key Specifications */}
              {(() => {
                const isAppleProduct = product.brand?.toLowerCase() === 'apple' || product.name?.toLowerCase().includes('macbook');
                const hasAppleSpecs = isAppleProduct && (product.apple_model || product.apple_processor || product.apple_ram || product.apple_storage || product.apple_screen_size || product.apple_display || product.apple_graphics || product.apple_condition);
                const hasRAMSpecs = product.category_id === 'ram' && (product.ram_type || product.ram_capacity || product.ram_speed || product.ram_form_factor);
                const hasChromebookSpecs = product.category_id === 'chromebook' && (product.processor || product.ram || product.storage || product.display_size);
                const hasLaptopSpecs = !isAppleProduct && product.category_id !== 'ram' && product.category_id !== 'chromebook' && (product.processor || product.generation || product.ram || product.hdd || product.display_size || product.screensize || product.graphics);
                const hasAnySpecs = hasAppleSpecs || hasRAMSpecs || hasChromebookSpecs || hasLaptopSpecs;

                if (!hasAnySpecs) return null;

                return (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className={`px-3 py-2 border-b border-gray-200 ${isAppleProduct ? 'bg-gray-800' : 'bg-gray-50'}`}>
                      <h3 className={`font-semibold text-xs flex items-center gap-1.5 ${isAppleProduct ? 'text-white' : 'text-gray-800'}`}>
                        {isAppleProduct && (
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                          </svg>
                        )}
                        Key Specifications
                      </h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {/* Apple MacBook Specifications */}
                      {isAppleProduct ? (
                        <>
                          {(product.apple_model || product.name) && (
                            <div className="flex justify-between px-3 py-2">
                              <span className="text-gray-500 text-xs">Model</span>
                              <span className="font-medium text-gray-900 text-xs">{product.apple_model || (product.name?.toLowerCase().includes('air') ? 'MacBook Air' : 'MacBook Pro')}</span>
                            </div>
                          )}
                          {(product.apple_processor || product.processor) && (
                            <div className="flex justify-between px-3 py-2">
                              <span className="text-gray-500 text-xs">Chip</span>
                              <span className="font-medium text-gray-900 text-xs">{product.apple_processor || product.processor}</span>
                            </div>
                          )}
                          {(product.apple_ram || product.ram) && (
                            <div className="flex justify-between px-3 py-2">
                              <span className="text-gray-500 text-xs">Unified Memory</span>
                              <span className="font-medium text-gray-900 text-xs">{product.apple_ram || product.ram}</span>
                            </div>
                          )}
                          {(appleCustomization.updatedSpecs?.storage || product.apple_storage || product.hdd) && (
                            <div className="flex justify-between px-3 py-2">
                              <span className="text-gray-500 text-xs">SSD Storage</span>
                              <span className="font-medium text-gray-900 text-xs">{appleCustomization.updatedSpecs?.storage || product.apple_storage || product.hdd}</span>
                            </div>
                          )}
                          {(product.apple_screen_size || product.display_size) && (
                            <div className="flex justify-between px-3 py-2">
                              <span className="text-gray-500 text-xs">Display</span>
                              <span className="font-medium text-gray-900 text-xs">{product.apple_screen_size || product.display_size}</span>
                            </div>
                          )}
                          {(product.apple_display || product.resolution) && (
                            <div className="flex justify-between px-3 py-2">
                              <span className="text-gray-500 text-xs">Display Type</span>
                              <span className="font-medium text-gray-900 text-xs">{product.apple_display || product.resolution}</span>
                            </div>
                          )}
                          {(product.apple_condition || product.condition) && (
                            <div className="flex justify-between px-3 py-2">
                              <span className="text-gray-500 text-xs">Condition</span>
                              <span className="font-medium text-gray-900 text-xs">{product.apple_condition || product.condition}</span>
                            </div>
                          )}
                        </>
                      ) : product.category_id === 'ram' ? (
                        <>
                          {product.ram_type && (
                            <div className="flex justify-between px-3 py-2">
                              <span className="text-gray-500 text-xs">Type</span>
                              <span className="font-medium text-gray-900 text-xs">{product.ram_type}</span>
                            </div>
                          )}
                          {product.ram_capacity && (
                            <div className="flex justify-between px-3 py-2">
                              <span className="text-gray-500 text-xs">Capacity</span>
                              <span className="font-medium text-gray-900 text-xs">{product.ram_capacity}</span>
                            </div>
                          )}
                          {product.ram_speed && (
                            <div className="flex justify-between px-3 py-2">
                              <span className="text-gray-500 text-xs">Speed</span>
                              <span className="font-medium text-gray-900 text-xs">{product.ram_speed}</span>
                            </div>
                          )}
                          {product.ram_form_factor && (
                            <div className="flex justify-between px-3 py-2">
                              <span className="text-gray-500 text-xs">Form Factor</span>
                              <span className="font-medium text-gray-900 text-xs">{product.ram_form_factor}</span>
                            </div>
                          )}
                        </>
                      ) : product.category_id === 'chromebook' ? (
                        <>
                          {product.processor && (
                            <div className="flex justify-between px-3 py-2">
                              <span className="text-gray-500 text-xs">Processor</span>
                              <span className="font-medium text-gray-900 text-xs">{product.processor}</span>
                            </div>
                          )}
                          {(chromebookCustomization.updatedSpecs?.ram || product.ram) && (
                            <div className="flex justify-between px-3 py-2">
                              <span className="text-gray-500 text-xs">RAM</span>
                              <span className="font-medium text-gray-900 text-xs">{chromebookCustomization.updatedSpecs?.ram || product.ram}</span>
                            </div>
                          )}
                          {(chromebookCustomization.updatedSpecs?.storage || product.storage) && (
                            <div className="flex justify-between px-3 py-2">
                              <span className="text-gray-500 text-xs">Storage</span>
                              <span className="font-medium text-gray-900 text-xs">{chromebookCustomization.updatedSpecs?.storage || product.storage}</span>
                            </div>
                          )}
                          {product.display_size && (
                            <div className="flex justify-between px-3 py-2">
                              <span className="text-gray-500 text-xs">Display</span>
                              <span className="font-medium text-gray-900 text-xs">{product.display_size}</span>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          {product.processor && (
                            <div className="flex justify-between px-3 py-2">
                              <span className="text-gray-500 text-xs">Processor</span>
                              <span className="font-medium text-gray-900 text-xs">{product.processor}</span>
                            </div>
                          )}
                          {product.generation && (
                            <div className="flex justify-between px-3 py-2">
                              <span className="text-gray-500 text-xs">Generation</span>
                              <span className="font-medium text-gray-900 text-xs">{product.generation}</span>
                            </div>
                          )}
                          {(laptopCustomization.updatedSpecs?.ram || product.ram) && (
                            <div className="flex justify-between px-3 py-2">
                              <span className="text-gray-500 text-xs">RAM</span>
                              <span className="font-medium text-gray-900 text-xs">{laptopCustomization.updatedSpecs?.ram || product.ram}</span>
                            </div>
                          )}
                          {(laptopCustomization.updatedSpecs?.storage || product.hdd) && (
                            <div className="flex justify-between px-3 py-2">
                              <span className="text-gray-500 text-xs">Storage</span>
                              <span className="font-medium text-gray-900 text-xs">{laptopCustomization.updatedSpecs?.storage || product.hdd}</span>
                            </div>
                          )}
                          {(product.display_size || product.screensize) && (
                            <div className="flex justify-between px-3 py-2">
                              <span className="text-gray-500 text-xs">Display</span>
                              <span className="font-medium text-gray-900 text-xs">{product.display_size || product.screensize}</span>
                            </div>
                          )}
                          {product.graphics && (
                            <div className="flex justify-between px-3 py-2">
                              <span className="text-gray-500 text-xs">Graphics</span>
                              <span className="font-medium text-gray-900 text-xs">{product.graphics}</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Laptop Customizer (non-Apple products) */}
              {product.category_id === 'laptop' && product.show_laptop_customizer !== false && (
                <LaptopCustomizer
                  product={product}
                  onCustomizationChange={handleCustomizationChange}
                />
              )}

              {/* Apple MacBook Customizer */}
              {(product.category_id === 'laptop' || product.category_id === 'workstation') &&
               (product.brand?.toLowerCase() === 'apple' || product.name?.toLowerCase().includes('macbook')) &&
               product.show_apple_customizer !== false && (
                <AppleCustomizer
                  product={product}
                  onCustomizationChange={handleAppleCustomizationChange}
                />
              )}

              {/* Chromebook Customizer */}
              {product.category_id === 'chromebook' && product.show_chromebook_customizer !== false && (
                <ChromebookCustomizer
                  product={product}
                  onCustomizationChange={handleChromebookCustomizationChange}
                />
              )}

              {/* RAM Customizer */}
              {product.category_id === 'ram' && product.show_ram_customizer !== false && (
                <RAMCustomizer
                  product={product}
                  onCustomizationChange={handleRAMCustomizationChange}
                />
              )}

              {/* Quantity & Add to Cart */}
              <div className="space-y-3">
                {/* Quantity Selector */}
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-gray-700">Quantity:</span>
                  <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2.5 bg-gray-50 hover:bg-gray-100 transition-colors font-bold text-gray-600 text-lg"
                    >
                      −
                    </button>
                    <span className="px-6 py-2.5 font-bold text-gray-900 min-w-[60px] text-center bg-white text-lg">
                      {quantity}
                    </span>
                    <button
                      onClick={() => {
                        const stockQuantity = product.stock_quantity || 999;
                        if (quantity < stockQuantity) {
                          setQuantity(quantity + 1);
                        }
                      }}
                      className="px-4 py-2.5 bg-gray-50 hover:bg-gray-100 transition-colors font-bold text-gray-600 text-lg"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                {(() => {
                  const { isAvailable } = checkProductAvailability(product);
                  const unitPrice = product.category_id === 'ram' && ramCustomization.totalPrice > 0
                    ? ramCustomization.totalPrice
                    : (laptopCustomization.totalPrice > 0 ? laptopCustomization.totalPrice : parseInt(product.price));
                  const totalPrice = unitPrice * quantity;

                  if (!isAvailable) {
                    return (
                      <button
                        disabled
                        className="w-full bg-gray-300 text-gray-500 px-4 py-3.5 rounded-xl font-bold cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        Out of Stock
                      </button>
                    );
                  }

                  return (
                    <button
                      onClick={() => {
                        const customizations = product.category_id === 'ram'
                          ? ramCustomization
                          : (product.category_id === 'chromebook' ? chromebookCustomization : laptopCustomization);

                        addToCart({
                          ...product,
                          quantity,
                          customizations: customizations.customizations,
                          customizedPrice: unitPrice,
                          updatedSpecs: customizations.updatedSpecs
                        });
                      }}
                      className="w-full bg-[#6dc1c9] hover:bg-teal-600 text-white px-4 py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl text-lg"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart — Rs {totalPrice.toLocaleString()}
                    </button>
                  );
                })()}

                {/* Wishlist & Compare Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist(product)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border font-medium transition-all text-xs ${
                      isInWishlist(product.id)
                        ? 'bg-[#6dc1c9]/10 border-[#6dc1c9] text-[#6dc1c9]'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-[#6dc1c9] hover:text-[#6dc1c9]'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-[#6dc1c9]' : ''}`} />
                    <span>{isInWishlist(product.id) ? 'Wishlisted' : 'Wishlist'}</span>
                  </button>

                  <button
                    onClick={() => addToCompare(product)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border font-medium transition-all text-xs ${
                      isInCompare(product.id)
                        ? 'bg-[#6dc1c9]/10 border-[#6dc1c9] text-[#6dc1c9]'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-[#6dc1c9] hover:text-[#6dc1c9]'
                    }`}
                  >
                    <GitCompare className="w-4 h-4" />
                    <span>{isInCompare(product.id) ? 'Compared' : 'Compare'}</span>
                  </button>
                </div>
              </div>

              {/* Features Bar */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
                <div className="text-center p-2 bg-teal-50/50 rounded-lg">
                  <Truck className="w-4 h-4 text-[#6dc1c9] mx-auto mb-1" />
                  <p className="text-[10px] font-semibold text-gray-700">Fast Delivery</p>
                </div>
                <div className="text-center p-2 bg-blue-50/50 rounded-lg">
                  <Shield className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                  <p className="text-[10px] font-semibold text-gray-700">15 Days Warranty</p>
                </div>
                <div className="text-center p-2 bg-purple-50/50 rounded-lg">
                  <RotateCcw className="w-4 h-4 text-purple-500 mx-auto mb-1" />
                  <p className="text-[10px] font-semibold text-gray-700">Easy Return</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('description')}
                className={`flex-1 px-6 py-4 font-semibold text-sm transition-all relative ${
                  activeTab === 'description'
                    ? 'text-[#6dc1c9] bg-teal-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Description
                {activeTab === 'description' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#6dc1c9]"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab('specification')}
                className={`flex-1 px-6 py-4 font-semibold text-sm transition-all relative ${
                  activeTab === 'specification'
                    ? 'text-[#6dc1c9] bg-teal-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Specifications
                {activeTab === 'specification' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#6dc1c9]"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`flex-1 px-6 py-4 font-semibold text-sm transition-all relative ${
                  activeTab === 'reviews'
                    ? 'text-[#6dc1c9] bg-teal-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Reviews
                {activeTab === 'reviews' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#6dc1c9]"></div>
                )}
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8 lg:p-10">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Product Description</h3>
                {product.description ? (
                  <div className="text-gray-700 leading-relaxed text-base whitespace-pre-line">
                    {product.description}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No description available for this product.</p>
                )}

                {(product.warranty || product.condition) && (
                  <div className="mt-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                    <h4 className="font-bold text-gray-900 mb-4 text-lg">Additional Information</h4>
                    <div className="space-y-2">
                      {product.condition && (
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-[#6dc1c9]" />
                          <p className="text-gray-700">
                            <strong>Condition:</strong> {product.condition}
                          </p>
                        </div>
                      )}
                      {product.warranty && (
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-[#6dc1c9]" />
                          <p className="text-gray-700">
                            <strong>Warranty:</strong> {product.warranty}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'specification' && (
              <div>
                <h3 className="text-2xl font-bold mb-6 text-gray-900">Technical Specifications</h3>

                {/* Basic Information */}
                {(product.brand || product.category_id || product.model || product.condition) && (
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-[#6dc1c9]">Basic Information</h4>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      {product.brand && (
                        <div className="grid grid-cols-2 divide-x divide-gray-200 border-b border-gray-200">
                          <div className="bg-gray-50 px-4 py-3 font-medium text-gray-900 text-sm">Brand</div>
                          <div className="px-4 py-3 text-gray-700 text-sm">{product.brand}</div>
                        </div>
                      )}
                      {product.category_id && (
                        <div className="grid grid-cols-2 divide-x divide-gray-200 border-b border-gray-200">
                          <div className="bg-gray-50 px-4 py-3 font-medium text-gray-900 text-sm">Category</div>
                          <div className="px-4 py-3 text-gray-700 text-sm capitalize">{product.category_id.replace('-', ' ')}</div>
                        </div>
                      )}
                      {product.model && (
                        <div className="grid grid-cols-2 divide-x divide-gray-200 border-b border-gray-200">
                          <div className="bg-gray-50 px-4 py-3 font-medium text-gray-900 text-sm">Model</div>
                          <div className="px-4 py-3 text-gray-700 text-sm">{product.model}</div>
                        </div>
                      )}
                      {product.condition && (
                        <div className="grid grid-cols-2 divide-x divide-gray-200">
                          <div className="bg-gray-50 px-4 py-3 font-medium text-gray-900 text-sm">Condition</div>
                          <div className="px-4 py-3 text-gray-700 text-sm">{product.condition}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* RAM-specific Specifications */}
                {product.category_id === 'ram' && (product.ram_type || product.ram_capacity || product.ram_speed || product.ram_form_factor || product.ram_condition || product.ram_warranty) && (
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-[#6dc1c9]">RAM Specifications</h4>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      {product.ram_type && (
                        <div className="grid grid-cols-2 divide-x divide-gray-200 border-b border-gray-200">
                          <div className="bg-gray-50 px-4 py-3 font-medium text-gray-900 text-sm">Type</div>
                          <div className="px-4 py-3 text-gray-700 text-sm">{product.ram_type}</div>
                        </div>
                      )}
                      {product.ram_capacity && (
                        <div className="grid grid-cols-2 divide-x divide-gray-200 border-b border-gray-200">
                          <div className="bg-gray-50 px-4 py-3 font-medium text-gray-900 text-sm">Capacity</div>
                          <div className="px-4 py-3 text-gray-700 text-sm">{product.ram_capacity}</div>
                        </div>
                      )}
                      {product.ram_speed && (
                        <div className="grid grid-cols-2 divide-x divide-gray-200 border-b border-gray-200">
                          <div className="bg-gray-50 px-4 py-3 font-medium text-gray-900 text-sm">Speed (Frequency)</div>
                          <div className="px-4 py-3 text-gray-700 text-sm">{product.ram_speed}</div>
                        </div>
                      )}
                      {product.ram_form_factor && (
                        <div className="grid grid-cols-2 divide-x divide-gray-200 border-b border-gray-200">
                          <div className="bg-gray-50 px-4 py-3 font-medium text-gray-900 text-sm">Form Factor</div>
                          <div className="px-4 py-3 text-gray-700 text-sm">{product.ram_form_factor}</div>
                        </div>
                      )}
                      {product.ram_condition && (
                        <div className="grid grid-cols-2 divide-x divide-gray-200 border-b border-gray-200">
                          <div className="bg-gray-50 px-4 py-3 font-medium text-gray-900 text-sm">Condition</div>
                          <div className="px-4 py-3 text-gray-700 text-sm">{product.ram_condition}</div>
                        </div>
                      )}
                      {product.ram_warranty && (
                        <div className="grid grid-cols-2 divide-x divide-gray-200">
                          <div className="bg-gray-50 px-4 py-3 font-medium text-gray-900 text-sm">Warranty</div>
                          <div className="px-4 py-3 text-gray-700 text-sm">{product.ram_warranty}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Apple MacBook Specifications */}
                {(product.brand?.toLowerCase() === 'apple' || product.name?.toLowerCase().includes('macbook')) &&
                 (product.apple_model || product.apple_processor || product.apple_ram || product.apple_storage || product.apple_screen_size || product.apple_display || product.apple_graphics || product.apple_condition) && (
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-gray-800 flex items-center gap-2">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                      </svg>
                      Apple MacBook Specifications
                    </h4>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      {product.apple_model && (
                        <div className="grid grid-cols-2 divide-x divide-gray-200 border-b border-gray-200">
                          <div className="bg-gray-50 px-4 py-3 font-medium text-gray-900 text-sm">Model</div>
                          <div className="px-4 py-3 text-gray-700 text-sm">{product.apple_model}</div>
                        </div>
                      )}
                      {product.apple_processor && (
                        <div className="grid grid-cols-2 divide-x divide-gray-200 border-b border-gray-200">
                          <div className="bg-gray-50 px-4 py-3 font-medium text-gray-900 text-sm">Apple Processor</div>
                          <div className="px-4 py-3 text-gray-700 text-sm">{product.apple_processor}</div>
                        </div>
                      )}
                      {product.apple_ram && (
                        <div className="grid grid-cols-2 divide-x divide-gray-200 border-b border-gray-200">
                          <div className="bg-gray-50 px-4 py-3 font-medium text-gray-900 text-sm">Unified Memory</div>
                          <div className="px-4 py-3 text-gray-700 text-sm">{product.apple_ram}</div>
                        </div>
                      )}
                      {product.apple_storage && (
                        <div className="grid grid-cols-2 divide-x divide-gray-200 border-b border-gray-200">
                          <div className="bg-gray-50 px-4 py-3 font-medium text-gray-900 text-sm">SSD Storage</div>
                          <div className="px-4 py-3 text-gray-700 text-sm">{product.apple_storage}</div>
                        </div>
                      )}
                      {product.apple_screen_size && (
                        <div className="grid grid-cols-2 divide-x divide-gray-200 border-b border-gray-200">
                          <div className="bg-gray-50 px-4 py-3 font-medium text-gray-900 text-sm">Screen Size</div>
                          <div className="px-4 py-3 text-gray-700 text-sm">{product.apple_screen_size}</div>
                        </div>
                      )}
                      {product.apple_display && (
                        <div className="grid grid-cols-2 divide-x divide-gray-200 border-b border-gray-200">
                          <div className="bg-gray-50 px-4 py-3 font-medium text-gray-900 text-sm">Display Type</div>
                          <div className="px-4 py-3 text-gray-700 text-sm">{product.apple_display}</div>
                        </div>
                      )}
                      {product.apple_graphics && (
                        <div className="grid grid-cols-2 divide-x divide-gray-200 border-b border-gray-200">
                          <div className="bg-gray-50 px-4 py-3 font-medium text-gray-900 text-sm">Graphics</div>
                          <div className="px-4 py-3 text-gray-700 text-sm">{product.apple_graphics}</div>
                        </div>
                      )}
                      {product.apple_condition && (
                        <div className="grid grid-cols-2 divide-x divide-gray-200">
                          <div className="bg-gray-50 px-4 py-3 font-medium text-gray-900 text-sm">Condition</div>
                          <div className="px-4 py-3 text-gray-700 text-sm">{product.apple_condition}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Performance Specifications (for Laptop) */}
                {product.category_id !== 'ram' && (product.processor || product.generation || product.ram || product.hdd) && (
                  <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-[#6dc1c9]">Performance</h4>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    {product.processor && (
                      <div className="grid grid-cols-2 divide-x divide-gray-200 border-b border-gray-200">
                        <div className="bg-gray-50 px-4 py-3 font-medium text-gray-900 text-sm">Processor</div>
                        <div className="px-4 py-3 text-gray-700 text-sm">{product.processor}</div>
                      </div>
                    )}
                    {product.generation && (
                      <div className="grid grid-cols-2 divide-x divide-gray-200 border-b border-gray-200">
                        <div className="bg-gray-50 px-4 py-3 font-medium text-gray-900 text-sm">Generation</div>
                        <div className="px-4 py-3 text-gray-700 text-sm">{product.generation}</div>
                      </div>
                    )}
                    {product.ram && (
                      <div className="grid grid-cols-2 divide-x divide-gray-200 border-b border-gray-200">
                        <div className="bg-gray-50 px-4 py-3 font-medium text-gray-900 text-sm">RAM</div>
                        <div className="px-4 py-3 text-gray-700 text-sm">{product.ram}</div>
                      </div>
                    )}
                    {product.hdd && (
                      <div className="grid grid-cols-2 divide-x divide-gray-200">
                        <div className="bg-gray-50 px-4 py-3 font-medium text-gray-900 text-sm">Storage</div>
                        <div className="px-4 py-3 text-gray-700 text-sm">{product.hdd}</div>
                      </div>
                    )}
                  </div>
                </div>
                )}

                {/* Display & Graphics (for Laptop) */}
                {product.category_id !== 'ram' && (product.display_size || product.screensize || product.resolution || product.integrated_graphics || product.discrete_graphics || product.graphics || product.touch_type) && (
                  <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-[#6dc1c9]">Display & Graphics</h4>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    {(product.display_size || product.screensize) && (
                      <div className="grid grid-cols-2 divide-x divide-gray-200 border-b border-gray-200">
                        <div className="bg-gray-50 px-4 py-3 font-medium text-gray-900 text-sm">Display Size</div>
                        <div className="px-4 py-3 text-gray-700 text-sm">{product.display_size || product.screensize}</div>
                      </div>
                    )}
                    {product.resolution && (
                      <div className="grid grid-cols-2 divide-x divide-gray-200 border-b border-gray-200">
                        <div className="bg-gray-50 px-4 py-3 font-medium text-gray-900 text-sm">Resolution</div>
                        <div className="px-4 py-3 text-gray-700 text-sm">{product.resolution}</div>
                      </div>
                    )}
                    {product.integrated_graphics && (
                      <div className="grid grid-cols-2 divide-x divide-gray-200 border-b border-gray-200">
                        <div className="bg-gray-50 px-4 py-3 font-medium text-gray-900 text-sm">Integrated Graphics</div>
                        <div className="px-4 py-3 text-gray-700 text-sm">{product.integrated_graphics}</div>
                      </div>
                    )}
                    {product.discrete_graphics && (
                      <div className="grid grid-cols-2 divide-x divide-gray-200 border-b border-gray-200">
                        <div className="bg-gray-50 px-4 py-3 font-medium text-gray-900 text-sm">Discrete Graphics</div>
                        <div className="px-4 py-3 text-gray-700 text-sm">{product.discrete_graphics}</div>
                      </div>
                    )}
                    {product.graphics && (
                      <div className="grid grid-cols-2 divide-x divide-gray-200 border-b border-gray-200">
                        <div className="bg-gray-50 px-4 py-3 font-medium text-gray-900 text-sm">Graphics</div>
                        <div className="px-4 py-3 text-gray-700 text-sm">{product.graphics}</div>
                      </div>
                    )}
                    {product.touch_type && (
                      <div className="grid grid-cols-2 divide-x divide-gray-200">
                        <div className="bg-gray-50 px-4 py-3 font-medium text-gray-900 text-sm">Touch Type</div>
                        <div className="px-4 py-3 text-gray-700 text-sm">{product.touch_type}</div>
                      </div>
                    )}
                  </div>
                </div>
                )}

                {/* Features & Connectivity (for Laptop) */}
                {product.category_id !== 'ram' && (product.operating_features || product.extra_features) && (
                  <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-[#6dc1c9]">Features & Connectivity</h4>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    {product.operating_features && (
                      <div className="grid grid-cols-2 divide-x divide-gray-200 border-b border-gray-200">
                        <div className="bg-gray-50 px-4 py-3 font-medium text-gray-900 text-sm">Operating Features</div>
                        <div className="px-4 py-3 text-gray-700 text-sm">{product.operating_features}</div>
                      </div>
                    )}
                    {product.extra_features && (
                      <div className="grid grid-cols-2 divide-x divide-gray-200">
                        <div className="bg-gray-50 px-4 py-3 font-medium text-gray-900 text-sm">Extra Features</div>
                        <div className="px-4 py-3 text-gray-700 text-sm">{product.extra_features}</div>
                      </div>
                    )}
                  </div>
                </div>
                )}

                {/* Power & Battery (for Laptop) */}
                {product.category_id !== 'ram' && (product.battery || product.charger_included !== undefined) && (
                  <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-[#6dc1c9]">Power & Battery</h4>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    {product.battery && (
                      <div className="grid grid-cols-2 divide-x divide-gray-200 border-b border-gray-200">
                        <div className="bg-gray-50 px-4 py-3 font-medium text-gray-900 text-sm">Battery</div>
                        <div className="px-4 py-3 text-gray-700 text-sm">{product.battery}</div>
                      </div>
                    )}
                    {product.charger_included !== undefined && (
                      <div className="grid grid-cols-2 divide-x divide-gray-200">
                        <div className="bg-gray-50 px-4 py-3 font-medium text-gray-900 text-sm">Charger Included</div>
                        <div className="px-4 py-3 text-gray-700 text-sm">{product.charger_included ? 'Yes' : 'No'}</div>
                      </div>
                    )}
                  </div>
                </div>
                )}

                {/* Warranty & Support */}
                {(product.warranty || product.warranty_period) && (
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-[#6dc1c9]">Warranty & Support</h4>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      {product.warranty && (
                        <div className="grid grid-cols-2 divide-x divide-gray-200 border-b border-gray-200">
                          <div className="bg-gray-50 px-4 py-3 font-medium text-gray-900 text-sm">Warranty</div>
                          <div className="px-4 py-3 text-gray-700 text-sm">{product.warranty}</div>
                        </div>
                      )}
                      {product.warranty_period && (
                        <div className="grid grid-cols-2 divide-x divide-gray-200">
                          <div className="bg-gray-50 px-4 py-3 font-medium text-gray-900 text-sm">Warranty Period</div>
                          <div className="px-4 py-3 text-gray-700 text-sm">{product.warranty_period} months</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Product Details */}
                {(product.sku || product.weight) && (
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-[#6dc1c9]">Product Details</h4>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      {product.sku && (
                        <div className="grid grid-cols-2 divide-x divide-gray-200 border-b border-gray-200">
                          <div className="bg-gray-50 px-4 py-3 font-medium text-gray-900 text-sm">SKU</div>
                          <div className="px-4 py-3 text-gray-700 text-sm font-mono">{product.sku}</div>
                        </div>
                      )}
                      {product.weight && (
                        <div className="grid grid-cols-2 divide-x divide-gray-200">
                          <div className="bg-gray-50 px-4 py-3 font-medium text-gray-900 text-sm">Weight</div>
                          <div className="px-4 py-3 text-gray-700 text-sm">{product.weight} kg</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Pricing Information */}
                {(product.price || product.sale_price) && (
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-[#6dc1c9]">Pricing</h4>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      {product.price && (
                        <div className="grid grid-cols-2 divide-x divide-gray-200 border-b border-gray-200">
                          <div className="bg-gray-50 px-4 py-3 font-medium text-gray-900 text-sm">Current Price</div>
                          <div className="px-4 py-3 text-gray-700 text-sm font-semibold">Rs. {product.price.toLocaleString()}</div>
                        </div>
                      )}
                      {product.sale_price && (
                        <div className="grid grid-cols-2 divide-x divide-gray-200">
                          <div className="bg-gray-50 px-4 py-3 font-medium text-gray-900 text-sm">Sale Price</div>
                          <div className="px-4 py-3 text-gray-700 text-sm font-semibold">Rs. {product.sale_price.toLocaleString()}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Additional Information */}
                {(product.tags && product.tags.length > 0) && (
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-[#6dc1c9]">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-[#6dc1c9] bg-opacity-10 text-[#6dc1c9] rounded-full text-sm font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <ReviewSection productId={product.id} />
            )}
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-8 bg-gradient-to-r from-[#6dc1c9] to-blue-600 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-8 lg:p-10 text-white">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold mb-2">Have Questions? Contact Mohit Computers</h3>
              <p className="text-teal-100 mb-6">Our team is here to help you find the perfect laptop</p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-teal-100">Call us</p>
                    <p className="font-semibold">0336 8900349</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-teal-100">Email us</p>
                    <p className="font-semibold">info@mohitcomputers.pk</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-teal-100">Visit us</p>
                    <p className="font-semibold text-sm">Suite 316-B, Regal Trade Square, Saddar, Karachi</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-sm p-8 lg:p-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">You May Also Like</h2>
              <Link href="/products" className="text-[#6dc1c9] hover:text-teal-700 font-semibold text-sm">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={() => setShowImageModal(false)}
            className="absolute top-4 right-4 text-white hover:bg-white/10 p-2 rounded-full transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
          <div className="relative max-w-6xl w-full h-full flex items-center justify-center">
            <Image
              src={getImageSrc(selectedImage)}
              alt={product.name}
              width={1200}
              height={1200}
              className="object-contain max-h-full max-w-full"
              onError={() => handleImageError(selectedImage)}
              unoptimized
            />
          </div>
          {productImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {productImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    selectedImage === index ? 'bg-white w-8' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
