'use client';

import React, { useState } from 'react';
import { X, Filter } from 'lucide-react';
import { filterOptions } from '../lib/data';

const FilterSidebar = ({ filters, onFiltersChange, isOpen, onClose }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterChange = (category, value, checked) => {
    const newFilters = { ...localFilters };
    
    if (!newFilters[category]) {
      newFilters[category] = [];
    }

    if (checked) {
      newFilters[category] = [...newFilters[category], value];
    } else {
      newFilters[category] = newFilters[category].filter(item => item !== value);
    }

    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handlePriceRangeChange = (range) => {
    const newFilters = { ...localFilters, priceRange: range };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    const emptyFilters = {};
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const FilterSection = ({ title, options, category }) => (
    <div className="mb-6">
      <h4 className="font-semibold text-gray-800 mb-3">{title}</h4>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {options.map((option) => (
          <label key={option} className="flex items-center">
            <input
              type="checkbox"
              checked={localFilters[category]?.includes(option) || false}
              onChange={(e) => handleFilterChange(category, option, e.target.checked)}
              className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200 
        transform transition-transform duration-300 ease-in-out lg:transform-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
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
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Content */}
        <div className="p-4">
          {/* Price Range */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-3">Price Range</h4>
            <div className="space-y-2">
              {filterOptions.priceRanges.map((range) => (
                <label key={range.label} className="flex items-center">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={localFilters.priceRange?.label === range.label}
                    onChange={() => handlePriceRangeChange(range)}
                    className="mr-2 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{range.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <FilterSection 
            title="Brand" 
            options={filterOptions.brands} 
            category="brands" 
          />

          {/* Processor Filter */}
          <FilterSection 
            title="Processor" 
            options={filterOptions.processors} 
            category="processors" 
          />

          {/* RAM Filter */}
          <FilterSection 
            title="RAM" 
            options={filterOptions.ram} 
            category="ram" 
          />

          {/* Storage Filter */}
          <FilterSection 
            title="Storage" 
            options={filterOptions.storage} 
            category="storage" 
          />

          {/* Display Size Filter */}
          <FilterSection 
            title="Display Size" 
            options={filterOptions.display} 
            category="display" 
          />

          {/* Generation Filter */}
          <FilterSection 
            title="Generation" 
            options={filterOptions.generation} 
            category="generation" 
          />

          {/* Condition Filter */}
          <FilterSection 
            title="Condition" 
            options={filterOptions.condition} 
            category="condition" 
          />

          {/* In Stock Only */}
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={localFilters.inStock || false}
                onChange={(e) => handleFilterChange('inStock', true, e.target.checked)}
                className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">In Stock Only</span>
            </label>
          </div>

          {/* Featured Products Only */}
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={localFilters.featured || false}
                onChange={(e) => handleFilterChange('featured', true, e.target.checked)}
                className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Featured Products Only</span>
            </label>
          </div>

          {/* Apply Filters Button (Mobile) */}
          <div className="lg:hidden">
            <button
              onClick={onClose}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;