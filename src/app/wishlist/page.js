'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ArrowRight } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import ProductCard from '../../components/ProductCard';

export default function Wishlist() {
  const { wishlistItems, clearWishlist } = useWishlist();

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Wishlist is Empty</h1>
            <p className="text-gray-600 mb-8">
              Save your favorite products to your wishlist so you can easily find them later. 
              Start browsing and add items you love!
            </p>
            <Link 
              href="/products"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              Browse Products
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">My Wishlist</h1>
            <p className="text-gray-600">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
            </p>
          </div>
          
          {wishlistItems.length > 0 && (
            <button
              onClick={clearWishlist}
              className="text-red-600 hover:text-red-800 font-medium px-4 py-2 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Wishlist Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product}
              showCompare={true}
            />
          ))}
        </div>

        {/* Continue Shopping */}
        <div className="mt-12 text-center">
          <Link 
            href="/products"
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center"
          >
            Continue Shopping
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}