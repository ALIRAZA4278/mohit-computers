'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Heart, ShoppingCart, GitCompare, Truck, Shield, RotateCcw, CheckCircle, Phone, Mail, MapPin, ZoomIn, X } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';
import { useCompare } from '../../../context/CompareContext';
import ProductCard from '../../../components/ProductCard';
import ReviewSection from '../../../components/ReviewSection';

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

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCompare, isInCompare } = useCompare();

  useEffect(() => {
    if (params.id) {
      fetchProduct();
    }
  }, [params.id]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const productImages = product.images
    ? (typeof product.images === 'string' ? JSON.parse(product.images) : product.images)
    : product.featured_image
    ? [product.featured_image]
    : ['/placeholder-laptop.png'];

  const handleAddToCart = () => {
    // Check stock availability - with fallback for existing products
    // Set defaults based on category and product name
    const category = product.category_id || product.category;
    const categoryLower = typeof category === 'string' ? category.toLowerCase() : '';
    const productNameLower = typeof product.name === 'string' ? product.name.toLowerCase() : '';
    const isAccessoryCategory = ['accessories', 'ram', 'ssd', 'chromebook', 'accessory'].some(cat => 
      categoryLower.includes(cat) || productNameLower.includes(cat)
    );
    
    const stockQuantity = product.stock_quantity !== undefined ? product.stock_quantity : (isAccessoryCategory ? 0 : 999);
    const inStock = product.in_stock !== undefined ? product.in_stock : (product.inStock !== undefined ? product.inStock : !isAccessoryCategory);
    const isActive = product.is_active !== undefined ? product.is_active : product.inStock !== false;
    const isAvailableForPurchase = isActive && inStock && stockQuantity > 0;
    
    if (!isAvailableForPurchase) {
      alert('Sorry, this product is currently out of stock.');
      return;
    }
    
    if (quantity > stockQuantity) {
      alert(`Sorry, only ${stockQuantity} items are available in stock.`);
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

  const discountPercentage = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

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
                    src={productImages[selectedImage]}
                    alt={product.name || 'Product'}
                    width={600}
                    height={600}
                    className="object-contain w-full h-full cursor-zoom-in transition-transform group-hover:scale-105"
                    onClick={() => setShowImageModal(true)}
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
                        src={img}
                        alt={`${product.name} - ${index + 1}`}
                        fill
                        className="object-cover"
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
                  <span className="text-xs sm:text-sm text-[#6dc1c9] font-medium">In Stock</span>
                </div>
              </div>

              {/* Price Section */}
              <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl p-4 sm:p-6 border border-teal-100">
                <div className="flex items-baseline gap-2 sm:gap-3 mb-2 flex-wrap">
                  <span className="text-2xl sm:text-4xl font-bold text-gray-900">
                    Rs {parseInt(product.price).toLocaleString()}
                  </span>
                  {product.original_price && (
                    <span className="text-lg sm:text-xl text-gray-500 line-through">
                      Rs {parseInt(product.original_price).toLocaleString()}
                    </span>
                  )}
                </div>
                {discountPercentage > 0 && (
                  <p className="text-xs sm:text-sm text-green-600 font-medium">
                    You save Rs {(product.original_price - product.price).toLocaleString()} ({discountPercentage}% off)
                  </p>
                )}
              </div>

              {/* Key Specifications */}
              {(product.processor || product.ram || product.hdd || product.generation || product.display_size || product.screensize) && (
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
                          <span className="text-sm text-gray-700">{product.ram}</span>
                        </div>
                      </div>
                    )}
                    {product.hdd && (
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-[#6dc1c9] mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="text-sm font-medium text-gray-900">Storage: </span>
                          <span className="text-sm text-gray-700">{product.hdd}</span>
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
              )}

              {/* Stock Availability */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {(() => {
                      const category = product.category_id || product.category;
                      const categoryLower = typeof category === 'string' ? category.toLowerCase() : '';
                      const productNameLower = typeof product.name === 'string' ? product.name.toLowerCase() : '';
                      const isAccessoryCategory = ['accessories', 'ram', 'ssd', 'chromebook', 'accessory'].some(cat => 
                        categoryLower.includes(cat) || productNameLower.includes(cat)
                      );
                      
                      const stockQuantity = product.stock_quantity !== undefined ? product.stock_quantity : (isAccessoryCategory ? 0 : 999);
                      const inStock = product.in_stock !== undefined ? product.in_stock : (product.inStock !== undefined ? product.inStock : !isAccessoryCategory);
                      const isActive = product.is_active !== undefined ? product.is_active : product.inStock !== false;
                      const isAvailableForPurchase = isActive && inStock && stockQuantity > 0;
                      
                      if (!isAvailableForPurchase) {
                        return (
                          <>
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span className="text-red-700 font-semibold">Out of Stock</span>
                          </>
                        );
                      } else if (stockQuantity <= 5) {
                        return (
                          <>
                            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                            <span className="text-orange-700 font-semibold">Limited Stock</span>
                          </>
                        );
                      } else {
                        return (
                          <>
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-green-700 font-semibold">In Stock</span>
                          </>
                        );
                      }
                    })()}
                  </div>
                 
                </div>
              </div>

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
                    const category = product.category_id || product.category;
                    const categoryLower = typeof category === 'string' ? category.toLowerCase() : '';
                    const productNameLower = typeof product.name === 'string' ? product.name.toLowerCase() : '';
                    const isAccessoryCategory = ['accessories', 'ram', 'ssd', 'chromebook', 'accessory'].some(cat => 
                      categoryLower.includes(cat) || productNameLower.includes(cat)
                    );
                    
                    const stockQuantity = product.stock_quantity !== undefined ? product.stock_quantity : (isAccessoryCategory ? 0 : 999);
                    const inStock = product.in_stock !== undefined ? product.in_stock : (product.inStock !== undefined ? product.inStock : !isAccessoryCategory);
                    const isActive = product.is_active !== undefined ? product.is_active : product.inStock !== false;
                    const isAvailableForPurchase = isActive && inStock && stockQuantity > 0;
                    
                    if (!isAvailableForPurchase) {
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
                        onClick={handleAddToCart}
                        className="flex-1 bg-gradient-to-r from-[#6dc1c9] to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="hidden sm:inline">Add to Cart</span>
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
                  <div className="grid md:grid-cols-2 gap-x-8 gap-y-1">
                    {product.brand && (
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="font-medium text-gray-900">Brand</span>
                        <span className="text-gray-700 font-medium">{product.brand}</span>
                      </div>
                    )}
                    {product.model && (
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="font-medium text-gray-900">Model</span>
                        <span className="text-gray-700">{product.model}</span>
                      </div>
                    )}
                    {product.category_id && (
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="font-medium text-gray-900">Category</span>
                        <span className="text-gray-700 capitalize">{product.category_id.replace('-', ' ')}</span>
                      </div>
                    )}
                    {product.condition && (
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="font-medium text-gray-900">Condition</span>
                        <span className="text-gray-700">{product.condition}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Performance Specifications */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-[#6dc1c9]">Performance</h4>
                  <div className="grid md:grid-cols-2 gap-x-8 gap-y-1">
                    {product.processor && (
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="font-medium text-gray-900">Processor</span>
                        <span className="text-gray-700">{product.processor}</span>
                      </div>
                    )}
                    {product.generation && (
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="font-medium text-gray-900">Generation</span>
                        <span className="text-gray-700">{product.generation}</span>
                      </div>
                    )}
                    {product.ram && (
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="font-medium text-gray-900">RAM</span>
                        <span className="text-gray-700">{product.ram}</span>
                      </div>
                    )}
                    {product.hdd && (
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="font-medium text-gray-900">Storage</span>
                        <span className="text-gray-700">{product.hdd}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Display & Graphics */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-[#6dc1c9]">Display & Graphics</h4>
                  <div className="grid md:grid-cols-2 gap-x-8 gap-y-1">
                    {product.display_size && (
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="font-medium text-gray-900">Display Size</span>
                        <span className="text-gray-700">{product.display_size}</span>
                      </div>
                    )}
                    {product.screensize && (
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="font-medium text-gray-900">Screen Size</span>
                        <span className="text-gray-700">{product.screensize}</span>
                      </div>
                    )}
                    {product.resolution && (
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="font-medium text-gray-900">Resolution</span>
                        <span className="text-gray-700">{product.resolution}</span>
                      </div>
                    )}
                    {product.integrated_graphics && (
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="font-medium text-gray-900">Integrated Graphics</span>
                        <span className="text-gray-700">{product.integrated_graphics}</span>
                      </div>
                    )}
                    {product.discrete_graphics && (
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="font-medium text-gray-900">Discrete Graphics</span>
                        <span className="text-gray-700">{product.discrete_graphics}</span>
                      </div>
                    )}
                    {product.graphics && (
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="font-medium text-gray-900">Graphics</span>
                        <span className="text-gray-700">{product.graphics}</span>
                      </div>
                    )}
                    {product.touch_type && (
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="font-medium text-gray-900">Touch Type</span>
                        <span className="text-gray-700">{product.touch_type}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Features & Connectivity */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-[#6dc1c9]">Features & Connectivity</h4>
                  <div className="grid md:grid-cols-1 gap-y-1">
                    {product.operating_features && (
                      <div className="flex items-start justify-between py-3 border-b border-gray-100">
                        <span className="font-medium text-gray-900">Operating Features</span>
                        <span className="text-gray-700 text-right max-w-md">{product.operating_features}</span>
                      </div>
                    )}
                    {product.extra_features && (
                      <div className="flex items-start justify-between py-3 border-b border-gray-100">
                        <span className="font-medium text-gray-900">Extra Features</span>
                        <span className="text-gray-700 text-right max-w-md">{product.extra_features}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Power & Battery */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-[#6dc1c9]">Power & Battery</h4>
                  <div className="grid md:grid-cols-2 gap-x-8 gap-y-1">
                    {product.battery && (
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="font-medium text-gray-900">Battery</span>
                        <span className="text-gray-700">{product.battery}</span>
                      </div>
                    )}
                    {product.charger_included !== undefined && (
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="font-medium text-gray-900">Charger Included</span>
                        <span className="text-gray-700">{product.charger_included ? 'Yes' : 'No'}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Warranty & Support */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-[#6dc1c9]">Warranty & Support</h4>
                  <div className="grid md:grid-cols-2 gap-x-8 gap-y-1">
                    {product.warranty && (
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="font-medium text-gray-900">Warranty</span>
                        <span className="text-gray-700">{product.warranty}</span>
                      </div>
                    )}
                    {product.warranty_period && (
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="font-medium text-gray-900">Warranty Period</span>
                        <span className="text-gray-700">{product.warranty_period} months</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Details */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-[#6dc1c9]">Product Details</h4>
                  <div className="grid md:grid-cols-2 gap-x-8 gap-y-1">
                    {product.sku && (
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="font-medium text-gray-900">SKU</span>
                        <span className="text-gray-700 font-mono text-sm">{product.sku}</span>
                      </div>
                    )}
                    {product.weight && (
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="font-medium text-gray-900">Weight</span>
                        <span className="text-gray-700">{product.weight} kg</span>
                      </div>
                    )}
                    {product.stock_quantity !== undefined && (
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="font-medium text-gray-900">Stock Quantity</span>
                        <span className="text-gray-700">{product.stock_quantity}</span>
                      </div>
                    )}
                    {product.is_featured !== undefined && (
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="font-medium text-gray-900">Featured Product</span>
                        <span className="text-gray-700">{product.is_featured ? 'Yes' : 'No'}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pricing Information */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-[#6dc1c9]">Pricing</h4>
                  <div className="grid md:grid-cols-2 gap-x-8 gap-y-1">
                    {product.price && (
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="font-medium text-gray-900">Current Price</span>
                        <span className="text-gray-700 font-semibold">Rs. {product.price.toLocaleString()}</span>
                      </div>
                    )}
                    {product.sale_price && (
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="font-medium text-gray-900">Sale Price</span>
                        <span className="text-gray-700 font-semibold">Rs. {product.sale_price.toLocaleString()}</span>
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
              src={productImages[selectedImage]}
              alt={product.name}
              width={1200}
              height={1200}
              className="object-contain max-h-full max-w-full"
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
