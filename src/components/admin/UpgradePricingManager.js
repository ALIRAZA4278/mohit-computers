'use client';

import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, DollarSign } from 'lucide-react';

export default function UpgradePricingManager() {
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchPricing();
  }, []);

  const fetchPricing = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/upgrade-pricing');
      const data = await response.json();
      setPricing(data);
    } catch (error) {
      console.error('Error fetching pricing:', error);
      setMessage({ type: 'error', text: 'Failed to load pricing data' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage({ type: '', text: '' });

      const response = await fetch('/api/upgrade-pricing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pricing)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Pricing updated successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update pricing' });
      }
    } catch (error) {
      console.error('Error saving pricing:', error);
      setMessage({ type: 'error', text: 'Failed to save pricing' });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setPricing(prev => ({
      ...prev,
      [field]: parseInt(value) || 0
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading pricing data...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-green-600 p-2 rounded-lg">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Upgrade Pricing Configuration</h2>
            <p className="text-sm text-gray-600">Manage global RAM and SSD upgrade prices</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* RAM Pricing - DDR3/DDR3L (3rd to 5th Generation) */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            RAM Upgrade Prices - DDR3/DDR3L
          </h3>
          <p className="text-sm text-gray-600">For 3rd to 5th Generation Processors</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              4GB DDR3/DDR3L RAM
            </label>
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">Rs:</span>
              <input
                type="number"
                value={pricing?.ram_ddr3_4gb || 0}
                onChange={(e) => handleChange('ram_ddr3_4gb', e.target.value)}
                min="0"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              8GB DDR3/DDR3L RAM
            </label>
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">Rs:</span>
              <input
                type="number"
                value={pricing?.ram_ddr3_8gb || 0}
                onChange={(e) => handleChange('ram_ddr3_8gb', e.target.value)}
                min="0"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* RAM Pricing - DDR4 (6th to 11th Generation) */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            RAM Upgrade Prices - DDR4
          </h3>
          <p className="text-sm text-gray-600">For 6th to 11th Generation Processors</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              4GB DDR4 RAM
            </label>
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">Rs:</span>
              <input
                type="number"
                value={pricing?.ram_ddr4_4gb || 0}
                onChange={(e) => handleChange('ram_ddr4_4gb', e.target.value)}
                min="0"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              8GB DDR4 RAM
            </label>
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">Rs:</span>
              <input
                type="number"
                value={pricing?.ram_ddr4_8gb || 0}
                onChange={(e) => handleChange('ram_ddr4_8gb', e.target.value)}
                min="0"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              16GB DDR4 RAM
            </label>
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">Rs:</span>
              <input
                type="number"
                value={pricing?.ram_ddr4_16gb || 0}
                onChange={(e) => handleChange('ram_ddr4_16gb', e.target.value)}
                min="0"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              32GB DDR4 RAM
            </label>
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">Rs:</span>
              <input
                type="number"
                value={pricing?.ram_ddr4_32gb || 0}
                onChange={(e) => handleChange('ram_ddr4_32gb', e.target.value)}
                min="0"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* RAM Speed Pricing */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-lg border border-orange-200 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            RAM Speed Upgrade Prices (MHz)
          </h3>
          <p className="text-sm text-gray-600">Additional cost for higher frequency RAM (above 2133 MHz base)</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              2400 MHz
              <span className="text-xs text-gray-500 block">Faster performance</span>
            </label>
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">+Rs:</span>
              <input
                type="number"
                value={pricing?.ram_speed_2400 || 0}
                onChange={(e) => handleChange('ram_speed_2400', e.target.value)}
                min="0"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              2666 MHz
              <span className="text-xs text-gray-500 block">Enhanced speed</span>
            </label>
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">+Rs:</span>
              <input
                type="number"
                value={pricing?.ram_speed_2666 || 0}
                onChange={(e) => handleChange('ram_speed_2666', e.target.value)}
                min="0"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              3200 MHz
              <span className="text-xs text-gray-500 block">Maximum performance</span>
            </label>
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">+Rs:</span>
              <input
                type="number"
                value={pricing?.ram_speed_3200 || 0}
                onChange={(e) => handleChange('ram_speed_3200', e.target.value)}
                min="0"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SSD Pricing */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-lg border border-green-200 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            SSD Upgrade Prices
          </h3>
          <p className="text-sm text-gray-600">Storage upgrade pricing tiers</p>
        </div>

        <div className="space-y-6">
          {/* From 128GB */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">From 128GB SSD</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  128GB → 256GB
                </label>
                <div className="flex items-center">
                  <span className="text-gray-600 mr-2">Rs:</span>
                  <input
                    type="number"
                    value={pricing?.ssd_128_to_256 || 0}
                    onChange={(e) => handleChange('ssd_128_to_256', e.target.value)}
                    min="0"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  128GB → 512GB
                </label>
                <div className="flex items-center">
                  <span className="text-gray-600 mr-2">Rs:</span>
                  <input
                    type="number"
                    value={pricing?.ssd_128_to_512 || 0}
                    onChange={(e) => handleChange('ssd_128_to_512', e.target.value)}
                    min="0"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  128GB → 1TB
                </label>
                <div className="flex items-center">
                  <span className="text-gray-600 mr-2">Rs:</span>
                  <input
                    type="number"
                    value={pricing?.ssd_128_to_1tb || 0}
                    onChange={(e) => handleChange('ssd_128_to_1tb', e.target.value)}
                    min="0"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* From 256GB */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">From 256GB SSD</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  256GB → 512GB
                </label>
                <div className="flex items-center">
                  <span className="text-gray-600 mr-2">Rs:</span>
                  <input
                    type="number"
                    value={pricing?.ssd_256_to_512 || 0}
                    onChange={(e) => handleChange('ssd_256_to_512', e.target.value)}
                    min="0"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  256GB → 1TB
                </label>
                <div className="flex items-center">
                  <span className="text-gray-600 mr-2">Rs:</span>
                  <input
                    type="number"
                    value={pricing?.ssd_256_to_1tb || 0}
                    onChange={(e) => handleChange('ssd_256_to_1tb', e.target.value)}
                    min="0"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* From 512GB */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">From 512GB SSD</h4>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  512GB → 1TB
                </label>
                <div className="flex items-center">
                  <span className="text-gray-600 mr-2">Rs:</span>
                  <input
                    type="number"
                    value={pricing?.ssd_512_to_1tb || 0}
                    onChange={(e) => handleChange('ssd_512_to_1tb', e.target.value)}
                    min="0"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Last Updated Info */}
      {pricing?.updated_at && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-600">
          <p>
            <strong>Last Updated:</strong> {new Date(pricing.updated_at).toLocaleString()}
            {pricing.updated_by && ` by ${pricing.updated_by}`}
          </p>
        </div>
      )}
    </div>
  );
}
