"use client";

import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, DollarSign, Cpu, HardDrive, AlertCircle, CheckCircle } from 'lucide-react';

export default function Settings() {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  // RAM Pricing State
  const [ramPricing, setRamPricing] = useState({
    ddr3: {
      '4GB': 1000,
      '8GB': 2500
    },
    ddr4: {
      '4GB': 3200,
      '8GB': 6000,
      '16GB': 11500
    }
  });

  // SSD Pricing State (with upgrade paths)
  const [ssdPricing, setSsdPricing] = useState({
    '125GB': {
      '256GB': 3000,
      '512GB': 8000,
      '1TB': 18500
    },
    '128GB': {
      '256GB': 3000,
      '512GB': 8000,
      '1TB': 18500
    },
    '256GB': {
      '512GB': 8000,
      '1TB': 15500
    },
    '512GB': {
      '1TB': 10500
    }
  });

  // Load current pricing from upgradeOptions.js
  useEffect(() => {
    loadCurrentPricing();
  }, []);

  const loadCurrentPricing = async () => {
    try {
      const response = await fetch('/api/admin/settings/upgrade-pricing');
      if (response.ok) {
        const data = await response.json();
        if (data.ramPricing) setRamPricing(data.ramPricing);
        if (data.ssdPricing) setSsdPricing(data.ssdPricing);
      }
    } catch (error) {
      console.error('Error loading pricing:', error);
    }
  };

  const handleRAMPriceChange = (ramType, capacity, value) => {
    setRamPricing(prev => ({
      ...prev,
      [ramType]: {
        ...prev[ramType],
        [capacity]: parseInt(value) || 0
      }
    }));
    setHasChanges(true);
  };

  const handleSSDPriceChange = (fromCapacity, toCapacity, value) => {
    setSsdPricing(prev => ({
      ...prev,
      [fromCapacity]: {
        ...prev[fromCapacity],
        [toCapacity]: parseInt(value) || 0
      }
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/settings/upgrade-pricing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ramPricing,
          ssdPricing
        }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Pricing updated successfully! All products will now use the new prices.' });
        setHasChanges(false);
      } else {
        setMessage({ type: 'error', text: 'Failed to update pricing. Please try again.' });
      }
    } catch (error) {
      console.error('Error saving pricing:', error);
      setMessage({ type: 'error', text: 'An error occurred while saving. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset to default prices?')) {
      setRamPricing({
        ddr3: {
          '4GB': 1000,
          '8GB': 2500
        },
        ddr4: {
          '4GB': 3200,
          '8GB': 6000,
          '16GB': 11500
        }
      });
      setSsdPricing({
        '125GB': {
          '256GB': 3000,
          '512GB': 8000,
          '1TB': 18500
        },
        '128GB': {
          '256GB': 3000,
          '512GB': 8000,
          '1TB': 18500
        },
        '256GB': {
          '512GB': 8000,
          '1TB': 15500
        },
        '512GB': {
          '1TB': 10500
        }
      });
      setHasChanges(true);
      setMessage({ type: 'success', text: 'Prices reset to default values. Click Save to apply.' });
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upgrade Pricing Settings</h1>
        <p className="text-gray-600">
          Manage RAM and SSD upgrade pricing for all laptop products. Changes apply globally.
        </p>
      </div>

      {/* Message Alert */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg border-2 flex items-start gap-3 ${
          message.type === 'success'
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          )}
          <p>{message.text}</p>
        </div>
      )}

      {/* Unsaved Changes Warning */}
      {hasChanges && (
        <div className="mb-6 p-4 rounded-lg border-2 bg-amber-50 border-amber-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-amber-800">
            You have unsaved changes. Click <strong>Save Changes</strong> to apply them.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RAM Pricing Section */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-5">
            <div className="flex items-center gap-3 text-white">
              <div className="p-2 bg-white/20 rounded-lg">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">RAM Upgrade Pricing</h2>
                <p className="text-blue-100 text-sm">Based on Processor Generation</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* DDR3 Pricing */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">DDR3/DDR3L RAM</h3>
                <span className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-600 font-medium">
                  3rd - 5th Gen
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <label className="w-24 text-sm font-semibold text-gray-700">4GB DDR3</label>
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                      Rs
                    </span>
                    <input
                      type="number"
                      value={ramPricing.ddr3['4GB']}
                      onChange={(e) => handleRAMPriceChange('ddr3', '4GB', e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-semibold"
                      min="0"
                      step="100"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <label className="w-24 text-sm font-semibold text-gray-700">8GB DDR3</label>
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                      Rs
                    </span>
                    <input
                      type="number"
                      value={ramPricing.ddr3['8GB']}
                      onChange={(e) => handleRAMPriceChange('ddr3', '8GB', e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-semibold"
                      min="0"
                      step="100"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t-2 border-gray-200"></div>

            {/* DDR4 Pricing */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">DDR4 RAM</h3>
                <span className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-600 font-medium">
                  6th - 11th Gen
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <label className="w-24 text-sm font-semibold text-gray-700">4GB DDR4</label>
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                      Rs
                    </span>
                    <input
                      type="number"
                      value={ramPricing.ddr4['4GB']}
                      onChange={(e) => handleRAMPriceChange('ddr4', '4GB', e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-semibold"
                      min="0"
                      step="100"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <label className="w-24 text-sm font-semibold text-gray-700">8GB DDR4</label>
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                      Rs
                    </span>
                    <input
                      type="number"
                      value={ramPricing.ddr4['8GB']}
                      onChange={(e) => handleRAMPriceChange('ddr4', '8GB', e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-semibold"
                      min="0"
                      step="100"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <label className="w-24 text-sm font-semibold text-gray-700">16GB DDR4</label>
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                      Rs
                    </span>
                    <input
                      type="number"
                      value={ramPricing.ddr4['16GB']}
                      onChange={(e) => handleRAMPriceChange('ddr4', '16GB', e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-semibold"
                      min="0"
                      step="100"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SSD Pricing Section */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-teal-600 to-cyan-500 p-5">
            <div className="flex items-center gap-3 text-white">
              <div className="p-2 bg-white/20 rounded-lg">
                <HardDrive className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">SSD Upgrade Pricing</h2>
                <p className="text-teal-100 text-sm">Universal for All Laptops</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* From 125GB/128GB */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-3 bg-gray-100 px-3 py-2 rounded">
                From 125GB/128GB SSD
              </h3>
              <div className="space-y-3 pl-3">
                <div className="flex items-center gap-3">
                  <label className="w-32 text-sm font-medium text-gray-700">To 256GB SSD</label>
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                      Rs
                    </span>
                    <input
                      type="number"
                      value={ssdPricing['125GB']['256GB']}
                      onChange={(e) => handleSSDPriceChange('125GB', '256GB', e.target.value)}
                      onBlur={(e) => {
                        // Keep 125GB and 128GB in sync
                        handleSSDPriceChange('128GB', '256GB', e.target.value);
                      }}
                      className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-semibold"
                      min="0"
                      step="100"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <label className="w-32 text-sm font-medium text-gray-700">To 512GB SSD</label>
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                      Rs
                    </span>
                    <input
                      type="number"
                      value={ssdPricing['125GB']['512GB']}
                      onChange={(e) => handleSSDPriceChange('125GB', '512GB', e.target.value)}
                      onBlur={(e) => {
                        // Keep 125GB and 128GB in sync
                        handleSSDPriceChange('128GB', '512GB', e.target.value);
                      }}
                      className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-semibold"
                      min="0"
                      step="100"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <label className="w-32 text-sm font-medium text-gray-700">To 1TB SSD</label>
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                      Rs
                    </span>
                    <input
                      type="number"
                      value={ssdPricing['125GB']['1TB']}
                      onChange={(e) => handleSSDPriceChange('125GB', '1TB', e.target.value)}
                      onBlur={(e) => {
                        // Keep 125GB and 128GB in sync
                        handleSSDPriceChange('128GB', '1TB', e.target.value);
                      }}
                      className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-semibold"
                      min="0"
                      step="100"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t-2 border-gray-200"></div>

            {/* From 256GB */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-3 bg-gray-100 px-3 py-2 rounded">
                From 256GB SSD
              </h3>
              <div className="space-y-3 pl-3">
                <div className="flex items-center gap-3">
                  <label className="w-32 text-sm font-medium text-gray-700">To 512GB SSD</label>
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                      Rs
                    </span>
                    <input
                      type="number"
                      value={ssdPricing['256GB']['512GB']}
                      onChange={(e) => handleSSDPriceChange('256GB', '512GB', e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-semibold"
                      min="0"
                      step="100"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <label className="w-32 text-sm font-medium text-gray-700">To 1TB SSD</label>
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                      Rs
                    </span>
                    <input
                      type="number"
                      value={ssdPricing['256GB']['1TB']}
                      onChange={(e) => handleSSDPriceChange('256GB', '1TB', e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-semibold"
                      min="0"
                      step="100"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t-2 border-gray-200"></div>

            {/* From 512GB */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-3 bg-gray-100 px-3 py-2 rounded">
                From 512GB SSD
              </h3>
              <div className="space-y-3 pl-3">
                <div className="flex items-center gap-3">
                  <label className="w-32 text-sm font-medium text-gray-700">To 1TB SSD</label>
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                      Rs
                    </span>
                    <input
                      type="number"
                      value={ssdPricing['512GB']['1TB']}
                      onChange={(e) => handleSSDPriceChange('512GB', '1TB', e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-semibold"
                      min="0"
                      step="100"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-teal-50 border-2 border-teal-200 rounded-lg">
              <p className="text-sm text-teal-800">
                <strong>Note:</strong> 125GB and 128GB are treated as equivalent. Updating one will automatically update the other.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-lg border-2 border-gray-200">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold transition-colors border-2 border-gray-300"
        >
          <RefreshCw className="w-5 h-5" />
          Reset to Default
        </button>

        <button
          onClick={handleSave}
          disabled={saving || !hasChanges}
          className={`flex items-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all ${
            saving || !hasChanges
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-teal-600 text-white hover:from-blue-700 hover:to-teal-700 shadow-lg'
          }`}
        >
          <Save className="w-5 h-5" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Info Section */}
      <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          How Pricing Works
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <span className="font-bold mt-0.5">•</span>
            <span><strong>RAM Pricing:</strong> Based on processor generation. 3rd-5th Gen laptops show DDR3 options, while 6th-11th Gen show DDR4 options.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold mt-0.5">•</span>
            <span><strong>SSD Pricing:</strong> All three SSD options (256GB, 512GB, 1TB) are shown for every laptop product.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold mt-0.5">•</span>
            <span><strong>Global Changes:</strong> When you update prices here, they automatically apply to all laptop products across your website.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold mt-0.5">•</span>
            <span><strong>No Generation:</strong> If a laptop doesn&apos;t have a generation defined, no upgrade options will be displayed on the product page.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
