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
      {/* Floating Widget */}
      <div className="fixed bottom-6 right-6 z-40">
        <div className={`bg-white rounded-2xl shadow-2xl border border-gray-200 transition-all duration-300 ${
          isExpanded ? 'w-80' : 'w-auto'
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center space-x-2 text-teal-600 hover:text-teal-700 transition-colors"
            >
              <div className="relative">
                <GitCompareArrows className="w-5 h-5" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {compareItems.length}
                </span>
              </div>
              <span className="font-medium">Compare ({compareItems.length})</span>
            </button>
            
            {isExpanded && (
              <button
                onClick={() => setIsExpanded(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Expanded Content */}
          {isExpanded && (
            <div className="p-4">
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {compareItems.map((product) => (
                  <div key={product.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                    <div className="flex items-center space-x-2 flex-1">
                      <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-xs">
                        📱
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
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

              <div className="mt-4 space-y-2">
                <button
                  onClick={() => {
                    setIsModalOpen(true);
                    setIsExpanded(false);
                  }}
                  className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center justify-center"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Compare Now
                </button>
              </div>
            </div>
          )}

          {/* Collapsed Click Area */}
          {!isExpanded && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 text-sm font-medium text-teal-600 hover:bg-teal-50 transition-colors rounded-b-2xl"
            >
              View Comparison
            </button>
          )}
        </div>
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