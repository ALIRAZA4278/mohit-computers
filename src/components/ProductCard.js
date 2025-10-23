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

  return (
    <div className="group h-full">
      <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-teal-200 h-full flex flex-col">
        {/* Badges Container - Removed category badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {/* Out of Stock Badge */}
          {!isAvailableForPurchase && (
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-2.5 py-1 rounded-lg text-xs font-semibold shadow-lg border border-red-400/20 backdrop-blur-sm">
              OUT OF STOCK
            </div>
          )}
          
          {/* Low Stock Badge */}
          {isAvailableForPurchase && stockQuantity <= 5 && stockQuantity > 0 && (
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-2.5 py-1 rounded-lg text-xs font-semibold shadow-lg border border-orange-400/20 backdrop-blur-sm">
              LIMITED STOCK
            </div>
          )}
          
          {/* NEW Badge */}
          {isAvailableForPurchase && isNew && !product.is_clearance && !product.is_discounted && (
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-2.5 py-1 rounded-lg text-xs font-semibold shadow-lg border border-green-400/20 backdrop-blur-sm">
              NEW
            </div>
          )}

          {/* Clearance Badge */}
          {isAvailableForPurchase && product.is_clearance && (
            <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-2.5 py-1 rounded-lg text-xs font-semibold shadow-lg border border-orange-400/20 backdrop-blur-sm">
              CLEARANCE
            </div>
          )}

          {/* Discounted Badge */}
          {isAvailableForPurchase && product.is_discounted && !product.is_clearance && (
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-2.5 py-1 rounded-lg text-xs font-semibold shadow-lg border border-purple-400/20 backdrop-blur-sm">
              SPECIAL OFFER
            </div>
          )}
        </div>

        {/* Discount Badge */}
        {isAvailableForPurchase && discountPercentage > 0 && (
          <div className="absolute top-3 right-3 z-10">
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-2.5 py-1 rounded-lg text-xs font-semibold shadow-lg border border-red-400/20 backdrop-blur-sm">
              {discountPercentage}% OFF
            </div>
          </div>
        )}
        
        {/* Product Image */}
        <div className="relative h-32 sm:h-36 bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-4">
          <Image
            src={product.featured_image || product.image || "/next.svg"}
            alt={product.name}
            width={200}
            height={120}
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.target.src = "/next.svg";
            }}
          />
        </div>
        
        {/* Product Info */}
        <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
          <div className="flex-1">
            <Link href={`/products/${product.id}`}>
              <h3 className="font-bold text-sm sm:text-base text-gray-900 mb-2 line-clamp-2 group-hover:text-[#6dc1c9] transition-colors cursor-pointer min-h-[2.5rem] sm:min-h-[3rem]">
                {product.name}
              </h3>
            </Link>

          {/* Brand */}
          {product.brand && (
            <p className="text-xs text-gray-500 mb-1 sm:mb-2 font-medium">
              Brand: {product.brand}
            </p>
          )}

          {/* Specifications */}
          <div className="text-xs text-gray-600 mb-2 sm:mb-3 space-y-1 min-h-[2rem] sm:min-h-[3rem]">
            {product.processor && (
              <div className="flex items-center">
                <span className="w-1 h-1 bg-teal-500 rounded-full mr-2"></span>
                <span className="truncate">{product.processor}</span>
              </div>
            )}
            {product.generation && (
              <div className="flex items-center">
                <span className="w-1 h-1 bg-teal-500 rounded-full mr-2"></span>
                <span className="truncate">{product.generation}</span>
              </div>
            )}
            {product.ram && (
              <div className="flex items-center">
                <span className="w-1 h-1 bg-teal-500 rounded-full mr-2"></span>
                <span className="truncate">{product.ram} RAM, {product.hdd || product.storage}</span>
              </div>
            )}
            {(product.display_size || product.screensize || product.display) && (
              <div className="flex items-center">
                <span className="w-1 h-1 bg-teal-500 rounded-full mr-2"></span>
                <span className="truncate">{product.display_size || product.screensize || product.display}</span>
              </div>
            )}
          </div>
          
          {/* Price */}
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div>
              <span className="text-base sm:text-lg font-bold text-gray-900">
                Rs:{product.price?.toLocaleString() || '0'}
              </span>
              {originalPrice && (
                <span className="text-xs text-gray-500 line-through ml-1 block">
                  Rs:{originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            {originalPrice && (
              <div className="bg-green-100 text-green-800 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-medium">
                Save Rs:{(originalPrice - product.price).toLocaleString()}
              </div>
            )}
          </div>

          {/* Stock Status */}
          <div className="mb-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              isAvailableForPurchase 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              <span className={`w-1 h-1 rounded-full mr-1 ${
                isAvailableForPurchase ? 'bg-green-500' : 'bg-red-500'
              }`}></span>
              {isAvailableForPurchase ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-2">
            <Link
              href={`/products/${product.id}`}
              className="w-full bg-[#6dc1c9] text-white py-2 px-2 sm:px-3 rounded-lg text-center font-medium hover:bg-teal-700 transition-colors duration-200 block text-xs sm:text-sm"
            >
              View Details
            </Link>

            <div className="flex gap-1 sm:gap-2">
              <button
                onClick={handleAddToCart}
                disabled={!isAvailableForPurchase}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-colors ${
                  isAvailableForPurchase
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
                title={!isAvailableForPurchase ? 'Out of stock' : 'Add to cart'}
              >
                <ShoppingCart className="w-3 h-3 inline mr-1" />
                {isAvailableForPurchase ? 'Cart' : 'Out of Stock'}
              </button>
              
              {/* Compare Button */}
              {showCompare && isLaptopCategory(category) && (
                <button
                  onClick={handleCompare}
                  className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isInCompare(product.id)
                      ? 'bg-teal-100 text-teal-700 border border-teal-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-teal-100 hover:text-teal-700'
                  }`}
                  title={isInCompare(product.id) ? 'Remove from comparison' : 'Add to comparison'}
                >
                  <GitCompareArrows className="w-3 h-3" />
                </button>
              )}
              
              {/* Wishlist Button */}
              <button
                onClick={handleWishlist}
                className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isInWishlist(product.id)
                    ? 'bg-red-100 text-red-700 border border-red-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-700'
                }`}
                title={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart className={`w-3 h-3 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
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