'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter, Grid, List, SortAsc, Loader } from 'lucide-react';
import ProductCard from '../../components/ProductCard';
import FilterSidebar from '../../components/FilterSidebar';

function ChromebookContent() {
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
  const [dynamicFilterOptions, setDynamicFilterOptions] = useState({});

  // Generate dynamic + fallback filter options for Chromebooks
  const generateDynamicFilters = (productsList) => {
    // HARDCODED FALLBACK - Used if no products or empty values
    const hardcodedFallbacks = {
      brands: ['Dell', 'HP', 'Lenovo', 'Acer', 'Asus', 'Samsung'],
      processors: [
        'Intel Celeron N3350',
        'Intel Celeron N4000',
        'Intel Celeron N4020',
        'Intel Celeron N4120',
        'Intel Pentium N5030',
        'Intel Pentium N6000',
        'Intel Core i3 (8th Gen)',
        'Intel Core i3 (10th Gen)',
        'Intel Core i5 (8th Gen)',
        'Intel Core i5 (10th Gen)',
        'Intel Core i7'
      ],
      ram: ['2GB', '4GB', '8GB', '16GB'],
      storageType: ['eMMC', 'SSD'],
      storageCapacity: ['16GB', '32GB', '64GB', '128GB', '256GB', '512GB'],
      displaySize: ['11.6"', '12.5"', '13.3"', '14"', '15.6"'],
      displayType: ['HD', 'Full HD (FHD)'],
      touchscreen: ['Non-Touch', 'Touchscreen', 'Touchscreen x360'],
      operatingSystem: ['Windows', 'Chrome OS'],
      aueYear: ['2025', '2026', '2027', '2028', '2029', '2030', '2031', '2032', '2033', '2034']
    };

    // Filter out SEO-only products
    const availableProducts = productsList.filter(p => !p.seo_only);

    // Filter out empty/invalid values
    const isValidValue = (value) => {
      if (!value) return false;
      const str = String(value).trim().toLowerCase();
      return str !== '-' && str !== '--' && str !== '—' && str !== 'n/a' && str !== 'na' && str !== 'null' && str !== 'undefined' && str.length > 0;
    };

    const extractUniqueValues = (field, processor) => {
      const values = availableProducts
        .map(p => processor ? processor(p[field]) : p[field])
        .filter(Boolean)
        .flat()
        .filter(isValidValue)
        .map(v => String(v).trim());
      return [...new Set(values)].sort();
    };

    // Enhanced processor categorization for Chromebooks
    const categorizeProcessor = (processor) => {
      const procStr = (processor || '').toLowerCase();
      const categories = [];

      // Intel Celeron variants
      if (procStr.includes('celeron')) {
        if (procStr.includes('n3350')) categories.push('Intel Celeron N3350');
        else if (procStr.includes('n3060')) categories.push('Intel Celeron N3060');
        else if (procStr.includes('n3160')) categories.push('Intel Celeron N3160');
        else if (procStr.includes('n4000')) categories.push('Intel Celeron N4000');
        else if (procStr.includes('n4020')) categories.push('Intel Celeron N4020');
        else if (procStr.includes('n4120')) categories.push('Intel Celeron N4120');
        else if (procStr.includes('n4500')) categories.push('Intel Celeron N4500');
        else if (procStr.includes('3965y')) categories.push('Intel Celeron 3965Y');
        else categories.push('Intel Celeron');
      }

      // Intel Pentium variants
      if (procStr.includes('pentium')) {
        if (procStr.includes('n5030')) categories.push('Intel Pentium N5030');
        else if (procStr.includes('n6000')) categories.push('Intel Pentium N6000');
        else categories.push('Intel Pentium');
      }

      // Intel Core i3
      if (procStr.includes('core i3') || procStr.includes('i3-')) {
        if (procStr.includes('8th gen') || procStr.includes('8130') || procStr.includes('8145')) {
          categories.push('Intel Core i3 (8th Gen)');
        } else if (procStr.includes('10th gen') || procStr.includes('10110') || procStr.includes('1005')) {
          categories.push('Intel Core i3 (10th Gen)');
        } else {
          categories.push('Intel Core i3');
        }
      }

      // Intel Core i5
      if (procStr.includes('core i5') || procStr.includes('i5-')) {
        if (procStr.includes('8th gen') || procStr.includes('8250') || procStr.includes('8265') || procStr.includes('8365')) {
          categories.push('Intel Core i5 (8th Gen)');
        } else if (procStr.includes('10th gen') || procStr.includes('10210') || procStr.includes('1035')) {
          categories.push('Intel Core i5 (10th Gen)');
        } else {
          categories.push('Intel Core i5');
        }
      }

      // Intel Core i7
      if (procStr.includes('core i7') || procStr.includes('i7-')) {
        categories.push('Intel Core i7');
      }

      // Intel Core m3
      if (procStr.includes('core m3') || procStr.includes('m3-')) {
        categories.push('Intel Core m3');
      }

      // MediaTek
      if (procStr.includes('mediatek')) {
        if (procStr.includes('mt8173')) categories.push('MediaTek MT8173C');
        else if (procStr.includes('mt8183')) categories.push('MediaTek MT8183');
        else if (procStr.includes('helio p60')) categories.push('MediaTek Helio P60T');
        else categories.push('MediaTek');
      }

      return categories.length > 0 ? categories : [processor];
    };

    // Extract dynamic values from products
    const dynamicBrands = extractUniqueValues('brand');
    const dynamicProcessors = extractUniqueValues('processor', categorizeProcessor);
    const dynamicRam = extractUniqueValues('ram');

    const dynamicStorageType = extractUniqueValues('storage', (storage) => {
      const storageStr = (storage || '').toLowerCase();
      const types = [];
      if (storageStr.includes('emmc')) types.push('eMMC');
      if (storageStr.includes('ssd')) types.push('SSD');
      return types;
    });

    const dynamicStorageCapacity = extractUniqueValues('storage', (storage) => {
      const storageStr = storage || '';
      const capacities = [];
      if (storageStr.includes('16GB') || storageStr.includes('16 GB')) capacities.push('16GB');
      if (storageStr.includes('32GB') || storageStr.includes('32 GB')) capacities.push('32GB');
      if (storageStr.includes('64GB') || storageStr.includes('64 GB')) capacities.push('64GB');
      if (storageStr.includes('128GB') || storageStr.includes('128 GB')) capacities.push('128GB');
      if (storageStr.includes('256GB') || storageStr.includes('256 GB')) capacities.push('256GB');
      if (storageStr.includes('512GB') || storageStr.includes('512 GB')) capacities.push('512GB');
      return capacities;
    });

    const dynamicDisplaySize = [...new Set([
      ...extractUniqueValues('display_size'),
      ...extractUniqueValues('display')
    ])].sort();

    const dynamicDisplayType = extractUniqueValues('resolution', (resolution) => {
      const resStr = (resolution || '').toLowerCase();
      const types = [];
      if (resStr.includes('1366x768') || (resStr.includes('hd') && !resStr.includes('full hd') && !resStr.includes('fhd'))) types.push('HD');
      if (resStr.includes('1920x1080') || resStr.includes('full hd') || resStr.includes('fhd')) types.push('Full HD (FHD)');
      return types;
    });

    const dynamicTouchscreen = extractUniqueValues('touch_type', (touchType) => {
      const touchStr = (touchType || '').toLowerCase();
      const types = [];
      if (touchStr.includes('non-touch') || touchStr.includes('non touch')) types.push('Non-Touch');
      if (touchStr.includes('touch') && !touchStr.includes('x360') && !touchStr.includes('non')) types.push('Touchscreen');
      if (touchStr.includes('x360')) types.push('Touchscreen x360');
      return types;
    });

    const dynamicOS = extractUniqueValues('os');

    const dynamicAUE = [...new Set([
      ...extractUniqueValues('aue_year'),
      ...extractUniqueValues('auto_update_expiration')
    ])].sort();

    // Generate dynamic price ranges based on actual product prices
    const generatePriceRanges = () => {
      const prices = availableProducts.map(p => p.price).filter(p => p > 0).sort((a, b) => a - b);
      if (prices.length === 0) {
        return [
          { label: 'Rs 10,000 - Rs 20,000', min: 10000, max: 20000 },
          { label: 'Rs 20,000 - Rs 30,000', min: 20000, max: 30000 },
          { label: 'Rs 30,000 - Rs 40,000', min: 30000, max: 40000 },
          { label: 'Rs 40,000 - Rs 50,000', min: 40000, max: 50000 },
          { label: 'Above Rs 50,000', min: 50000, max: Infinity }
        ];
      }

      const minPrice = Math.floor(prices[0] / 10000) * 10000;
      const maxPrice = Math.ceil(prices[prices.length - 1] / 10000) * 10000;
      const ranges = [];
      const step = 20000;

      for (let i = minPrice; i < maxPrice; i += step) {
        const rangeMax = i + step;
        const label = `Rs ${i.toLocaleString()} - Rs ${rangeMax.toLocaleString()}`;
        ranges.push({ label, min: i, max: rangeMax });
      }

      if (maxPrice > minPrice) {
        const aboveLabel = `Above Rs ${maxPrice.toLocaleString()}`;
        ranges.push({ label: aboveLabel, min: maxPrice, max: Infinity });
      }

      return ranges;
    };

    // Use dynamic values if available, otherwise fallback to hardcoded
    return {
      brands: dynamicBrands.length > 0 ? dynamicBrands : hardcodedFallbacks.brands,
      processors: dynamicProcessors.length > 0 ? dynamicProcessors : hardcodedFallbacks.processors,
      ram: dynamicRam.length > 0 ? dynamicRam : hardcodedFallbacks.ram,
      storageType: dynamicStorageType.length > 0 ? dynamicStorageType : hardcodedFallbacks.storageType,
      storageCapacity: dynamicStorageCapacity.length > 0 ? dynamicStorageCapacity : hardcodedFallbacks.storageCapacity,
      displaySize: dynamicDisplaySize.length > 0 ? dynamicDisplaySize : hardcodedFallbacks.displaySize,
      displayType: dynamicDisplayType.length > 0 ? dynamicDisplayType : hardcodedFallbacks.displayType,
      touchscreen: dynamicTouchscreen.length > 0 ? dynamicTouchscreen : hardcodedFallbacks.touchscreen,
      operatingSystem: dynamicOS.length > 0 ? dynamicOS : hardcodedFallbacks.operatingSystem,
      aueYear: dynamicAUE.length > 0 ? dynamicAUE : hardcodedFallbacks.aueYear,
      chromebookPriceRanges: generatePriceRanges()
    };
  };

  // Fetch chromebook products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products');
        const data = await response.json();

        if (data.success) {
          // Filter only chromebook products
          const chromebookProducts = (data.data || []).filter(
            product => product.category_id === 'chromebook' || product.category === 'chromebook'
          );
          setProducts(chromebookProducts);

          // Generate dynamic filter options from available products
          const dynamicOptions = generateDynamicFilters(chromebookProducts);
          setDynamicFilterOptions(dynamicOptions);

          console.log('Chromebook products loaded:', chromebookProducts.length);
          console.log('Sample chromebook product:', chromebookProducts[0]);
          console.log('Dynamic filter options:', dynamicOptions);
          console.log('Brands found:', dynamicOptions.brands);
          console.log('Processors found:', dynamicOptions.processors);
          console.log('RAM found:', dynamicOptions.ram);
        } else {
          setError(data.error || 'Failed to load products');
        }
      } catch (err) {
        console.error('Error fetching chromebook products:', err);
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

          // Match specific processor models
          if (filterProc.includes('celeron n3350')) {
            return productProcessor.includes('n3350');
          }
          if (filterProc.includes('celeron n4000')) {
            return productProcessor.includes('n4000');
          }
          if (filterProc.includes('celeron n4020')) {
            return productProcessor.includes('n4020');
          }
          if (filterProc.includes('celeron n4120')) {
            return productProcessor.includes('n4120');
          }
          if (filterProc.includes('celeron')) {
            return productProcessor.includes('celeron');
          }

          if (filterProc.includes('pentium n5030')) {
            return productProcessor.includes('n5030');
          }
          if (filterProc.includes('pentium n6000')) {
            return productProcessor.includes('n6000');
          }
          if (filterProc.includes('pentium')) {
            return productProcessor.includes('pentium');
          }

          if (filterProc.includes('core i3') && filterProc.includes('8th')) {
            return (productProcessor.includes('i3') || productProcessor.includes('core i3')) &&
                   (productProcessor.includes('8th') || productProcessor.includes('8130') || productProcessor.includes('8145'));
          }
          if (filterProc.includes('core i3') && filterProc.includes('10th')) {
            return (productProcessor.includes('i3') || productProcessor.includes('core i3')) &&
                   (productProcessor.includes('10th') || productProcessor.includes('10110') || productProcessor.includes('1005'));
          }
          if (filterProc.includes('core i3')) {
            return productProcessor.includes('i3') || productProcessor.includes('core i3');
          }

          if (filterProc.includes('core i5') && filterProc.includes('8th')) {
            return (productProcessor.includes('i5') || productProcessor.includes('core i5')) &&
                   (productProcessor.includes('8th') || productProcessor.includes('8250') || productProcessor.includes('8265'));
          }
          if (filterProc.includes('core i5') && filterProc.includes('10th')) {
            return (productProcessor.includes('i5') || productProcessor.includes('core i5')) &&
                   (productProcessor.includes('10th') || productProcessor.includes('10210') || productProcessor.includes('1035'));
          }
          if (filterProc.includes('core i5')) {
            return productProcessor.includes('i5') || productProcessor.includes('core i5');
          }

          if (filterProc.includes('core i7')) {
            return productProcessor.includes('i7') || productProcessor.includes('core i7');
          }

          // Fallback to general matching
          return productProcessor === filterProc || productProcessor.includes(filterProc);
        });
      });
    }

    // Apply RAM filter
    if (filters.ram && filters.ram.length > 0) {
      filtered = filtered.filter(product => {
        const productRam = (product.ram || '').toLowerCase();
        return filters.ram.some(filterRam => {
          const filterLower = filterRam.toLowerCase();
          // Match with or without space (4GB or 4 GB)
          const filterWithSpace = filterRam.replace('GB', ' GB');
          return productRam.includes(filterLower) || productRam.includes(filterWithSpace.toLowerCase());
        });
      });
    }

    // Apply storage type filter (Chromebook-specific)
    if (filters.storageType && filters.storageType.length > 0) {
      filtered = filtered.filter(product => {
        const productStorage = (product.storage || product.hdd || '').toLowerCase();
        return filters.storageType.some(filterType => {
          const filterTypeLower = filterType.toLowerCase();
          return productStorage.includes(filterTypeLower);
        });
      });
    }

    // Apply storage capacity filter (Chromebook-specific)
    if (filters.storageCapacity && filters.storageCapacity.length > 0) {
      filtered = filtered.filter(product => {
        const productStorage = (product.storage || product.hdd || '').toLowerCase();
        return filters.storageCapacity.some(filterCapacity => {
          const filterLower = filterCapacity.toLowerCase();
          // Match with or without space (64GB or 64 GB)
          const filterWithSpace = filterCapacity.replace('GB', ' GB');
          return productStorage.includes(filterLower) || productStorage.includes(filterWithSpace.toLowerCase());
        });
      });
    }

    // Apply display size filter
    if (filters.displaySize && filters.displaySize.length > 0) {
      filtered = filtered.filter(product => {
        const productDisplaySize = product.display_size || product.display || '';
        return filters.displaySize.some(filterDisplay => {
          // Remove quotes from filter for matching (11.6" -> 11.6)
          const cleanFilter = filterDisplay.replace(/"/g, '');
          return productDisplaySize.includes(filterDisplay) || productDisplaySize.includes(cleanFilter);
        });
      });
    }

    // Apply display type filter (HD, FHD)
    if (filters.displayType && filters.displayType.length > 0) {
      filtered = filtered.filter(product => {
        const productResolution = (product.resolution || '').toLowerCase();
        return filters.displayType.some(filterType => {
          const filterTypeLower = filterType.toLowerCase();
          if (filterTypeLower === 'hd') {
            return productResolution.includes('1366x768') || productResolution.includes('hd');
          }
          if (filterTypeLower === 'full hd (fhd)') {
            return productResolution.includes('1920x1080') || productResolution.includes('full hd') || productResolution.includes('fhd');
          }
          return productResolution.includes(filterTypeLower);
        });
      });
    }

    // Apply touchscreen filter
    if (filters.touchscreen && filters.touchscreen.length > 0) {
      filtered = filtered.filter(product => {
        const productTouchType = (product.touch_type || '').toLowerCase();
        return filters.touchscreen.some(filterTouch => {
          const filterTouchLower = filterTouch.toLowerCase();
          if (filterTouchLower === 'non-touch') {
            return productTouchType.includes('non-touch') || productTouchType.includes('non touch');
          }
          if (filterTouchLower === 'touchscreen') {
            return productTouchType.includes('touch') && !productTouchType.includes('x360');
          }
          if (filterTouchLower === 'touchscreen x360') {
            return productTouchType.includes('x360');
          }
          return productTouchType.includes(filterTouchLower);
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

    // Apply AUE year filter (Chromebook-specific)
    if (filters.aueYear && filters.aueYear.length > 0) {
      filtered = filtered.filter(product => {
        const productAUE = (product.aue_year || product.auto_update_expiration || '').toString();
        return filters.aueYear.some(filterYear => {
          return productAUE.includes(filterYear);
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
          product.storage,
          product.display_size,
          product.display,
          product.resolution,
          product.touch_type,
          product.os,
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
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">Chromebooks</h1>
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
            category="chromebook"
            dynamicChromebookOptions={dynamicFilterOptions}
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
                    Showing {filteredProducts.length} of {products.length} chromebooks
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
                <span className="ml-2 text-gray-600">Loading chromebooks...</span>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-red-600 mb-2">Error Loading Chromebooks</h3>
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
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No chromebooks found</h3>
                <p className="text-gray-500">
                  {products.length === 0 ? 'No chromebooks available' : 'Try adjusting your filters or search criteria'}
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

export default function ChromebookPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#6dc1c9] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading chromebooks...</p>
        </div>
      </div>
    }>
      <ChromebookContent />
    </Suspense>
  );
}
