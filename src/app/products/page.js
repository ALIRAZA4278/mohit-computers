'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter, Grid, List, SortAsc, Loader } from 'lucide-react';
import ProductCard from '../../components/ProductCard';
import FilterSidebar from '../../components/FilterSidebar';
import Banner from '../../components/Banner';

function ProductsContent() {
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
  const [currentCategory, setCurrentCategory] = useState(null);


  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products');
        const data = await response.json();
        
        if (data.success) {
          const products = data.data || [];
          setProducts(products);

          // DEBUG: Show actual product data
          if (products.length > 0) {
            console.log('=== PRODUCTS LOADED ===');
            console.log('Total products:', products.length);
            console.log('First product:', products[0]);
            console.log('All brands:', [...new Set(products.map(p => p.brand).filter(Boolean))].sort());
            console.log('All categories:', [...new Set(products.map(p => p.category || p.category_id).filter(Boolean))].sort());
          }
        } else {
          setError(data.error || 'Failed to load products');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Watch for URL parameter changes and update filters accordingly
  useEffect(() => {
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const search = searchParams.get('search');

    console.log('=== URL PARAMS CHANGED ===');
    console.log('Category:', category);
    console.log('Brand:', brand);
    console.log('Search:', search);

    // ALWAYS clear all filters first, then apply URL params
    const newFilters = {};

    if (category) {
      // Map friendly category names to database values
      const categoryMap = {
        'used-laptop': 'laptop',  // Database uses 'laptop' not 'used-laptop'
        'chromebook': 'chromebook',
        'accessories': 'accessories',
        'ram': 'ram',
        'ssd': 'ssd'
      };
      const mappedCategory = categoryMap[category] || category;
      newFilters.category = [mappedCategory];
      setCurrentCategory(mappedCategory);
      console.log('✅ Category filter set:', newFilters.category);
    } else {
      setCurrentCategory(null);
    }

    if (brand) {
      // Ensure brand is capitalized properly
      newFilters.brands = [brand];
      console.log('✅ Brand filter set:', newFilters.brands);
    }

    if (search) {
      setSearchQuery(search);
    } else {
      setSearchQuery('');
    }

    console.log('🔄 Updating filters:', newFilters);
    setFilters(newFilters);
  }, [searchParams]); // Re-run when searchParams change

  useEffect(() => {
    if (!products || !Array.isArray(products)) {
      setFilteredProducts([]);
      return;
    }

    console.log('🔍 Filtering - Total products:', products.length);
    console.log('🔍 Active filters:', filters);

    // Show sample products for debugging
    if (products.length > 0) {
      console.log('📦 Sample product:', {
        name: products[0].name,
        brand: products[0].brand,
        category: products[0].category,
        category_id: products[0].category_id
      });
    }

    let filtered = [...products];

    // Apply category filter
    if (filters.category && filters.category.length > 0) {
      const beforeFilter = filtered.length;

      // Filter by category
      filtered = filtered.filter(product => {
        const productCategory = (product.category || product.category_id || '').toLowerCase();

        return filters.category.some(cat => {
          const filterCat = cat.toLowerCase();
          // Exact match or contains
          return productCategory === filterCat || productCategory.includes(filterCat);
        });
      });

      console.log(`✅ Category filter (${filters.category}): ${beforeFilter} → ${filtered.length} products`);
    }

    // Apply brand filter (case-insensitive and flexible)
    if (filters.brands && filters.brands.length > 0) {
      const beforeFilter = filtered.length;

      console.log('🏷️ Applying brand filter:', filters.brands);
      console.log('🏷️ Products to filter:', beforeFilter);

      // Debug: Show first product before filtering
      if (filtered.length > 0) {
        console.log('🏷️ First product brand before filter:', filtered[0].brand);
      }

      filtered = filtered.filter(product => {
        const productBrand = (product.brand || '').toLowerCase().trim();

        const matches = filters.brands.some(brand => {
          const filterBrand = brand.toLowerCase().trim();
          // Match if brand exactly matches OR if product brand contains filter brand
          const isMatch = productBrand === filterBrand || productBrand.includes(filterBrand);

          // Debug first comparison
          if (!isMatch && beforeFilter > 0 && filtered.indexOf(product) === 0) {
            console.log('🏷️ Brand comparison:', {
              productBrand: `"${productBrand}"`,
              filterBrand: `"${filterBrand}"`,
              match: isMatch
            });
          }

          return isMatch;
        });

        return matches;
      });

      console.log(`✅ Brand filter result: ${beforeFilter} → ${filtered.length} products`);

      // Debug if no products matched
      if (filtered.length === 0 && beforeFilter > 0) {
        console.log('❌ NO BRANDS MATCHED!');
        console.log('Sample brands from products:',
          products.slice(0, 10).map(p => `"${p.brand}"`).filter(b => b !== '""')
        );
        console.log('Looking for:', filters.brands.map(b => `"${b}"`));
      }
    }

    // Apply processor filter (database field: processor)
    if (filters.processors && filters.processors.length > 0) {
      const beforeFilter = filtered.length;
      
      filtered = filtered.filter(product => {
        const productProcessor = (product.processor || '').toLowerCase();
        
        return filters.processors.some(filterProcessor => {
          const filterProc = filterProcessor.toLowerCase();
          
          // Try exact match first
          if (productProcessor === filterProc) {
            return true;
          }
          
          // Try contains match
          if (productProcessor.includes(filterProc)) {
            return true;
          }
          
          // Special handling for processor variations
          // Handle "Pentium / Celeron" matching both "Intel Pentium" and "Intel Celeron"
          if (filterProc.includes('pentium') && productProcessor.includes('pentium')) {
            return true;
          }
          if (filterProc.includes('celeron') && productProcessor.includes('celeron')) {
            return true;
          }
          
          // Handle Xeon variations (E3 v5, etc.)
          if (filterProc.includes('xeon') && productProcessor.includes('xeon')) {
            return true;
          }
          
          // Handle AMD variations
          if (filterProc.includes('amd') && productProcessor.includes('amd')) {
            // More specific AMD matching
            if (filterProc.includes('ryzen 3') && productProcessor.includes('ryzen 3')) return true;
            if (filterProc.includes('ryzen 5') && productProcessor.includes('ryzen 5')) return true;
            if (filterProc.includes('ryzen 7') && productProcessor.includes('ryzen 7')) return true;
            if (filterProc.includes('pro apu') && productProcessor.includes('pro')) return true;
          }
          
          return false;
        });
      });
      
      console.log(`✅ Processor filter (${filters.processors}): ${beforeFilter} → ${filtered.length} products`);
      
      // Debug if no products matched
      if (filtered.length === 0 && beforeFilter > 0) {
        console.log('❌ NO PROCESSORS MATCHED!');
        console.log('Sample processors from products:',
          products.slice(0, 10).map(p => `"${p.processor}"`).filter(proc => proc !== '""')
        );
        console.log('Looking for:', filters.processors.map(p => `"${p}"`));
      }
    }

    // Apply RAM filter (database field: ram)
    if (filters.ram && filters.ram.length > 0) {
      const beforeFilter = filtered.length;
      
      filtered = filtered.filter(product => {
        const productRam = product.ram || '';
        
        return filters.ram.some(filterRam => {
          // Try exact match first
          if (productRam === filterRam) {
            return true;
          }
          
          // Try contains match
          if (productRam.includes(filterRam)) {
            return true;
          }
          
          // Try reverse contains (filter contains product)
          if (filterRam.includes(productRam)) {
            return true;
          }
          
          // Special handling for DDR5 - if filter is "32GB DDR5" and product is "32GB DDR5", match
          // Or if filter is "32GB" and product is "32GB DDR5", also match
          const cleanProductRam = productRam.replace(/\s*DDR\d*/i, '').trim();
          const cleanFilterRam = filterRam.replace(/\s*DDR\d*/i, '').trim();
          
          if (cleanProductRam === cleanFilterRam) {
            return true;
          }
          
          return false;
        });
      });
      
      console.log(`✅ RAM filter (${filters.ram}): ${beforeFilter} → ${filtered.length} products`);
      
      // Debug if no products matched
      if (filtered.length === 0 && beforeFilter > 0) {
        console.log('❌ NO RAM OPTIONS MATCHED!');
        console.log('Sample RAM from products:',
          products.slice(0, 10).map(p => `"${p.ram}"`).filter(r => r !== '""')
        );
        console.log('Looking for:', filters.ram.map(r => `"${r}"`));
      }
    }

    // Apply storage filter (database field: hdd)
    if (filters.storage && filters.storage.length > 0) {
      const beforeFilter = filtered.length;
      
      filtered = filtered.filter(product => {
        const productStorage = product.hdd || '';
        
        return filters.storage.some(filterStorage => {
          // Try exact match first
          if (productStorage === filterStorage) {
            return true;
          }
          
          // Try contains match
          if (productStorage.includes(filterStorage)) {
            return true;
          }
          
          // Try reverse contains (filter contains product)
          if (filterStorage.includes(productStorage)) {
            return true;
          }
          
          return false;
        });
      });
      
      console.log(`✅ Storage filter (${filters.storage}): ${beforeFilter} → ${filtered.length} products`);
      
      // Debug if no products matched
      if (filtered.length === 0 && beforeFilter > 0) {
        console.log('❌ NO STORAGE OPTIONS MATCHED!');
        console.log('Sample storage from products:',
          products.slice(0, 10).map(p => `"${p.hdd}"`).filter(s => s !== '""')
        );
        console.log('Looking for:', filters.storage.map(s => `"${s}"`));
      }
    }

    // Apply display filter (database field: display_size)
    if (filters.display && filters.display.length > 0) {
      const beforeFilter = filtered.length;
      
      filtered = filtered.filter(product => {
        const productDisplaySize = product.display_size || '';
        
        return filters.display.some(filterDisplay => {
          // Try exact match first
          if (productDisplaySize === filterDisplay) {
            return true;
          }
          
          // Try contains match
          if (productDisplaySize.includes(filterDisplay)) {
            return true;
          }
          
          // Try reverse contains (filter contains product)
          if (filterDisplay.includes(productDisplaySize)) {
            return true;
          }
          
          // Try removing quotes and special characters for flexible matching
          const cleanProduct = productDisplaySize.replace(/[″"']/g, '"').trim();
          const cleanFilter = filterDisplay.replace(/[″"']/g, '"').trim();
          
          return cleanProduct === cleanFilter || 
                 cleanProduct.includes(cleanFilter) || 
                 cleanFilter.includes(cleanProduct);
        });
      });
      
      console.log(`✅ Display filter (${filters.display}): ${beforeFilter} → ${filtered.length} products`);
      
      // Debug if no products matched
      if (filtered.length === 0 && beforeFilter > 0) {
        console.log('❌ NO DISPLAY SIZES MATCHED!');
        console.log('Sample display sizes from products:',
          products.slice(0, 10).map(p => `"${p.display_size}"`).filter(d => d !== '""')
        );
        console.log('Looking for:', filters.display.map(d => `"${d}"`));
      }
    }

    // Apply generation filter (database field: generation)
    if (filters.generation && filters.generation.length > 0) {
      const beforeFilter = filtered.length;
      
      filtered = filtered.filter(product => {
        const productGeneration = product.generation || '';
        
        return filters.generation.some(filterGeneration => {
          // Try exact match first
          if (productGeneration === filterGeneration) {
            return true;
          }
          
          // Try contains match (for cases like "8th Gen" matching "8th")
          if (productGeneration.includes(filterGeneration) || filterGeneration.includes(productGeneration)) {
            return true;
          }
          
          return false;
        });
      });
      
      console.log(`✅ Generation filter (${filters.generation}): ${beforeFilter} → ${filtered.length} products`);
      
      // Debug if no products matched
      if (filtered.length === 0 && beforeFilter > 0) {
        console.log('❌ NO GENERATIONS MATCHED!');
        console.log('Sample generations from products:',
          products.slice(0, 10).map(p => `"${p.generation}"`).filter(g => g !== '""')
        );
        console.log('Looking for:', filters.generation.map(g => `"${g}"`));
      }
    }

    // Apply RAM-specific filters
    // RAM Type filter (DDR3, DDR4, DDR5, etc.)
    if (filters.ramType && filters.ramType.length > 0) {
      const beforeFilter = filtered.length;
      filtered = filtered.filter(product => {
        const productRamType = (product.ram_type || '').toLowerCase();
        return filters.ramType.some(filterType =>
          productRamType === filterType.toLowerCase() ||
          productRamType.includes(filterType.toLowerCase())
        );
      });
      console.log(`✅ RAM Type filter (${filters.ramType}): ${beforeFilter} → ${filtered.length} products`);
    }

    // RAM Capacity filter (2GB, 4GB, 8GB, etc.)
    if (filters.ramCapacity && filters.ramCapacity.length > 0) {
      const beforeFilter = filtered.length;
      filtered = filtered.filter(product => {
        const productRamCapacity = (product.ram_capacity || '').toLowerCase();
        return filters.ramCapacity.some(filterCapacity =>
          productRamCapacity === filterCapacity.toLowerCase() ||
          productRamCapacity.includes(filterCapacity.toLowerCase())
        );
      });
      console.log(`✅ RAM Capacity filter (${filters.ramCapacity}): ${beforeFilter} → ${filtered.length} products`);
    }

    // RAM Speed filter (1600 MHz, 2400 MHz, etc.)
    if (filters.ramSpeed && filters.ramSpeed.length > 0) {
      const beforeFilter = filtered.length;
      filtered = filtered.filter(product => {
        const productRamSpeed = (product.ram_speed || '').toLowerCase();
        return filters.ramSpeed.some(filterSpeed =>
          productRamSpeed === filterSpeed.toLowerCase() ||
          productRamSpeed.includes(filterSpeed.toLowerCase())
        );
      });
      console.log(`✅ RAM Speed filter (${filters.ramSpeed}): ${beforeFilter} → ${filtered.length} products`);
    }

    // RAM Form Factor filter (SO-DIMM, DIMM)
    if (filters.ramFormFactor && filters.ramFormFactor.length > 0) {
      const beforeFilter = filtered.length;
      filtered = filtered.filter(product => {
        const productRamFormFactor = (product.ram_form_factor || '').toLowerCase();
        return filters.ramFormFactor.some(filterFormFactor =>
          productRamFormFactor === filterFormFactor.toLowerCase() ||
          productRamFormFactor.includes(filterFormFactor.toLowerCase())
        );
      });
      console.log(`✅ RAM Form Factor filter (${filters.ramFormFactor}): ${beforeFilter} → ${filtered.length} products`);
    }

    // RAM Condition filter (New, Used, Refurbished)
    if (filters.ramCondition && filters.ramCondition.length > 0) {
      const beforeFilter = filtered.length;
      filtered = filtered.filter(product => {
        const productRamCondition = (product.ram_condition || '').toLowerCase();
        return filters.ramCondition.some(filterCondition =>
          productRamCondition === filterCondition.toLowerCase() ||
          productRamCondition.includes(filterCondition.toLowerCase())
        );
      });
      console.log(`✅ RAM Condition filter (${filters.ramCondition}): ${beforeFilter} → ${filtered.length} products`);
    }

    // RAM Warranty filter (15 Days, 3 Months, etc.)
    if (filters.ramWarranty && filters.ramWarranty.length > 0) {
      const beforeFilter = filtered.length;
      filtered = filtered.filter(product => {
        const productRamWarranty = (product.ram_warranty || '').toLowerCase();
        return filters.ramWarranty.some(filterWarranty =>
          productRamWarranty === filterWarranty.toLowerCase() ||
          productRamWarranty.includes(filterWarranty.toLowerCase())
        );
      });
      console.log(`✅ RAM Warranty filter (${filters.ramWarranty}): ${beforeFilter} → ${filtered.length} products`);
    }

    // Apply price range filter
    if (filters.priceRange) {
      filtered = filtered.filter(product =>
        product.price >= filters.priceRange.min &&
        product.price <= filters.priceRange.max
      );
    }

    // Apply in stock filter (database field: is_active)
    if (filters.inStock) {
      filtered = filtered.filter(product => product.is_active);
    }

    // Apply featured filter (database field: is_featured)
    if (filters.featured) {
      filtered = filtered.filter(product => product.is_featured);
    }

    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.processor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.ram?.toLowerCase().includes(searchQuery.toLowerCase())
      );
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
      {/* Products Banner */}
      <Banner
        desktopImage="/banners/product banner.jpg"
        mobileImage="/banners/product banner.jpg"
        alt="Our Products"
        height="300px"
        priority={true}
      />

      <div className="container mx-auto px-4 py-8">

        <div className="flex">
          {/* Filter Sidebar */}
          <FilterSidebar
            filters={filters}
            onFiltersChange={handleFiltersChange}
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            category={currentCategory}
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
                <p className="text-gray-500">
                  {products.length === 0 ? 'No products available in database' : 'Try adjusting your filters or search criteria'}
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

            {/* Pagination would go here if needed */}
          </div>
        </div>
      </div>

    </div>
  );
}

export default function Products() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#6dc1c9] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading products...</p>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}