'use client';

import React from 'react';
import Link from 'next/link';
import { BarChart3, ArrowRight } from 'lucide-react';
import { useCompare } from '../../context/CompareContext';
import CompareTable from '../../components/CompareTable';

export default function Compare() {
  const { compareItems } = useCompare();

  if (compareItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <BarChart3 className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-800 mb-4">No Products to Compare</h1>
            <p className="text-gray-600 mb-8">
              Add products to your comparison list to see their features side by side. 
              You can compare up to 4 products at once.
            </p>
            <Link 
              href="/products"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              Browse Products
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Product Comparison</h1>
          <p className="text-gray-600">
            Compare {compareItems.length} {compareItems.length === 1 ? 'product' : 'products'} side by side
          </p>
        </div>

        {/* Compare Table */}
        <CompareTable />

        {/* Continue Shopping */}
        <div className="mt-12 text-center">
          <Link 
            href="/products"
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center"
          >
            Browse More Products
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}