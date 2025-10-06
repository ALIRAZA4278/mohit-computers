'use client';

import React, { useState, useEffect } from 'react';
import { Filter, Grid, List, SortAsc } from 'lucide-react';
import ProductCard from '../../components/ProductCard';
import FilterSidebar from '../../components/FilterSidebar';
import { products } from '../../lib/data';

export default function Products() {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');


  useEffect(() => {
    // Get URL parameters for initial filtering
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const search = urlParams.get('search');
    
    if (category) {
      setFilters({ category: [category] });
    }
    
    if (search) {
      setSearchQuery(search);
    }
  }, []);

  useEffect(() => {
    let filtered = [...products];

    // Apply category filter
    if (filters.category && filters.category.length > 0) {
      filtered = filtered.filter(product => 
        filters.category.includes(product.category)
      );
    }

    // Apply brand filter
    if (filters.brands && filters.brands.length > 0) {
      filtered = filtered.filter(product => 
        filters.brands.includes(product.brand)
      );
    }

    // Apply processor filter
    if (filters.processors && filters.processors.length > 0) {
      filtered = filtered.filter(product => 
        filters.processors.some(proc => 
          product.processor?.includes(proc) || 
          product.specifications?.processor?.includes(proc)
        )
      );
    }

    // Apply RAM filter
    if (filters.ram && filters.ram.length > 0) {
      filtered = filtered.filter(product => 
        filters.ram.some(ram => 
          product.ram?.includes(ram) || 
          product.specifications?.ram?.includes(ram)
        )
      );
    }

    // Apply storage filter
    if (filters.storage && filters.storage.length > 0) {
      filtered = filtered.filter(product => 
        filters.storage.some(storage => 
          product.storage?.includes(storage) || 
          product.specifications?.storage?.includes(storage)
        )
      );
    }

    // Apply display filter
    if (filters.display && filters.display.length > 0) {
      filtered = filtered.filter(product => 
        filters.display.some(display => 
          product.display?.includes(display) || 
          product.specifications?.display?.includes(display)
        )
      );
    }

    // Apply generation filter
    if (filters.generation && filters.generation.length > 0) {
      filtered = filtered.filter(product => 
        filters.generation.includes(product.generation)
      );
    }

    // Apply condition filter
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

    // Apply in stock filter
    if (filters.inStock) {
      filtered = filtered.filter(product => product.inStock);
    }

    // Apply featured filter
    if (filters.featured) {
      filtered = filtered.filter(product => product.featured);
    }

    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
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
          return a.name.localeCompare(b.name);
        case 'brand':
          return a.brand.localeCompare(b.brand);
        case 'newest':
          return b.id - a.id;
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [filters, sortBy, searchQuery]);

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

            {/* Products Grid/List */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your filters or search criteria</p>
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