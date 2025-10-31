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

      // Handle special categories that are actually features
      if (category === 'rugged-laptop') {
        // Rugged laptops are laptops with is_rugged_tough flag
        newFilters.category = ['laptop'];
        newFilters.specialFeatures = ['Rugged / Tough'];
        setCurrentCategory('laptop');
        console.log('✅ Rugged Laptop filter set - Category: laptop, Special Features: Rugged / Tough');
      } else if (category === 'workstation') {
        // Workstation laptops are laptops with is_workstation flag
        newFilters.category = ['laptop'];
        newFilters.specialFeatures = ['Workstation'];
        setCurrentCategory('laptop');
        console.log('✅ Workstation filter set - Category: laptop, Special Features: Workstation');
      } else {
        const mappedCategory = categoryMap[category] || category;
        newFilters.category = [mappedCategory];
        setCurrentCategory(mappedCategory);
        console.log('✅ Category filter set:', newFilters.category);
      }
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

    // Filter out SEO-only products (they should only be visible via direct URL, not in catalog)
    filtered = filtered.filter(product => !product.seo_only);

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

    // Apply resolution filter (database field: resolution)
    if (filters.resolution && filters.resolution.length > 0) {
      const beforeFilter = filtered.length;
      
      filtered = filtered.filter(product => {
        const productResolution = (product.resolution || '').toLowerCase();
        
        return filters.resolution.some(filterResolution => {
          const filterRes = filterResolution.toLowerCase();
          
          // Try exact match first
          if (productResolution === filterRes) {
            return true;
          }
          
          // Try contains match
          if (productResolution.includes(filterRes) || filterRes.includes(productResolution)) {
            return true;
          }
          
          // Special handling for resolution variations
          // Match "HD" with "HD (1366x768)"
          if (filterRes.includes('hd') && productResolution.includes('hd')) {
            if (filterRes.includes('full hd') && productResolution.includes('full hd')) return true;
            if (filterRes.includes('qhd') && productResolution.includes('qhd')) return true;
            if (filterRes.includes('4k') && productResolution.includes('4k')) return true;
            // Just "HD" (not Full HD)
            if (filterRes.match(/^hd\s*\(/i) && productResolution.match(/^hd\s*\(/i)) return true;
          }
          
          // Match resolution numbers like "1920x1080" with "Full HD (1920x1080)"
          if (filterRes.includes('1920') && productResolution.includes('1920')) return true;
          if (filterRes.includes('1366') && productResolution.includes('1366')) return true;
          if (filterRes.includes('2560') && productResolution.includes('2560')) return true;
          if (filterRes.includes('3840') && productResolution.includes('3840')) return true;
          
          return false;
        });
      });
      
      console.log(`✅ Resolution filter (${filters.resolution}): ${beforeFilter} → ${filtered.length} products`);
      
      // Debug if no products matched
      if (filtered.length === 0 && beforeFilter > 0) {
        console.log('❌ NO RESOLUTIONS MATCHED!');
        console.log('Sample resolutions from products:',
          products.slice(0, 10).map(p => `"${p.resolution}"`).filter(r => r !== '""')
        );
        console.log('Looking for:', filters.resolution.map(r => `"${r}"`));
      }
    }

    // Apply graphics filter (database fields: integrated_graphics, discrete_graphics, graphics)
    if (filters.graphics && filters.graphics.length > 0) {
      const beforeFilter = filtered.length;

      filtered = filtered.filter(product => {
        // Check all graphics fields
        const productGraphics = (product.graphics || '').toLowerCase();
        const productIntegratedGraphics = (product.integrated_graphics || '').toLowerCase();
        const productDiscreteGraphics = (product.discrete_graphics || '').toLowerCase();

        return filters.graphics.some(filterGraphics => {
          const filterGfx = filterGraphics.toLowerCase();

          // Check each graphics field
          const checkGraphics = (gfxField) => {
            if (!gfxField) return false;

            // Try exact match first
            if (gfxField === filterGfx) {
              return true;
            }

            // Try contains match
            if (gfxField.includes(filterGfx) || filterGfx.includes(gfxField)) {
              return true;
            }

            // Special handling for graphics variations
            if (filterGfx.includes('intel') && gfxField.includes('intel')) {
              if (filterGfx.includes('uhd') && gfxField.includes('uhd')) return true;
              if (filterGfx.includes('hd') && gfxField.includes('hd') && !gfxField.includes('uhd')) return true;
              if (filterGfx.includes('iris') && gfxField.includes('iris')) return true;
            }

            if (filterGfx.includes('nvidia') && gfxField.includes('nvidia')) {
              if (filterGfx.includes('gtx') && gfxField.includes('gtx')) return true;
              if (filterGfx.includes('rtx') && gfxField.includes('rtx')) return true;
              if (filterGfx.includes('quadro') && gfxField.includes('quadro')) return true;
              if (filterGfx.includes('mx') && gfxField.includes('mx')) return true;
            }

            if (filterGfx.includes('amd') && gfxField.includes('amd')) {
              if (filterGfx.includes('radeon') && gfxField.includes('radeon')) return true;
            }

            return false;
          };

          // Return true if ANY graphics field matches
          return checkGraphics(productGraphics) ||
                 checkGraphics(productIntegratedGraphics) ||
                 checkGraphics(productDiscreteGraphics);
        });
      });

      console.log(`✅ Graphics filter (${filters.graphics}): ${beforeFilter} → ${filtered.length} products`);

      // Debug if no products matched
      if (filtered.length === 0 && beforeFilter > 0) {
        console.log('❌ NO GRAPHICS CARDS MATCHED!');
        console.log('Sample graphics from products:',
          products.slice(0, 10).map(p => ({
            graphics: p.graphics,
            integrated: p.integrated_graphics,
            discrete: p.discrete_graphics
          })).filter(g => g.graphics || g.integrated || g.discrete)
        );
        console.log('Looking for:', filters.graphics.map(g => `"${g}"`));
      }
    }

    // Apply touch type filter (database field: touch_type)
    if (filters.touchType && filters.touchType.length > 0) {
      const beforeFilter = filtered.length;
      
      filtered = filtered.filter(product => {
        const productTouchType = (product.touch_type || '').toLowerCase();
        
        return filters.touchType.some(filterTouchType => {
          const filterTouch = filterTouchType.toLowerCase();
          
          // Try exact match first
          if (productTouchType === filterTouch) {
            return true;
          }
          
          // Try contains match
          if (productTouchType.includes(filterTouch) || filterTouch.includes(productTouchType)) {
            return true;
          }
          
          // Special handling for touch variations
          if (filterTouch.includes('x360') && productTouchType.includes('x360')) return true;
          if (filterTouch.includes('convertible') && productTouchType.includes('convertible')) return true;
          if (filterTouch.includes('non') && productTouchType.includes('non')) return true;
          
          return false;
        });
      });
      
      console.log(`✅ Touch Type filter (${filters.touchType}): ${beforeFilter} → ${filtered.length} products`);
      
      // Debug if no products matched
      if (filtered.length === 0 && beforeFilter > 0) {
        console.log('❌ NO TOUCH TYPES MATCHED!');
        console.log('Sample touch types from products:',
          products.slice(0, 10).map(p => `"${p.touch_type}"`).filter(t => t !== '""')
        );
        console.log('Looking for:', filters.touchType.map(t => `"${t}"`));
      }
    }

    // Apply operating system filter (database field: os)
    if (filters.operatingSystem && filters.operatingSystem.length > 0) {
      const beforeFilter = filtered.length;
      
      filtered = filtered.filter(product => {
        const productOS = (product.os || '').toLowerCase();
        
        return filters.operatingSystem.some(filterOS => {
          const filterOSLower = filterOS.toLowerCase();
          
          // Try exact match first
          if (productOS === filterOSLower) {
            return true;
          }
          
          // Try contains match
          if (productOS.includes(filterOSLower) || filterOSLower.includes(productOS)) {
            return true;
          }
          
          // Special handling for OS variations
          if (filterOSLower.includes('windows 10') && productOS.includes('windows 10')) return true;
          if (filterOSLower.includes('windows 11') && productOS.includes('windows 11')) return true;
          if (filterOSLower.includes('macos') && productOS.includes('mac')) return true;
          if (filterOSLower.includes('chrome') && productOS.includes('chrome')) return true;
          if (filterOSLower.includes('linux') && productOS.includes('linux')) return true;
          
          return false;
        });
      });
      
      console.log(`✅ Operating System filter (${filters.operatingSystem}): ${beforeFilter} → ${filtered.length} products`);
      
      // Debug if no products matched
      if (filtered.length === 0 && beforeFilter > 0) {
        console.log('❌ NO OPERATING SYSTEMS MATCHED!');
        console.log('Sample OS from products:',
          products.slice(0, 10).map(p => `"${p.os}"`).filter(os => os !== '""')
        );
        console.log('Looking for:', filters.operatingSystem.map(os => `"${os}"`));
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

    // Apply in stock filter (database fields: in_stock, is_active and stock_quantity)
    if (filters.inStock) {
      const beforeFilter = filtered.length;

      filtered = filtered.filter(product => {
        // Check if product is active (already filtered by API, but double check)
        if (product.is_active === false) {
          return false;
        }

        // Check the in_stock boolean field first (if it exists)
        if (product.in_stock !== undefined && product.in_stock !== null) {
          // If in_stock is explicitly false, filter out
          if (product.in_stock === false || product.in_stock === 'false') {
            return false;
          }
        }

        // Also check stock_quantity field
        if (product.stock_quantity !== undefined && product.stock_quantity !== null) {
          // Convert to number in case it's a string
          const stockQty = typeof product.stock_quantity === 'string'
            ? parseInt(product.stock_quantity, 10)
            : product.stock_quantity;

          // If it's 0 or negative, it's out of stock
          if (stockQty <= 0) {
            return false;
          }
        }

        // If we reach here, product is in stock
        return true;
      });

      console.log(`✅ In Stock filter: ${beforeFilter} → ${filtered.length} products`);
    }

    // Apply featured filter (database field: is_featured)
    if (filters.featured) {
      filtered = filtered.filter(product => product.is_featured);
    }

    // Apply special features filter
    if (filters.specialFeatures && filters.specialFeatures.length > 0) {
      const beforeFilter = filtered.length;
      filtered = filtered.filter(product => {
        return filters.specialFeatures.some(feature => {
          if (feature === 'Workstation') return product.is_workstation === true;
          if (feature === 'Rugged / Tough') return product.is_rugged_tough === true;
          if (feature === 'Featured') return product.is_featured === true;
          if (feature === 'Clearance') return product.is_clearance === true;
          return false;
        });
      });
      console.log(`✅ Special Features filter (${filters.specialFeatures}): ${beforeFilter} → ${filtered.length} products`);
    }

    // Apply search query - match individual words
    if (searchQuery) {
      const searchWords = searchQuery.toLowerCase().trim().split(/\s+/).filter(word => word.length > 0);

      filtered = filtered.filter(product => {
        // Create searchable text from all relevant product fields
        const searchableText = [
          product.name,
          product.brand,
          product.category_id,
          product.processor,
          product.ram,
          product.hdd,
          product.display_size,
          product.generation,
          product.graphics,
          product.integrated_graphics,
          product.discrete_graphics,
          product.description
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        // Check if ALL search words are found in the searchable text
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

  // Extract unique graphics options from products (only discrete/dedicated graphics)
  const getUniqueGraphicsOptions = () => {
    const graphicsSet = new Set();

    products.forEach(product => {
      // Only add discrete/dedicated graphics
      if (product.discrete_graphics) {
        graphicsSet.add(product.discrete_graphics.trim());
      }
    });

    // Convert Set to Array and sort alphabetically
    return Array.from(graphicsSet).sort((a, b) => {
      // Sort with NVIDIA first, then AMD, then others
      const getPrefix = (str) => {
        if (str.toLowerCase().includes('nvidia')) return '1';
        if (str.toLowerCase().includes('amd')) return '2';
        return '3';
      };

      const prefixA = getPrefix(a);
      const prefixB = getPrefix(b);

      if (prefixA !== prefixB) {
        return prefixA.localeCompare(prefixB);
      }

      return a.localeCompare(b);
    });
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
            dynamicGraphicsOptions={getUniqueGraphicsOptions()}
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