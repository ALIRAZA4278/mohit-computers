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

  const renderProductSlot = (product) => {
    // Calculate stock availability
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

    const originalPrice = product.original_price || product.originalPrice;
    const discountPercentage = originalPrice
      ? Math.round(((originalPrice - product.price) / originalPrice) * 100)
      : 0;

    return (
      <div key={product.id} className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        {/* Remove Button & Badges */}
        <div className="relative">
          <button
            onClick={() => removeFromCompare(product.id)}
            className="absolute top-3 right-3 z-10 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full p-2 hover:from-red-600 hover:to-red-700 transition-all shadow-lg border-2 border-white"
            title="Remove from comparison"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg border border-red-400/20">
              {discountPercentage}% OFF
            </div>
          )}

          {/* Product Image */}
          <div className="h-36 bg-gradient-to-br from-gray-50 to-gray-100 p-4">
            <Image
              src={product.featured_image || product.image || "/next.svg"}
              alt={product.name}
              width={200}
              height={120}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.src = "/next.svg";
              }}
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-bold text-sm text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Brand Badge */}
          {product.brand && (
            <span className="inline-block bg-gradient-to-r from-teal-50 to-teal-100 text-teal-700 px-2 py-1 rounded-full text-xs font-semibold mb-3 border border-teal-200">
              {product.brand}
            </span>
          )}

          {/* Specifications */}
          <div className="text-xs text-gray-600 mb-3 space-y-1.5 bg-gray-50 rounded-lg p-3">
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
                <span className="truncate">{product.ram} RAM{product.hdd || product.storage ? `, ${product.hdd || product.storage}` : ''}</span>
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
          <div className="mb-3">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-base font-bold text-gray-900">
                  Rs {product.price?.toLocaleString() || '0'}
                </div>
                {originalPrice && (
                  <div className="text-xs text-gray-500 line-through">
                    Rs {originalPrice.toLocaleString()}
                  </div>
                )}
              </div>
              {originalPrice && (
                <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                  Save Rs {(originalPrice - product.price).toLocaleString()}
                </div>
              )}
            </div>
          </div>

          {/* Stock Status */}
          <div className="mb-3">
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
              className="w-full bg-gradient-to-r from-[#6dc1c9] to-teal-600 text-white py-2.5 px-3 rounded-lg text-xs font-semibold hover:from-teal-600 hover:to-teal-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1"
            >
              <Eye className="w-3 h-3" />
              View Details
            </Link>
            <button
              onClick={() => handleAddToCart(product)}
              disabled={!isAvailableForPurchase}
              className={`w-full py-2.5 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
                isAvailableForPurchase
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
              title={!isAvailableForPurchase ? 'Out of stock' : 'Add to cart'}
            >
              <ShoppingCart className="w-3 h-3" />
              {isAvailableForPurchase ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    );
  };

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