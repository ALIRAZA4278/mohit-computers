'use client';

import React, { useEffect, useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Filter, Grid, List, SortAsc, Loader, Tag, X } from 'lucide-react';
import ProductCard from '../../components/ProductCard';
import { productsAPI } from '../../lib/supabase-db';

// Category configuration
const CATEGORIES = [
  { id: 'all', label: 'View All' },
  { id: 'laptop', label: 'Used Laptops' },
  { id: 'chromebook', label: 'Chromebook' },
  { id: 'ram', label: 'RAM' },
  { id: 'ssd', label: 'SSD' },
  { id: 'accessories', label: 'Accessories' },
];

// Loading component
function SalesLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <Loader className="w-12 h-12 animate-spin text-[#6dc1c9] mx-auto mb-4" />
        <p className="text-gray-600">Loading sales...</p>
      </div>
    </div>
  );
}

// Main sales content component
function SalesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlCategory = searchParams.get('category') || 'all';

  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('discount');
  const [viewMode, setViewMode] = useState('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filters state
  const [filters, setFilters] = useState({});
  const [customPriceMin, setCustomPriceMin] = useState('');
  const [customPriceMax, setCustomPriceMax] = useState('');

  // Fetch all discounted products
  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const { data: allData, error: allError } = await productsAPI.getAll(5000, true);
        if (allError) throw allError;
        if (!mounted) return;
        setProducts(allData || []);
      } catch (err) {
        console.error('Error loading products:', err);
        setError(err?.message || 'Failed to load products');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false };
  }, []);

  // Update URL when category changes
  useEffect(() => {
    if (selectedCategory && selectedCategory !== 'all') {
      router.push(`/sales?category=${selectedCategory}`, { scroll: false });
    } else {
      router.push('/sales', { scroll: false });
    }
  }, [selectedCategory, router]);

  // Reset filters when category changes
  useEffect(() => {
    setFilters({});
    setCustomPriceMin('');
    setCustomPriceMax('');
  }, [selectedCategory]);

  // Helper: compute discount percent
  const getDiscount = (p) => {
    if (p.is_discounted && p.discount_percentage) return p.discount_percentage;
    const original = p.original_price ?? p.originalPrice ?? 0;
    const price = p.price ?? 0;
    if (!original || original <= price) return 0;
    return Math.round(((original - price) / original) * 100);
  };

  // Get discounted products only
  const discountedProducts = useMemo(() => {
    return products.filter((p) => {
      if (p.seo_only) return false;
      if (p.is_discounted) return true;
      const discount = getDiscount(p);
      return discount >= 10;
    });
  }, [products]);

  // Get category counts
  const categoryCounts = useMemo(() => {
    const counts = { all: discountedProducts.length };
    CATEGORIES.forEach(cat => {
      if (cat.id !== 'all') {
        counts[cat.id] = discountedProducts.filter(p =>
          p.category_id === cat.id || p.category === cat.id
        ).length;
      }
    });
    return counts;
  }, [discountedProducts]);

  // Filter products by selected category
  const categoryFilteredProducts = useMemo(() => {
    if (!selectedCategory || selectedCategory === 'all') {
      return discountedProducts;
    }
    return discountedProducts.filter(p =>
      p.category_id === selectedCategory || p.category === selectedCategory
    );
  }, [discountedProducts, selectedCategory]);

  // Generate dynamic filter options based on selected category
  const filterOptions = useMemo(() => {
    const productsToAnalyze = categoryFilteredProducts;

    // Filter out empty/invalid values
    const isValidValue = (value) => {
      if (!value) return false;
      const str = String(value).trim().toLowerCase();
      return str !== '-' && str !== '--' && str !== '—' && str !== 'n/a' && str !== 'na' && str !== 'null' && str !== 'undefined' && str.length > 0;
    };

    const brands = [...new Set(productsToAnalyze.map(p => p.brand || p.make).filter(isValidValue))].sort();
    const generations = [...new Set(productsToAnalyze.map(p => p.generation).filter(isValidValue))].sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || '0');
      const numB = parseInt(b.match(/\d+/)?.[0] || '0');
      return numA - numB;
    });
    const processors = [...new Set(productsToAnalyze.map(p => p.processor).filter(isValidValue))].sort();
    const ramOptions = [...new Set(productsToAnalyze.map(p => p.ram).filter(isValidValue))].sort();

    // RAM specific filters
    const ramType = [...new Set(productsToAnalyze.map(p => {
      const typeStr = (p.ram_type || '').toUpperCase();
      if (typeStr.includes('DDR5')) return 'DDR5';
      if (typeStr.includes('DDR4')) return 'DDR4';
      if (typeStr.includes('DDR3L')) return 'DDR3L';
      if (typeStr.includes('DDR3')) return 'DDR3';
      return null;
    }).filter(Boolean))].sort();

    const ramCapacity = [...new Set([
      ...productsToAnalyze.map(p => p.ram_capacity).filter(isValidValue),
      ...productsToAnalyze.map(p => p.capacity).filter(isValidValue),
      ...productsToAnalyze.map(p => p.ram).filter(isValidValue)
    ])].sort();

    const ramSpeed = [...new Set([
      ...productsToAnalyze.map(p => p.ram_speed).filter(isValidValue),
      ...productsToAnalyze.map(p => p.speed).filter(isValidValue)
    ])].sort();

    const ramFormFactor = [...new Set([
      ...productsToAnalyze.map(p => p.ram_form_factor).filter(isValidValue),
      ...productsToAnalyze.map(p => p.form_factor).filter(isValidValue)
    ])].sort();

    const ramCondition = [...new Set(productsToAnalyze.map(p => p.condition).filter(isValidValue))].sort();
    const ramWarranty = [...new Set(productsToAnalyze.map(p => p.warranty).filter(isValidValue))].sort();

    // SSD specific filters
    const ssdCapacity = [...new Set(productsToAnalyze.map(p => p.ssd_capacity).filter(isValidValue))].sort((a, b) => {
      const getGB = (val) => {
        const str = String(val).toUpperCase();
        if (str.includes('TB')) return parseFloat(str) * 1024;
        return parseFloat(str) || 0;
      };
      return getGB(a) - getGB(b);
    });

    const ssdFormFactor = [...new Set(productsToAnalyze.map(p => p.ssd_form_factor).filter(isValidValue))].sort();
    const ssdInterface = [...new Set(productsToAnalyze.map(p => p.ssd_interface).filter(isValidValue))].sort();
    const ssdCondition = [...new Set(productsToAnalyze.map(p => p.ssd_condition || p.condition).filter(isValidValue))].sort();
    const ssdWarranty = [...new Set(productsToAnalyze.map(p => p.ssd_warranty || p.warranty).filter(isValidValue))].sort();

    const prices = productsToAnalyze.map(p => p.price).filter(p => p > 0).sort((a, b) => a - b);
    let priceRanges = [];
    if (prices.length > 0) {
      const minPrice = Math.floor(prices[0] / 10000) * 10000;
      const maxPrice = Math.ceil(prices[prices.length - 1] / 10000) * 10000;
      const step = selectedCategory === 'ram' || selectedCategory === 'ssd' ? 5000 : 20000;

      for (let i = minPrice; i < maxPrice; i += step) {
        priceRanges.push({
          label: `Rs ${i.toLocaleString()} - Rs ${(i + step).toLocaleString()}`,
          min: i,
          max: i + step
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

    return {
      brands,
      generations,
      processors,
      ram: ramOptions,
      priceRanges,
      // RAM specific
      ramType,
      ramCapacity,
      ramSpeed,
      ramFormFactor,
      ramCondition,
      ramWarranty,
      // SSD specific
      ssdCapacity,
      ssdFormFactor,
      ssdInterface,
      ssdCondition,
      ssdWarranty
    };
  }, [categoryFilteredProducts, selectedCategory]);

  // Apply all filters and sorting
  const displayedProducts = useMemo(() => {
    let filtered = [...categoryFilteredProducts];

    // In stock filter
    if (filters.inStock) {
      filtered = filtered.filter(p => {
        if (p.is_active === false) return false;
        if (p.in_stock === false || p.in_stock === 'false') return false;
        if (p.stock_quantity !== undefined && p.stock_quantity !== null) {
          const stockQty = typeof p.stock_quantity === 'string' ? parseInt(p.stock_quantity, 10) : p.stock_quantity;
          if (stockQty <= 0) return false;
        }
        return true;
      });
    }

    // Brand filter
    if (filters.brands && filters.brands.length > 0) {
      filtered = filtered.filter(p => {
        const brand = (p.brand || p.make || '').toString();
        return filters.brands.includes(brand);
      });
    }

    // Processor filter
    if (filters.processors && filters.processors.length > 0) {
      filtered = filtered.filter(p => {
        const processor = (p.processor || '').toLowerCase();
        return filters.processors.some(fp => processor.includes(fp.toLowerCase()));
      });
    }

    // RAM filter
    if (filters.ram && filters.ram.length > 0) {
      filtered = filtered.filter(p => {
        const ram = (p.ram || '').toString();
        return filters.ram.includes(ram);
      });
    }

    // Generation filter
    if (filters.generation && filters.generation.length > 0) {
      filtered = filtered.filter(p => {
        const gen = (p.generation || '').toString();
        return filters.generation.includes(gen);
      });
    }

    // Price range filter
    if (filters.priceRange) {
      filtered = filtered.filter(p => {
        const price = p.price || 0;
        return price >= filters.priceRange.min && price <= filters.priceRange.max;
      });
    }

    // RAM Type filter
    if (filters.ramType && filters.ramType.length > 0) {
      filtered = filtered.filter(p => {
        const typeStr = (p.ram_type || '').toUpperCase();
        return filters.ramType.some(t => typeStr.includes(t));
      });
    }

    // RAM Capacity filter
    if (filters.ramCapacity && filters.ramCapacity.length > 0) {
      filtered = filtered.filter(p => {
        const capacity = (p.ram_capacity || p.capacity || p.ram || '').toString();
        return filters.ramCapacity.includes(capacity);
      });
    }

    // RAM Speed filter
    if (filters.ramSpeed && filters.ramSpeed.length > 0) {
      filtered = filtered.filter(p => {
        const speed = (p.ram_speed || p.speed || '').toString();
        return filters.ramSpeed.includes(speed);
      });
    }

    // RAM Form Factor filter
    if (filters.ramFormFactor && filters.ramFormFactor.length > 0) {
      filtered = filtered.filter(p => {
        const formFactor = (p.ram_form_factor || p.form_factor || '').toString();
        return filters.ramFormFactor.includes(formFactor);
      });
    }

    // RAM Condition filter
    if (filters.ramCondition && filters.ramCondition.length > 0) {
      filtered = filtered.filter(p => {
        const condition = (p.condition || '').toString();
        return filters.ramCondition.includes(condition);
      });
    }

    // RAM Warranty filter
    if (filters.ramWarranty && filters.ramWarranty.length > 0) {
      filtered = filtered.filter(p => {
        const warranty = (p.warranty || '').toString();
        return filters.ramWarranty.includes(warranty);
      });
    }

    // SSD Capacity filter
    if (filters.ssdCapacity && filters.ssdCapacity.length > 0) {
      filtered = filtered.filter(p => {
        const capacity = (p.ssd_capacity || '').toString();
        return filters.ssdCapacity.includes(capacity);
      });
    }

    // SSD Form Factor filter
    if (filters.ssdFormFactor && filters.ssdFormFactor.length > 0) {
      filtered = filtered.filter(p => {
        const formFactor = (p.ssd_form_factor || '').toString();
        return filters.ssdFormFactor.includes(formFactor);
      });
    }

    // SSD Interface filter
    if (filters.ssdInterface && filters.ssdInterface.length > 0) {
      filtered = filtered.filter(p => {
        const iface = (p.ssd_interface || '').toString();
        return filters.ssdInterface.includes(iface);
      });
    }

    // SSD Condition filter
    if (filters.ssdCondition && filters.ssdCondition.length > 0) {
      filtered = filtered.filter(p => {
        const condition = (p.ssd_condition || p.condition || '').toString();
        return filters.ssdCondition.includes(condition);
      });
    }

    // SSD Warranty filter
    if (filters.ssdWarranty && filters.ssdWarranty.length > 0) {
      filtered = filtered.filter(p => {
        const warranty = (p.ssd_warranty || p.warranty || '').toString();
        return filters.ssdWarranty.includes(warranty);
      });
    }

    // Featured filter
    if (filters.featured) {
      filtered = filtered.filter(p => p.is_featured || p.featured);
    }

    // Sort
    if (sortBy === 'discount') {
      filtered.sort((a, b) => getDiscount(b) - getDiscount(a));
    } else if (sortBy === 'priceAsc') {
      filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'priceDesc') {
      filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    }

    return filtered;
  }, [categoryFilteredProducts, filters, sortBy]);

  // Filter handlers
  const handleFilterChange = (category, value, checked) => {
    const newFilters = { ...filters };
    if (!newFilters[category]) {
      newFilters[category] = [];
    }
    if (checked) {
      newFilters[category] = [...newFilters[category], value];
    } else {
      newFilters[category] = newFilters[category].filter(item => item !== value);
    }
    setFilters(newFilters);
  };

  const handlePriceRangeChange = (range) => {
    setFilters({ ...filters, priceRange: range });
  };

  const handleCustomPriceChange = (min, max) => {
    setCustomPriceMin(min);
    setCustomPriceMax(max);

    if (min === '' && max === '') {
      const newFilters = { ...filters };
      delete newFilters.priceRange;
      setFilters(newFilters);
      return;
    }

    const minPrice = min === '' ? 0 : parseInt(min);
    const maxPrice = max === '' ? Number.POSITIVE_INFINITY : parseInt(max);

    if (minPrice > maxPrice && maxPrice !== Number.POSITIVE_INFINITY) {
      return;
    }

    const customRange = {
      label: `Rs ${minPrice.toLocaleString()} - ${maxPrice === Number.POSITIVE_INFINITY ? '∞' : `Rs ${maxPrice.toLocaleString()}`}`,
      min: minPrice,
      max: maxPrice
    };

    setFilters({ ...filters, priceRange: customRange });
  };

  const clearAllFilters = () => {
    setFilters({});
    setSelectedCategory('all');
    setCustomPriceMin('');
    setCustomPriceMax('');
  };

  // Filter Section Component
  const FilterSection = ({ title, options, category }) => (
    <div className="mb-6">
      <h4 className="font-semibold text-gray-800 mb-3">{title}</h4>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {options && options.length > 0 ? options.map((option) => (
          <label key={option} className="flex items-center">
            <input
              type="checkbox"
              checked={filters[category]?.includes(option) || false}
              onChange={(e) => handleFilterChange(category, option, e.target.checked)}
              className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{option}</span>
          </label>
        )) : (
          <p className="text-gray-500 text-sm">No options available</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex">
          {/* Mobile Overlay */}
          {isFilterOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
              onClick={() => setIsFilterOpen(false)}
            />
          )}

          {/* Filter Sidebar */}
          <div className={`
            fixed lg:static inset-y-0 left-0 z-40 w-80 bg-white border-r border-gray-200
            transform transition-transform duration-300 ease-in-out lg:transform-none
            ${isFilterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            overflow-y-auto
          `}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <Filter className="w-5 h-5 mr-2 text-blue-600" />
                Filters
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded lg:hidden"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Filter Content */}
            <div className="p-4">
              {/* In Stock Only */}
              <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.inStock || false}
                    onChange={(e) => {
                      const newFilters = { ...filters };
                      if (e.target.checked) {
                        newFilters.inStock = true;
                      } else {
                        delete newFilters.inStock;
                      }
                      setFilters(newFilters);
                    }}
                    className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <span className="text-sm font-semibold text-gray-800">In Stock Only</span>
                </label>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">Category</h4>
                <div className="space-y-2">
                  {CATEGORIES.map(cat => (
                    <label key={cat.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === cat.id}
                          onChange={() => setSelectedCategory(cat.id)}
                          className="mr-2 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{cat.label}</span>
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        {categoryCounts[cat.id] || 0}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">Price Range</h4>

                {/* Custom Price Range Inputs */}
                <div className="mb-4 p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-2">Custom Range:</p>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      min="0"
                      value={customPriceMin}
                      className="w-full sm:w-16 px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      onChange={(e) => handleCustomPriceChange(e.target.value, customPriceMax)}
                    />
                    <span className="text-gray-500 text-xs text-center sm:text-left py-1 sm:py-0">to</span>
                    <input
                      type="number"
                      placeholder="Max"
                      min="0"
                      value={customPriceMax}
                      className="w-full sm:w-16 px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      onChange={(e) => handleCustomPriceChange(customPriceMin, e.target.value)}
                    />
                  </div>
                  {customPriceMin && customPriceMax && parseInt(customPriceMin) > parseInt(customPriceMax) && (
                    <div className="mt-2 text-xs text-red-500">
                      Min price cannot be greater than max price
                    </div>
                  )}
                  {filters.priceRange && (
                    <div className="mt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-1 sm:space-y-0">
                      <div className="text-xs text-blue-600 font-medium break-all">
                        Active: {filters.priceRange.label}
                      </div>
                      <button
                        onClick={() => {
                          const newFilters = { ...filters };
                          delete newFilters.priceRange;
                          setFilters(newFilters);
                          setCustomPriceMin('');
                          setCustomPriceMax('');
                        }}
                        className="text-xs text-red-500 hover:text-red-700 underline self-start sm:self-auto"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>

                {/* Preset Price Ranges */}
                {filterOptions.priceRanges.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-600 mb-2">Quick Select:</p>
                    {filterOptions.priceRanges.map((range, idx) => (
                      <label key={idx} className="flex items-center p-1 hover:bg-gray-50 rounded cursor-pointer">
                        <input
                          type="radio"
                          name="priceRange"
                          checked={filters.priceRange?.label === range.label}
                          onChange={() => handlePriceRangeChange(range)}
                          className="mr-2 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{range.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Dynamic Filters based on category */}
              {filterOptions.brands.length > 0 && (
                <FilterSection title="Brand" options={filterOptions.brands} category="brands" />
              )}

              {/* Category-specific filters */}
              {selectedCategory === 'ram' ? (
                <>
                  {filterOptions.ramType.length > 0 && (
                    <FilterSection title="Type" options={filterOptions.ramType} category="ramType" />
                  )}

                  {filterOptions.ramCapacity.length > 0 && (
                    <FilterSection title="Capacity" options={filterOptions.ramCapacity} category="ramCapacity" />
                  )}

                  {filterOptions.ramSpeed.length > 0 && (
                    <FilterSection title="Speed (Frequency)" options={filterOptions.ramSpeed} category="ramSpeed" />
                  )}

                  {filterOptions.ramFormFactor.length > 0 && (
                    <FilterSection title="Form Factor" options={filterOptions.ramFormFactor} category="ramFormFactor" />
                  )}

                  {filterOptions.ramCondition.length > 0 && (
                    <FilterSection title="Condition" options={filterOptions.ramCondition} category="ramCondition" />
                  )}

                  {filterOptions.ramWarranty.length > 0 && (
                    <FilterSection title="Warranty" options={filterOptions.ramWarranty} category="ramWarranty" />
                  )}
                </>
              ) : selectedCategory === 'ssd' ? (
                <>
                  {filterOptions.ssdCapacity.length > 0 && (
                    <FilterSection title="Capacity" options={filterOptions.ssdCapacity} category="ssdCapacity" />
                  )}

                  {filterOptions.ssdFormFactor.length > 0 && (
                    <FilterSection title="Form Factor" options={filterOptions.ssdFormFactor} category="ssdFormFactor" />
                  )}

                  {filterOptions.ssdInterface.length > 0 && (
                    <FilterSection title="Interface" options={filterOptions.ssdInterface} category="ssdInterface" />
                  )}

                  {filterOptions.ssdCondition.length > 0 && (
                    <FilterSection title="Condition" options={filterOptions.ssdCondition} category="ssdCondition" />
                  )}

                  {filterOptions.ssdWarranty.length > 0 && (
                    <FilterSection title="Warranty" options={filterOptions.ssdWarranty} category="ssdWarranty" />
                  )}
                </>
              ) : (
                <>
                  {filterOptions.generations.length > 0 && (
                    <FilterSection title="Generation" options={filterOptions.generations} category="generation" />
                  )}

                  {filterOptions.processors.length > 0 && (
                    <FilterSection title="Processor" options={filterOptions.processors} category="processors" />
                  )}

                  {filterOptions.ram.length > 0 && (
                    <FilterSection title="RAM" options={filterOptions.ram} category="ram" />
                  )}
                </>
              )}

              {/* Featured Products Only */}
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.featured || false}
                    onChange={(e) => {
                      const newFilters = { ...filters };
                      if (e.target.checked) {
                        newFilters.featured = true;
                      } else {
                        delete newFilters.featured;
                      }
                      setFilters(newFilters);
                    }}
                    className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Featured Products Only</span>
                </label>
              </div>

              {/* Apply Filters Button (Mobile) */}
              <div className="lg:hidden">
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 lg:ml-8">
            {/* Toolbar */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setIsFilterOpen(true)}
                    className="lg:hidden flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </button>

                  <div className="text-gray-600">
                    <h1 className="text-xl font-bold text-gray-900">Sale Products</h1>
                    <p className="text-sm">Showing {displayedProducts.length} of {discountedProducts.length} products</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Sort Dropdown */}
                  <div className="flex items-center space-x-2">
                    <SortAsc className="w-4 h-4 text-gray-500" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="border text-black border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="discount">Highest Discount</option>
                      <option value="priceAsc">Price: Low to High</option>
                      <option value="priceDesc">Price: High to Low</option>
                      <option value="newest">Newest First</option>
                    </select>
                  </div>

                  {/* View Mode Toggle */}
                  <div className="border border-gray-300 rounded-lg p-1 flex">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products */}
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
            ) : displayedProducts.length === 0 ? (
              <div className="text-center py-12">
                <Tag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your filters.</p>
                <button
                  onClick={clearAllFilters}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className={`
                ${viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
                  : 'space-y-6'
                }
              `}>
                {displayedProducts.map((p) => (
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

// Export with Suspense wrapper for useSearchParams
export default function SalesPage() {
  return (
    <Suspense fallback={<SalesLoading />}>
      <SalesContent />
    </Suspense>
  );
}
