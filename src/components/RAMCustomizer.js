'use client';

import React, { useState, useEffect } from 'react';
import { Cpu, Zap, Award, Clock } from 'lucide-react';

export default function RAMCustomizer({ product, onCustomizationChange }) {
  // Get base price from product
  const basePrice = product?.price || 0;

  // RAM brands available (all same price, no modifiers)
  const brands = [
    { id: 'kingston', name: 'Kingston', priceModifier: 0 },
    { id: 'samsung', name: 'Samsung', priceModifier: 0 },
    { id: 'crucial', name: 'Crucial', priceModifier: 0 },
    { id: 'hynix', name: 'Hynix', priceModifier: 0 },
    { id: 'adata', name: 'Adata', priceModifier: 0 },
    { id: 'corsair', name: 'Corsair', priceModifier: 0 },
    { id: 'gskill', name: 'G.Skill', priceModifier: 0 },
    { id: 'transcend', name: 'Transcend', priceModifier: 0 }
  ];

  // Get capacity from product
  const capacity = product?.ram_capacity || '4GB';
  const capacityNum = parseInt(capacity);

  // Speed options with price modifiers based on capacity
  const getSpeedOptions = () => {
    if (capacityNum === 4) {
      return [
        { id: '2133', name: '2133 MHz', priceModifier: 0, description: 'Standard speed' },
        { id: '2400', name: '2400 MHz', priceModifier: 50, description: 'Faster performance' },
        { id: '2666', name: '2666 MHz', priceModifier: 100, description: 'Enhanced speed' },
        { id: '3200', name: '3200 MHz', priceModifier: 300, description: 'Maximum performance' }
      ];
    } else if (capacityNum === 8) {
      return [
        { id: '2133', name: '2133 MHz', priceModifier: 0, description: 'Standard speed' },
        { id: '2400', name: '2400 MHz', priceModifier: 200, description: 'Faster performance' },
        { id: '2666', name: '2666 MHz', priceModifier: 400, description: 'Enhanced speed' },
        { id: '3200', name: '3200 MHz', priceModifier: 600, description: 'Maximum performance' }
      ];
    } else if (capacityNum === 16) {
      return [
        { id: '2133', name: '2133 MHz', priceModifier: 0, description: 'Standard speed' },
        { id: '2400', name: '2400 MHz', priceModifier: 300, description: 'Faster performance' },
        { id: '2666', name: '2666 MHz', priceModifier: 600, description: 'Enhanced speed' },
        { id: '3200', name: '3200 MHz', priceModifier: 900, description: 'Maximum performance' }
      ];
    }
    return [
      { id: '2133', name: '2133 MHz', priceModifier: 0, description: 'Standard speed' }
    ];
  };

  const speedOptions = getSpeedOptions();

  // State for selections
  const [selectedBrand, setSelectedBrand] = useState(brands[0]);
  const [selectedSpeed, setSelectedSpeed] = useState(speedOptions[0]);
  const [totalPrice, setTotalPrice] = useState(basePrice);

  // Calculate total price when selections change
  useEffect(() => {
    const brandModifier = selectedBrand?.priceModifier || 0;
    const speedModifier = selectedSpeed?.priceModifier || 0;
    const newTotalPrice = basePrice + brandModifier + speedModifier;
    setTotalPrice(newTotalPrice);

    // Notify parent component
    if (onCustomizationChange) {
      onCustomizationChange({
        brand: selectedBrand,
        speed: selectedSpeed,
        totalPrice: newTotalPrice,
        additionalCost: brandModifier + speedModifier,
        specs: {
          brand: selectedBrand.name,
          speed: selectedSpeed.name,
          capacity: capacity,
          type: product?.ram_type || 'DDR4'
        }
      });
    }
  }, [selectedBrand, selectedSpeed, basePrice, capacity, product?.ram_type, onCustomizationChange]);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 shadow-lg border border-blue-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Cpu className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Customize Your RAM</h3>
          <p className="text-sm text-gray-600">Select brand and speed for your {capacity} {product?.ram_type || 'DDR4'} RAM</p>
        </div>
      </div>

      {/* Brand Selection */}
      <div className="mb-6">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-3">
          <Award className="w-4 h-4 text-blue-600" />
          Select Brand
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {brands.map((brand) => (
            <button
              key={brand.id}
              onClick={() => setSelectedBrand(brand)}
              className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                selectedBrand.id === brand.id
                  ? 'border-blue-600 bg-blue-100 shadow-md scale-105'
                  : 'border-gray-300 bg-white hover:border-blue-400 hover:shadow'
              }`}
            >
              <div className="text-center">
                <div className="font-semibold text-gray-900">{brand.name}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Speed Selection */}
      <div className="mb-6">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-3">
          <Zap className="w-4 h-4 text-blue-600" />
          Select Speed (Frequency)
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {speedOptions.map((speed) => (
            <button
              key={speed.id}
              onClick={() => setSelectedSpeed(speed)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                selectedSpeed.id === speed.id
                  ? 'border-blue-600 bg-blue-100 shadow-md scale-105'
                  : 'border-gray-300 bg-white hover:border-blue-400 hover:shadow'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    {speed.name}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">{speed.description}</div>
                </div>
                {speed.priceModifier !== 0 && (
                  <div className="text-sm font-semibold text-blue-600">
                    +Rs {speed.priceModifier}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Price Summary */}
      <div className="bg-white rounded-lg p-4 border-2 border-blue-300">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Base Price (2133 MHz):</span>
          <span className="text-sm font-medium text-gray-900">Rs {basePrice.toLocaleString()}</span>
        </div>
        {selectedSpeed.priceModifier !== 0 && (
          <>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Speed Upgrade ({selectedSpeed.name}):</span>
              <span className="text-sm font-medium text-blue-600">
                +Rs {selectedSpeed.priceModifier.toLocaleString()}
              </span>
            </div>
            <div className="border-t border-gray-300 my-2"></div>
          </>
        )}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">Total Price:</span>
          <span className="text-2xl font-bold text-blue-600">Rs {totalPrice.toLocaleString()}</span>
        </div>
      </div>

      {/* Selected Configuration Summary */}
      <div className="mt-4 p-3 bg-blue-100 rounded-lg border border-blue-300">
        <div className="text-sm font-semibold text-gray-800 mb-1">Your Configuration:</div>
        <div className="text-sm text-gray-700">
          {selectedBrand.name} {capacity} {product?.ram_type || 'DDR4'} {selectedSpeed.name} - {product?.ram_form_factor || 'Laptop (SO-DIMM)'}
        </div>
      </div>
    </div>
  );
}
