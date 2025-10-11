'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Eye, ShoppingCart } from 'lucide-react';
import { useCompare } from '../context/CompareContext';
import { useCart } from '../context/CartContext';

const CompareModal = ({ isOpen, onClose }) => {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();

  if (!isOpen) return null;

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const renderEmptySlot = (index) => (
    <div key={`empty-${index}`} className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center h-80">
      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
        <Plus className="w-8 h-8 text-gray-400" />
      </div>
      <p className="text-gray-500 text-center font-medium">Add Product to Compare</p>
      <p className="text-gray-400 text-sm text-center mt-1">Click compare on any laptop</p>
    </div>
  );

  const renderProductSlot = (product) => (
    <div key={product.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Remove Button */}
      <div className="relative">
        <button
          onClick={() => removeFromCompare(product.id)}
          className="absolute top-2 right-2 z-10 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
          title="Remove from comparison"
        >
          <X className="w-4 h-4" />
        </button>
        
        {/* Product Image */}
        <div className="h-40 bg-gray-50 p-4">
          <Image
            src="/next.svg"
            alt={product.name}
            width={200}
            height={120}
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-sm text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        <div className="text-xs text-gray-600 mb-3 space-y-1">
          {product.brand && (
            <div className="flex justify-between">
              <span>Brand:</span>
              <span className="font-medium">{product.brand}</span>
            </div>
          )}
          {product.processor && (
            <div className="flex justify-between">
              <span>CPU:</span>
              <span className="font-medium text-right">{product.processor}</span>
            </div>
          )}
          {product.ram && (
            <div className="flex justify-between">
              <span>RAM:</span>
              <span className="font-medium">{product.ram}</span>
            </div>
          )}
          {product.storage && (
            <div className="flex justify-between">
              <span>Storage:</span>
              <span className="font-medium">{product.storage}</span>
            </div>
          )}
          {product.display && (
            <div className="flex justify-between">
              <span>Display:</span>
              <span className="font-medium text-right">{product.display}</span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="mb-3">
          <div className="text-lg font-bold text-gray-900">
            Rs:{product.price.toLocaleString()}
          </div>
          {product.originalPrice && (
            <div className="text-xs text-gray-500 line-through">
              Rs:{product.originalPrice.toLocaleString()}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Link
            href={`/products/${product.id}`}
            className="w-full bg-[#6dc1c9] text-white py-2 px-3 rounded-lg text-xs font-medium hover:bg-teal-700 transition-colors flex items-center justify-center"
          >
            <Eye className="w-3 h-3 mr-1" />
            View Details
          </Link>
          <button
            onClick={() => handleAddToCart(product)}
            className="w-full bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
          >
            <ShoppingCart className="w-3 h-3 mr-1" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative h-full flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="border-b border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Compare Laptops</h2>
                <p className="text-gray-600 mt-1">Compare up to 4 laptops side by side</p>
              </div>
              <div className="flex items-center space-x-3">
                {compareItems.length > 0 && (
                  <button
                    onClick={clearCompare}
                    className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
            {compareItems.length === 0 ? (
              /* Empty State */
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Plus className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products to compare</h3>
                <p className="text-gray-600 mb-6">Add laptops to comparison by clicking the compare button on product cards</p>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-[#6dc1c9] text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
                >
                  Browse Laptops
                </button>
              </div>
            ) : (
              /* Comparison Grid */
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Render products */}
                  {compareItems.map(product => renderProductSlot(product))}
                  
                  {/* Render empty slots */}
                  {Array.from({ length: 4 - compareItems.length }).map((_, index) => 
                    renderEmptySlot(compareItems.length + index)
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex justify-center space-x-4">
                  <Link
                    href="/compare"
                    className="px-6 py-3 bg-[#6dc1c9] text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
                  >
                    View Detailed Comparison
                  </Link>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareModal;