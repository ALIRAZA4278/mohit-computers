'use client';

import React, { useEffect, useState } from 'react';
import Banner from '../../components/Banner';
import ProductCard from '../../components/ProductCard';
import FilterSidebar from '../../components/FilterSidebar';
import { productsAPI } from '../../lib/supabase-db';

export default function ClearancePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('discount'); // discount, priceAsc, priceDesc, newest
  const [itemsToShow, setItemsToShow] = useState(24);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        // Get all products and filter on client side for clearance/discounted items
        const { data: allData, error: allError } = await productsAPI.getAll(5000, true);
        if (allError) throw allError;
        if (!mounted) return;
        setProducts(allData || []);
      } catch (err) {
        console.error('Error loading products for clearance:', err);
        setError(err?.message || 'Failed to load products');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false };
  }, []);

  // Helper: compute discount percent
  const getDiscount = (p) => {
    // Use admin set discount percentage if available
    if (p.is_discounted && p.discount_percentage) return p.discount_percentage;
    
    // Calculate from original price
    const original = p.original_price ?? p.originalPrice ?? 0;
    const price = p.price ?? 0;
    if (!original || original <= price) return 0;
    return Math.round(((original - price) / original) * 100);
  };

  const applyFiltersAndSort = () => {
    // Products that qualify for clearance page: 
    // 1. Has is_clearance flag OR 
    // 2. Has is_discounted flag OR
    // 3. Has a discount >=15% (for backward compatibility)
    const clearanceCandidates = products.filter((p) => {
      // Check explicit clearance flag first
      if (p.is_clearance) return true;
      
      // Check discounted flag
      if (p.is_discounted) return true;
      
      // Fallback to discount calculation for backward compatibility
      const discount = getDiscount(p);
      return discount >= 15;
    });

    // Apply sidebar filters (partial, respects inStock and featured and brands/generation)
    const filtered = clearanceCandidates.filter((p) => {
      // In stock filter
      if (filters.inStock) {
        // Check if product is active
        if (p.is_active === false) return false;

        // Check the in_stock boolean field first
        if (p.in_stock !== undefined && p.in_stock !== null) {
          if (p.in_stock === false || p.in_stock === 'false') return false;
        }

        // Also check stock_quantity field
        if (p.stock_quantity !== undefined && p.stock_quantity !== null) {
          const stockQty = typeof p.stock_quantity === 'string'
            ? parseInt(p.stock_quantity, 10)
            : p.stock_quantity;
          if (stockQty <= 0) return false;
        }
      }

      // Featured
      if (filters.featured && !(p.is_featured || p.featured)) return false;

      // Brand filter
      if (filters.brands && filters.brands.length > 0) {
        const brand = (p.brand || p.make || '').toString();
        if (!filters.brands.includes(brand)) return false;
      }

      // Generation / processors / other checkbox filters - best effort
      if (filters.generation && filters.generation.length > 0) {
        const gen = (p.generation || '').toString();
        if (!filters.generation.includes(gen)) return false;
      }

      // Price range
      if (filters.priceRange) {
        const price = p.price ?? 0;
        const { min = 0, max = Number.POSITIVE_INFINITY } = filters.priceRange;
        if (price < min || price > max) return false;
      }

      return true;
    });

    // Sorting
    const sorted = filtered.sort((a, b) => {
      if (sortBy === 'priceAsc') return (a.price ?? 0) - (b.price ?? 0);
      if (sortBy === 'priceDesc') return (b.price ?? 0) - (a.price ?? 0);
      if (sortBy === 'newest') return new Date(b.created_at || b.createdAt || 0) - new Date(a.created_at || a.createdAt || 0);
      // default discount
      const da = getDiscount(a);
      const db = getDiscount(b);
      return db - da;
    });

    return sorted;
  };

  const filteredProducts = applyFiltersAndSort();
  const visibleProducts = filteredProducts.slice(0, itemsToShow);

  return (
    <div className="container mx-auto px-4 py-8">
      <Banner
        desktopImage="/banners/hero banner 1.jpg"
        mobileImage="/banners/hero mobile banner 1.jpg"
        alt="Clearance & Discounted Products - Mohit Computers"
        priority
      />

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <FilterSidebar
            filters={filters}
            onFiltersChange={(f) => { setFilters(f); setItemsToShow(24); }}
            isOpen={false}
            onClose={() => {}}
            category={null}
          />
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">Clearance & Discounted Products</h1>
              <p className="text-sm text-gray-600">Best deals, clearance items, and discounted products — limited stock and special offers.</p>
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-600">Sort by:</div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value="discount">Best Discount</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          {loading && (
            <div className="py-12 text-center text-gray-500">Loading products...</div>
          )}

          {!loading && error && (
            <div className="py-12 text-center text-red-500">{error}</div>
          )}

          {!loading && !error && visibleProducts.length === 0 && (
            <div className="py-12 text-center text-gray-500">No clearance or discounted products found.</div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
            {visibleProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {/* Load more */}
          {visibleProducts.length < filteredProducts.length && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setItemsToShow((s) => s + 24)}
                className="px-4 py-2 bg-[#6dc1c9] text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                Load more
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}