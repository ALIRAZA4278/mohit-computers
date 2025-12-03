'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter, Grid, List, SortAsc, Loader } from 'lucide-react';
import ProductCard from '../../components/ProductCard';
import FilterSidebar from '../../components/FilterSidebar';

function WorkstationContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dynamicLaptopOptions, setDynamicLaptopOptions] = useState({});

  // Generate dynamic filter options from available products
  const generateDynamicFilters = (productsList) => {
    // Filter workstation products and exclude SEO-only
    const availableProducts = productsList.filter(p =>
      !p.seo_only &&
      (p.is_workstation === true || p.category_id === 'workstation')
    );

    // Filter out empty/invalid values
    const isValidValue = (value) => {
      if (!value) return false;
      const str = String(value).trim().toLowerCase();
      // Filter out common empty/placeholder values
      return str !== '-' && str !== '--' && str !== '—' && str !== 'n/a' && str !== 'na' && str !== 'null' && str !== 'undefined' && str.length > 0;
    };

    const extractUniqueValues = (field, processor) => {
      const values = availableProducts
        .map(p => processor ? processor(p[field]) : p[field])
        .filter(Boolean)
        .flat()
        .filter(isValidValue) // Filter out invalid values
        .map(v => String(v).trim()); // Normalize: trim whitespace and convert to string
      return [...new Set(values)].sort();
    };

    // Sort generations in proper numerical order (4th Gen, 5th Gen, etc.)
    const sortGenerations = (generations) => {
      return generations.sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)?.[0] || '0');
        const numB = parseInt(b.match(/\d+/)?.[0] || '0');
        return numA - numB;
      });
    };

    // Generate dynamic price ranges based on actual product prices
    const generatePriceRanges = () => {
      const prices = availableProducts.map(p => p.price).filter(p => p > 0).sort((a, b) => a - b);
      if (prices.length === 0) return [];

      const minPrice = Math.floor(prices[0] / 10000) * 10000; // Round down to nearest 10k
      const maxPrice = Math.ceil(prices[prices.length - 1] / 10000) * 10000; // Round up to nearest 10k

      const ranges = [];
      const step = 20000; // 20k steps for workstations

      for (let i = minPrice; i < maxPrice; i += step) {
        const rangeMax = i + step;
        const label = `Rs:${i.toLocaleString()} - Rs:${rangeMax.toLocaleString()}`;
        ranges.push({ label, min: i, max: rangeMax });
      }

      // Add "Above" range
      if (maxPrice > minPrice) {
        const aboveLabel = `Above Rs:${maxPrice.toLocaleString()}`;
        ranges.push({ label: aboveLabel, min: maxPrice, max: Infinity });
      }

      return ranges;
    };

    const generations = extractUniqueValues('generation');

    // Combine and deduplicate storage values
    const storages = [...new Set([
      ...extractUniqueValues('hdd'),
      ...extractUniqueValues('storage')
    ])].sort();

    // Combine and deduplicate display values
    const displays = [...new Set([
      ...extractUniqueValues('display_size'),
      ...extractUniqueValues('display')
    ])].sort();

    // Combine and deduplicate graphics values
    const graphics = [...new Set([
      ...extractUniqueValues('discrete_graphics'),
      ...extractUniqueValues('integrated_graphics'),
      ...extractUniqueValues('graphics')
    ])].sort();

    return {
      brands: extractUniqueValues('brand'),
      processors: extractUniqueValues('processor'),
      ram: extractUniqueValues('ram'),
      storage: storages,
      display: displays,
      generation: sortGenerations(generations), // Sort generations numerically
      graphics: graphics,
      touchType: extractUniqueValues('touch_type'),
      resolution: extractUniqueValues('resolution'),
      operatingSystem: extractUniqueValues('os'),
      priceRanges: generatePriceRanges()
    };
  };

  // Fetch workstation products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products');
        const data = await response.json();
        
        if (data.success) {
          // Filter only workstation products
          const workstationProducts = (data.data || []).filter(
            product => product.is_workstation === true || product.category_id === 'workstation'
          );
          setProducts(workstationProducts);

          // Generate dynamic filter options from available products
          const dynamicOptions = generateDynamicFilters(workstationProducts);
          setDynamicLaptopOptions(dynamicOptions);

          console.log('Workstation products loaded:', workstationProducts.length);
          console.log('Dynamic filter options:', dynamicOptions);
        } else {
          setError(data.error || 'Failed to load products');
        }
      } catch (err) {
        console.error('Error fetching workstation products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Watch for URL parameter changes
  useEffect(() => {
    const brand = searchParams.get('brand');
    const search = searchParams.get('search');

    const newFilters = {};

    if (brand) {
      newFilters.brands = [brand];
    }

    if (search) {
      setSearchQuery(search);
    } else {
      setSearchQuery('');
    }

    setFilters(newFilters);
  }, [searchParams]);

  // Apply filters and search
  useEffect(() => {
    if (!products || !Array.isArray(products)) {
      setFilteredProducts([]);
      return;
    }

    let filtered = [...products];

    // Filter out SEO-only products (they should only be visible via direct URL, not in catalog)
    filtered = filtered.filter(product => !product.seo_only);

    // Apply brand filter
    if (filters.brands && filters.brands.length > 0) {
      filtered = filtered.filter(product => {
        const productBrand = (product.brand || '').toLowerCase().trim();
        return filters.brands.some(brand => {
          const filterBrand = brand.toLowerCase().trim();
          return productBrand === filterBrand || productBrand.includes(filterBrand);
        });
      });
    }

    // Apply processor filter
    if (filters.processors && filters.processors.length > 0) {
      filtered = filtered.filter(product => {
        const productProcessor = (product.processor || '').toLowerCase();
        return filters.processors.some(filterProcessor => {
          const filterProc = filterProcessor.toLowerCase();
          return productProcessor === filterProc || productProcessor.includes(filterProc);
        });
      });
    }

    // Apply RAM filter
    if (filters.ram && filters.ram.length > 0) {
      filtered = filtered.filter(product => {
        const productRam = product.ram || '';
        return filters.ram.some(filterRam => {
          return productRam === filterRam || productRam.includes(filterRam);
        });
      });
    }

    // Apply storage filter
    if (filters.storage && filters.storage.length > 0) {
      filtered = filtered.filter(product => {
        const productStorage = product.hdd || '';
        return filters.storage.some(filterStorage => {
          return productStorage === filterStorage || productStorage.includes(filterStorage);
        });
      });
    }

    // Apply display filter
    if (filters.display && filters.display.length > 0) {
      filtered = filtered.filter(product => {
        const productDisplaySize = product.display_size || '';
        return filters.display.some(filterDisplay => {
          return productDisplaySize === filterDisplay || productDisplaySize.includes(filterDisplay);
        });
      });
    }

    // Apply generation filter
    if (filters.generation && filters.generation.length > 0) {
      filtered = filtered.filter(product => {
        const productGeneration = product.generation || '';
        return filters.generation.some(filterGeneration => {
          return productGeneration === filterGeneration || 
                 productGeneration.includes(filterGeneration) || 
                 filterGeneration.includes(productGeneration);
        });
      });
    }

    // Apply resolution filter
    if (filters.resolution && filters.resolution.length > 0) {
      filtered = filtered.filter(product => {
        const productResolution = (product.resolution || '').toLowerCase();
        return filters.resolution.some(filterResolution => {
          const filterRes = filterResolution.toLowerCase();
          return productResolution === filterRes || productResolution.includes(filterRes);
        });
      });
    }

    // Apply graphics filter
    if (filters.graphics && filters.graphics.length > 0) {
      filtered = filtered.filter(product => {
        const productGraphics = (product.graphics || '').toLowerCase();
        return filters.graphics.some(filterGraphics => {
          const filterGfx = filterGraphics.toLowerCase();
          return productGraphics === filterGfx || productGraphics.includes(filterGfx);
        });
      });
    }

    // Apply touch type filter
    if (filters.touchType && filters.touchType.length > 0) {
      filtered = filtered.filter(product => {
        const productTouchType = (product.touch_type || '').toLowerCase();
        return filters.touchType.some(filterTouchType => {
          const filterTouch = filterTouchType.toLowerCase();
          return productTouchType === filterTouch || productTouchType.includes(filterTouch);
        });
      });
    }

    // Apply operating system filter
    if (filters.operatingSystem && filters.operatingSystem.length > 0) {
      filtered = filtered.filter(product => {
        const productOS = (product.os || '').toLowerCase();
        return filters.operatingSystem.some(filterOS => {
          const filterOSLower = filterOS.toLowerCase();
          return productOS === filterOSLower || productOS.includes(filterOSLower);
        });
      });
    }

    // Apply price range filter
    if (filters.priceRange) {
      filtered = filtered.filter(product =>
        product.price >= filters.priceRange.min &&
        product.price <= filters.priceRange.max
      );
    }

    // Apply in stock filter
    if (filters.inStock) {
      filtered = filtered.filter(product => {
        // Check if product is active
        if (product.is_active === false) return false;

        // Check the in_stock boolean field first
        if (product.in_stock !== undefined && product.in_stock !== null) {
          if (product.in_stock === false || product.in_stock === 'false') return false;
        }

        // Also check stock_quantity field
        if (product.stock_quantity !== undefined && product.stock_quantity !== null) {
          const stockQty = typeof product.stock_quantity === 'string'
            ? parseInt(product.stock_quantity, 10)
            : product.stock_quantity;
          if (stockQty <= 0) return false;
        }

        return true;
      });
    }

    // Apply featured filter
    if (filters.featured) {
      filtered = filtered.filter(product => product.is_featured);
    }

    // Apply search query
    if (searchQuery) {
      const searchWords = searchQuery.toLowerCase().trim().split(/\s+/).filter(word => word.length > 0);
      filtered = filtered.filter(product => {
        const searchableText = [
          product.name,
          product.brand,
          product.processor,
          product.ram,
          product.hdd,
          product.display_size,
          product.generation,
          product.graphics,
          product.description
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return searchWords.every(word => searchableText.includes(word));
      });
    }

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

    // Apply sorting with stock status priority
    filtered.sort((a, b) => {
      // First, prioritize in-stock products
      const aInStock = isInStock(a);
      const bInStock = isInStock(b);

      if (aInStock && !bInStock) return -1;
      if (!aInStock && bInStock) return 1;

      // If both have same stock status, apply regular sorting
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name?.localeCompare(b.name || '') || 0;
        case 'brand':
          return a.brand?.localeCompare(b.brand || '') || 0;
        case 'newest':
          return new Date(b.created_at) - new Date(a.created_at);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, filters, sortBy, searchQuery]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">Workstation & Gaming Laptops</h1>
            <div className="flex justify-center mb-4">
              <div className="w-24 h-1 bg-[#6dc1c9] rounded-full"></div>
            </div>
           
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-8">
        <div className="flex">
          {/* Filter Sidebar */}
          <FilterSidebar
            filters={filters}
            onFiltersChange={handleFiltersChange}
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            category="laptop"
            dynamicLaptopOptions={dynamicLaptopOptions}
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
                      <option value="name">Sort by Name</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="brand">Brand</option>
                      <option value="newest">Newest First</option>
                    </select>
                  </div>

                  {/* View Mode Toggle */}
                  <div className="border border-gray-300 rounded-lg p-1 flex">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded ${
                        viewMode === 'grid'
                          ? 'bg-[#6dc1c9] text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded ${
                        viewMode === 'list'
                          ? 'bg-[#6dc1c9] text-white'
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
                <Loader className="w-8 h-8 animate-spin text-[#6dc1c9]" />
                <span className="ml-2 text-gray-600">Loading products...</span>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-red-600 mb-2">Error Loading Products</h3>
                <p className="text-gray-500">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-4 px-4 py-2 bg-[#6dc1c9] text-white rounded-lg hover:bg-teal-600"
                >
                  Retry
                </button>
              </div>
            ) : !filteredProducts || filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
                <p className="text-gray-500">
                  {products.length === 0 ? 'No products available' : 'Try adjusting your filters or search criteria'}
                </p>
              </div>
            ) : (
              <div className={`
                ${viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' 
                  : 'space-y-6'
                }
              `}>
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product}
                    showCompare={true}
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

export default function WorkstationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#6dc1c9] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading products...</p>
        </div>
      </div>
    }>
      <WorkstationContent />
    </Suspense>
  );
}
