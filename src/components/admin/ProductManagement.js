'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Search, Package, Upload, ArrowLeft, RefreshCw } from 'lucide-react';
import ProductEditor from './ProductEditor';
import BulkImport from './BulkImport';

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showEditor, setShowEditor] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showBulkImport, setShowBulkImport] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products');
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowEditor(true);
  };

  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      if (data.success) {
        setProducts(products.filter(p => p.id !== productId));
        alert('Product deleted successfully');
      } else {
        alert('Error deleting product: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    }
  };

  const handleSave = async (productData) => {
    try {
      const url = editingProduct 
        ? `/api/admin/products/${editingProduct.id}`
        : '/api/admin/products';
      
      const method = editingProduct ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchProducts();
        setShowEditor(false);
        setEditingProduct(null);
        alert(editingProduct ? 'Product updated successfully' : 'Product created successfully');
      } else {
        alert('Error saving product: ' + data.error);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product');
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (showEditor) {
    return (
      <ProductEditor
        product={editingProduct}
        onSave={handleSave}
        onCancel={() => {
          setShowEditor(false);
          setEditingProduct(null);
        }}
      />
    );
  }

  if (showBulkImport) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowBulkImport(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Bulk Import Products</h2>
              <p className="text-gray-600">Import multiple products from CSV/Excel file</p>
            </div>
          </div>
        </div>
        <BulkImport 
          onImportComplete={() => {
            fetchProducts();
            setShowBulkImport(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-black">Product Management</h1>
        <div className="flex gap-3">
          <button
            onClick={fetchProducts}
            className="bg-white text-black px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 font-medium shadow-sm flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={() => setShowBulkImport(true)}
            className="bg-white text-black px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 font-medium shadow-sm flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Bulk Import
          </button>
          <button
            onClick={() => setShowEditor(true)}
            className="bg-[#6dc1c9] text-white px-6 py-2 rounded-lg hover:bg-teal-700 font-medium shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6 border border-gray-200">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search products by name or brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-black"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-black font-medium"
          >
            <option value="all">All Categories</option>
            <option value="laptop">Laptop</option>
            <option value="workstation">Workstation</option>
            <option value="chromebook">Chromebook</option>
            <option value="accessories">Accessories</option>
            <option value="ram">RAM</option>
            <option value="ssd">SSD</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6dc1c9]"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-200">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-black mb-2">No products found</h3>
          <p className="text-gray-600 mb-4">
            {products.length === 0
              ? "You haven&apos;t added any products yet."
              : "No products match your current filters."
            }
          </p>
          {products.length === 0 && (
            <button
              onClick={() => setShowEditor(true)}
              className="bg-[#6dc1c9] text-white px-6 py-2 rounded-lg hover:bg-teal-700 font-medium"
            >
              Add Your First Product
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-xl transition-shadow overflow-hidden"
            >
              {/* Product Image/Icon */}
              <div className="h-48 bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center">
                <Package className="w-20 h-20 text-[#6dc1c9]" />
              </div>

              {/* Product Info */}
              <div className="p-5 space-y-3">
                <div>
                  <h3 className="font-bold text-lg text-black line-clamp-1">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.brand}</p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 text-xs font-bold rounded-full bg-teal-100 text-teal-800 border border-teal-300">
                    {product.category_id?.toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                    product.is_active
                      ? 'bg-green-100 text-green-800 border border-green-300'
                      : 'bg-red-100 text-red-800 border border-red-300'
                  }`}>
                    {product.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="pt-3 border-t">
                  <p className="text-2xl font-bold text-black">Rs {product.price?.toLocaleString()}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-3">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 bg-[#6dc1c9] text-white py-2 rounded-lg hover:bg-teal-700 font-medium flex items-center justify-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      <div className="mt-6 bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <p className="text-sm text-black font-medium">
          Showing <span className="font-bold">{filteredProducts.length}</span> of <span className="font-bold">{products.length}</span> products
        </p>
      </div>
    </div>
  );
}
