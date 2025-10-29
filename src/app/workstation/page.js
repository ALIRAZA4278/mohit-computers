'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter, Grid, List, SortAsc, Loader } from 'lucide-react';
import ProductCard from '../../components/ProductCard';
import FilterSidebar from '../../components/FilterSidebar';
import Banner from '../../components/Banner';

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
          console.log('Workstation products loaded:', workstationProducts.length);
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
      filtered = filtered.filter(product => product.is_active);
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

    // Apply sorting
    filtered.sort((a, b) => {
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
      {/* Workstation Banner */}
      <Banner
        desktopImage="/banners/Work station banner.jpg"
        mobileImage="/banners/Work station banner.jpg"
        alt="Workstation Collection"
        height="300px"
        priority={true}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Professional Workstations</h1>
          <p className="text-lg text-gray-600">
            High-performance workstations designed for demanding professional workflows
          </p>
        </div>

        <div className="flex">
          {/* Filter Sidebar */}
          <FilterSidebar
            filters={filters}
            onFiltersChange={handleFiltersChange}
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            category="laptop"
          />

          {/* Main Content */}
          <div className="flex-1 lg:ml-8">
            {/* Toolbar */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={toggleFilter}
                    className="lg:hidden flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </button>
                  
                  <div className="text-gray-600">
                    Showing {filteredProducts.length} of {products.length} workstations
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
                <span className="ml-2 text-gray-600">Loading workstations...</span>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-red-600 mb-2">Error Loading Workstations</h3>
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
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No workstations found</h3>
                <p className="text-gray-500">
                  {products.length === 0 ? 'No workstations available' : 'Try adjusting your filters or search criteria'}
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
          <p className="text-gray-600 font-medium">Loading workstations...</p>
        </div>
      </div>
    }>
      <WorkstationContent />
    </Suspense>
  );
}
