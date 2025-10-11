'use client';

import React from 'react';
import Image from 'next/image';
import { X, ShoppingCart, CheckCircle, XCircle, Star, Link } from 'lucide-react';
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
    <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">Laptop Comparison</h2>
            <p className="text-blue-100 text-sm sm:text-base">Compare {laptopItems.length} laptop{laptopItems.length > 1 ? 's' : ''} side by side</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <div className="text-left sm:text-right">
              <div className="text-xs sm:text-sm text-blue-100">Best deals highlighted in</div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                <span className="text-xs sm:text-sm">Green</span>
              </div>
            </div>
            <button
              onClick={clearCompare}
              className="px-4 sm:px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-sm sm:text-base w-full sm:w-auto"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="block lg:hidden">
        <div className="p-4 space-y-4">
          {laptopItems.map((product, index) => (
            <div key={product.id} className="bg-gray-50 rounded-lg p-4 relative">
              {/* Remove Button */}
              <button
                onClick={() => removeFromCompare(product.id)}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg z-10"
                title="Remove from comparison"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Product Header */}
              <div className="flex items-start space-x-3 mb-4">
                <div className="bg-white rounded-lg p-2 flex-shrink-0">
                  <Image
                    src="/next.png"
                    alt={product.name}
                    width={80}
                    height={60}
                    className="w-20 h-15 object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 text-base mb-1 line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      {product.brand}
                    </span>
                    {product.featured && (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium flex items-center">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Featured
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Specifications Grid */}
              <div className="space-y-3">
                {/* Price */}
                <div className={`flex justify-between items-center p-3 rounded-lg ${isHighlight(product, 'price') ? 'bg-green-100 border border-green-200' : 'bg-white'}`}>
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
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <div className="flex items-center">
                    <span className="text-lg mr-2">🖥️</span>
                    <span className="font-medium text-gray-700">Processor</span>
                  </div>
                  <div className="text-right text-sm text-gray-800 max-w-32 truncate">
                    {product.processor || 'Not specified'}
                  </div>
                </div>

                {/* RAM */}
                <div className={`flex justify-between items-center p-3 rounded-lg ${isHighlight(product, 'ram') ? 'bg-green-100 border border-green-200' : 'bg-white'}`}>
                  <div className="flex items-center">
                    <span className="text-lg mr-2">🧠</span>
                    <span className="font-medium text-gray-700">RAM</span>
                  </div>
                  <div className={`text-right font-medium ${isHighlight(product, 'ram') ? 'text-green-600' : 'text-gray-800'}`}>
                    {product.ram || 'Not specified'}
                    {isHighlight(product, 'ram') && <span className="ml-1 text-xs">🏆</span>}
                  </div>
                </div>

                {/* Storage */}
                <div className={`flex justify-between items-center p-3 rounded-lg ${isHighlight(product, 'storage') ? 'bg-green-100 border border-green-200' : 'bg-white'}`}>
                  <div className="flex items-center">
                    <span className="text-lg mr-2">💾</span>
                    <span className="font-medium text-gray-700">Storage</span>
                  </div>
                  <div className="text-right">
                    <div className={`font-medium ${isHighlight(product, 'storage') ? 'text-green-600' : 'text-gray-800'}`}>
                      {product.storage || 'Not specified'}
                      {isHighlight(product, 'storage') && <span className="ml-1 text-xs">🏆</span>}
                    </div>
                    {(product.storage?.includes('SSD')) && (
                      <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mt-1 inline-block">
                        ⚡ SSD
                      </div>
                    )}
                  </div>
                </div>

                {/* Condition */}
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <div className="flex items-center">
                    <span className="text-lg mr-2">✨</span>
                    <span className="font-medium text-gray-700">Condition</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.condition === 'Excellent' ? 'bg-green-100 text-green-800' :
                    product.condition === 'Very Good' ? 'bg-blue-100 text-blue-800' :
                    product.condition === 'Good' ? 'bg-yellow-100 text-yellow-800' :
                    product.condition === 'New' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {product.condition || 'Good'}
                  </span>
                </div>

                {/* Stock Status */}
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
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
              <div className="mt-4 space-y-2">
                <button
                  onClick={(e) => handleAddToCart(product)}
                  disabled={!product.inStock}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 text-sm ${
                    product.inStock
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4 inline mr-2" />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
                
                <a 
                  href={`/products/${product.id}`}
                  className="w-full py-2 px-4 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200 font-medium block text-center text-sm"
                >
                  View Details
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
            <tr>
              <td className="p-6 font-semibold text-gray-700 bg-gray-50 sticky left-0 z-10 border-r border-gray-200">
                <div className="text-lg">Specification</div>
              </td>
              {laptopItems.map((product, index) => (
                <td key={product.id} className="p-4 lg:p-6 bg-gray-50 min-w-64 lg:min-w-80 border-r border-gray-200 last:border-r-0">
                  <div className="relative">
                    <button
                      onClick={() => removeFromCompare(product.id)}
                      className="absolute -top-3 -right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg z-10"
                      title="Remove from comparison"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    
                    {/* Product Image */}
                    <div className="bg-gray-100 rounded-lg p-4 mb-4">
                      <Image
                        src="/next.png" // Fallback image
                        alt={product.name}
                        width={250}
                        height={180}
                        className="w-full h-40 object-contain"
                      />
                    </div>
                    
                    {/* Product Title */}
                    <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    
                    {/* Brand Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {product.brand}
                      </span>
                      {product.featured && (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium flex items-center">
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
      <div className="bg-gray-50 p-4 sm:p-6 border-t border-gray-200">
        <div className="text-center">
          {/* Mobile Summary */}
          <div className="block sm:hidden mb-4 space-y-2">
            <p className="text-gray-600 text-xs">
              📊 Comparison completed for {laptopItems.length} laptop{laptopItems.length > 1 ? 's' : ''}
            </p>
            <p className="text-gray-600 text-xs">
              🏆 Best values highlighted in green
            </p>
            <p className="text-gray-600 text-xs">
              💡 <strong>Need help choosing?</strong> <a href="/contact" className="text-blue-600 hover:underline">Contact our experts</a>
            </p>
          </div>
          
          {/* Desktop Summary */}
          <p className="hidden sm:block text-gray-600 mb-4 text-sm sm:text-base">
            📊 Comparison completed for {laptopItems.length} laptop{laptopItems.length > 1 ? 's' : ''} • 
            🏆 Best values highlighted in green • 
            💡 <strong>Need help choosing?</strong> <a href="/contact" className="text-blue-600 hover:underline">Contact our experts</a>
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              onClick={clearCompare}
              className="px-4 sm:px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
            >
              Clear Comparison
            </button>
            <Link href="/products?category=used-laptop"
              className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base text-center"
            >
              Browse More Laptops
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareTable;