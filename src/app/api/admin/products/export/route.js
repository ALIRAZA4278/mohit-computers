import { NextResponse } from 'next/server';
import { productsAPI } from '@/lib/supabase-db';
import ExcelJS from 'exceljs';

// GET - Export all products to Excel with dropdowns (same format as template)
export async function GET(request) {
  try {
    console.log('[EXPORT] Starting products export with dropdowns...');

    // Get all products from database
    const { data: products, error } = await productsAPI.getAll(10000, false);

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

    // Create workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Mohit Computers';
    workbook.created = new Date();

    // Define dropdown options (same as template)
    const dropdowns = {
      category: ['laptop', 'chromebook', 'workstation', 'ram', 'ssd', 'accessories'],
      brand: ['HP', 'Dell', 'Lenovo', 'Acer', 'ASUS', 'Apple', 'MSI', 'Toshiba', 'Sony', 'Samsung', 'Kingston', 'Corsair', 'Crucial', 'G.Skill', 'Transcend', 'WD', 'SanDisk', 'Intel', 'Logitech', 'Microsoft', 'Razer', 'Generic'],
      productType: ['New', 'Used'],
      condition: ['New', 'Excellent', 'Very Good', 'Good', 'Used'],
      touchType: ['Touch', 'Non-touch', 'X360 (Convertible)', 'Touch - Detachable'],
      generation: ['4th Gen', '5th Gen', '6th Gen', '7th Gen', '8th Gen', '9th Gen', '10th Gen', '11th Gen', '12th Gen', '13th Gen'],
      booleanOptions: ['TRUE', 'FALSE'],
      supportedRamType: ['', 'ddr3', 'ddr4', 'ddr5'],
      ramType: ['DDR3', 'DDR3L', 'DDR4', 'DDR5'],
      ramCapacity: ['2GB', '4GB', '8GB', '16GB', '32GB'],
      ramSpeed: ['1333 MHz', '1600 MHz', '2133 MHz', '2400 MHz', '2666 MHz', '3200 MHz', '4800 MHz'],
      ramFormFactor: ['Laptop (SO-DIMM)', 'Desktop (DIMM)'],
      warranty: ['15 days', '1 month', '3 months', '6 months', '1 year', '2 years', '3 years'],
      displaySize: ['11.6 inch', '12 inch', '12.5 inch', '13.3 inch', '14 inch', '15.6 inch', '17 inch', '17.3 inch'],
      integratedGraphics: [
        'Intel HD Graphics 4400',
        'Intel HD Graphics 520',
        'Intel HD Graphics 530',
        'Intel HD Graphics 620',
        'Intel HD Graphics 630',
        'Intel UHD Graphics 620',
        'Intel UHD Graphics 630',
        'Intel Iris Xe Graphics',
        'AMD Radeon Vega 8',
        'AMD Radeon Vega',
        'Apple M1 GPU (7-core)',
        'Apple M1 GPU (8-core)',
        'Apple M1 Pro GPU (14-core)',
        'Apple M1 Pro GPU (16-core)',
        'Apple M1 Max GPU (24-core)',
        'Apple M1 Max GPU (32-core)',
        'Apple M2 GPU (8-core)',
        'Apple M2 GPU (10-core)',
        'Apple M2 Pro GPU (16-core)',
        'Apple M2 Pro GPU (19-core)',
        'Apple M2 Max GPU (30-core)',
        'Apple M2 Max GPU (38-core)',
        'Apple M3 GPU (8-core)',
        'Apple M3 GPU (10-core)',
        'Apple M3 Pro GPU (14-core)',
        'Apple M3 Pro GPU (18-core)',
        'Apple M3 Max GPU (30-core)',
        'Apple M3 Max GPU (40-core)',
        'Apple M4 GPU',
        'Apple GPU'
      ],
      dedicatedGraphics: [
        'NVIDIA GeForce MX150',
        'NVIDIA GeForce MX250',
        'NVIDIA GeForce GTX 1050',
        'NVIDIA GeForce GTX 1650',
        'NVIDIA GeForce RTX 3050',
        'NVIDIA GeForce RTX 3060',
        'NVIDIA Quadro T500',
        'AMD Radeon Pro',
        'NVIDIA RTX A2000'
      ],
      processors: [
        'Intel Core i3',
        'Intel Core i5',
        'Intel Core i5-H',
        'Intel Core i7',
        'Intel Core i7-H',
        'Intel Core i9',
        'Intel Core i9-H',
        'Intel Pentium',
        'Intel Celeron',
        'Intel Xeon',
        'AMD Ryzen 3',
        'AMD Ryzen 5',
        'AMD Ryzen 5-H',
        'AMD Ryzen 7',
        'AMD Ryzen 7-H',
        'AMD Ryzen 9',
        'AMD Ryzen 9-H',
        'Apple M1',
        'Apple M1 Pro',
        'Apple M1 Max',
        'Apple M2',
        'Apple M2 Pro',
        'Apple M2 Max',
        'Apple M3',
        'Apple M3 Pro',
        'Apple M3 Max',
        'Apple M4',
        'Apple M4 Pro',
        'Apple M4 Max'
      ]
    };

    // Create main Products sheet
    const productsSheet = workbook.addWorksheet('Products', {
      views: [{ state: 'frozen', ySplit: 1 }]
    });

    // Define columns (same as template + Product ID for updates)
    productsSheet.columns = [
      { header: 'Product ID', key: 'productId', width: 38 },
      { header: 'Category', key: 'category', width: 15 },
      { header: 'Model', key: 'model', width: 30 },
      { header: 'Brand', key: 'brand', width: 15 },
      { header: 'Product Type', key: 'productType', width: 12 },
      { header: 'Description', key: 'description', width: 40 },
      { header: 'Selling Price', key: 'sellingPrice', width: 15 },
      { header: 'Original Price', key: 'originalPrice', width: 15 },
      { header: 'Stock Quantity', key: 'stockQty', width: 15 },
      { header: 'In Stock', key: 'inStock', width: 12 },
      { header: 'Is Active', key: 'isActive', width: 12 },
      { header: 'Is Featured', key: 'isFeatured', width: 12 },
      { header: 'Is New Arrival', key: 'isNewArrival', width: 15 },
      { header: 'On Sale', key: 'onSale', width: 12 },
      { header: 'Discount %', key: 'discountPct', width: 12 },
      { header: 'Is Workstation', key: 'isWorkstation', width: 15 },
      { header: 'Is Rugged', key: 'isRugged', width: 12 },
      { header: 'Is Clearance', key: 'isClearance', width: 12 },
      { header: 'Clearance Reason', key: 'clearanceReason', width: 20 },
      { header: 'SEO Only', key: 'seoOnly', width: 12 },
      { header: 'Processor', key: 'processor', width: 20 },
      { header: 'Generation', key: 'generation', width: 12 },
      { header: 'Supported RAM Type', key: 'supportedRamType', width: 18 },
      { header: 'RAM', key: 'ram', width: 15 },
      { header: 'Storage/HDD', key: 'hdd', width: 18 },
      { header: 'Display Size', key: 'displaySize', width: 15 },
      { header: 'Resolution', key: 'resolution', width: 22 },
      { header: 'Resolution Filter', key: 'resolutionFilter', width: 15 },
      { header: 'Integrated Graphics', key: 'integratedGraphics', width: 25 },
      { header: 'Dedicated Graphics', key: 'dedicatedGraphics', width: 25 },
      { header: 'Graphics Memory', key: 'graphicsMemory', width: 15 },
      { header: 'Touch Type', key: 'touchType', width: 18 },
      { header: 'Operating System', key: 'os', width: 20 },
      { header: 'Extra Features', key: 'extraFeatures', width: 30 },
      { header: 'Condition', key: 'condition', width: 15 },
      { header: 'Battery', key: 'battery', width: 18 },
      { header: 'Charger Included', key: 'chargerIncluded', width: 15 },
      { header: 'Warranty', key: 'warranty', width: 12 },
      { header: 'Show Customizer', key: 'showCustomizer', width: 15 },
      { header: 'Show RAM Options', key: 'showRamOptions', width: 15 },
      { header: 'Show SSD Options', key: 'showSsdOptions', width: 15 },
      { header: 'RAM Type', key: 'ramType', width: 12 },
      { header: 'RAM Capacity', key: 'ramCapacity', width: 15 },
      { header: 'RAM Speed', key: 'ramSpeed', width: 12 },
      { header: 'RAM Form Factor', key: 'ramFormFactor', width: 18 },
      { header: 'RAM Condition', key: 'ramCondition', width: 15 },
      { header: 'RAM Warranty', key: 'ramWarranty', width: 12 },
      { header: 'Image URL 1', key: 'image1', width: 35 },
      { header: 'Image URL 2', key: 'image2', width: 35 },
      { header: 'Image URL 3', key: 'image3', width: 35 }
    ];

    // Style header row
    productsSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    productsSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF6DC1C9' }
    };
    productsSheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

    // Add product data
    products.forEach(product => {
      productsSheet.addRow({
        productId: product.id,
        category: product.category_id || '',
        model: product.name || '',
        brand: product.brand || '',
        productType: product.product_type || (product.condition === 'New' ? 'New' : 'Used'),
        description: product.description || '',
        sellingPrice: product.price || 0,
        originalPrice: product.original_price || '',
        stockQty: product.stock_quantity || 0,
        inStock: product.in_stock ? 'TRUE' : 'FALSE',
        isActive: product.is_active ? 'TRUE' : 'FALSE',
        isFeatured: product.is_featured ? 'TRUE' : 'FALSE',
        isNewArrival: product.new_arrival ? 'TRUE' : 'FALSE',
        onSale: product.is_discounted ? 'TRUE' : 'FALSE',
        discountPct: product.discount_percentage || '',
        isWorkstation: product.is_workstation ? 'TRUE' : 'FALSE',
        isRugged: product.is_rugged_tough ? 'TRUE' : 'FALSE',
        isClearance: product.is_clearance ? 'TRUE' : 'FALSE',
        clearanceReason: product.clearance_reason || '',
        seoOnly: product.seo_only ? 'TRUE' : 'FALSE',
        processor: product.processor || '',
        generation: product.generation || '',
        supportedRamType: product.supported_ram_type || '',
        ram: product.ram || '',
        hdd: product.hdd || '',
        displaySize: product.display_size || '',
        resolution: product.resolution || '',
        resolutionFilter: product.resolution_filter || '',
        integratedGraphics: product.integrated_graphics || '',
        dedicatedGraphics: product.discrete_graphics || '',
        graphicsMemory: product.graphics_memory || '',
        touchType: product.touch_type || '',
        os: product.os || product.operating_features || '',
        extraFeatures: product.extra_features || '',
        condition: product.condition || '',
        battery: product.battery || '',
        chargerIncluded: product.charger_included ? 'TRUE' : 'FALSE',
        warranty: product.warranty || '',
        showCustomizer: product.show_laptop_customizer !== false ? 'TRUE' : 'FALSE',
        showRamOptions: product.show_ram_options !== false ? 'TRUE' : 'FALSE',
        showSsdOptions: product.show_ssd_options !== false ? 'TRUE' : 'FALSE',
        ramType: product.ram_type || '',
        ramCapacity: product.ram_capacity || '',
        ramSpeed: product.ram_speed || '',
        ramFormFactor: product.ram_form_factor || '',
        ramCondition: product.ram_condition || '',
        ramWarranty: product.ram_warranty || '',
        image1: Array.isArray(product.images) && product.images[0] ? product.images[0] : (product.featured_image || ''),
        image2: Array.isArray(product.images) && product.images[1] ? product.images[1] : '',
        image3: Array.isArray(product.images) && product.images[2] ? product.images[2] : ''
      });
    });

    // Highlight Product ID column (yellow - don't edit!)
    const dataRows = products.length + 1;
    for (let row = 2; row <= dataRows; row++) {
      productsSheet.getCell(`A${row}`).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFF2CC' }
      };
    }

    // Column mapping for dropdowns (shifted by 1 due to Product ID column, and 1 for Product Type)
    const columnDropdowns = {
      'B': dropdowns.category,           // Category
      'D': dropdowns.brand,              // Brand
      'E': dropdowns.productType,        // Product Type (New/Used)
      'J': dropdowns.booleanOptions,     // In Stock
      'K': dropdowns.booleanOptions,     // Is Active
      'L': dropdowns.booleanOptions,     // Is Featured
      'M': dropdowns.booleanOptions,     // Is New Arrival
      'N': dropdowns.booleanOptions,     // On Sale
      'P': dropdowns.booleanOptions,     // Is Workstation
      'Q': dropdowns.booleanOptions,     // Is Rugged
      'R': dropdowns.booleanOptions,     // Is Clearance
      'T': dropdowns.booleanOptions,     // SEO Only
      'U': dropdowns.processors,         // Processor
      'V': dropdowns.generation,         // Generation
      'W': dropdowns.supportedRamType,   // Supported RAM Type
      'Y': dropdowns.displaySize,        // Display Size
      'AB': dropdowns.integratedGraphics, // Integrated Graphics
      'AC': dropdowns.dedicatedGraphics, // Dedicated Graphics
      'AE': dropdowns.touchType,         // Touch Type
      'AH': dropdowns.condition,         // Condition
      'AJ': dropdowns.booleanOptions,    // Charger Included
      'AK': dropdowns.warranty,          // Warranty
      'AL': dropdowns.booleanOptions,    // Show Customizer
      'AM': dropdowns.booleanOptions,    // Show RAM Options
      'AN': dropdowns.booleanOptions,    // Show SSD Options
      'AO': dropdowns.ramType,           // RAM Type
      'AP': dropdowns.ramCapacity,       // RAM Capacity
      'AQ': dropdowns.ramSpeed,          // RAM Speed
      'AR': dropdowns.ramFormFactor,     // RAM Form Factor
      'AS': dropdowns.condition,         // RAM Condition
      'AT': dropdowns.warranty           // RAM Warranty
    };

    // Apply dropdowns to each column
    for (const [col, options] of Object.entries(columnDropdowns)) {
      for (let row = 2; row <= dataRows; row++) {
        const cell = productsSheet.getCell(`${col}${row}`);
        cell.dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: [`"${options.join(',')}"`],
          showErrorMessage: true,
          errorStyle: 'warning',
          errorTitle: 'Invalid Value',
          error: 'Please select a value from the dropdown list'
        };
      }
    }

    // Generate Excel file buffer
    const buffer = await workbook.xlsx.writeBuffer();

    console.log(`[EXPORT] Export complete. ${products.length} products exported with dropdowns.`);

    // Return Excel file
    return new NextResponse(buffer, {
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
