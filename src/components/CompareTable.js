'use client';

import React from 'react';
import Image from 'next/image';
import { X, ShoppingCart, CheckCircle, XCircle, Star, Link, GitCompareArrows } from 'lucide-react';
import { useCompare } from '../context/CompareContext';
import { useCart } from '../context/CartContext';

const CompareTable = () => {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();

  // Filter only laptop products for comparison
  const laptopItems = compareItems.filter(item => 
    item.category === 'laptop' || item.category_id === 'laptop'
  );

  if (laptopItems.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 px-4">
        <div className="bg-blue-100 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
        </div>
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">No Laptops to Compare</h3>
        <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">Add laptops to your comparison list to see their specifications side by side</p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 max-w-md mx-auto">
          <p className="text-xs sm:text-sm text-yellow-700">
            💡 <strong>Tip:</strong> You can compare up to 4 laptops at once. Look for the compare icon on laptop product cards.
          </p>
        </div>
      </div>
    );
  }

  const handleAddToCart = (product) => {
    addToCart(product);
    // Show success feedback
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = 'Added!';
    button.className = button.className.replace('bg-blue-600', 'bg-green-600');
    setTimeout(() => {
      button.textContent = originalText;
      button.className = button.className.replace('bg-green-600', 'bg-blue-600');
    }, 2000);
  };

  const getBestValue = (items, field) => {
    const values = items.map(item => {
      if (field === 'price') return item.price;
      if (field === 'ram') return parseInt(item.ram?.match(/\d+/)?.[0] || '0');
      if (field === 'storage') {
        const storage = item.storage || item.specifications?.storage || '';
        const ssdMatch = storage.match(/(\d+)GB.*SSD/i);
        const hddMatch = storage.match(/(\d+)GB.*HDD/i);
        if (ssdMatch) return parseInt(ssdMatch[1]) + 1000; // SSD bonus
        if (hddMatch) return parseInt(hddMatch[1]);
        return 0;
      }
      return 0;
    });
    
    if (field === 'price') return Math.min(...values);
    return Math.max(...values);
  };

  const isHighlight = (item, field, value) => {
    const bestValue = getBestValue(laptopItems, field);
    if (field === 'price') return item.price === bestValue;
    if (field === 'ram') return parseInt(item.ram?.match(/\d+/)?.[0] || '0') === bestValue;
    if (field === 'storage') {
      const storage = item.storage || item.specifications?.storage || '';
      const ssdMatch = storage.match(/(\d+)GB.*SSD/i);
      const hddMatch = storage.match(/(\d+)GB.*HDD/i);
      let itemValue = 0;
      if (ssdMatch) itemValue = parseInt(ssdMatch[1]) + 1000;
      else if (hddMatch) itemValue = parseInt(hddMatch[1]);
      return itemValue === bestValue;
    }
    return false;
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#6dc1c9] via-teal-600 to-teal-700 text-white p-6 sm:p-8 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px'}}></div>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <GitCompareArrows className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1">Product Comparison</h2>
                <p className="text-teal-100 text-sm sm:text-base">Compare {laptopItems.length} laptop{laptopItems.length > 1 ? 's' : ''} side by side</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
              <div className="text-xs text-teal-100 mb-1">Best values highlighted</div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full shadow-lg"></div>
                <span className="text-sm font-semibold">Green Badge</span>
              </div>
            </div>
            <button
              onClick={clearCompare}
              className="px-6 py-3 bg-white text-red-600 rounded-xl hover:bg-red-50 transition-all duration-200 font-semibold text-sm sm:text-base w-full sm:w-auto shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="block lg:hidden">
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 bg-gradient-to-br from-gray-50 to-gray-100">
          {laptopItems.map((product, index) => (
            <div key={product.id} className="bg-white rounded-2xl p-5 relative shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
              {/* Remove Button */}
              <button
                onClick={() => removeFromCompare(product.id)}
                className="absolute -top-2 -right-2 p-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl z-10 border-2 border-white"
                title="Remove from comparison"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Product Number Badge */}
              <div className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-br from-[#6dc1c9] to-teal-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg border-2 border-white">
                {index + 1}
              </div>

              {/* Product Header */}
              <div className="flex items-start space-x-4 mb-5 mt-2">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-3 flex-shrink-0 border border-gray-200 shadow-sm">
                  <Image
                    src={product.featured_image || product.image || "/next.svg"}
                    alt={product.name}
                    width={80}
                    height={60}
                    className="w-20 h-15 object-contain"
                    onError={(e) => {
                      e.target.src = "/next.svg";
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-base mb-2 line-clamp-2 leading-tight">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-gradient-to-r from-teal-50 to-teal-100 text-teal-700 px-3 py-1 rounded-full text-xs font-semibold border border-teal-200">
                      {product.brand}
                    </span>
                    {product.featured && (
                      <span className="bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-semibold flex items-center border border-yellow-200">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Featured
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Specifications Grid */}
              <div className="space-y-2">
                {/* Price */}
                <div className={`flex justify-between items-center p-4 rounded-xl transition-all duration-200 ${isHighlight(product, 'price') ? 'bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-300 shadow-md' : 'bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200'}`}>
                  <div className="flex items-center">
                    <span className="text-lg mr-2">💰</span>
                    <span className="font-medium text-gray-700">Price</span>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold text-lg ${isHighlight(product, 'price') ? 'text-green-600' : 'text-gray-800'}`}>
                      Rs{product.price.toLocaleString()}
                      {isHighlight(product, 'price') && <span className="ml-1 text-xs">🏆</span>}
                    </div>
                    {product.originalPrice && (
                      <div className="text-xs text-gray-500 line-through">
                        Rs{product.originalPrice.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Processor */}
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-base">🖥️</span>
                    </div>
                    <span className="font-semibold text-gray-800 text-sm">Processor</span>
                  </div>
                  <div className="text-right text-sm text-gray-800 max-w-32 truncate font-medium">
                    {product.processor || 'Not specified'}
                  </div>
                </div>

                {/* RAM */}
                <div className={`flex justify-between items-center p-4 rounded-xl transition-all duration-200 ${isHighlight(product, 'ram') ? 'bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-300 shadow-md' : 'bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200'}`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isHighlight(product, 'ram') ? 'bg-green-200' : 'bg-purple-100'}`}>
                      <span className="text-base">🧠</span>
                    </div>
                    <span className="font-semibold text-gray-800 text-sm">RAM</span>
                  </div>
                  <div className={`text-right font-bold text-sm ${isHighlight(product, 'ram') ? 'text-green-700' : 'text-gray-800'}`}>
                    {product.ram || 'Not specified'}
                    {isHighlight(product, 'ram') && <span className="ml-1 text-xs">🏆</span>}
                  </div>
                </div>

                {/* Storage */}
                <div className={`flex justify-between items-center p-4 rounded-xl transition-all duration-200 ${isHighlight(product, 'storage') ? 'bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-300 shadow-md' : 'bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200'}`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isHighlight(product, 'storage') ? 'bg-green-200' : 'bg-indigo-100'}`}>
                      <span className="text-base">💾</span>
                    </div>
                    <span className="font-semibold text-gray-800 text-sm">Storage</span>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold text-sm ${isHighlight(product, 'storage') ? 'text-green-700' : 'text-gray-800'}`}>
                      {product.storage || product.hdd || 'Not specified'}
                      {isHighlight(product, 'storage') && <span className="ml-1 text-xs">🏆</span>}
                    </div>
                    {(product.storage?.includes('SSD') || product.hdd?.includes('SSD')) && (
                      <div className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full mt-1 inline-flex items-center font-semibold">
                        ⚡ SSD
                      </div>
                    )}
                  </div>
                </div>

                {/* Condition */}
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <span className="text-base">✨</span>
                    </div>
                    <span className="font-semibold text-gray-800 text-sm">Condition</span>
                  </div>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                    product.condition === 'Excellent' ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300' :
                    product.condition === 'Very Good' ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300' :
                    product.condition === 'Good' ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300' :
                    product.condition === 'New' ? 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300' :
                    'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300'
                  }`}>
                    {product.condition || 'Good'}
                  </span>
                </div>

                {/* Stock Status */}
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl">
                  <div className="flex items-center">
                    <span className="text-lg mr-2">📦</span>
                    <span className="font-medium text-gray-700">Stock</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${
                    product.inStock 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.inStock ? (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        In Stock
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3 mr-1" />
                        Out of Stock
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 space-y-3">
                <button
                  onClick={(e) => handleAddToCart(product)}
                  disabled={!product.inStock}
                  className={`w-full py-3.5 px-4 rounded-xl font-bold transition-all duration-200 text-sm shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${
                    product.inStock
                      ? 'bg-gradient-to-r from-[#6dc1c9] to-teal-600 text-white hover:from-teal-600 hover:to-teal-700 transform hover:-translate-y-0.5'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>

                <a
                  href={`/products/${product.id}`}
                  className="w-full py-3 px-4 border-2 border-[#6dc1c9] text-[#6dc1c9] rounded-xl hover:bg-[#6dc1c9] hover:text-white transition-all duration-200 font-semibold block text-center text-sm shadow-md hover:shadow-lg"
                >
                  View Full Details
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <td className="p-6 font-bold text-gray-800 bg-gradient-to-r from-gray-50 to-gray-100 sticky left-0 z-10 border-r border-gray-200">
                <div className="text-xl">Specification</div>
              </td>
              {laptopItems.map((product, index) => (
                <td key={product.id} className="p-6 bg-gradient-to-br from-gray-50 to-white min-w-72 lg:min-w-80 border-r border-gray-200 last:border-r-0 relative">
                  <div className="relative">
                    {/* Product Number Badge */}
                    <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-br from-[#6dc1c9] to-teal-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg border-2 border-white z-20">
                      {index + 1}
                    </div>

                    <button
                      onClick={() => removeFromCompare(product.id)}
                      className="absolute -top-3 -right-3 p-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl z-20 border-2 border-white"
                      title="Remove from comparison"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    {/* Product Image */}
                    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-5 mb-4 shadow-sm border border-gray-200 mt-4">
                      <Image
                        src={product.featured_image || product.image || "/next.svg"}
                        alt={product.name}
                        width={250}
                        height={180}
                        className="w-full h-40 object-contain"
                        onError={(e) => {
                          e.target.src = "/next.svg";
                        }}
                      />
                    </div>

                    {/* Product Title */}
                    <h3 className="font-bold text-gray-900 text-lg mb-3 line-clamp-2 min-h-[3.5rem]">
                      {product.name}
                    </h3>

                    {/* Brand Badge */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="bg-gradient-to-r from-teal-50 to-teal-100 text-teal-700 px-3 py-1.5 rounded-full text-sm font-semibold border border-teal-200 shadow-sm">
                        {product.brand}
                      </span>
                      {product.featured && (
                        <span className="bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-semibold flex items-center border border-yellow-200 shadow-sm">
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                </td>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Price Row */}
            <tr className="border-t hover:bg-gray-25">
              <td className="p-6 font-semibold text-gray-800 bg-gray-50 sticky left-0 z-10 border-r border-gray-200">
                <div className="flex items-center">
                  💰 <span className="ml-2">Price</span>
                </div>
              </td>
              {laptopItems.map((product) => (
                <td key={product.id} className={`p-6 border-r border-gray-200 last:border-r-0 ${isHighlight(product, 'price') ? 'bg-green-50 border-green-200' : ''}`}>
                  <div className={`font-bold text-xl lg:text-2xl ${isHighlight(product, 'price') ? 'text-green-600' : 'text-gray-800'}`}>
                    Rs{product.price.toLocaleString()}
                    {isHighlight(product, 'price') && <span className="ml-2 text-sm">🏆 Best Price</span>}
                  </div>
                  {product.originalPrice && (
                    <div className="text-sm text-gray-500 line-through mt-1">
                      Rs{product.originalPrice.toLocaleString()}
                    </div>
                  )}
                  {product.originalPrice && (
                    <div className="text-xs text-green-600 font-medium mt-1">
                      Save Rs{(product.originalPrice - product.price).toLocaleString()} 
                      ({Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off)
                    </div>
                  )}
                </td>
              ))}
            </tr>

            {/* Processor Row */}
            <tr className="border-t bg-gray-25 hover:bg-gray-50">
              <td className="p-6 font-semibold text-gray-800 bg-gray-100 sticky left-0 z-10 border-r border-gray-200">
                <div className="flex items-center">
                  🖥️ <span className="ml-2">Processor</span>
                </div>
              </td>
              {laptopItems.map((product) => (
                <td key={product.id} className="p-6 border-r border-gray-200 last:border-r-0">
                  <div className="font-medium text-gray-800">
                    {product.processor || product.specifications?.processor || 'Not specified'}
                  </div>
                  {product.generation && (
                    <div className="text-sm text-blue-600 mt-1">{product.generation}</div>
                  )}
                </td>
              ))}
            </tr>

            {/* RAM Row */}
            <tr className="border-t hover:bg-gray-25">
              <td className="p-6 font-semibold text-gray-800 bg-gray-50 sticky left-0 z-10 border-r border-gray-200">
                <div className="flex items-center">
                  🧠 <span className="ml-2">Memory (RAM)</span>
                </div>
              </td>
              {laptopItems.map((product) => (
                <td key={product.id} className={`p-6 border-r border-gray-200 last:border-r-0 ${isHighlight(product, 'ram') ? 'bg-green-50 border-green-200' : ''}`}>
                  <div className={`font-bold text-lg ${isHighlight(product, 'ram') ? 'text-green-600' : 'text-gray-800'}`}>
                    {product.ram || product.specifications?.ram || 'Not specified'}
                    {isHighlight(product, 'ram') && <span className="ml-2 text-sm">🏆 Highest RAM</span>}
                  </div>
                </td>
              ))}
            </tr>

            {/* Storage Row */}
            <tr className="border-t bg-gray-25 hover:bg-gray-50">
              <td className="p-6 font-semibold text-gray-800 bg-gray-100 sticky left-0 z-10 border-r border-gray-200">
                <div className="flex items-center">
                  💾 <span className="ml-2">Storage</span>
                </div>
              </td>
              {laptopItems.map((product) => (
                <td key={product.id} className={`p-6 border-r border-gray-200 last:border-r-0 ${isHighlight(product, 'storage') ? 'bg-green-50 border-green-200' : ''}`}>
                  <div className={`font-bold text-lg ${isHighlight(product, 'storage') ? 'text-green-600' : 'text-gray-800'}`}>
                    {product.storage || product.specifications?.storage || 'Not specified'}
                    {isHighlight(product, 'storage') && <span className="ml-2 text-sm">🏆 Best Storage</span>}
                  </div>
                  {(product.storage?.includes('SSD') || product.specifications?.storage?.includes('SSD')) && (
                    <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mt-2 inline-block">
                      ⚡ SSD - Faster Performance
                    </div>
                  )}
                </td>
              ))}
            </tr>

            {/* Display Row */}
            <tr className="border-t hover:bg-gray-25">
              <td className="p-6 font-semibold text-gray-800 bg-gray-50 sticky left-0 z-10 border-r border-gray-200">
                <div className="flex items-center">
                  📺 <span className="ml-2">Display</span>
                </div>
              </td>
              {laptopItems.map((product) => (
                <td key={product.id} className="p-6 border-r border-gray-200 last:border-r-0">
                  <div className="font-medium text-gray-800">
                    {product.display || product.specifications?.display || 'Not specified'}
                  </div>
                </td>
              ))}
            </tr>

            {/* Graphics Row */}
            <tr className="border-t bg-gray-25 hover:bg-gray-50">
              <td className="p-6 font-semibold text-gray-800 bg-gray-100 sticky left-0 z-10 border-r border-gray-200">
                <div className="flex items-center">
                  🎮 <span className="ml-2">Graphics</span>
                </div>
              </td>
              {laptopItems.map((product) => (
                <td key={product.id} className="p-6 border-r border-gray-200 last:border-r-0">
                  <div className="font-medium text-gray-800">
                    {product.specifications?.graphics || 'Integrated Graphics'}
                  </div>
                </td>
              ))}
            </tr>

            {/* Operating System Row */}
            <tr className="border-t hover:bg-gray-25">
              <td className="p-6 font-semibold text-gray-800 bg-gray-50 sticky left-0 z-10 border-r border-gray-200">
                <div className="flex items-center">
                  💿 <span className="ml-2">Operating System</span>
                </div>
              </td>
              {laptopItems.map((product) => (
                <td key={product.id} className="p-6 border-r border-gray-200 last:border-r-0">
                  <div className="font-medium text-gray-800">
                    {product.specifications?.os || 'Windows 11'}
                  </div>
                </td>
              ))}
            </tr>

            {/* Battery Row */}
            <tr className="border-t bg-gray-25 hover:bg-gray-50">
              <td className="p-6 font-semibold text-gray-800 bg-gray-100 sticky left-0 z-10 border-r border-gray-200">
                <div className="flex items-center">
                  🔋 <span className="ml-2">Battery Life</span>
                </div>
              </td>
              {laptopItems.map((product) => (
                <td key={product.id} className="p-6 border-r border-gray-200 last:border-r-0">
                  <div className="font-medium text-gray-800">
                    {product.specifications?.battery || 'Up to 6 hours'}
                  </div>
                </td>
              ))}
            </tr>

            {/* Weight Row */}
            <tr className="border-t hover:bg-gray-25">
              <td className="p-6 font-semibold text-gray-800 bg-gray-50 sticky left-0 z-10 border-r border-gray-200">
                <div className="flex items-center">
                  ⚖️ <span className="ml-2">Weight</span>
                </div>
              </td>
              {laptopItems.map((product) => (
                <td key={product.id} className="p-6 border-r border-gray-200 last:border-r-0">
                  <div className="font-medium text-gray-800">
                    {product.specifications?.weight || 'Not specified'}
                  </div>
                </td>
              ))}
            </tr>

            {/* Condition Row */}
            <tr className="border-t bg-gray-25 hover:bg-gray-50">
              <td className="p-6 font-semibold text-gray-800 bg-gray-100 sticky left-0 z-10 border-r border-gray-200">
                <div className="flex items-center">
                  ✨ <span className="ml-2">Condition</span>
                </div>
              </td>
              {laptopItems.map((product) => (
                <td key={product.id} className="p-6 border-r border-gray-200 last:border-r-0">
                  <span className={`px-3 py-2 rounded-full text-sm font-medium ${
                    product.condition === 'Excellent' ? 'bg-green-100 text-green-800' :
                    product.condition === 'Very Good' ? 'bg-blue-100 text-blue-800' :
                    product.condition === 'Good' ? 'bg-yellow-100 text-yellow-800' :
                    product.condition === 'New' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {product.condition === 'Excellent' && '⭐'}
                    {product.condition === 'Very Good' && '👍'}
                    {product.condition === 'Good' && '✅'}
                    {product.condition === 'New' && '🆕'}
                    {' '}
                    {product.condition || 'Good'}
                  </span>
                </td>
              ))}
            </tr>

            {/* Warranty Row */}
            <tr className="border-t hover:bg-gray-25">
              <td className="p-6 font-semibold text-gray-800 bg-gray-50 sticky left-0 z-10 border-r border-gray-200">
                <div className="flex items-center">
                  🛡️ <span className="ml-2">Warranty</span>
                </div>
              </td>
              {laptopItems.map((product) => (
                <td key={product.id} className="p-6 border-r border-gray-200 last:border-r-0">
                  <div className="font-medium text-gray-800">
                    {product.warranty || '3 months'}
                  </div>
                </td>
              ))}
            </tr>

            {/* Stock Status Row */}
            <tr className="border-t bg-gray-25 hover:bg-gray-50">
              <td className="p-6 font-semibold text-gray-800 bg-gray-100 sticky left-0 z-10 border-r border-gray-200">
                <div className="flex items-center">
                  📦 <span className="ml-2">Availability</span>
                </div>
              </td>
              {laptopItems.map((product) => (
                <td key={product.id} className="p-6 border-r border-gray-200 last:border-r-0">
                  <span className={`px-3 py-2 rounded-full text-sm font-medium flex items-center w-fit ${
                    (() => {
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
                      return isAvailableForPurchase ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
                    })()
                  }`}>
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
                      
                      if (isAvailableForPurchase) {
                        return (
                          <>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            In Stock
                          </>
                        );
                      } else {
                        return (
                          <>
                            <XCircle className="w-4 h-4 mr-1" />
                            Out of Stock
                          </>
                        );
                      }
                    })()}
                  </span>
                </td>
              ))}
            </tr>



            {/* Actions Row */}
            <tr className="border-t bg-gradient-to-r from-blue-50 to-blue-100">
              <td className="p-6 font-semibold text-gray-800 bg-blue-100 sticky left-0 z-10 border-r border-gray-200">
                <div className="flex items-center">
                  🛒 <span className="ml-2">Actions</span>
                </div>
              </td>
              {laptopItems.map((product) => (
                <td key={product.id} className="p-6 border-r border-gray-200 last:border-r-0">
                  <div className="space-y-3">
                    <button
                      onClick={(e) => handleAddToCart(product)}
                      disabled={(() => {
                        const category = product.category_id || product.category;
                        const categoryLower = typeof category === 'string' ? category.toLowerCase() : '';
                        const productNameLower = typeof product.name === 'string' ? product.name.toLowerCase() : '';
                      const isAccessoryCategory = ['accessories', 'ram', 'ssd', 'chromebook', 'accessory'].some(cat => 
                        categoryLower.includes(cat) || productNameLower.includes(cat)
                      );
                        
                        const stockQuantity = product.stock_quantity !== undefined ? product.stock_quantity : (isAccessoryCategory ? 0 : 999);
                        const inStock = product.in_stock !== undefined ? product.in_stock : (product.inStock !== undefined ? product.inStock : !isAccessoryCategory);
                        const isActive = product.is_active !== undefined ? product.is_active : product.inStock !== false;
                        return !(isActive && inStock && stockQuantity > 0);
                      })()}
                      className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                        (() => {
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
                          return isAvailableForPurchase
                            ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed';
                        })()
                      }`}
                    >
                      <ShoppingCart className="w-5 h-5 inline mr-2" />
                      {(() => {
                        const stockQuantity = product.stock_quantity !== undefined ? product.stock_quantity : 999; // Default to 999 for existing products
                        const inStock = product.in_stock !== undefined ? product.in_stock : (product.inStock !== undefined ? product.inStock : true); // Default to true
                        const isActive = product.is_active !== undefined ? product.is_active : product.inStock !== false;
                        const isAvailableForPurchase = isActive && inStock && stockQuantity > 0;
                        return isAvailableForPurchase ? 'Add to Cart' : 'Out of Stock';
                      })()}
                    </button>
                    
                    <a 
                      href={`/products/${product.id}`}
                      className="w-full py-2 px-4 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200 font-medium block text-center"
                    >
                      View Details
                    </a>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      
      {/* Bottom Summary */}
      <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 p-6 sm:p-8 border-t-2 border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
              <div className="text-3xl mb-2">📊</div>
              <div className="font-bold text-gray-900">{laptopItems.length} Product{laptopItems.length > 1 ? 's' : ''}</div>
              <div className="text-xs text-gray-500">Compared</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
              <div className="text-3xl mb-2">🏆</div>
              <div className="font-bold text-gray-900">Best Values</div>
              <div className="text-xs text-gray-500">Highlighted in Green</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
              <div className="text-3xl mb-2">💡</div>
              <div className="font-bold text-gray-900">Need Help?</div>
              <div className="text-xs text-gray-500">
                <a href="/contact" className="text-[#6dc1c9] hover:underline font-semibold">Contact Experts</a>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <button
              onClick={clearCompare}
              className="px-6 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-100 transition-all duration-200 font-semibold text-sm sm:text-base border-2 border-gray-300 shadow-md hover:shadow-lg"
            >
              Clear Comparison
            </button>
            <Link href="/products"
              className="px-6 py-3 bg-gradient-to-r from-[#6dc1c9] to-teal-600 text-white rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all duration-200 font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl"
            >
              Browse More Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareTable;