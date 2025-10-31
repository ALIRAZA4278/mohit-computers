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
import RAMCustomizer from '../../../components/RAMCustomizer';
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

  // Calculate available RAM options based on processor generation
  useEffect(() => {
    if (product?.generation && product?.category_id === 'laptop') {
      const ramOptions = getRAMOptionsByGeneration(product.generation);
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
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 p-4 sm:p-6 lg:p-10">
            {/* Left: Image Gallery */}
            <div className="space-y-3 sm:space-y-4">
              {/* Main Image */}
              <div className="relative bg-gray-50 rounded-xl overflow-hidden group">
                <div className="aspect-square flex items-center justify-center p-4 sm:p-8">
                  <Image
                    src={getImageSrc(selectedImage)}
                    alt={product.name || 'Product'}
                    width={600}
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
                  className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white/90 backdrop-blur-sm p-1.5 sm:p-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                </button>

                {/* Discount Badge */}
                {discountPercentage > 0 && (
                  <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-full font-bold shadow-lg text-xs sm:text-sm">
                    {discountPercentage}% OFF
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {productImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                  {productImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? 'border-teal-500 ring-2 ring-teal-200 shadow-md'
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

            {/* Right: Product Info */}
            <div className="space-y-4 sm:space-y-6">
              {/* Brand & Category */}
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                {product.brand && (
                  <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                    {product.brand}
                  </span>
                )}
                {product.category_id && (
                  <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 capitalize">
                    {product.category_id.replace('-', ' ')}
                  </span>
                )}
              </div>

              {/* Product Title */}
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-2 sm:mb-3">
                  {product.name || 'Product Name'}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600 font-medium">(5.0 Rating)</span>
                  <span className="text-xs sm:text-sm text-gray-400">•</span>
                  <span className={`text-xs sm:text-sm font-medium ${checkProductAvailability(product).isAvailable ? 'text-[#6dc1c9]' : 'text-red-500'}`}>
                    {checkProductAvailability(product).isAvailable ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>

              {/* Price Section */}
              <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl p-4 sm:p-6 border border-teal-100">
                <div className="flex items-baseline gap-2 sm:gap-3 mb-2 flex-wrap">
                  <span className="text-2xl sm:text-4xl font-bold text-gray-900">
                    Rs {(
                      product.category_id === 'ram' && ramCustomization.totalPrice > 0
                        ? ramCustomization.totalPrice
                        : (laptopCustomization.totalPrice > 0 ? laptopCustomization.totalPrice : parseInt(product.price))
                    ).toLocaleString()}
                  </span>
                  {product.original_price && (
                    <span className="text-lg sm:text-xl text-gray-500 line-through">
                      Rs {parseInt(product.original_price).toLocaleString()}
                    </span>
                  )}
                  {laptopCustomization.additionalCost > 0 && (
                    <span className="text-sm bg-teal-100 text-teal-700 px-2 py-1 rounded-full">
                      Rs {laptopCustomization.additionalCost.toLocaleString()} upgrades
                    </span>
                  )}
                  {product.category_id === 'ram' && ramCustomization.additionalCost > 0 && (
                    <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      +Rs {ramCustomization.additionalCost.toLocaleString()}
                    </span>
                  )}
                </div>
                {discountPercentage > 0 && (
                  <p className="text-xs sm:text-sm text-green-600 font-medium">
                    You save Rs {(product.original_price - product.price).toLocaleString()} ({discountPercentage}% off)
                  </p>
                )}
                {laptopCustomization.additionalCost > 0 && (
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    Base price: Rs {parseInt(product.price).toLocaleString()} | Upgrades: Rs {laptopCustomization.additionalCost.toLocaleString()}
                  </p>
                )}
                {product.category_id === 'ram' && ramCustomization.specs && (
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    Selected: {ramCustomization.specs.brand} • {ramCustomization.specs.speed}
                  </p>
                )}
              </div>

              {/* Key Specifications */}
              {product.category_id === 'ram' ? (
                // RAM-specific Key Specifications
                (product.ram_type || product.ram_capacity || product.ram_speed || product.ram_form_factor) && (
                  <div className="bg-gray-50 rounded-xl p-5 space-y-3">
                    <h3 className="font-semibold text-gray-900 mb-3">Key Specifications</h3>
                    <div className="grid grid-cols-1 gap-3">
                      {product.ram_type && (
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-[#6dc1c9] mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="text-sm font-medium text-gray-900">Type: </span>
                            <span className="text-sm text-gray-700">{product.ram_type}</span>
                          </div>
                        </div>
                      )}
                      {product.ram_capacity && (
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-[#6dc1c9] mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="text-sm font-medium text-gray-900">Capacity: </span>
                            <span className="text-sm text-gray-700">{product.ram_capacity}</span>
                          </div>
                        </div>
                      )}
                      {product.ram_speed && (
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-[#6dc1c9] mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="text-sm font-medium text-gray-900">Speed: </span>
                            <span className="text-sm text-gray-700">{product.ram_speed}</span>
                          </div>
                        </div>
                      )}
                      {product.ram_form_factor && (
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-[#6dc1c9] mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="text-sm font-medium text-gray-900">Form Factor: </span>
                            <span className="text-sm text-gray-700">{product.ram_form_factor}</span>
                          </div>
                        </div>
                      )}
                      {product.ram_condition && (
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-[#6dc1c9] mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="text-sm font-medium text-gray-900">Condition: </span>
                            <span className="text-sm text-gray-700">{product.ram_condition}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              ) : (
                // Laptop-specific Key Specifications
                (product.processor || product.ram || product.hdd || product.generation || product.display_size || product.screensize) && (
                  <div className="bg-gray-50 rounded-xl p-5 space-y-3">
                    <h3 className="font-semibold text-gray-900 mb-3">Key Specifications</h3>
                    <div className="grid grid-cols-1 gap-3">
                      {product.processor && (
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-[#6dc1c9] mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="text-sm font-medium text-gray-900">Processor: </span>
                            <span className="text-sm text-gray-700">{product.processor}</span>
                          </div>
                        </div>
                      )}
                      {product.generation && (
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-[#6dc1c9] mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="text-sm font-medium text-gray-900">Generation: </span>
                            <span className="text-sm text-gray-700">{product.generation}</span>
                          </div>
                        </div>
                      )}
                      {product.ram && (
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-[#6dc1c9] mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="text-sm font-medium text-gray-900">RAM: </span>
                            <span className="text-sm text-gray-700">
                              {laptopCustomization.updatedSpecs?.ram || product.ram}
                            </span>
                            {laptopCustomization.customizations.ramUpgrade && (
                              <span className="ml-2 text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full">
                                Upgraded
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      {product.hdd && (
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-[#6dc1c9] mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="text-sm font-medium text-gray-900">Storage: </span>
                            <span className="text-sm text-gray-700">
                              {laptopCustomization.updatedSpecs?.storage || product.hdd}
                            </span>
                            {laptopCustomization.customizations.ssdUpgrade && (
                              <span className="ml-2 text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full">
                                Upgraded
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      {(product.display_size || product.screensize) && (
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-[#6dc1c9] mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="text-sm font-medium text-gray-900">Display Size: </span>
                            <span className="text-sm text-gray-700">{product.display_size || product.screensize}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              )}

              {/* Laptop Customizer - New customizer component (if enabled in admin) */}
              {product.category_id === 'laptop' && product.show_laptop_customizer !== false && (
                <div className="mt-6">
                  <LaptopCustomizer
                    product={product}
                    onCustomizationChange={handleCustomizationChange}
                  />
                </div>
              )}

              {/* RAM Customizer - For RAM products (if enabled in admin) */}
              {product.category_id === 'ram' && product.show_ram_customizer !== false && (
                <div className="mt-6">
                  <RAMCustomizer
                    product={product}
                    onCustomizationChange={handleRAMCustomizationChange}
                  />
                </div>
              )}

              {/* Old customization section removed - using LaptopCustomizer component instead */}
              {false && (
                <div className="bg-white border-2 border-gray-200 rounded-xl p-5 space-y-5">
                  <h3 className="font-bold text-gray-900 text-lg">Customize Your Laptop</h3>

                  {/* Dynamic SSD Storage Options */}
                  {availableSSDOptions && availableSSDOptions.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">SSD Storage Upgrade</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {availableSSDOptions.map((ssdOption, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedStorage(
                              selectedStorage?.capacity === ssdOption.capacity ? null : ssdOption
                            )}
                            className={`border-2 rounded-lg p-4 text-left transition-all ${
                              selectedStorage?.capacity === ssdOption.capacity
                                ? 'border-[#6dc1c9] bg-teal-50'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-semibold text-gray-900">{ssdOption.capacity} SSD</div>
                                <div className="text-sm text-gray-600">+Rs {ssdOption.price.toLocaleString()}</div>
                              </div>
                              <div className={`w-5 h-5 rounded-full border-2 ${
                                selectedStorage?.capacity === ssdOption.capacity
                                  ? 'border-[#6dc1c9] bg-[#6dc1c9]'
                                  : 'border-gray-300'
                              }`}>
                                {selectedStorage?.capacity === ssdOption.capacity && (
                                  <CheckCircle className="w-4 h-4 text-white" />
                                )}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dynamic Memory (RAM) Options */}
                  {availableRAMOptions && availableRAMOptions.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">Memory (RAM) Upgrade</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {availableRAMOptions.map((ramOption, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedMemory(
                              selectedMemory?.label === ramOption.label ? null : ramOption
                            )}
                            className={`border-2 rounded-lg p-4 text-left transition-all ${
                              selectedMemory?.label === ramOption.label
                                ? 'border-[#6dc1c9] bg-teal-50'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-semibold text-gray-900">{ramOption.label}</div>
                                <div className="text-sm text-gray-600">+Rs {ramOption.price.toLocaleString()}</div>
                              </div>
                              <div className={`w-5 h-5 rounded-full border-2 ${
                                selectedMemory?.label === ramOption.label
                                  ? 'border-[#6dc1c9] bg-[#6dc1c9]'
                                  : 'border-gray-300'
                              }`}>
                                {selectedMemory?.label === ramOption.label && (
                                  <CheckCircle className="w-4 h-4 text-white" />
                                )}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Custom Upgrade Options */}
                  {product.custom_upgrades && product.custom_upgrades.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">Additional Options</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {product.custom_upgrades.map((upgrade, index) => {
                          const isStorage = upgrade.type === 'storage';
                          const isSelected = isStorage
                            ? selectedStorage?.customIndex === index
                            : selectedMemory?.customIndex === index;

                          return (
                            <button
                              key={index}
                              onClick={() => {
                                if (isStorage) {
                                  setSelectedStorage(
                                    isSelected ? null : { ...upgrade, customIndex: index, id: `custom-storage-${index}` }
                                  );
                                } else {
                                  setSelectedMemory(
                                    isSelected ? null : { ...upgrade, customIndex: index, id: `custom-memory-${index}` }
                                  );
                                }
                              }}
                              className={`border-2 rounded-lg p-4 text-left transition-all ${
                                isSelected
                                  ? 'border-[#6dc1c9] bg-teal-50'
                                  : 'border-gray-300 hover:border-gray-400'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-semibold text-gray-900">
                                    {upgrade.label && `${upgrade.label} - `}{upgrade.capacity}
                                  </div>
                                  <div className="text-xs text-gray-500 capitalize">{upgrade.type}</div>
                                  <div className="text-sm text-gray-600 mt-1">+Rs {parseInt(upgrade.price).toLocaleString()}</div>
                                </div>
                                <div className={`w-5 h-5 rounded-full border-2 ${
                                  isSelected
                                    ? 'border-[#6dc1c9] bg-[#6dc1c9]'
                                    : 'border-gray-300'
                                }`}>
                                  {isSelected && (
                                    <CheckCircle className="w-4 h-4 text-white" />
                                  )}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Total Price with Upgrades */}
                  {customUpgradePrice > 0 && (
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between text-lg font-bold">
                        <span className="text-gray-900">Total Price:</span>
                        <span className="text-[#6dc1c9]">
                          Rs {(parseInt(product.price) + customUpgradePrice).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Base price: Rs {parseInt(product.price).toLocaleString()} +
                        Upgrades: Rs {customUpgradePrice.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Quantity & Actions */}
              <div className="space-y-4">
                {/* Quantity Selector */}
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-700">Quantity:</span>
                  <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 bg-gray-50 hover:bg-gray-100 transition-colors font-semibold text-gray-700"
                    >
                      -
                    </button>
                    <span className="px-6 py-2 font-semibold text-gray-900 min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => {
                        const stockQuantity = product.stock_quantity || 0;
                        if (quantity < stockQuantity) {
                          setQuantity(quantity + 1);
                        }
                      }}
                      disabled={quantity >= (product.stock_quantity || 0)}
                      className="px-4 py-2 bg-gray-50 hover:bg-gray-100 transition-colors font-semibold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {(() => {
                    const { isAvailable } = checkProductAvailability(product);

                    if (!isAvailable) {
                      return (
                        <button
                          disabled
                          className="flex-1 bg-gray-400 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                          Out of Stock
                        </button>
                      );
                    }
                    
                    return (
                      <button
                        onClick={product.category_id === 'laptop' ? handleAddToCartWithCustomization : handleAddToCart}
                        className="flex-1 bg-gradient-to-r from-[#6dc1c9] to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="hidden sm:inline">
                          {product.category_id === 'laptop' && (laptopCustomization.additionalCost > 0) 
                            ? `Add to Cart (Rs:${laptopCustomization.totalPrice?.toLocaleString()})` 
                            : 'Add to Cart'
                          }
                        </span>
                        <span className="sm:hidden">Add to Cart</span>
                      </button>
                    );
                  })()}
                  
                  {/* Wishlist and Compare buttons row for mobile */}
                  <div className="flex gap-3 sm:contents">
                    <button
                      onClick={handleWishlist}
                      className={`flex-1 sm:flex-none px-4 sm:px-6 py-3 sm:py-4 rounded-xl font-semibold transition-all border-2 flex items-center justify-center gap-2 ${
                        isInWishlist(product.id)
                          ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-red-300 hover:bg-red-50'
                      }`}
                    >
                      <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                      <span className="text-sm sm:hidden">Wishlist</span>
                    </button>
                    <button
                      onClick={handleCompare}
                      className={`flex-1 sm:flex-none px-4 sm:px-6 py-3 sm:py-4 rounded-xl font-semibold transition-all border-2 flex items-center justify-center gap-2 ${
                        isInCompare(product.id)
                          ? 'bg-blue-50 border-blue-200 text-blue-600'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      <GitCompare className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-sm sm:hidden">Compare</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-4 sm:pt-6 border-t">
                <div className="text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-[#6dc1c9]" />
                  </div>
                  <p className="text-xs font-medium text-gray-900">Fast Delivery</p>
                  <p className="text-xs text-gray-500">Within 2-3 days</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                  <p className="text-xs font-medium text-gray-900">Warranty</p>
                  <p className="text-xs text-gray-500">{product.warranty || '6 Months'}</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                  </div>
                  <p className="text-xs font-medium text-gray-900">Easy Return</p>
                  <p className="text-xs text-gray-500">3 Days policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm overflow-hidden">
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

                {/* RAM-specific Specifications */}
                {product.category_id === 'ram' && (
                  <>
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
                  </>
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

                {/* Product Details */}
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
                      <div className="grid grid-cols-2 divide-x divide-gray-200 border-b border-gray-200">
                        <div className="bg-gray-50 px-4 py-3 font-medium text-gray-900 text-sm">Weight</div>
                        <div className="px-4 py-3 text-gray-700 text-sm">{product.weight} kg</div>
                      </div>
                    )}
                    <div className="grid grid-cols-2 divide-x divide-gray-200 border-b border-gray-200">
                      <div className="bg-gray-50 px-4 py-3 font-medium text-gray-900 text-sm">Availability</div>
                      <div className="px-4 py-3 text-gray-700 text-sm">
                        {checkProductAvailability(product).isAvailable ? 'In Stock' : 'Out of Stock'}
                      </div>
                    </div>
                    {product.is_featured !== undefined && (
                      <div className="grid grid-cols-2 divide-x divide-gray-200">
                        <div className="bg-gray-50 px-4 py-3 font-medium text-gray-900 text-sm">Featured Product</div>
                        <div className="px-4 py-3 text-gray-700 text-sm">{product.is_featured ? 'Yes' : 'No'}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pricing Information */}
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
