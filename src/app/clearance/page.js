'use client';

import React, { useEffect, useState } from 'react';
import { Filter, Grid, List, SortAsc, Loader } from 'lucide-react';
import ProductCard from '../../components/ProductCard';
import FilterSidebar from '../../components/FilterSidebar';
import { productsAPI } from '../../lib/supabase-db';

export default function ClearancePage() {
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
    // Filter out SEO-only products first (they should only be visible via direct URL, not in catalog)
    const visibleProducts = products.filter((p) => !p.seo_only);

    // Products that qualify for clearance page:
    // 1. Has is_clearance flag OR
    // 2. Has is_discounted flag OR
    // 3. Has a discount >=15% (for backward compatibility)
    const clearanceCandidates = visibleProducts.filter((p) => {
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

    // Helper function to check if product is in stock
    const isInStock = (product) => {
      // Check if product is active
      if (product.is_active === false) return false;

      // Check the in_stock boolean field
      if (product.in_stock !== undefined && product.in_stock !== null) {
        if (product.in_stock === false || product.in_stock === 'false') return false;
      }

      // Check stock_quantity field
      if (product.stock_quantity !== undefined && product.stock_quantity !== null) {
        const stockQty = typeof product.stock_quantity === 'string'
          ? parseInt(product.stock_quantity, 10)
          : product.stock_quantity;
        if (stockQty <= 0) return false;
      }

      return true;
    };

    // Sorting with stock status priority
    const sorted = filtered.sort((a, b) => {
      // First, prioritize in-stock products
      const aInStock = isInStock(a);
      const bInStock = isInStock(b);

      if (aInStock && !bInStock) return -1;
      if (!aInStock && bInStock) return 1;

      // If both have same stock status, apply regular sorting
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

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Clearance Sale</h1>
            <div className="flex justify-center mb-4">
              <div className="w-24 h-1 bg-[#6dc1c9] rounded-full"></div>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Amazing deals on quality laptops and accessories. Limited stock available!
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-8">
        <div className="flex">
          {/* Filter Sidebar */}
          <FilterSidebar
            filters={filters}
            onFiltersChange={setFilters}
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            category={null}
          />

          {/* Main Content */}
          <div className="flex-1 lg:ml-8">
            {/* Toolbar */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={toggleFilter}
                    className="lg:hidden flex items-center px-4 py-2 bg-[#6dc1c9] text-white rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </button>

                  <div className="text-gray-600">
                    Showing {filteredProducts.length} of {products.length} products
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Sort Dropdown */}
                  <div className="flex items-center space-x-2">
                    <SortAsc className="w-4 h-4 text-gray-500" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="border text-black border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6dc1c9]"
                    >
                      <option value="discount">Best Discount</option>
                      <option value="priceAsc">Price: Low to High</option>
                      <option value="priceDesc">Price: High to Low</option>
                      <option value="newest">Newest First</option>
                    </select>
                  </div>

                  {/* View Mode Toggle */}
                  <div className="border border-gray-300 rounded-lg p-1 flex">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded ${
                        viewMode === 'grid'
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded ${
                        viewMode === 'list'
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Loading products...</span>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-red-600 mb-2">Error Loading Products</h3>
                <p className="text-gray-500">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Retry
                </button>
              </div>
            ) : !filteredProducts || filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
                <p className="text-gray-500">No clearance or discounted products available at this time.</p>
              </div>
            ) : (
              <div className={`
                ${viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
                  : 'space-y-6'
                }
              `}>
                {filteredProducts.map((p) => (
                  <ProductCard key={p.id} product={p} showCompare={true} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}