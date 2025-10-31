'use client';

import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, DollarSign } from 'lucide-react';

export default function UpgradePricingManager() {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchPricing();
  }, []);

  const fetchPricing = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/laptop-upgrade-options');
      const data = await response.json();
      if (data.success) {
        setOptions(data.options || []);
      }
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

      // Update each option's price
      const updatePromises = options.map(option =>
        fetch('/api/laptop-upgrade-options', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: option.id,
            price: option.price
          })
        })
      );

      const responses = await Promise.all(updatePromises);
      const allSuccessful = responses.every(r => r.ok);

      if (allSuccessful) {
        setMessage({ type: 'success', text: 'Pricing updated successfully! Changes are now live in the laptop customizer.' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        fetchPricing(); // Refresh data
      } else {
        setMessage({ type: 'error', text: 'Failed to update some pricing options' });
      }
    } catch (error) {
      console.error('Error saving pricing:', error);
      setMessage({ type: 'error', text: 'Failed to save pricing' });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (id, value) => {
    setOptions(prev => prev.map(option =>
      option.id === id
        ? { ...option, price: parseInt(value) || 0 }
        : option
    ));
  };

  // Organize options by type
  const ramDDR3 = options.filter(opt => opt.option_type === 'ram' && opt.applicable_to === 'ddr3');
  const ramDDR4 = options.filter(opt => opt.option_type === 'ram' && opt.applicable_to === 'ddr4');
  const ssdOptions = options.filter(opt => opt.option_type === 'ssd');

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
            <h2 className="text-2xl font-bold text-gray-900">Laptop Upgrade Pricing</h2>
            <p className="text-sm text-gray-600">Update prices for all laptop customization options. Changes apply immediately to the website.</p>
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
          {ramDDR3.map((option) => (
            <div key={option.id}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {option.display_label}
                {option.description && <span className="text-xs text-gray-500 block">{option.description}</span>}
              </label>
              <div className="flex items-center">
                <span className="text-gray-600 mr-2">Rs:</span>
                <input
                  type="number"
                  value={option.price || 0}
                  onChange={(e) => handleChange(option.id, e.target.value)}
                  min="0"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          ))}
        </div>
        {ramDDR3.length === 0 && (
          <p className="text-center py-4 text-gray-500">No DDR3 RAM options available. Add them in Laptop Options section.</p>
        )}
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
          {ramDDR4.map((option) => (
            <div key={option.id}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {option.display_label}
                {option.description && <span className="text-xs text-gray-500 block">{option.description}</span>}
              </label>
              <div className="flex items-center">
                <span className="text-gray-600 mr-2">Rs:</span>
                <input
                  type="number"
                  value={option.price || 0}
                  onChange={(e) => handleChange(option.id, e.target.value)}
                  min="0"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          ))}
        </div>
        {ramDDR4.length === 0 && (
          <p className="text-center py-4 text-gray-500">No DDR4 RAM options available. Add them in Laptop Options section.</p>
        )}
      </div>

      {/* SSD Pricing */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-lg border border-green-200 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            SSD Upgrade Prices
          </h3>
          <p className="text-sm text-gray-600">Storage upgrade pricing</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ssdOptions.map((option) => (
            <div key={option.id}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {option.display_label}
                {option.description && <span className="text-xs text-gray-500 block">{option.description}</span>}
              </label>
              <div className="flex items-center">
                <span className="text-gray-600 mr-2">Rs:</span>
                <input
                  type="number"
                  value={option.price || 0}
                  onChange={(e) => handleChange(option.id, e.target.value)}
                  min="0"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          ))}
        </div>
        {ssdOptions.length === 0 && (
          <p className="text-center py-4 text-gray-500">No SSD options available. Add them in Laptop Options section.</p>
        )}
      </div>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2">How it works:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Update prices here to change what customers see in the laptop customizer</li>
          <li>• To add/remove upgrade options, use the &quot;Laptop Options&quot; section in the admin panel</li>
          <li>• Changes are applied immediately across all laptop products</li>
        </ul>
      </div>
    </div>
  );
}
