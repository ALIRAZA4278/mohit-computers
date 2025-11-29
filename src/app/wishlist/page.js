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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        {/* Hero Section */}
        <section className="py-10 pb-0">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-[#6dc1c9] rounded-full mr-2"></span>
                My Wishlist
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Your Wishlist</h1>
              <div className="w-24 h-1 bg-[#6dc1c9] rounded-full mx-auto"></div>
            </div>
          </div>
        </section>

        {/* Empty Wishlist */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-100">
                <div className="w-32 h-32 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Heart className="w-16 h-16 text-[#6dc1c9]" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Wishlist is Empty</h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Save your favorite products to your wishlist so you can easily find them later.
                  Start browsing and add items you love!
                </p>
                <Link
                  href="/products"
                  className="bg-[#6dc1c9] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-teal-600 transition-colors inline-flex items-center shadow-lg hover:shadow-xl"
                >
                  Browse Products
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-[#6dc1c9] rounded-full mr-2"></span>
              My Wishlist
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Your Wishlist</h1>
            <p className="text-lg text-gray-600 mb-6">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
            </p>
            <div className="w-24 h-1 bg-[#6dc1c9] rounded-full mx-auto"></div>
          </div>
        </div>
      </section>

      {/* Wishlist Content */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
          
          {wishlistItems.length > 0 && (
            <button
              onClick={clearWishlist}
              className="text-[#6dc1c9] hover:text-teal-700 font-medium px-4 py-2 border border-[#6dc1c9] rounded-lg hover:bg-teal-50 transition-colors"
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
            className="bg-[#6dc1c9] text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-600 transition-colors inline-flex items-center shadow-lg hover:shadow-xl"
          >
            Continue Shopping
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
        </div>
      </section>
    </div>
  );
}