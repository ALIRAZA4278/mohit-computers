import { NextResponse } from 'next/server';
import ExcelJS from 'exceljs';

// GET - Download Excel template with ACTUAL dropdowns
export async function GET() {
  try {
    // Create workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Mohit Computers';
    workbook.created = new Date();

    // Define dropdown options (same as admin panel)
    const dropdowns = {
      category: ['laptop', 'chromebook', 'workstation', 'ram', 'ssd', 'accessories'],
      brand: ['HP', 'Dell', 'Lenovo', 'Acer', 'ASUS', 'Apple', 'MSI', 'Toshiba', 'Sony', 'Samsung', 'Kingston', 'Corsair', 'Crucial', 'G.Skill', 'Transcend', 'WD', 'SanDisk', 'Intel', 'Logitech', 'Microsoft', 'Razer', 'Generic'],
      productType: ['New', 'Used'],
      condition: ['New', 'Excellent', 'Very Good', 'Good', 'Used'],
      touchType: ['Touch', 'Non-touch', 'X360 (Convertible)', 'Touch - Detachable'],
      resolution: ['HD (1366x768)', 'Full HD (1920x1080)', 'QHD (2560x1440)', '4K UHD (3840x2160)', 'Retina Display', 'Liquid Retina', 'Liquid Retina XDR', 'XDR Display'],
      resolutionFilter: ['HD', 'Full HD', 'QHD', '4K', 'Retina'],
      generation: ['4th Gen', '5th Gen', '6th Gen', '7th Gen', '8th Gen', '9th Gen', '10th Gen', '11th Gen', '12th Gen', '13th Gen'],
      booleanOptions: ['TRUE', 'FALSE'],
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
      ],
      graphicsMemory: ['1GB', '2GB', '3GB', '4GB', '6GB', '8GB', '12GB', '16GB']
    };

    // Create main Products sheet
    const productsSheet = workbook.addWorksheet('Products', {
      views: [{ state: 'frozen', ySplit: 1 }]
    });

    // Define columns with headers
    productsSheet.columns = [
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

    // Add sample data row
    productsSheet.addRow({
      category: 'laptop',
      model: 'HP EliteBook 840 G5',
      brand: 'HP',
      productType: 'Used',
      description: 'Premium business ultrabook with excellent build quality',
      sellingPrice: 35000,
      originalPrice: 40000,
      stockQty: 5,
      inStock: 'TRUE',
      isActive: 'TRUE',
      isFeatured: 'FALSE',
      isNewArrival: 'FALSE',
      onSale: 'FALSE',
      discountPct: '',
      isWorkstation: 'FALSE',
      isRugged: 'FALSE',
      isClearance: 'FALSE',
      clearanceReason: '',
      seoOnly: 'FALSE',
      processor: 'Intel Core i5',
      generation: '8th Gen',
      ram: '8GB DDR4',
      hdd: '256GB SSD',
      displaySize: '14 inch',
      resolution: 'Full HD (1920x1080)',
      resolutionFilter: 'Full HD',
      integratedGraphics: 'Intel UHD Graphics 620',
      dedicatedGraphics: '',
      graphicsMemory: '',
      touchType: 'Non-touch',
      os: 'Windows 11 Pro',
      extraFeatures: 'USB 3.0, HDMI, WiFi 6, Bluetooth',
      condition: 'Excellent',
      battery: 'Up to 8 hours',
      chargerIncluded: 'TRUE',
      warranty: '6 months',
      showCustomizer: 'TRUE',
      showRamOptions: 'TRUE',
      showSsdOptions: 'TRUE',
      ramType: '',
      ramCapacity: '',
      ramSpeed: '',
      ramFormFactor: '',
      ramCondition: '',
      ramWarranty: '',
      image1: 'https://example.com/image1.jpg',
      image2: '',
      image3: ''
    });

    // Add data validation (dropdowns) for rows 2-100
    const rowStart = 2;
    const rowEnd = 100;

    // Column mapping for dropdowns (shifted by 1 due to Product Type column)
    const columnDropdowns = {
      'A': dropdowns.category,           // Category
      'C': dropdowns.brand,              // Brand
      'D': dropdowns.productType,        // Product Type (New/Used)
      'I': dropdowns.booleanOptions,     // In Stock
      'J': dropdowns.booleanOptions,     // Is Active
      'K': dropdowns.booleanOptions,     // Is Featured
      'L': dropdowns.booleanOptions,     // Is New Arrival
      'M': dropdowns.booleanOptions,     // On Sale
      'O': dropdowns.booleanOptions,     // Is Workstation
      'P': dropdowns.booleanOptions,     // Is Rugged
      'Q': dropdowns.booleanOptions,     // Is Clearance
      'S': dropdowns.booleanOptions,     // SEO Only
      'T': dropdowns.processors,         // Processor
      'U': dropdowns.generation,         // Generation
      'X': dropdowns.displaySize,        // Display Size
      // Resolution - manual text input
      // Resolution Filter - manual text input
      'AA': dropdowns.integratedGraphics, // Integrated Graphics
      'AB': dropdowns.dedicatedGraphics, // Dedicated Graphics
      // Graphics Memory - manual text input
      'AD': dropdowns.touchType,         // Touch Type
      'AG': dropdowns.condition,         // Condition
      'AI': dropdowns.booleanOptions,    // Charger Included
      'AJ': dropdowns.warranty,          // Warranty
      'AK': dropdowns.booleanOptions,    // Show Customizer
      'AL': dropdowns.booleanOptions,    // Show RAM Options
      'AM': dropdowns.booleanOptions,    // Show SSD Options
      'AN': dropdowns.ramType,           // RAM Type
      'AO': dropdowns.ramCapacity,       // RAM Capacity
      'AP': dropdowns.ramSpeed,          // RAM Speed
      'AQ': dropdowns.ramFormFactor,     // RAM Form Factor
      'AR': dropdowns.condition,         // RAM Condition
      'AS': dropdowns.warranty           // RAM Warranty
    };

    // Apply dropdowns to each column
    for (const [col, options] of Object.entries(columnDropdowns)) {
      for (let row = rowStart; row <= rowEnd; row++) {
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

    // Create Instructions sheet
    const instructionsSheet = workbook.addWorksheet('Instructions');
    instructionsSheet.columns = [
      { header: 'Field', key: 'field', width: 25 },
      { header: 'Description', key: 'description', width: 70 }
    ];

    // Style instructions header
    instructionsSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    instructionsSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF6DC1C9' }
    };

    // Add instructions
    const instructions = [
      { field: 'HOW TO USE', description: 'Fields with dropdown arrows have predefined options. Click cell to see dropdown.' },
      { field: '', description: '' },
      { field: 'Category*', description: 'Product type: laptop, chromebook, workstation, ram, ssd, accessories' },
      { field: 'Model*', description: 'Product model name (e.g., HP EliteBook 840 G5)' },
      { field: 'Brand', description: 'Product manufacturer (dropdown)' },
      { field: 'Product Type', description: 'New or Used (dropdown)' },
      { field: 'Description', description: 'Product description' },
      { field: 'Selling Price*', description: 'Current price (number only, no currency)' },
      { field: 'Original Price', description: 'Original price before discount' },
      { field: 'Stock Quantity', description: 'Number of items in stock' },
      { field: 'In Stock', description: 'TRUE/FALSE - Is product available?' },
      { field: 'Is Active', description: 'TRUE/FALSE - Show product on website?' },
      { field: 'Is Featured', description: 'TRUE/FALSE - Show in featured section?' },
      { field: 'Is New Arrival', description: 'TRUE/FALSE - Show in new arrivals?' },
      { field: 'On Sale', description: 'TRUE/FALSE - Is product on sale?' },
      { field: 'Discount %', description: 'Discount percentage (e.g., 10, 20, 30)' },
      { field: 'Is Workstation', description: 'TRUE/FALSE - Is this a workstation/gaming laptop?' },
      { field: 'Is Rugged', description: 'TRUE/FALSE - Is this a rugged laptop?' },
      { field: 'Is Clearance', description: 'TRUE/FALSE - Is this a clearance item?' },
      { field: 'SEO Only', description: 'TRUE/FALSE - Hide from catalog but keep for SEO?' },
      { field: 'Processor', description: 'CPU type (dropdown)' },
      { field: 'Generation', description: 'Processor generation (dropdown)' },
      { field: 'RAM', description: 'RAM specification (e.g., 8GB DDR4)' },
      { field: 'Storage/HDD', description: 'Storage (e.g., 256GB SSD, 1TB HDD)' },
      { field: 'Display Size', description: 'Screen size (dropdown)' },
      { field: 'Resolution', description: 'Full resolution text for product detail page (e.g., Full HD IPS)' },
      { field: 'Resolution Filter', description: 'For filtering: HD, Full HD, QHD, 4K, Retina (dropdown)' },
      { field: 'Integrated Graphics', description: 'Built-in GPU (dropdown)' },
      { field: 'Dedicated Graphics', description: 'Discrete GPU if any (dropdown)' },
      { field: 'Graphics Memory', description: 'GPU VRAM: 1GB, 2GB, 4GB, 6GB, 8GB, etc. (dropdown)' },
      { field: 'Touch Type', description: 'Touch, Non-touch, or X360 (dropdown)' },
      { field: 'Condition', description: 'Product condition (dropdown)' },
      { field: 'Warranty', description: 'Warranty period (dropdown)' },
      { field: '', description: '' },
      { field: 'RAM PRODUCTS ONLY', description: 'Use these fields for RAM category products' },
      { field: 'RAM Type', description: 'DDR3, DDR4, DDR5 (dropdown)' },
      { field: 'RAM Capacity', description: '4GB, 8GB, 16GB, etc. (dropdown)' },
      { field: 'RAM Speed', description: '2400 MHz, 3200 MHz, etc. (dropdown)' },
      { field: '', description: '' },
      { field: '* Required Fields', description: 'Category, Model, and Selling Price are required' },
      { field: '', description: '' },
      { field: 'TIP', description: 'Click on any cell with dropdown to see available options!' }
    ];

    instructions.forEach(inst => {
      instructionsSheet.addRow(inst);
    });

    // Generate Excel file buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Create response
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="mohit_computers_template.xlsx"'
      }
    });
  } catch (error) {
    console.error('Error generating Excel template:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate Excel template: ' + error.message },
      { status: 500 }
    );
  }
}
