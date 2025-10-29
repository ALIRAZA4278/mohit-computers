'use client';

import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Edit2, X, Cpu, HardDrive, Eye, EyeOff } from 'lucide-react';

export default function LaptopUpgradeOptionsManager() {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [editingOption, setEditingOption] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState('ram'); // 'ram' or 'ssd'

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/laptop-upgrade-options');
      const data = await response.json();
      if (data.success) {
        setOptions(data.options || []);
      }
    } catch (error) {
      console.error('Error fetching options:', error);
      setMessage({ type: 'error', text: 'Failed to load upgrade options' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (optionData) => {
    try {
      setSaving(true);
      setMessage({ type: '', text: '' });

      const url = '/api/laptop-upgrade-options';
      const method = optionData.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(optionData)
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: data.message });
        fetchOptions();
        setEditingOption(null);
        setShowAddModal(false);
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save option' });
      }
    } catch (error) {
      console.error('Error saving option:', error);
      setMessage({ type: 'error', text: 'Failed to save option' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this upgrade option?')) return;

    try {
      const response = await fetch(`/api/laptop-upgrade-options?id=${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Option deleted successfully' });
        fetchOptions();
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to delete option' });
      }
    } catch (error) {
      console.error('Error deleting option:', error);
      setMessage({ type: 'error', text: 'Failed to delete option' });
    }
  };

  const toggleActive = async (option) => {
    await handleSave({ ...option, is_active: !option.is_active });
  };

  const ramOptions = options.filter(opt => opt.option_type === 'ram');
  const ssdOptions = options.filter(opt => opt.option_type === 'ssd');

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading upgrade options...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-purple-600 p-2 rounded-lg">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Laptop Upgrade Options</h2>
            <p className="text-sm text-gray-600">Manage RAM and SSD upgrade options for laptop customizer</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Option
        </button>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('ram')}
          className={`flex items-center gap-2 px-6 py-3 font-semibold transition-colors ${
            activeTab === 'ram'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Cpu className="w-5 h-5" />
          RAM Upgrades ({ramOptions.length})
        </button>
        <button
          onClick={() => setActiveTab('ssd')}
          className={`flex items-center gap-2 px-6 py-3 font-semibold transition-colors ${
            activeTab === 'ssd'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <HardDrive className="w-5 h-5" />
          SSD Upgrades ({ssdOptions.length})
        </button>
      </div>

      {/* Options Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Size</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Label</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Description</th>
              {activeTab === 'ram' && (
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
              )}
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Price</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Order</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {(activeTab === 'ram' ? ramOptions : ssdOptions).map((option) => (
              <tr key={option.id} className={!option.is_active ? 'opacity-50' : ''}>
                <td className="px-4 py-4 text-sm font-medium text-gray-900">{option.size}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{option.display_label}</td>
                <td className="px-4 py-4 text-sm text-gray-600">{option.description}</td>
                {activeTab === 'ram' && (
                  <td className="px-4 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      option.applicable_to === 'ddr3' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                    }`}>
                      {option.applicable_to?.toUpperCase()}
                    </span>
                  </td>
                )}
                <td className="px-4 py-4 text-sm font-semibold text-gray-900">
                  Rs {option.price?.toLocaleString()}
                </td>
                <td className="px-4 py-4 text-sm text-gray-600">{option.display_order}</td>
                <td className="px-4 py-4">
                  <button
                    onClick={() => toggleActive(option)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      option.is_active
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {option.is_active ? <Eye className="w-4 h-4 inline" /> : <EyeOff className="w-4 h-4 inline" />}
                  </button>
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditingOption(option)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(option.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(activeTab === 'ram' ? ramOptions : ssdOptions).length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No {activeTab.toUpperCase()} upgrade options found. Click &quot;Add Option&quot; to create one.
          </div>
        )}
      </div>

      {/* Edit/Add Modal */}
      {(editingOption || showAddModal) && (
        <OptionEditModal
          option={editingOption}
          optionType={activeTab}
          onSave={handleSave}
          onCancel={() => {
            setEditingOption(null);
            setShowAddModal(false);
          }}
          saving={saving}
        />
      )}
    </div>
  );
}

// Edit/Add Modal Component
function OptionEditModal({ option, optionType, onSave, onCancel, saving }) {
  const [formData, setFormData] = useState(option || {
    option_type: optionType,
    size: '',
    size_number: 0,
    display_label: '',
    description: '',
    applicable_to: optionType === 'ram' ? 'ddr4' : 'all',
    min_generation: optionType === 'ram' ? 6 : null,
    max_generation: optionType === 'ram' ? 11 : null,
    price: 0,
    is_active: true,
    display_order: 0
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">
            {option ? 'Edit' : 'Add'} {optionType.toUpperCase()} Upgrade Option
          </h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Size *</label>
              <input
                type="text"
                value={formData.size}
                onChange={(e) => handleChange('size', e.target.value)}
                placeholder="e.g., 8GB, 512GB"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Size Number *</label>
              <input
                type="number"
                value={formData.size_number}
                onChange={(e) => handleChange('size_number', parseInt(e.target.value))}
                placeholder="e.g., 8, 512"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Display Label *</label>
            <input
              type="text"
              value={formData.display_label}
              onChange={(e) => handleChange('display_label', e.target.value)}
              placeholder="e.g., 8GB DDR4, 512GB NVMe SSD"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Brief description of the upgrade"
              rows="2"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {optionType === 'ram' && (
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">RAM Type *</label>
                <select
                  value={formData.applicable_to}
                  onChange={(e) => handleChange('applicable_to', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="ddr3">DDR3 (3rd-5th Gen)</option>
                  <option value="ddr4">DDR4 (6th-11th Gen)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Generation</label>
                <input
                  type="number"
                  value={formData.min_generation || ''}
                  onChange={(e) => handleChange('min_generation', e.target.value ? parseInt(e.target.value) : null)}
                  placeholder="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Generation</label>
                <input
                  type="number"
                  value={formData.max_generation || ''}
                  onChange={(e) => handleChange('max_generation', e.target.value ? parseInt(e.target.value) : null)}
                  placeholder="11"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price (Rs) *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleChange('price', parseInt(e.target.value) || 0)}
                placeholder="0"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) => handleChange('display_order', parseInt(e.target.value) || 0)}
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => handleChange('is_active', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="is_active" className="ml-2 text-sm font-medium text-gray-700">
              Active (visible in customizer)
            </label>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Saving...' : 'Save Option'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
