'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, BarChart3, Star, Eye } from 'lucide-react';
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
        // Optional: Show success message
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

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200">
      {/* Product Image */}
      <div className="relative overflow-hidden rounded-t-lg">
        <Image
          // src={product.image}
          src="/next.png" // Fallback image
          alt={product.name}
          width={300}
          height={200}
          className="w-full h-48 object-cover"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2">
          {discountPercentage > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
              {discountPercentage}% OFF
            </span>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Product Name */}
        <Link href={`/products/${product.id}`}>
          <h3 className="font-medium text-base text-blue-600 mb-2 hover:text-blue-700 cursor-pointer line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Specifications */}
        <div className="text-sm text-gray-600 mb-3 space-y-1">
          {product.processor && (
            <div>• {product.processor}</div>
          )}
          {product.ram && (
            <div>• {product.ram} RAM and {product.storage}</div>
          )}
          {product.display && (
            <div>• {product.display}</div>
          )}
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-gray-900">
              Rs.{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                Rs.{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {/* VIEW DETAIL Button */}
          <Link 
            href={`/products/${product.id}`}
            className="w-full bg-blue-900 text-white py-2 px-4 rounded text-center font-medium hover:bg-blue-800 transition-colors duration-200 block"
          >
            VIEW DETAIL
          </Link>

          {/* Compare and Wishlist Buttons */}
          <div className="flex gap-2">

           

            {/* Compare Button */}
            {showCompare && isLaptopCategory(product.category) && (
              <button
                onClick={handleCompare}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors duration-200 ${
                  isInCompare(product.id)
                    ? 'bg-blue-900 text-white'
                    : 'bg-blue-900 text-white hover:bg-teal-600'
                }`}
                title={isInCompare(product.id) ? 'Remove from comparison' : 'Add to comparison'}
              >
                ⚖ Compare
              </button>
            )}

            {/* Wishlist Button */}
            <button
              onClick={handleWishlist}
              className={`px-3 py-2 rounded text-sm font-medium transition-colors duration-200 ${
                isInWishlist(product.id)
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-red-500 hover:text-white'
              }`}
              title={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              {isInWishlist(product.id) ? '♥ Added' : '♡ Add to Wishlist'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;