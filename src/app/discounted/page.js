'use client';

import React, { useEffect, useState } from 'react';
import { Filter, Grid, List, SortAsc, Loader, Tag } from 'lucide-react';
import ProductCard from '../../components/ProductCard';
import FilterSidebar from '../../components/FilterSidebar';
import { productsAPI } from '../../lib/supabase-db';

export default function DiscountedPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('discount'); // discount, priceAsc, priceDesc, newest
  const [viewMode, setViewMode] = useState('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        // Get all products and filter on client side for discounted items
        const { data: allData, error: allError } = await productsAPI.getAll(5000, true);
        if (allError) throw allError;
        if (!mounted) return;
        setProducts(allData || []);
      } catch (err) {
        console.error('Error loading products for discounted:', err);
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
    // Filter out SEO-only products first (they should only be visible via direct URL, not in catalog)
    const visibleProducts = products.filter((p) => !p.seo_only);

    // Products that qualify for discounted page:
    // 1. Has is_discounted flag OR
    // 2. Has a discount >=10% (for showing sale products)
    const discountedCandidates = visibleProducts.filter((p) => {
      // Check explicit discounted flag first
      if (p.is_discounted) return true;

      // Fallback to discount calculation
      const discount = getDiscount(p);
      return discount >= 10;
    });

    // Apply sidebar filters (partial, respects inStock and featured and brands/generation)
    const filtered = discountedCandidates.filter((p) => {
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

      // Generation filter (Laptop specific)
      if (filters.generation && filters.generation.length > 0) {
        const gen = (p.generation || '').toString();
        if (!filters.generation.includes(gen)) return false;
      }

      // Processor filter
      if (filters.processors && filters.processors.length > 0) {
        const processor = (p.processor || '').toLowerCase();
        const matched = filters.processors.some(fp => processor.includes(fp.toLowerCase()));
        if (!matched) return false;
      }

      // RAM filter
      if (filters.ram && filters.ram.length > 0) {
        const ram = (p.ram || '').toString();
        if (!filters.ram.includes(ram)) return false;
      }

      // Price range filter
      if (filters.priceRange) {
        const price = p.price || 0;
        if (price < filters.priceRange.min || price > filters.priceRange.max) return false;
      }

      return true;
    });

    // Sort
    const sorted = [...filtered];
    if (sortBy === 'discount') {
      sorted.sort((a, b) => getDiscount(b) - getDiscount(a));
    } else if (sortBy === 'priceAsc') {
      sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'priceDesc') {
      sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === 'newest') {
      sorted.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
        const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
        return dateB - dateA;
      });
    }

    return sorted;
  };

  const displayedProducts = applyFiltersAndSort();

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Get unique values for filters from discounted products only
  const getFilterOptions = () => {
    const visibleProducts = products.filter((p) => !p.seo_only);
    const discountedOnly = visibleProducts.filter((p) => {
      if (p.is_discounted) return true;
      const discount = getDiscount(p);
      return discount >= 10;
    });

    const brands = [...new Set(discountedOnly.map(p => p.brand || p.make).filter(Boolean))].sort();
    const generations = [...new Set(discountedOnly.map(p => p.generation).filter(Boolean))].sort();
    const processors = [...new Set(discountedOnly.map(p => p.processor).filter(Boolean))].sort();
    const ramOptions = [...new Set(discountedOnly.map(p => p.ram).filter(Boolean))].sort();

    // Generate price ranges based on actual prices
    const prices = discountedOnly.map(p => p.price).filter(p => p > 0).sort((a, b) => a - b);
    let priceRanges = [];
    if (prices.length > 0) {
      const minPrice = Math.floor(prices[0] / 10000) * 10000;
      const maxPrice = Math.ceil(prices[prices.length - 1] / 10000) * 10000;
      const step = 20000;

      for (let i = minPrice; i < maxPrice; i += step) {
        const rangeMax = i + step;
        priceRanges.push({
          label: `Rs ${i.toLocaleString()} - Rs ${rangeMax.toLocaleString()}`,
          min: i,
          max: rangeMax
        });
      }

      if (maxPrice > minPrice) {
        priceRanges.push({
          label: `Above Rs ${maxPrice.toLocaleString()}`,
          min: maxPrice,
          max: Infinity
        });
      }
    }

    return { brands, generations, processors, ram: ramOptions, priceRanges };
  };

  const filterOptions = getFilterOptions();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <FilterSidebar
            filters={filters}
            onFiltersChange={handleFiltersChange}
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            category="discounted"
            dynamicLaptopOptions={{
              brands: filterOptions.brands,
              processors: filterOptions.processors,
              ram: filterOptions.ram,
              generation: filterOptions.generations,
              priceRanges: filterOptions.priceRanges
            }}
          />

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="lg:hidden flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Filter className="w-4 h-4" />
                    <span>Filters</span>
                  </button>

                  <div className="text-gray-600">
                    <h1 className="text-xl font-bold text-gray-900">Discounted Products</h1>
                    <p className="text-sm">Showing {displayedProducts.length} of {products.length} products</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Sort Dropdown */}
                  <div className="flex items-center space-x-2">
                    <SortAsc className="w-4 h-4 text-gray-600" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="discount">Highest Discount</option>
                      <option value="priceAsc">Price: Low to High</option>
                      <option value="priceDesc">Price: High to Low</option>
                      <option value="newest">Newest First</option>
                    </select>
                  </div>

                  {/* View Mode Toggle */}
                  <div className="flex border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600'} rounded-l-lg`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600'} rounded-r-lg`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Retry
                </button>
              </div>
            ) : displayedProducts.length === 0 ? (
              <div className="text-center py-20">
                <Tag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No discounted products found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or check back later for new discounts.</p>
                <button
                  onClick={() => setFilters({})}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className={viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'flex flex-col space-y-4'
              }>
                {displayedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
