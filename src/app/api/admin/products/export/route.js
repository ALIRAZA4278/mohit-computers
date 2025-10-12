import { NextResponse } from 'next/server';
import { productsAPI } from '@/lib/supabase-db';

// GET - Export all products to CSV for updating
export async function GET() {
  try {
    // Fetch all products from database
    const { data: products, error } = await productsAPI.getAll();
    
    if (error) {
      throw new Error(error.message);
    }

    if (!products || products.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No products found to export' },
        { status: 404 }
      );
    }

    // Create CSV header with ID field first for updates
    const headers = [
      'ID', // Important: ID field for updates
      'Category',
      'Model',
      'Processor', 
      'Generation',
      'Ram',
      'HDD',
      'Display Size',
      'Resolution (Options)',
      'Integrated Graphics',
      'Discrete/Dedicated Graphics',
      'Touch / Non touch / X360',
      'Operating Features',
      'Extra Features (Connectivity/Ports/Other)',
      'Condition',
      'Battery',
      'Charger Included',
      'Warranty',
      'Selling Price',
      'Original Price',
      'Stock Quantity',
      'In Stock',
      'Is Active',
      'Is Featured',
      'Image URL 1',
      'Image URL 2', 
      'Image URL 3',
      'Image URL 4',
      'Image URL 5'
    ];

    // Convert products to CSV format
    const csvRows = [headers.join(',')];

    products.forEach(product => {
      // Parse images array
      let images = [];
      try {
        if (product.images) {
          images = typeof product.images === 'string' 
            ? JSON.parse(product.images) 
            : product.images;
        }
      } catch (e) {
        images = [];
      }

      // Ensure we have 5 image slots
      while (images.length < 5) {
        images.push('');
      }

      const row = [
        product.id, // ID for updates
        product.category_id || 'laptop',
        `"${(product.name || '').replace(/"/g, '""')}"`, // Escape quotes
        `"${(product.processor || '').replace(/"/g, '""')}"`,
        `"${(product.generation || '').replace(/"/g, '""')}"`,
        `"${(product.ram || '').replace(/"/g, '""')}"`,
        `"${(product.hdd || product.storage || '').replace(/"/g, '""')}"`,
        `"${(product.display_size || product.screensize || '').replace(/"/g, '""')}"`,
        `"${(product.resolution || '').replace(/"/g, '""')}"`,
        `"${(product.integrated_graphics || '').replace(/"/g, '""')}"`,
        `"${(product.discrete_graphics || '').replace(/"/g, '""')}"`,
        `"${(product.touch_type || '').replace(/"/g, '""')}"`,
        `"${(product.operating_features || '').replace(/"/g, '""')}"`,
        `"${(product.extra_features || '').replace(/"/g, '""')}"`,
        `"${(product.condition || 'Good').replace(/"/g, '""')}"`,
        `"${(product.battery || '').replace(/"/g, '""')}"`,
        product.charger_included ? 'true' : 'false',
        `"${(product.warranty || '').replace(/"/g, '""')}"`,
        product.price || 0,
        product.original_price || '',
        product.stock_quantity || 0,
        product.in_stock ? 'true' : 'false',
        product.is_active ? 'true' : 'false',
        product.is_featured ? 'true' : 'false',
        `"${(images[0] || '').replace(/"/g, '""')}"`,
        `"${(images[1] || '').replace(/"/g, '""')}"`,
        `"${(images[2] || '').replace(/"/g, '""')}"`,
        `"${(images[3] || '').replace(/"/g, '""')}"`,
        `"${(images[4] || '').replace(/"/g, '""')}"`
      ];
      
      csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');

    // Create response with CSV content
    const response = new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="products_export_${new Date().toISOString().split('T')[0]}.csv"`
      }
    });

    return response;
  } catch (error) {
    console.error('Error exporting products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to export products: ' + error.message },
      { status: 500 }
    );
  }
}
