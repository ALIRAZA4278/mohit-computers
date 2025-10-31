'use client';

import React, { useState } from 'react';
import { X, Filter } from 'lucide-react';
import { filterOptions } from '../lib/data';

const FilterSidebar = ({ filters, onFiltersChange, isOpen, onClose, category, dynamicGraphicsOptions = [] }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [customPriceMin, setCustomPriceMin] = useState('');
  const [customPriceMax, setCustomPriceMax] = useState('');

  // Sync local filters with parent filters when they change (from URL/navbar)
  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

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

  const handleCustomPriceChange = (min, max) => {
    setCustomPriceMin(min);
    setCustomPriceMax(max);

    if (min === '' && max === '') {
      const newFilters = { ...localFilters };
      delete newFilters.priceRange;
      setLocalFilters(newFilters);
      onFiltersChange(newFilters);
      return;
    }

    const minPrice = min === '' ? 0 : parseInt(min);
    const maxPrice = max === '' ? Number.POSITIVE_INFINITY : parseInt(max);
    
    // Validate: min should not be greater than max
    if (minPrice > maxPrice && maxPrice !== Number.POSITIVE_INFINITY) {
      return; // Don't update if invalid range
    }
    
    const customRange = {
      label: `Rs ${minPrice.toLocaleString()} - ${maxPrice === Number.POSITIVE_INFINITY ? '∞' : `Rs ${maxPrice.toLocaleString()}`}`,
      min: minPrice,
      max: maxPrice
    };

    const newFilters = { ...localFilters, priceRange: customRange };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    const emptyFilters = {};
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
    // Clear custom price inputs
    setCustomPriceMin('');
    setCustomPriceMax('');
  };

  const FilterSection = ({ title, options, category }) => (
    <div className="mb-6">
      <h4 className="font-semibold text-gray-800 mb-3">{title}</h4>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {options && options.length > 0 ? options.map((option) => (
          <label key={option} className="flex items-center">
            <input
              type="checkbox"
              checked={localFilters[category]?.includes(option) || false}
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
          {/* In Stock Only - Moved to top */}
          <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localFilters.inStock || false}
                onChange={(e) => {
                  const newFilters = { ...localFilters };
                  if (e.target.checked) {
                    newFilters.inStock = true;
                  } else {
                    delete newFilters.inStock;
                  }
                  setLocalFilters(newFilters);
                  onFiltersChange(newFilters);
                }}
                className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
              <span className="text-sm font-semibold text-gray-800">In Stock Only</span>
            </label>
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
                  onChange={(e) => {
                    const minValue = e.target.value;
                    handleCustomPriceChange(minValue, customPriceMax);
                  }}
                />
                <span className="text-gray-500 text-xs text-center sm:text-left py-1 sm:py-0">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  min="0"
                  value={customPriceMax}
                  className="w-full sm:w-16 px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  onChange={(e) => {
                    const maxValue = e.target.value;
                    handleCustomPriceChange(customPriceMin, maxValue);
                  }}
                />
              </div>
              {customPriceMin && customPriceMax && parseInt(customPriceMin) > parseInt(customPriceMax) && (
                <div className="mt-2 text-xs text-red-500">
                  Min price cannot be greater than max price
                </div>
              )}
              {localFilters.priceRange && (
                <div className="mt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-1 sm:space-y-0">
                  <div className="text-xs text-blue-600 font-medium break-all">
                    Active: {localFilters.priceRange.label}
                  </div>
                  <button
                    onClick={() => {
                      const newFilters = { ...localFilters };
                      delete newFilters.priceRange;
                      setLocalFilters(newFilters);
                      onFiltersChange(newFilters);
                      // Clear the input state
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
            <div className="space-y-3 sm:space-y-2">
              <p className="text-xs text-gray-600 mb-2">Quick Select:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                {(category === 'ram' ? filterOptions.ramPriceRanges : filterOptions.priceRanges).map((range) => (
                  <label key={range.label} className="flex items-center p-2 sm:p-1 hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="radio"
                      name="priceRange"
                      checked={localFilters.priceRange?.label === range.label}
                      onChange={() => handlePriceRangeChange(range)}
                      className="mr-2 text-blue-600 focus:ring-blue-500 flex-shrink-0"
                    />
                    <span className="text-sm text-gray-700 leading-tight">{range.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Category-specific filters for RAM */}
          {category === 'ram' ? (
            <>
              {/* Brand Filter - RAM specific brands */}
              <FilterSection
                title="Brand"
                options={filterOptions.ramBrands}
                category="brands"
              />

              {/* RAM Type Filter */}
              <FilterSection
                title="Type"
                options={filterOptions.ramType}
                category="ramType"
              />

              {/* RAM Form Factor Filter */}
              <FilterSection
                title="Form Factor"
                options={filterOptions.ramFormFactor}
                category="ramFormFactor"
              />

              {/* RAM Capacity Filter */}
              <FilterSection
                title="Capacity"
                options={filterOptions.ramCapacity}
                category="ramCapacity"
              />

              {/* RAM Speed Filter */}
              <FilterSection
                title="Speed (Frequency)"
                options={filterOptions.ramSpeed}
                category="ramSpeed"
              />

              {/* RAM Condition Filter */}
              <FilterSection
                title="Condition"
                options={filterOptions.ramCondition}
                category="ramCondition"
              />

              {/* RAM Warranty Filter */}
              <FilterSection
                title="Warranty"
                options={filterOptions.ramWarranty}
                category="ramWarranty"
              />
            </>
          ) : (
            <>
              {/* Default filters for laptops and other categories */}
              {/* Brand Filter */}
              <FilterSection
                title="Brand"
                options={filterOptions.brands}
                category="brands"
              />

              {/* Generation Filter */}
              <FilterSection
                title="Generation"
                options={filterOptions.generation}
                category="generation"
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

              {/* Graphics Card Filter */}
              <FilterSection
                title="Graphics Card"
                options={dynamicGraphicsOptions.length > 0 ? dynamicGraphicsOptions : filterOptions.graphics}
                category="graphics"
              />

              {/* Touch Type Filter */}
              <FilterSection
                title="Touch Type"
                options={filterOptions.touchType}
                category="touchType"
              />

              {/* Resolution Filter */}
              <FilterSection
                title="Resolution"
                options={filterOptions.resolution}
                category="resolution"
              />

              {/* Operating System Filter */}
              <FilterSection
                title="Operating System"
                options={filterOptions.operatingSystem}
                category="operatingSystem"
              />

              {/* Special Features Filter */}
              <FilterSection
                title="Special Features"
                options={filterOptions.specialFeatures}
                category="specialFeatures"
              />
            </>
          )}

          {/* Featured Products Only */}
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={localFilters.featured || false}
                onChange={(e) => {
                  const newFilters = { ...localFilters };
                  if (e.target.checked) {
                    newFilters.featured = true;
                  } else {
                    delete newFilters.featured;
                  }
                  setLocalFilters(newFilters);
                  onFiltersChange(newFilters);
                }}
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