'use client';

import React, { useState } from 'react';
import { Upload, Download, FileText, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

export default function BulkUpdate({ onUpdateComplete }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [result, setResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const exportProducts = async () => {
    try {
      setExporting(true);
      const response = await fetch('/api/admin/products/export');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Export failed');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `products_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting products:', error);
      alert('Error exporting products: ' + error.message);
    } finally {
      setExporting(false);
    }
  };

  const handleUpdate = async () => {
    if (!file) {
      alert('Please select a file first');
      return;
    }

    setUploading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/products/bulk-update', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setResult(data);

      if (data.success) {
        // Call parent callback to refresh product list
        if (onUpdateComplete) {
          onUpdateComplete();
        }
      }
    } catch (error) {
      console.error('Error updating products:', error);
      setResult({
        success: false,
        error: 'Update failed: ' + error.message
      });
    } finally {
      setUploading(false);
    }
  };

  const resetUpdate = () => {
    setFile(null);
    setResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Bulk Update Products</h3>
          <p className="text-gray-600">Export existing products, modify them, and upload to update</p>
        </div>
        <button
          onClick={exportProducts}
          disabled={exporting}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {exporting ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          {exporting ? 'Exporting...' : 'Export Products'}
        </button>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">How to Update Products:</h4>
        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
          <li><strong>Export Products:</strong> Click "Export Products" to download current products with IDs</li>
          <li><strong>Edit Data:</strong> Open the CSV file and modify the products you want to update</li>
          <li><strong>Keep IDs:</strong> Don't change the ID column - it's used to identify which products to update</li>
          <li><strong>Upload:</strong> Upload the modified file to update products</li>
        </ol>
      </div>

      {/* File Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : file 
            ? 'border-green-500 bg-green-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {file ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <FileText className="w-12 h-12 text-green-600" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900">{file.name}</p>
              <p className="text-sm text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleUpdate}
                disabled={uploading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                {uploading ? 'Updating...' : 'Update Products'}
              </button>
              <button
                onClick={resetUpdate}
                disabled={uploading}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <Upload className="w-12 h-12 text-gray-400" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900">
                Drop your updated CSV or Excel file here
              </p>
              <p className="text-sm text-gray-500">
                or click to browse files
              </p>
            </div>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload-update"
            />
            <label
              htmlFor="file-upload-update"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Choose File
            </label>
          </div>
        )}
      </div>

      {/* Update Progress */}
      {uploading && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
            <div>
              <p className="font-medium text-green-900">Updating products...</p>
              <p className="text-sm text-green-700">Please wait while we update your products</p>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className={`border rounded-lg p-4 ${
          result.success 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-start gap-3">
            {result.success ? (
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <h4 className={`font-medium ${
                result.success ? 'text-green-900' : 'text-red-900'
              }`}>
                {result.success ? 'Update Successful!' : 'Update Failed'}
              </h4>
              
              {result.success ? (
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-green-700">
                    Successfully updated {result.updated} out of {result.total} products
                  </p>
                  {result.errors && result.errors.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-orange-800 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        Some products had errors:
                      </p>
                      <div className="mt-2 max-h-32 overflow-y-auto">
                        {result.errors.slice(0, 5).map((error, index) => (
                          <div key={index} className="text-xs text-orange-700 bg-orange-100 p-2 rounded mt-1">
                            <strong>{error.product}:</strong> {error.error}
                          </div>
                        ))}
                        {result.errors.length > 5 && (
                          <p className="text-xs text-orange-700 mt-1">
                            ... and {result.errors.length - 5} more errors
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-red-700 mt-1">
                  {result.error}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Warning */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-900 mb-1">Important Notes:</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Only products with valid IDs will be updated</li>
              <li>• Products not found in database will be skipped</li>
              <li>• Always backup your data before bulk updates</li>
              <li>• The ID column must not be modified</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
