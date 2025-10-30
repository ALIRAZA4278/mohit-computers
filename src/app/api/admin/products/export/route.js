import { NextResponse } from 'next/server';
import { productsAPI } from '@/lib/supabase-db';
import * as XLSX from 'xlsx';

// GET - Export all products to Excel
export async function GET(request) {
  try {
    console.log('[EXPORT] Starting products export...');

    // Get all products from database
    const { data: products, error } = await productsAPI.getAll(10000, false); // Get all, including inactive

    if (error) {
      console.error('[EXPORT] Database error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch products from database' },
        { status: 500 }
      );
    }

    if (!products || products.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No products found in database' },
        { status: 404 }
      );
    }

    console.log(`[EXPORT] Found ${products.length} products to export`);

    // Convert products to Excel format
    const excelData = products.map(product => ({
      // IMPORTANT: Product ID for updates (hidden in Excel but present)
      'Product ID': product.id,

      // Basic Information
      'Category': product.category_id || '',
      'Model': product.name || '',
      'Brand': product.brand || '',
      'Description': product.description || '',
      'Selling Price': product.price || 0,
      'Original Price': product.original_price || '',
      'Stock Quantity': product.stock_quantity || 0,
      'SKU': product.sku || '',
      'In Stock': product.in_stock ? 'true' : 'false',
      'Is Active': product.is_active ? 'true' : 'false',
      'Is Featured': product.is_featured ? 'true' : 'false',

      // Product Types
      'Is Workstation': product.is_workstation ? 'true' : 'false',
      'Is Rugged Tough': product.is_rugged_tough ? 'true' : 'false',

      // Clearance & Discount
      'Is Clearance': product.is_clearance ? 'true' : 'false',
      'Clearance Reason': product.clearance_reason || '',
      'Is Discounted': product.is_discounted ? 'true' : 'false',
      'Discount Percentage': product.discount_percentage || '',

      // Laptop Specifications
      'Processor': product.processor || '',
      'Generation': product.generation || '',
      'Ram': product.ram || '',
      'HDD': product.hdd || '',
      'Display Size': product.display_size || '',
      'Resolution (Options)': product.resolution || '',
      'Integrated Graphics': product.integrated_graphics || '',
      'Discrete/Dedicated Graphics': product.discrete_graphics || '',
      'Touch / Non touch / X360': product.touch_type || '',
      'Operating Features': product.operating_features || '',
      'Extra Features (Connectivity/Ports/Other)': product.extra_features || '',
      'Condition': product.condition || '',
      'Battery': product.battery || '',
      'Charger Included': product.charger_included ? 'true' : 'false',
      'Warranty': product.warranty || '',

      // Customization Controls
      'Show Laptop Customizer': product.show_laptop_customizer !== false ? 'true' : 'false',
      'Show RAM Options': product.show_ram_options !== false ? 'true' : 'false',
      'Show SSD Options': product.show_ssd_options !== false ? 'true' : 'false',

      // RAM Product Fields
      'RAM Type': product.ram_type || '',
      'RAM Capacity': product.ram_capacity || '',
      'RAM Speed': product.ram_speed || '',
      'RAM Form Factor': product.ram_form_factor || '',
      'RAM Condition': product.ram_condition || '',
      'RAM Warranty': product.ram_warranty || '',
      'Show RAM Customizer': product.show_ram_customizer ? 'true' : 'false',

      // Images
      'Image URL 1': Array.isArray(product.images) && product.images[0] ? product.images[0] : (product.featured_image || ''),
      'Image URL 2': Array.isArray(product.images) && product.images[1] ? product.images[1] : '',
      'Image URL 3': Array.isArray(product.images) && product.images[2] ? product.images[2] : '',
      'Image URL 4': Array.isArray(product.images) && product.images[3] ? product.images[3] : '',
      'Image URL 5': Array.isArray(product.images) && product.images[4] ? product.images[4] : '',
    }));

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Set column widths for better readability
    const columnWidths = [
      { wch: 36 }, // Product ID (UUID)
      { wch: 15 }, // Category
      { wch: 30 }, // Model
      { wch: 15 }, // Brand
      { wch: 40 }, // Description
      { wch: 12 }, // Selling Price
      { wch: 12 }, // Original Price
      { wch: 12 }, // Stock Quantity
      { wch: 20 }, // SKU
    ];
    worksheet['!cols'] = columnWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');

    // Generate Excel file buffer
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    console.log(`[EXPORT] Export complete. ${products.length} products exported.`);

    // Return Excel file
    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="products_export_${new Date().toISOString().split('T')[0]}.xlsx"`
      }
    });

  } catch (error) {
    console.error('[EXPORT] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to export products: ' + error.message },
      { status: 500 }
    );
  }
}
