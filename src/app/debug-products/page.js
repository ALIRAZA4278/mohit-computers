'use client';

import { useEffect, useState } from 'react';

export default function DebugProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProducts(data.data || []);
        }
      });
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Product Database Debug</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Total Products: {products.length}</h2>

        {products.length > 0 && (
          <>
            <div className="mb-6 p-4 bg-gray-100 rounded">
              <h3 className="font-semibold mb-2">First Product (Sample):</h3>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(products[0], null, 2)}
              </pre>
            </div>

            <div className="mb-6 p-4 bg-blue-100 rounded">
              <h3 className="font-semibold mb-2">All Unique Brands:</h3>
              <div className="flex flex-wrap gap-2">
                {[...new Set(products.map(p => p.brand).filter(Boolean))].sort().map(brand => (
                  <span key={brand} className="px-3 py-1 bg-blue-500 text-white rounded">
                    {brand}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-sm">Total unique brands: {new Set(products.map(p => p.brand).filter(Boolean)).size}</p>
            </div>

            <div className="mb-6 p-4 bg-green-100 rounded">
              <h3 className="font-semibold mb-2">All Unique Categories:</h3>
              <div className="flex flex-wrap gap-2">
                {[...new Set(products.map(p => p.category || p.category_id).filter(Boolean))].sort().map(cat => (
                  <span key={cat} className="px-3 py-1 bg-green-500 text-white rounded">
                    {cat}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-sm">Total unique categories: {new Set(products.map(p => p.category || p.category_id).filter(Boolean)).size}</p>
            </div>

            <div className="mb-6 p-4 bg-yellow-100 rounded">
              <h3 className="font-semibold mb-2">Sample Products (First 5):</h3>
              <div className="space-y-2">
                {products.slice(0, 5).map((product, idx) => (
                  <div key={idx} className="p-2 bg-white rounded text-sm">
                    <strong>{product.name}</strong>
                    <br />
                    Brand: <code className="bg-gray-200 px-1">{product.brand || 'NULL'}</code>
                    {' | '}
                    Category: <code className="bg-gray-200 px-1">{product.category || product.category_id || 'NULL'}</code>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
