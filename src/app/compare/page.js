'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { GitCompareArrows, ArrowRight } from 'lucide-react';
import { useCompare } from '../../context/CompareContext';
import CompareTable from '../../components/CompareTable';

export default function Compare() {
  const { compareItems } = useCompare();
  const [freshProducts, setFreshProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch fresh product data when compare items change
  useEffect(() => {
    const fetchFreshProductData = async () => {
      if (compareItems.length === 0) {
        setFreshProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Fetch fresh data for each product
        const productPromises = compareItems.map(item =>
          fetch(`/api/products/${item.id}`)
            .then(res => res.json())
            .then(data => data.success ? data.product : null)
            .catch(err => {
              console.error(`Error fetching product ${item.id}:`, err);
              return item; // Fallback to cached data if fetch fails
            })
        );

        const products = await Promise.all(productPromises);
        setFreshProducts(products.filter(p => p !== null));
      } catch (error) {
        console.error('Error fetching fresh product data:', error);
        setFreshProducts(compareItems); // Fallback to cached data
      } finally {
        setLoading(false);
      }
    };

    fetchFreshProductData();
  }, [compareItems]);

  if (compareItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        {/* Hero Section */}
        <section className="py-8 sm:py-10 pb-0">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 sm:mb-12 lg:mb-16">
              <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
                Product Comparison
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">Compare Products</h1>
              <div className="w-16 sm:w-24 h-1 bg-[#6dc1c9] rounded-full mx-auto"></div>
            </div>
          </div>
        </section>

        {/* Empty Compare */}
        <section className="py-8 sm:py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-12 border border-gray-100">
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
                  <GitCompareArrows className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">No Products to Compare</h2>
                <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                  Add products to your comparison list to see their features side by side.
                  You can compare up to 4 laptops at once to find the perfect match!
                </p>
                <Link
                  href="/products"
                  className="bg-[#6dc1c9] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-base lg:text-lg hover:bg-teal-700 transition-colors inline-flex items-center shadow-lg hover:shadow-xl"
                >
                  Browse Laptops
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
              Product Comparison
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">Compare Products</h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-4 sm:mb-6">
              Compare {compareItems.length} {compareItems.length === 1 ? 'product' : 'products'} side by side
            </p>
            <div className="w-16 sm:w-24 h-1 bg-[#6dc1c9] rounded-full mx-auto"></div>
          </div>
        </div>
      </section>

      {/* Compare Content */}
      <section className="pb-20">
        <div className="container mx-auto px-4">

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#6dc1c9] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading fresh product details...</p>
            </div>
          </div>
        ) : (
          <CompareTable products={freshProducts} />
        )}

        {/* Continue Shopping */}
        <div className="mt-8 sm:mt-12 text-center">
          <Link
            href="/products"
            className="bg-[#6dc1c9] text-white px-6 sm:px-8 py-3 rounded-lg font-semibold text-sm sm:text-base hover:bg-teal-700 transition-colors inline-flex items-center shadow-lg hover:shadow-xl"
          >
            Browse More Products
            <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        </div>
        </div>
      </section>
    </div>
  );
}