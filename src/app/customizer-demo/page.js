'use client';

import React from 'react';
import LaptopCustomizer from '../components/LaptopCustomizer';

export default function CustomizerDemo() {
  // Sample laptop product for testing
  const sampleLaptop = {
    id: 'sample-laptop',
    name: 'HP EliteBook 840 G5',
    price: 35000,
    category_id: 'laptop',
    ram: '8GB',
    hdd: '256GB SSD',
    processor: 'Intel Core i5',
    generation: '8th Gen',
    brand: 'HP'
  };

  const handleCustomizationChange = (customizationData) => {
    console.log('Customization changed:', customizationData);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Laptop Customizer Demo</h1>
          <p className="text-gray-600">Test the laptop customization features</p>
        </div>

        {/* Sample Product Info */}
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Sample Product</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Name:</strong> {sampleLaptop.name}</p>
            <p><strong>Base Price:</strong> Rs:{sampleLaptop.price.toLocaleString()}</p>
            <p><strong>RAM:</strong> {sampleLaptop.ram}</p>
            <p><strong>Storage:</strong> {sampleLaptop.hdd}</p>
            <p><strong>Processor:</strong> {sampleLaptop.processor}</p>
          </div>
        </div>

        {/* Laptop Customizer Component */}
        <div className="max-w-4xl mx-auto">
          <LaptopCustomizer 
            product={sampleLaptop}
            onCustomizationChange={handleCustomizationChange}
          />
        </div>
      </div>
    </div>
  );
}