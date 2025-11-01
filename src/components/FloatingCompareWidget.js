'use client';

import React, { useState } from 'react';
import { GitCompareArrows, X, Eye } from 'lucide-react';
import { useCompare } from '../context/CompareContext';
import CompareModal from './CompareModal';

const FloatingCompareWidget = () => {
  const { compareItems, removeFromCompare } = useCompare();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  if (compareItems.length === 0) {
    return null;
  }

  return (
    <>
      {/* Floating Widget - Icon Only Like WhatsApp */}
      <div className="fixed bottom-24 right-6 z-40">
        {/* Expanded Panel */}
        {isExpanded && (
          <div className="absolute bottom-16 right-0 mb-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between p-3 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800 text-sm">Compare Products</h3>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3">
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {compareItems.map((product) => (
                  <div key={product.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                    <div className="flex items-center space-x-2 flex-1">
                      <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-xs">
                        📱
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-900 truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Rs:{product.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCompare(product.id)}
                      className="text-red-400 hover:text-red-600 transition-colors p-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-3">
                <button
                  onClick={() => {
                    setIsModalOpen(true);
                    setIsExpanded(false);
                  }}
                  className="w-full bg-[#6dc1c9] text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors flex items-center justify-center"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Compare Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Circular Icon Button - Like WhatsApp */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="group relative bg-[#6dc1c9] hover:bg-teal-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
          aria-label="Compare Products"
        >
          {/* Pulse animation ring */}
          <span className="absolute inset-0 rounded-full bg-[#6dc1c9] animate-ping opacity-75"></span>

          {/* Icon with Badge */}
          <div className="relative z-10">
            <GitCompareArrows className="w-6 h-6" />
            {/* Badge */}
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
              {compareItems.length}
            </span>
          </div>

          {/* Hover tooltip */}
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            Compare Products
          </span>
        </button>
      </div>

      {/* Compare Modal */}
      <CompareModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default FloatingCompareWidget;