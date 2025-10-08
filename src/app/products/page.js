'use client';

import React, { useState, useEffect } from 'react';
import { Filter, Grid, List, SortAsc, Loader } from 'lucide-react';
import ProductCard from '../../components/ProductCard';
import FilterSidebar from '../../components/FilterSidebar';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products');
        const data = await response.json();
        
        if (data.success) {
          setProducts(data.data || []);
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

  useEffect(() => {
    // Get URL parameters for initial filtering
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const brand = urlParams.get('brand');
    const search = urlParams.get('search');
    
    const initialFilters = {};
    
    if (category) {
      initialFilters.category = [category];
    }
    
    if (brand) {
      initialFilters.brands = [brand];
    }
    
    if (search) {
      setSearchQuery(search);
    }
    
    if (Object.keys(initialFilters).length > 0) {
      setFilters(initialFilters);
    }
  }, []);

  useEffect(() => {
    if (!products || !Array.isArray(products)) {
      setFilteredProducts([]);
      return;
    }

    let filtered = [...products];

    // Apply category filter (database field: category_id)
    if (filters.category && filters.category.length > 0) {
      filtered = filtered.filter(product => 
        filters.category.includes(product.category_id)
      );
    }

    // Apply brand filter
    if (filters.brands && filters.brands.length > 0) {
      filtered = filtered.filter(product => 
        filters.brands.includes(product.brand)
      );
    }

    // Apply processor filter (database field: processor)
    if (filters.processors && filters.processors.length > 0) {
      filtered = filtered.filter(product => 
        filters.processors.some(proc => 
          product.processor?.toLowerCase().includes(proc.toLowerCase())
        )
      );
    }

    // Apply RAM filter (database field: ram)
    if (filters.ram && filters.ram.length > 0) {
      filtered = filtered.filter(product => 
        filters.ram.some(ram => 
          product.ram?.includes(ram)
        )
      );
    }

    // Apply storage filter (database field: hdd)
    if (filters.storage && filters.storage.length > 0) {
      filtered = filtered.filter(product => 
        filters.storage.some(storage => 
          product.hdd?.includes(storage)
        )
      );
    }

    // Apply display filter (database field: display_size)
    if (filters.display && filters.display.length > 0) {
      filtered = filtered.filter(product => 
        filters.display.some(display => 
          product.display_size?.includes(display)
        )
      );
    }

    // Apply generation filter (database field: generation)
    if (filters.generation && filters.generation.length > 0) {
      filtered = filtered.filter(product => 
        filters.generation.includes(product.generation)
      );
    }

    // Apply condition filter (database field: condition)
    if (filters.condition && filters.condition.length > 0) {
      filtered = filtered.filter(product => 
        filters.condition.includes(product.condition)
      );
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
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Our Products</h1>
          <p className="text-gray-600">
            Discover our wide range of quality refurbished laptops and accessories
          </p>
        </div>

        <div className="flex">
          {/* Filter Sidebar */}
          <FilterSidebar 
            filters={filters}
            onFiltersChange={handleFiltersChange}
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
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
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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