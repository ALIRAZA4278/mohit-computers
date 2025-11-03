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
      <div className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-teal-200 h-full flex flex-col ${isAccessory ? 'max-w-sm mx-auto' : ''}`}>
        {/* Badges Container - Super Cute Minimal */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          {/* Low Stock Badge */}
          {isAvailableForPurchase && stockQuantity <= 5 && stockQuantity > 0 && (
            <div className="bg-amber-400 text-amber-900 px-2.5 py-1 rounded-full text-[9px] font-extrabold tracking-wide shadow-sm border border-amber-300/50">
              LIMITED
            </div>
          )}

          {/* NEW Badge */}
          {isAvailableForPurchase && isNew && !product.is_clearance && !product.is_discounted && (
            <div className="bg-teal-400 text-teal-900 px-2.5 py-1 rounded-full text-[9px] font-extrabold tracking-wide shadow-sm border border-teal-300/50">
              NEW
            </div>
          )}

          {/* Clearance Badge */}
          {isAvailableForPurchase && product.is_clearance && (
            <div className="bg-rose-400 text-rose-900 px-2.5 py-1 rounded-full text-[9px] font-extrabold tracking-wide shadow-sm border border-rose-300/50">
              CLEARANCE
            </div>
          )}

          {/* Discounted Badge */}
          {isAvailableForPurchase && product.is_discounted && !product.is_clearance && (
            <div className="bg-violet-400 text-violet-900 px-2.5 py-1 rounded-full text-[9px] font-extrabold tracking-wide shadow-sm border border-violet-300/50">
              SPECIAL
            </div>
          )}
        </div>

        {/* Discount Badge */}
        {isAvailableForPurchase && discountPercentage > 0 && (
          <div className="absolute top-2 right-2 z-10">
            <div className="bg-red-500 text-white px-2.5 py-1 rounded-full text-[9px] font-extrabold tracking-wide shadow-sm border border-red-400/50">
              {discountPercentage}% OFF
            </div>
          </div>
        )}
        
        {/* Product Image */}
        <div className={`relative bg-gradient-to-br from-gray-50 to-gray-100 ${isAccessory ? 'h-28 sm:h-32 p-2.5 sm:p-3' : 'h-32 sm:h-36 p-3 sm:p-4'}`}>
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
        <div className={`flex-1 flex flex-col justify-between ${isAccessory ? 'p-2.5 sm:p-3.5' : 'p-3 sm:p-4'}`}>
          <div className="flex-1">
            <Link href={`/products/${product.id}`}>
              <h3 className={`font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#6dc1c9] transition-colors cursor-pointer ${isAccessory ? 'text-sm min-h-[2.5rem]' : 'text-sm sm:text-base min-h-[2.5rem] sm:min-h-[3rem]'}`}>
                {product.name}
              </h3>
            </Link>

          {/* Brand - Hide for accessories to save space */}
          {!isAccessory && product.brand && (
            <p className="text-xs text-gray-500 mb-1 sm:mb-2 font-medium">
              Brand: {product.brand}
            </p>
          )}

          {/* Specifications - Only show for laptops, hide for accessories */}
          {!isAccessory && (
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
          )}

          {/* Brand for accessories - compact version */}
          {isAccessory && product.brand && (
            <p className="text-xs text-gray-500 mb-1.5 font-medium">
              Brand: {product.brand}
            </p>
          )}

          {/* Price */}
          <div className={`flex items-center justify-between ${isAccessory ? 'mb-2' : 'mb-2 sm:mb-3'}`}>
            <div>
              <span className={`font-bold text-gray-900 ${isAccessory ? 'text-base' : 'text-base sm:text-lg'}`}>
                Rs:{product.price?.toLocaleString() || '0'}
              </span>
              {originalPrice && (
                <span className={`text-gray-500 line-through ml-1 block ${isAccessory ? 'text-[10px]' : 'text-xs'}`}>
                  Rs:{originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            {originalPrice && !isAccessory && (
              <div className="bg-green-100 text-green-800 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-medium">
                Save Rs:{(originalPrice - product.price).toLocaleString()}
              </div>
            )}
          </div>

          {/* Stock Status */}
          <div className={isAccessory ? 'mb-1.5' : 'mb-2'}>
            <span className={`inline-flex items-center px-2 py-1 rounded-full font-medium ${isAccessory ? 'text-xs' : 'text-xs'} ${
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
          <div className={isAccessory ? 'space-y-1' : 'space-y-2'}>
            <Link
              href={`/products/${product.id}`}
              className={`w-full bg-[#6dc1c9] text-white rounded-lg text-center font-medium hover:bg-teal-700 transition-colors duration-200 block ${isAccessory ? 'py-2 px-2 text-xs' : 'py-2 px-2 sm:px-3 text-xs sm:text-sm'}`}
            >
              View Details
            </Link>

            <div className={`flex ${isAccessory ? 'gap-1' : 'gap-1 sm:gap-2'}`}>
              <button
                onClick={handleAddToCart}
                disabled={!isAvailableForPurchase}
                className={`flex-1 rounded-lg font-medium transition-colors ${isAccessory ? 'py-1.5 px-2 text-xs' : 'py-1.5 px-2 text-xs'} ${
                  isAvailableForPurchase
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
                title={!isAvailableForPurchase ? 'Out of stock' : 'Add to cart'}
              >
                <ShoppingCart className={`inline ${isAccessory ? 'w-3 h-3 mr-1' : 'w-3 h-3 mr-1'}`} />
                {isAvailableForPurchase ? 'Cart' : 'Out of Stock'}
              </button>
              
              {/* Compare Button */}
              {showCompare && isLaptopCategory(category) && (
                <button
                  onClick={handleCompare}
                  className={`rounded-lg font-medium transition-colors ${isAccessory ? 'px-1.5 py-1' : 'px-2 py-1.5 text-xs'} ${
                    isInCompare(product.id)
                      ? 'bg-teal-100 text-teal-700 border border-teal-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-teal-100 hover:text-teal-700'
                  }`}
                  title={isInCompare(product.id) ? 'Remove from comparison' : 'Add to comparison'}
                >
                  <GitCompareArrows className={isAccessory ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
                </button>
              )}

              {/* Wishlist Button */}
              <button
                onClick={handleWishlist}
                className={`rounded-lg font-medium transition-colors ${isAccessory ? 'px-1.5 py-1' : 'px-2 py-1.5 text-xs'} ${
                  isInWishlist(product.id)
                    ? 'bg-red-100 text-red-700 border border-red-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-700'
                }`}
                title={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart className={`${isAccessory ? 'w-2.5 h-2.5' : 'w-3 h-3'} ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
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