'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { HardDrive, Zap } from 'lucide-react';

export default function AppleCustomizer({ product, onCustomizationChange }) {
  const [selectedSsd, setSelectedSsd] = useState(null);
  const [totalPrice, setTotalPrice] = useState(product?.price || 0);

  // Get the processor type from product (apple_processor field)
  const getProcessorType = () => {
    const processor = product?.apple_processor || product?.processor || '';
    const processorLower = processor.toLowerCase();

    if (processorLower.includes('m4')) return 'm4';
    if (processorLower.includes('m3')) return 'm3';
    if (processorLower.includes('m2')) return 'm2';
    if (processorLower.includes('m1')) return 'm1';
    if (processorLower.includes('intel')) return 'intel';

    // Default to m1 if not specified
    return 'm1';
  };

  const processorType = getProcessorType();

  // Get SSD upgrade options based on processor type from apple_ssd_upgrades field
  const ssdOptions = useMemo(() => {
    const upgrades = product?.apple_ssd_upgrades;
    if (!upgrades) return [];

    const options = [];
    const ssdSizes = ['512GB', '1TB', '2TB'];

    ssdSizes.forEach(size => {
      const sizeUpgrades = upgrades[size];
      if (sizeUpgrades) {
        // Get the price for the current processor type
        const price = sizeUpgrades[processorType];

        // Only add if price exists and is greater than 0
        if (price && parseInt(price) > 0) {
          options.push({
            id: `apple-ssd-${size}`,
            size: size,
            price: parseInt(price),
            processorType: processorType
          });
        }
      }
    });

    return options;
  }, [product?.apple_ssd_upgrades, processorType]);

  // Calculate total price when SSD selection changes
  useEffect(() => {
    let additionalCost = 0;
    let updatedSpecs = {
      storage: product?.apple_storage || product?.hdd || '256GB'
    };

    if (selectedSsd) {
      additionalCost = selectedSsd.price;
      updatedSpecs.storage = selectedSsd.size;
    }

    const basePrice = parseFloat(product?.price) || 0;
    const newTotalPrice = basePrice + additionalCost;
    setTotalPrice(newTotalPrice);

    // Notify parent component
    if (onCustomizationChange) {
      onCustomizationChange({
        customizations: { ssdUpgrade: selectedSsd },
        additionalCost,
        totalPrice: newTotalPrice,
        updatedSpecs
      });
    }
  }, [selectedSsd, product?.price, product?.apple_storage, product?.hdd, onCustomizationChange]);

  const handleSsdSelect = (ssd) => {
    setSelectedSsd(prev => prev?.id === ssd.id ? null : ssd);
  };

  if (!product) return null;

  // Don't render if no SSD options available or customizer is disabled
  if (product?.show_apple_customizer === false || ssdOptions.length === 0) return null;

  // Get processor display name
  const getProcessorDisplayName = () => {
    switch (processorType) {
      case 'm4': return 'Apple M4';
      case 'm3': return 'Apple M3';
      case 'm2': return 'Apple M2';
      case 'm1': return 'Apple M1';
      case 'intel': return 'Intel';
      default: return 'Apple Silicon';
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-3">
        <h3 className="text-white font-bold flex items-center gap-2">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
          Upgrade Your MacBook
        </h3>
        <p className="text-gray-400 text-xs mt-1">
          Pricing for {getProcessorDisplayName()} processor
        </p>
      </div>

      <div className="p-4 space-y-4">
        {/* SSD Upgrade Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
              <HardDrive className="w-4 h-4 text-gray-700" />
            </div>
            <span className="font-semibold text-gray-800">SSD Storage Upgrade</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {ssdOptions.map((ssd) => (
              <button
                key={ssd.id}
                onClick={() => handleSsdSelect(ssd)}
                className={`relative text-left p-3 rounded-xl transition-all ${
                  selectedSsd?.id === ssd.id
                    ? 'bg-gray-900 text-white shadow-lg'
                    : 'bg-white border border-gray-200 hover:border-gray-400 hover:shadow-md'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold">{ssd.size}</span>
                  <span className={`font-bold ${selectedSsd?.id === ssd.id ? 'text-white' : 'text-gray-700'}`}>
                    +Rs {ssd.price.toLocaleString()}
                  </span>
                </div>
                <div className={`text-xs mt-1 ${selectedSsd?.id === ssd.id ? 'text-gray-300' : 'text-gray-500'}`}>
                  {product?.apple_storage || '256GB'} → {ssd.size}
                </div>
                {selectedSsd?.id === ssd.id && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow">
                    <svg className="w-3 h-3 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Price Summary */}
        {selectedSsd && (
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <h4 className="font-bold text-gray-800 mb-3 text-sm flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-gray-700 text-xs">₨</span>
              </div>
              Price Summary
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Base Price</span>
                <span className="font-medium text-gray-800">Rs {parseInt(product?.price || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">+ SSD Upgrade ({selectedSsd.size})</span>
                <span className="font-medium text-gray-800">Rs {selectedSsd.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-dashed border-gray-200">
                <span className="font-bold text-gray-800">Total</span>
                <span className="font-bold text-gray-900 text-lg">Rs {totalPrice.toLocaleString()}</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedSsd(null)}
              className="w-full text-center text-xs text-gray-400 hover:text-red-500 mt-3 transition-colors"
            >
              Reset configuration
            </button>
          </div>
        )}

        {/* Info Note */}
        <p className="text-xs text-gray-400 italic">
          Note: Apple MacBooks have unified memory (RAM) that cannot be upgraded after purchase.
        </p>
      </div>
    </div>
  );
}
