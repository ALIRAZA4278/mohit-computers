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
    addToCart(product);
    // Optional: Show success message
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Get category badge info
  const getCategoryBadge = () => {
    if (product.category === 'used-laptop') {
      return { text: 'Laptop', gradient: 'from-blue-500 to-blue-600' };
    }
    if (product.category === 'chromebook') {
      return { text: 'Chromebook', gradient: 'from-green-500 to-green-600' };
    }
    if (product.category === 'accessories') {
      return { text: 'Accessory', gradient: 'from-orange-400 to-red-500' };
    }
    return { text: 'Product', gradient: 'from-gray-500 to-gray-600' };
  };

  const categoryBadge = getCategoryBadge();

  return (
    <div className="group h-full">
      <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-teal-200 h-full flex flex-col">
        {/* Category Badge */}
        <div className="absolute top-4 left-4 z-10">
          <div className={`bg-gradient-to-r ${categoryBadge.gradient} text-white px-3 py-1 rounded-full text-xs font-bold shadow-md`}>
            {categoryBadge.text}
          </div>
        </div>

        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-4 right-4 z-10">
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
              {discountPercentage}% OFF
            </div>
          </div>
        )}
        
        {/* Product Image */}
        <div className="relative h-36 bg-gradient-to-br from-gray-50 to-gray-100 p-4">
          <Image
            src="/next.svg"
            alt={product.name}
            width={200}
            height={120}
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        
        {/* Product Info */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div className="flex-1">
            <Link href={`/products/${product.id}`}>
              <h3 className="font-bold text-base text-gray-900 mb-2 line-clamp-2 group-hover:text-teal-600 transition-colors cursor-pointer min-h-[3rem]">
                {product.name}
              </h3>
            </Link>

          {/* Brand */}
          {product.brand && (
            <p className="text-xs text-gray-500 mb-2 font-medium">
              Brand: {product.brand}
            </p>
          )}

          {/* Specifications */}
          <div className="text-xs text-gray-600 mb-3 space-y-1 min-h-[3rem]">
            {product.processor && (
              <div className="flex items-center">
                <span className="w-1 h-1 bg-teal-500 rounded-full mr-2"></span>
                <span className="truncate">{product.processor}</span>
              </div>
            )}
            {product.ram && (
              <div className="flex items-center">
                <span className="w-1 h-1 bg-teal-500 rounded-full mr-2"></span>
                <span className="truncate">{product.ram} RAM, {product.storage}</span>
              </div>
            )}
            {product.display && (
              <div className="flex items-center">
                <span className="w-1 h-1 bg-teal-500 rounded-full mr-2"></span>
                <span className="truncate">{product.display}</span>
              </div>
            )}
          </div>
          
          {/* Price */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-lg font-bold text-gray-900">
                Rs:{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-gray-500 line-through ml-1 block">
                  Rs:{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            {product.originalPrice && (
              <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                Save Rs:{(product.originalPrice - product.price).toLocaleString()}
              </div>
            )}
          </div>

          {/* Stock Status */}
          <div className="mb-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              product.inStock !== false 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              <span className={`w-1 h-1 rounded-full mr-1 ${
                product.inStock !== false ? 'bg-green-500' : 'bg-red-500'
              }`}></span>
              {product.inStock !== false ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-2">
            <Link 
              href={`/products/${product.id}`}
              className="w-full bg-teal-600 text-white py-2 px-3 rounded-lg text-center font-medium hover:bg-teal-700 transition-colors duration-200 block text-sm"
            >
              View Details
            </Link>
            
            <div className="flex gap-1">
              <button
                onClick={handleAddToCart}
                disabled={product.inStock === false}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-colors ${
                  product.inStock !== false
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="w-3 h-3 inline mr-1" />
                Cart
              </button>
              
              {/* Compare Button */}
              {showCompare && isLaptopCategory(product.category) && (
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