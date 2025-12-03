'use client';

import React, { useState } from 'react';
import { Upload, Download, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function BulkImport({ onImportComplete }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
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

  const downloadTemplate = async () => {
    try {
      const response = await fetch('/api/admin/products/csv-template');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'products_template.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading template:', error);
      alert('Error downloading template');
    }
  };

  const downloadExcelTemplate = async () => {
    try {
      const response = await fetch('/api/admin/products/excel-template');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'mohit_computers_product_template.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading Excel template:', error);
      alert('Error downloading Excel template');
    }
  };

  const exportProducts = async () => {
    try {
      const response = await fetch('/api/admin/products/export');

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `products_export_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      alert('Products exported successfully! Edit the file and upload to update.');
    } catch (error) {
      console.error('Error exporting products:', error);
      alert('Error exporting products: ' + error.message);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first');
      return;
    }

    setUploading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/products/bulk-import', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setResult(data);

      if (data.success) {
        // Call parent callback to refresh product list
        if (onImportComplete) {
          onImportComplete();
        }
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setResult({
        success: false,
        error: 'Upload failed: ' + error.message
      });
    } finally {
      setUploading(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Bulk Import/Update Products</h3>
          <p className="text-gray-600">Upload CSV or Excel file to import new products or update existing ones</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={downloadExcelTemplate}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Excel Template (Recommended)
          </button>
          <button
            onClick={downloadTemplate}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            CSV Template
          </button>
          <button
            onClick={exportProducts}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Products
          </button>
        </div>
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
                onClick={handleUpload}
                disabled={uploading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                {uploading ? 'Uploading...' : 'Upload & Import'}
              </button>
              <button
                onClick={resetUpload}
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
                Drop your CSV or Excel file here
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
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Choose File
            </label>
          </div>
        )}
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <div>
              <p className="font-medium text-blue-900">Processing your file...</p>
              <p className="text-sm text-blue-700">Please wait while we import your products</p>
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
                {result.success ? 'Import Successful!' : 'Import Failed'}
              </h4>
              
              {result.success ? (
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-green-700">
                    Successfully processed {result.created + result.updated} out of {result.total} products
                  </p>
                  {(result.created > 0 || result.updated > 0) && (
                    <div className="text-sm text-green-600 mt-1">
                      {result.created > 0 && <span>✓ Created: {result.created}</span>}
                      {result.created > 0 && result.updated > 0 && <span className="mx-2">•</span>}
                      {result.updated > 0 && <span>✓ Updated: {result.updated}</span>}
                    </div>
                  )}
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

      {/* Instructions */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Instructions:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• <strong>Excel Template (Recommended):</strong> Download Excel template - includes &quot;Dropdown Options&quot; sheet with all valid values for reference</li>
          <li>• <strong>Update Products:</strong> Click &quot;Export Products&quot; to download existing products, edit them, and re-upload</li>
          <li>• Required fields: <strong>Model, Selling Price</strong></li>
          <li>• <strong>Product ID column:</strong> Keep this column for updates (don&apos;t change it!)</li>
          <li>• <strong>No Product ID:</strong> New product will be created</li>
          <li>• <strong>With Product ID:</strong> Existing product will be updated (no duplicate)</li>
          <li>• <strong>Image Links:</strong> Add up to 5 product image URLs</li>
          <li>• Use &quot;TRUE&quot;/&quot;FALSE&quot; for boolean fields (In Stock, Is Active, Is Featured, etc.)</li>
          <li>• Supported file types: CSV (.csv), Excel (.xlsx, .xls)</li>
          <li>• <strong>Tip:</strong> Check the &quot;Dropdown Options&quot; sheet in Excel template for all valid values</li>
        </ul>
      </div>
    </div>
  );
}
