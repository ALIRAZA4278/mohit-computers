'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, GitCompareArrows, Star, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';

const ProductCard = ({ product, showCompare = true }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCompare, removeFromCompare, isInCompare, isLaptopCategory } = useCompare();

  const handleWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleCompare = () => {
    if (isInCompare(product.id)) {
      removeFromCompare(product.id);
    } else {
      const success = addToCompare(product);
      if (success) {
        // Product added to compare - floating widget will handle the display
      }
    }
  };

  const handleAddToCart = () => {
    if (!isAvailableForPurchase) {
      alert('Sorry, this product is currently out of stock.');
      return;
    }
    addToCart(product);
    // Optional: Show success message
  };

  // Handle both database and static data field names
  const originalPrice = product.original_price || product.originalPrice;
  const category = product.category_id || product.category;
  const isActive = product.is_active !== undefined ? product.is_active : product.inStock !== false;
  const isFeatured = product.is_featured || product.featured;
  
  // Check if product is in stock - with fallback for existing products
  // Set defaults based on category and product name
  const categoryLower = typeof category === 'string' ? category.toLowerCase() : '';
  const productNameLower = typeof product.name === 'string' ? product.name.toLowerCase() : '';
  const isAccessoryCategory = ['accessories', 'ram', 'ssd', 'chromebook', 'accessory'].some(cat => 
    categoryLower.includes(cat) || productNameLower.includes(cat)
  );
  
  const stockQuantity = product.stock_quantity !== undefined ? product.stock_quantity : (isAccessoryCategory ? 0 : 999);
  const inStock = product.in_stock !== undefined ? product.in_stock : (product.inStock !== undefined ? product.inStock : !isAccessoryCategory);
  const isAvailableForPurchase = isActive && inStock && stockQuantity > 0;

  // Debug logging for category detection
  if (process.env.NODE_ENV === 'development') {
    console.log('Product:', product.name, 'Category:', category, 'Is Workstation:', product.is_workstation);
  }

  // Calculate discount percentage - use admin set value if available, else calculate
  const discountPercentage = product.is_discounted && product.discount_percentage 
    ? product.discount_percentage
    : (originalPrice ? Math.round(((originalPrice - product.price) / originalPrice) * 100) : 0);

  // Check if product is new (created within last 30 days)
  const isNew = product.created_at ?
    (new Date() - new Date(product.created_at)) / (1000 * 60 * 60 * 24) <= 30
    : false;

  // Get category badge info
  const getCategoryBadge = () => {
    const categoryLower = typeof category === 'string' ? category.toLowerCase() : '';
    
    // Check for workstation first (highest priority)
    if (categoryLower.includes('workstation') || product.is_workstation) {
      return { text: 'Workstation', gradient: 'from-slate-600 to-slate-700' };
    }
    if (categoryLower.includes('laptop') || categoryLower === 'used-laptop') {
      return { text: 'Laptop', gradient: 'from-blue-500 to-blue-600' };
    }
    if (categoryLower.includes('chromebook')) {
      return { text: 'Chromebook', gradient: 'from-emerald-500 to-emerald-600' };
    }
    if (categoryLower.includes('accessories') || categoryLower.includes('accessory')) {
      return { text: 'Accessory', gradient: 'from-orange-500 to-orange-600' };
    }
    if (categoryLower.includes('ram') || categoryLower.includes('memory')) {
      return { text: 'RAM', gradient: 'from-purple-500 to-purple-600' };
    }
    if (categoryLower.includes('ssd') || categoryLower.includes('storage')) {
      return { text: 'SSD', gradient: 'from-indigo-500 to-indigo-600' };
    }
    if (categoryLower.includes('keyboard')) {
      return { text: 'Keyboard', gradient: 'from-teal-500 to-[#6dc1c9]' };
    }
    if (categoryLower.includes('mouse')) {
      return { text: 'Mouse', gradient: 'from-cyan-500 to-cyan-600' };
    }
    if (categoryLower.includes('ups') || categoryLower.includes('power')) {
      return { text: 'UPS', gradient: 'from-yellow-500 to-yellow-600' };
    }
    if (categoryLower.includes('desktop') || categoryLower.includes('pc')) {
      return { text: 'Desktop', gradient: 'from-gray-600 to-gray-700' };
    }
    return { text: 'Product', gradient: 'from-gray-500 to-gray-600' };
  };

  const categoryBadge = getCategoryBadge();

  // Check if this is an accessory product for compact layout
  const isAccessory = ['accessories', 'ram', 'ssd', 'keyboard', 'mouse', 'ups', 'power', 'accessory'].some(cat =>
    categoryLower.includes(cat)
  );

  return (
    <div className="group h-full">
      <div className="relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col hover:-translate-y-1">
        {/* Badges Container */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          {isAvailableForPurchase && stockQuantity <= 5 && stockQuantity > 0 && (
            <div className="bg-amber-400 text-amber-900 px-2 py-0.5 rounded text-[10px] font-bold">
              LIMITED
            </div>
          )}
          {isAvailableForPurchase && isNew && !product.is_clearance && !product.is_discounted && (
            <div className="bg-teal-500 text-white px-2 py-0.5 rounded text-[10px] font-bold">
              NEW
            </div>
          )}
          {isAvailableForPurchase && product.is_clearance && (
            <div className="bg-rose-500 text-white px-2 py-0.5 rounded text-[10px] font-bold">
              CLEARANCE
            </div>
          )}
        </div>

        {/* Discount Badge */}
        {isAvailableForPurchase && discountPercentage > 0 && (
          <div className="absolute top-2 right-2 z-10">
            <div className="bg-red-500 text-white px-2 py-0.5 rounded text-[10px] font-bold">
              {discountPercentage}% OFF
            </div>
          </div>
        )}

        {/* Product Image - Fixed Height */}
        <div className="relative bg-gray-50 h-[160px] p-4 flex items-center justify-center">
          <Image
            src={product.featured_image || product.image || "/next.svg"}
            alt={product.name}
            width={200}
            height={140}
            className="max-h-[140px] w-auto object-contain group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = "/next.svg";
            }}
          />
        </div>

        {/* Product Info - Fixed Structure */}
        <div className="flex-1 flex flex-col p-4">
          {/* Product Name - Fixed Height */}
          <Link href={`/products/${product.id}`}>
            <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 h-[40px] group-hover:text-[#6dc1c9] transition-colors cursor-pointer">
              {product.name}
            </h3>
          </Link>

          {/* Brand */}
          {product.brand && (
            <p className="text-xs text-gray-500 mt-1">
              Brand: {product.brand}
            </p>
          )}

          {/* Specifications - Fixed Height */}
          <div className="text-xs text-gray-600 mt-2 space-y-0.5 h-[72px] overflow-hidden">
            {product.processor && (
              <div className="flex items-center">
                <span className="w-1 h-1 bg-[#6dc1c9] rounded-full mr-1.5 flex-shrink-0"></span>
                <span className="truncate">{product.processor}</span>
              </div>
            )}
            {product.generation && (
              <div className="flex items-center">
                <span className="w-1 h-1 bg-[#6dc1c9] rounded-full mr-1.5 flex-shrink-0"></span>
                <span className="truncate">{product.generation}</span>
              </div>
            )}
            {product.ram && (
              <div className="flex items-center">
                <span className="w-1 h-1 bg-[#6dc1c9] rounded-full mr-1.5 flex-shrink-0"></span>
                <span className="truncate">{product.ram}, {product.hdd || product.storage}</span>
              </div>
            )}
            {(product.display_size || product.screensize || product.display) && (
              <div className="flex items-center">
                <span className="w-1 h-1 bg-[#6dc1c9] rounded-full mr-1.5 flex-shrink-0"></span>
                <span className="truncate">{product.display_size || product.screensize || product.display}</span>
              </div>
            )}
          </div>

          {/* Price Section */}
          <div className="mt-auto pt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-gray-900">
                Rs:{product.price?.toLocaleString() || '0'}
              </span>
              {originalPrice && (
                <span className="text-xs text-gray-400 line-through">
                  Rs:{originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="mt-2">
              <span className={`inline-flex items-center text-xs font-medium ${
                isAvailableForPurchase ? 'text-green-600' : 'text-red-600'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full mr-1 ${
                  isAvailableForPurchase ? 'bg-green-500' : 'bg-red-500'
                }`}></span>
                {isAvailableForPurchase ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {/* Action Buttons - Fixed Layout */}
            <div className="mt-3 space-y-2">
              <Link
                href={`/products/${product.id}`}
                className="w-full bg-[#6dc1c9] text-white py-2 rounded-lg text-sm text-center font-medium hover:bg-teal-600 transition-colors block"
              >
                View Details
              </Link>

              <div className="flex gap-2">
                <button
                  onClick={handleAddToCart}
                  disabled={!isAvailableForPurchase}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-colors ${
                    isAvailableForPurchase
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  {isAvailableForPurchase ? 'Cart' : 'Out of Stock'}
                </button>

                {showCompare && isLaptopCategory(category) && (
                  <button
                    onClick={handleCompare}
                    className={`p-2 rounded-lg transition-colors ${
                      isInCompare(product.id)
                        ? 'bg-[#6dc1c9] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    title={isInCompare(product.id) ? 'Remove from comparison' : 'Compare'}
                  >
                    <GitCompareArrows className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={handleWishlist}
                  className={`p-2 rounded-lg transition-colors ${
                    isInWishlist(product.id)
                      ? 'bg-red-100 text-red-500'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title={isInWishlist(product.id) ? 'Remove from wishlist' : 'Wishlist'}
                >
                  <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;