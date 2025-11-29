'use client';

import React, { useState, useEffect } from 'react';
import { Cpu, Zap, Award, Clock } from 'lucide-react';

export default function RAMCustomizer({ product, onCustomizationChange }) {
  // Get base price from product
  const basePrice = product?.price || 0;

  // RAM brands available (displayed only, not selectable)
  const brands = ['Kingston', 'Samsung', 'Crucial', 'Hynix', 'Adata', 'Corsair', 'G.Skill', 'Transcend'];

  // Get capacity from product
  const capacity = product?.ram_capacity || '4GB';
  const capacityNum = parseInt(capacity);

  // State for global pricing from database
  const [globalPricing, setGlobalPricing] = useState(null);

  // Fetch global pricing on component mount
  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const response = await fetch('/api/upgrade-pricing');
        const data = await response.json();
        setGlobalPricing(data);
      } catch (error) {
        console.error('Error fetching RAM speed pricing:', error);
      }
    };
    fetchPricing();
  }, []);

  // Speed options with price modifiers based on capacity
  const getSpeedOptions = () => {
    // Check if product has custom prices, otherwise use global pricing from database
    const customPrices = product?.ram_speed_prices || {};
    
    // Use custom prices if available, otherwise use global pricing, finally fallback to defaults
    const price2400 = customPrices['2400'] || globalPricing?.ram_speed_2400 || 300;
    const price2666 = customPrices['2666'] || globalPricing?.ram_speed_2666 || 600;
    const price3200 = customPrices['3200'] || globalPricing?.ram_speed_3200 || 900;
    
    if (capacityNum === 4) {
      return [
        { id: '2133', name: '2133 MHz', priceModifier: 0, description: 'Standard speed' },
        { id: '2400', name: '2400 MHz', priceModifier: price2400, description: 'Faster performance' },
        { id: '2666', name: '2666 MHz', priceModifier: price2666, description: 'Enhanced speed' },
        { id: '3200', name: '3200 MHz', priceModifier: price3200, description: 'Maximum performance' }
      ];
    } else if (capacityNum === 8) {
      return [
        { id: '2133', name: '2133 MHz', priceModifier: 0, description: 'Standard speed' },
        { id: '2400', name: '2400 MHz', priceModifier: price2400, description: 'Faster performance' },
        { id: '2666', name: '2666 MHz', priceModifier: price2666, description: 'Enhanced speed' },
        { id: '3200', name: '3200 MHz', priceModifier: price3200, description: 'Maximum performance' }
      ];
    } else if (capacityNum === 16) {
      return [
        { id: '2133', name: '2133 MHz', priceModifier: 0, description: 'Standard speed' },
        { id: '2400', name: '2400 MHz', priceModifier: price2400, description: 'Faster performance' },
        { id: '2666', name: '2666 MHz', priceModifier: price2666, description: 'Enhanced speed' },
        { id: '3200', name: '3200 MHz', priceModifier: price3200, description: 'Maximum performance' }
      ];
    }
    return [
      { id: '2133', name: '2133 MHz', priceModifier: 0, description: 'Standard speed' }
    ];
  };

  const speedOptions = getSpeedOptions();

  // State for selections
  const [selectedSpeed, setSelectedSpeed] = useState(speedOptions[0]);
  const [totalPrice, setTotalPrice] = useState(basePrice);

  // Update selected speed when globalPricing loads (only first time)
  useEffect(() => {
    if (globalPricing) {
      const options = getSpeedOptions();
      if (options.length > 0) {
        setSelectedSpeed(options[0]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalPricing]);

  // Calculate total price when selections change
  useEffect(() => {
    const speedModifier = selectedSpeed?.priceModifier || 0;
    const newTotalPrice = basePrice + speedModifier;
    setTotalPrice(newTotalPrice);

    // Notify parent component
    if (onCustomizationChange) {
      onCustomizationChange({
        brand: 'MIX BRAND',
        speed: selectedSpeed,
        totalPrice: newTotalPrice,
        additionalCost: speedModifier,
        specs: {
          brand: 'MIX BRAND',
          speed: selectedSpeed.name,
          capacity: capacity,
          type: product?.ram_type || 'DDR4'
        }
      });
    }
  }, [selectedSpeed, basePrice, capacity, product?.ram_type, onCustomizationChange]);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#6dc1c9] to-teal-500 px-4 py-3">
        <h3 className="text-white font-bold flex items-center gap-2">
          <Cpu className="w-5 h-5" />
          Customize Your RAM
        </h3>
        <p className="text-sm text-teal-100">Select speed for your {capacity} {product?.ram_type || 'DDR4'} RAM</p>
      </div>

      <div className="p-4 space-y-5">

      {/* Brand Display (Non-selectable) */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-3">
          <Award className="w-4 h-4 text-[#6dc1c9]" />
          Available Brands (MIX BRAND)
        </label>
        <div className="p-4 rounded-lg border border-gray-200 bg-white">
          <div className="text-center mb-2">
            <div className="text-lg font-bold text-[#6dc1c9]">MIX BRAND</div>
            <div className="text-xs text-gray-600 mt-1">Any of the following brands may be provided based on availability</div>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            {brands.map((brand) => (
              <span
                key={brand}
                className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-full text-xs font-medium text-gray-700"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Speed Selection */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-3">
          <Zap className="w-4 h-4 text-[#6dc1c9]" />
          Select Speed (Frequency)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {speedOptions.map((speed) => (
            <button
              key={speed.id}
              onClick={() => setSelectedSpeed(speed)}
              className={`relative text-left p-3 rounded-xl transition-all ${
                selectedSpeed.id === speed.id
                  ? 'bg-[#6dc1c9] text-white shadow-lg shadow-[#6dc1c9]/30'
                  : 'bg-white border border-gray-200 hover:border-[#6dc1c9] hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className={`font-semibold flex items-center gap-2 ${selectedSpeed.id === speed.id ? 'text-white' : 'text-gray-900'}`}>
                    <Clock className={`w-4 h-4 ${selectedSpeed.id === speed.id ? 'text-white' : 'text-[#6dc1c9]'}`} />
                    {speed.name}
                  </div>
                  <div className={`text-xs mt-1 ${selectedSpeed.id === speed.id ? 'text-teal-100' : 'text-gray-500'}`}>{speed.description}</div>
                </div>
                {speed.priceModifier !== 0 && (
                  <div className={`text-sm font-bold ${selectedSpeed.id === speed.id ? 'text-white' : 'text-[#6dc1c9]'}`}>
                    +Rs {speed.priceModifier}
                  </div>
                )}
              </div>
              {selectedSpeed.id === speed.id && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow">
                  <svg className="w-3 h-3 text-[#6dc1c9]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Price Summary */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <h4 className="font-bold text-gray-800 mb-3 text-sm flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#6dc1c9]/10 flex items-center justify-center">
            <span className="text-[#6dc1c9] text-xs">₨</span>
          </div>
          Price Summary
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Base Price (2133 MHz)</span>
            <span className="font-medium text-gray-800">Rs {basePrice.toLocaleString()}</span>
          </div>
          {selectedSpeed.priceModifier !== 0 && (
            <div className="flex justify-between">
              <span className="text-[#6dc1c9]">+ Speed ({selectedSpeed.name})</span>
              <span className="font-medium text-gray-800">Rs {selectedSpeed.priceModifier.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between pt-3 border-t border-dashed border-gray-200">
            <span className="font-bold text-gray-800">Total</span>
            <span className="font-bold text-[#6dc1c9] text-lg">Rs {totalPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Selected Configuration Summary */}
      <div className="p-3 bg-[#6dc1c9]/10 rounded-lg border border-[#6dc1c9]/20">
        <div className="text-sm font-semibold text-gray-800 mb-1">Your Configuration:</div>
        <div className="text-sm text-gray-700">
          MIX BRAND {capacity} {product?.ram_type || 'DDR4'} {selectedSpeed.name} - {product?.ram_form_factor || 'Laptop (SO-DIMM)'}
        </div>
      </div>
      </div>
    </div>
  );
}
