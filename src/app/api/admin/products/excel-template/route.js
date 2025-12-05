import { NextResponse } from 'next/server';
import ExcelJS from 'exceljs';

// GET - Download Excel template for LAPTOPS ONLY (with dropdowns)
export async function GET() {
  try {
    // Create workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Mohit Computers';
    workbook.created = new Date();

    // Define dropdown options for LAPTOPS (excluding Apple-specific options)
    const dropdowns = {
      brand: ['HP', 'Dell', 'Lenovo', 'Acer', 'ASUS', 'MSI', 'Toshiba', 'Sony', 'Samsung'],
      productType: ['New', 'Used'],
      condition: ['New', 'Excellent', 'Very Good', 'Good', 'Used'],
      touchType: ['Touch', 'Non-touch', 'X360 (Convertible)', 'Touch - Detachable'],
      resolutionFilter: ['HD', 'Full HD', 'QHD', '4K'],
      generation: ['4th Gen', '5th Gen', '6th Gen', '7th Gen', '8th Gen', '9th Gen', '10th Gen', '11th Gen', '12th Gen', '13th Gen'],
      booleanOptions: ['TRUE', 'FALSE'],
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
        'AMD Radeon Vega'
      ],
      dedicatedGraphics: [
        'NVIDIA GeForce MX150',
        'NVIDIA GeForce MX250',
        'NVIDIA GeForce MX350',
        'NVIDIA GeForce MX450',
        'NVIDIA GeForce GTX 1050',
        'NVIDIA GeForce GTX 1650',
        'NVIDIA GeForce RTX 2050',
        'NVIDIA GeForce RTX 3050',
        'NVIDIA GeForce RTX 3060',
        'NVIDIA GeForce RTX 4050',
        'NVIDIA GeForce RTX 4060',
        'NVIDIA Quadro T500',
        'NVIDIA Quadro T1000',
        'NVIDIA Quadro T2000',
        'NVIDIA RTX A1000',
        'NVIDIA RTX A2000',
        'AMD Radeon Pro',
        'AMD Radeon RX'
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
        'AMD Ryzen 9-H'
      ],
      graphicsMemory: ['1GB', '2GB', '3GB', '4GB', '6GB', '8GB', '12GB', '16GB'],
      ram: ['4GB DDR3', '4GB DDR4', '8GB DDR3', '8GB DDR4', '16GB DDR4', '32GB DDR4', '32GB DDR5', '64GB DDR5'],
      storage: ['128GB SSD', '256GB SSD', '512GB SSD', '1TB SSD', '2TB SSD', '500GB HDD', '1TB HDD', '128GB SSD + 500GB HDD', '256GB SSD + 1TB HDD'],
      operatingSystem: ['Windows 10', 'Windows 10 Pro', 'Windows 11', 'Windows 11 Pro', 'Linux', 'DOS', 'Free DOS']
    };

    // Create main Products sheet
    const productsSheet = workbook.addWorksheet('Laptops', {
      views: [{ state: 'frozen', ySplit: 1 }]
    });

    // Define columns - LAPTOP FIELDS ONLY
    productsSheet.columns = [
      { header: 'Model Name*', key: 'model', width: 35 },
      { header: 'Brand*', key: 'brand', width: 12 },
      { header: 'Product Type', key: 'productType', width: 12 },
      { header: 'Processor*', key: 'processor', width: 18 },
      { header: 'Generation*', key: 'generation', width: 12 },
      { header: 'RAM*', key: 'ram', width: 15 },
      { header: 'Storage*', key: 'storage', width: 20 },
      { header: 'Display Size', key: 'displaySize', width: 12 },
      { header: 'Resolution Filter', key: 'resolutionFilter', width: 12 },
      { header: 'Resolution Detail', key: 'resolution', width: 25 },
      { header: 'Integrated Graphics', key: 'integratedGraphics', width: 22 },
      { header: 'Dedicated Graphics', key: 'dedicatedGraphics', width: 22 },
      { header: 'Graphics Memory', key: 'graphicsMemory', width: 15 },
      { header: 'Touch Type', key: 'touchType', width: 18 },
      { header: 'Operating System', key: 'os', width: 18 },
      { header: 'Condition', key: 'condition', width: 12 },
      { header: 'Battery', key: 'battery', width: 18 },
      { header: 'Charger Included', key: 'chargerIncluded', width: 15 },
      { header: 'Extra Features', key: 'extraFeatures', width: 35 },
      { header: 'Selling Price*', key: 'sellingPrice', width: 12 },
      { header: 'Original Price', key: 'originalPrice', width: 12 },
      { header: 'Stock Quantity', key: 'stockQty', width: 12 },
      { header: 'Warranty', key: 'warranty', width: 12 },
      { header: 'Description', key: 'description', width: 40 },
      { header: 'In Stock', key: 'inStock', width: 10 },
      { header: 'Is Active', key: 'isActive', width: 10 },
      { header: 'Is Featured', key: 'isFeatured', width: 10 },
      { header: 'Is New Arrival', key: 'isNewArrival', width: 12 },
      { header: 'Is Workstation', key: 'isWorkstation', width: 12 },
      { header: 'Is Rugged', key: 'isRugged', width: 10 },
      { header: 'On Sale', key: 'onSale', width: 10 },
      { header: 'Discount %', key: 'discountPct', width: 10 },
      { header: 'SEO Only', key: 'seoOnly', width: 10 },
      { header: 'Show Customizer', key: 'showCustomizer', width: 14 },
      { header: 'Show RAM Options', key: 'showRamOptions', width: 14 },
      { header: 'Show SSD Options', key: 'showSsdOptions', width: 14 },
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

    // Add sample data rows
    const sampleData = [
      {
        model: 'HP EliteBook 840 G5',
        brand: 'HP',
        productType: 'Used',
        processor: 'Intel Core i5',
        generation: '8th Gen',
        ram: '8GB DDR4',
        storage: '256GB SSD',
        displaySize: '14 inch',
        resolutionFilter: 'Full HD',
        resolution: 'Full HD IPS (1920x1080)',
        integratedGraphics: 'Intel UHD Graphics 620',
        dedicatedGraphics: '',
        graphicsMemory: '',
        touchType: 'Non-touch',
        os: 'Windows 11 Pro',
        condition: 'Excellent',
        battery: 'Up to 8 hours',
        chargerIncluded: 'TRUE',
        extraFeatures: 'USB 3.0, HDMI, WiFi 6, Bluetooth, Backlit Keyboard',
        sellingPrice: 45000,
        originalPrice: 55000,
        stockQty: 5,
        warranty: '6 months',
        description: 'Premium business ultrabook with excellent build quality',
        inStock: 'TRUE',
        isActive: 'TRUE',
        isFeatured: 'FALSE',
        isNewArrival: 'FALSE',
        isWorkstation: 'FALSE',
        isRugged: 'FALSE',
        onSale: 'FALSE',
        discountPct: '',
        seoOnly: 'FALSE',
        showCustomizer: 'TRUE',
        showRamOptions: 'TRUE',
        showSsdOptions: 'TRUE',
        image1: '',
        image2: '',
        image3: ''
      },
      {
        model: 'Dell Latitude 5520',
        brand: 'Dell',
        productType: 'Used',
        processor: 'Intel Core i7',
        generation: '11th Gen',
        ram: '16GB DDR4',
        storage: '512GB SSD',
        displaySize: '15.6 inch',
        resolutionFilter: 'Full HD',
        resolution: 'Full HD IPS Anti-Glare',
        integratedGraphics: 'Intel Iris Xe Graphics',
        dedicatedGraphics: '',
        graphicsMemory: '',
        touchType: 'Non-touch',
        os: 'Windows 11 Pro',
        condition: 'Very Good',
        battery: 'Up to 10 hours',
        chargerIncluded: 'TRUE',
        extraFeatures: 'Thunderbolt 4, USB-C, HDMI 2.0, WiFi 6, Fingerprint Reader',
        sellingPrice: 65000,
        originalPrice: 80000,
        stockQty: 3,
        warranty: '6 months',
        description: 'Business laptop with 11th Gen processor',
        inStock: 'TRUE',
        isActive: 'TRUE',
        isFeatured: 'TRUE',
        isNewArrival: 'FALSE',
        isWorkstation: 'FALSE',
        isRugged: 'FALSE',
        onSale: 'FALSE',
        discountPct: '',
        seoOnly: 'FALSE',
        showCustomizer: 'TRUE',
        showRamOptions: 'TRUE',
        showSsdOptions: 'TRUE',
        image1: '',
        image2: '',
        image3: ''
      },
      {
        model: 'Lenovo ThinkPad P15 Workstation',
        brand: 'Lenovo',
        productType: 'Used',
        processor: 'Intel Core i7-H',
        generation: '10th Gen',
        ram: '32GB DDR4',
        storage: '1TB SSD',
        displaySize: '15.6 inch',
        resolutionFilter: '4K',
        resolution: '4K UHD IPS (3840x2160)',
        integratedGraphics: 'Intel UHD Graphics 630',
        dedicatedGraphics: 'NVIDIA Quadro T2000',
        graphicsMemory: '4GB',
        touchType: 'Non-touch',
        os: 'Windows 11 Pro',
        condition: 'Excellent',
        battery: 'Up to 6 hours',
        chargerIncluded: 'TRUE',
        extraFeatures: 'Thunderbolt 3, USB 3.1, HDMI, SD Card, Numeric Keypad',
        sellingPrice: 125000,
        originalPrice: 180000,
        stockQty: 2,
        warranty: '1 year',
        description: 'Professional workstation for CAD/3D/Video editing',
        inStock: 'TRUE',
        isActive: 'TRUE',
        isFeatured: 'TRUE',
        isNewArrival: 'FALSE',
        isWorkstation: 'TRUE',
        isRugged: 'FALSE',
        onSale: 'FALSE',
        discountPct: '',
        seoOnly: 'FALSE',
        showCustomizer: 'TRUE',
        showRamOptions: 'TRUE',
        showSsdOptions: 'TRUE',
        image1: '',
        image2: '',
        image3: ''
      }
    ];

    sampleData.forEach(data => {
      productsSheet.addRow(data);
    });

    // Add data validation (dropdowns) for rows 2-200
    const rowStart = 2;
    const rowEnd = 200;

    // Column mapping for dropdowns
    // A=Model, B=Brand, C=ProductType, D=Processor, E=Generation, F=RAM, G=Storage, H=DisplaySize,
    // I=ResFilter, J=ResDetail, K=IntGraphics, L=DedGraphics, M=GraphicsMem, N=TouchType, O=OS,
    // P=Condition, Q=Battery, R=Charger, S=ExtraFeatures, T=SellingPrice, U=OrigPrice, V=StockQty,
    // W=Warranty, X=Desc, Y=InStock, Z=IsActive, AA=IsFeatured, AB=IsNewArrival, AC=IsWorkstation,
    // AD=IsRugged, AE=OnSale, AF=Discount%, AG=SEOOnly, AH=ShowCustomizer, AI=ShowRAM, AJ=ShowSSD
    const columnDropdowns = {
      'B': dropdowns.brand,              // Brand
      'C': dropdowns.productType,        // Product Type
      'D': dropdowns.processors,         // Processor
      'E': dropdowns.generation,         // Generation
      'F': dropdowns.ram,                // RAM
      'G': dropdowns.storage,            // Storage
      'H': dropdowns.displaySize,        // Display Size
      'I': dropdowns.resolutionFilter,   // Resolution Filter
      'K': dropdowns.integratedGraphics, // Integrated Graphics
      'L': dropdowns.dedicatedGraphics,  // Dedicated Graphics
      'M': dropdowns.graphicsMemory,     // Graphics Memory
      'N': dropdowns.touchType,          // Touch Type
      'O': dropdowns.operatingSystem,    // Operating System
      'P': dropdowns.condition,          // Condition
      'R': dropdowns.booleanOptions,     // Charger Included
      'W': dropdowns.warranty,           // Warranty
      'Y': dropdowns.booleanOptions,     // In Stock
      'Z': dropdowns.booleanOptions,     // Is Active
      'AA': dropdowns.booleanOptions,    // Is Featured
      'AB': dropdowns.booleanOptions,    // Is New Arrival
      'AC': dropdowns.booleanOptions,    // Is Workstation
      'AD': dropdowns.booleanOptions,    // Is Rugged
      'AE': dropdowns.booleanOptions,    // On Sale
      'AG': dropdowns.booleanOptions,    // SEO Only
      'AH': dropdowns.booleanOptions,    // Show Customizer
      'AI': dropdowns.booleanOptions,    // Show RAM Options
      'AJ': dropdowns.booleanOptions     // Show SSD Options
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

    // Highlight required columns
    const requiredCols = ['A', 'B', 'D', 'E', 'F', 'G', 'T']; // Model, Brand, Processor, Gen, RAM, Storage, Price
    requiredCols.forEach(col => {
      const cell = productsSheet.getCell(`${col}1`);
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4A9BA0' } // Darker teal for required
      };
    });

    // Create Instructions sheet
    const instructionsSheet = workbook.addWorksheet('Instructions');
    instructionsSheet.columns = [
      { header: 'Field', key: 'field', width: 25 },
      { header: 'Description', key: 'description', width: 70 },
      { header: 'Required', key: 'required', width: 10 }
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
      { field: '📋 LAPTOP TEMPLATE', description: 'This template is for importing LAPTOPS only (excluding Apple products)', required: '' },
      { field: '', description: 'Fields marked with * are required. Dark teal headers = required fields.', required: '' },
      { field: '', description: '', required: '' },
      { field: '🔽 DROPDOWN FIELDS', description: 'Click on cell to see dropdown arrow, then select value', required: '' },
      { field: '', description: '', required: '' },
      { field: 'Model Name*', description: 'Full laptop model name (e.g., HP EliteBook 840 G5)', required: 'YES' },
      { field: 'Brand*', description: 'HP, Dell, Lenovo, Acer, ASUS, MSI, etc.', required: 'YES' },
      { field: 'Product Type', description: 'New or Used', required: 'NO' },
      { field: 'Processor*', description: 'Intel Core i3/i5/i7/i9, AMD Ryzen 3/5/7/9, etc.', required: 'YES' },
      { field: 'Generation*', description: '4th Gen to 13th Gen', required: 'YES' },
      { field: 'RAM*', description: 'e.g., 8GB DDR4, 16GB DDR4', required: 'YES' },
      { field: 'Storage*', description: 'e.g., 256GB SSD, 512GB SSD, 1TB HDD', required: 'YES' },
      { field: 'Display Size', description: '11.6", 12", 13.3", 14", 15.6", 17.3"', required: 'NO' },
      { field: 'Resolution Filter', description: 'HD, Full HD, QHD, 4K (for website filtering)', required: 'NO' },
      { field: 'Resolution Detail', description: 'Full description like "Full HD IPS (1920x1080)"', required: 'NO' },
      { field: 'Integrated Graphics', description: 'Intel HD/UHD/Iris, AMD Radeon Vega', required: 'NO' },
      { field: 'Dedicated Graphics', description: 'NVIDIA GeForce/Quadro, AMD Radeon Pro (if any)', required: 'NO' },
      { field: 'Graphics Memory', description: '1GB, 2GB, 4GB, 6GB, 8GB (for dedicated GPU)', required: 'NO' },
      { field: 'Touch Type', description: 'Touch, Non-touch, X360 (Convertible), Touch - Detachable', required: 'NO' },
      { field: 'Operating System', description: 'Windows 10/11, Windows Pro, Linux, DOS', required: 'NO' },
      { field: 'Condition', description: 'New, Excellent, Very Good, Good, Used', required: 'NO' },
      { field: 'Battery', description: 'Battery life description (e.g., "Up to 8 hours")', required: 'NO' },
      { field: 'Charger Included', description: 'TRUE or FALSE', required: 'NO' },
      { field: 'Extra Features', description: 'Ports, connectivity, special features (comma separated)', required: 'NO' },
      { field: 'Selling Price*', description: 'Current selling price in PKR (numbers only)', required: 'YES' },
      { field: 'Original Price', description: 'Original/MRP price (for showing discount)', required: 'NO' },
      { field: 'Stock Quantity', description: 'Number of units available', required: 'NO' },
      { field: 'Warranty', description: '15 days, 1 month, 3 months, 6 months, 1 year, etc.', required: 'NO' },
      { field: 'Description', description: 'Product description for detail page', required: 'NO' },
      { field: '', description: '', required: '' },
      { field: '⚙️ SETTINGS', description: '', required: '' },
      { field: 'In Stock', description: 'TRUE = Available, FALSE = Out of stock', required: 'NO' },
      { field: 'Is Active', description: 'TRUE = Show on website, FALSE = Hidden', required: 'NO' },
      { field: 'Is Featured', description: 'TRUE = Show in featured section', required: 'NO' },
      { field: 'Is New Arrival', description: 'TRUE = Show in new arrivals', required: 'NO' },
      { field: 'Is Workstation', description: 'TRUE = Mark as workstation/gaming laptop', required: 'NO' },
      { field: 'Is Rugged', description: 'TRUE = Mark as rugged/tough laptop', required: 'NO' },
      { field: 'On Sale', description: 'TRUE = Show sale badge', required: 'NO' },
      { field: 'Discount %', description: 'Discount percentage (10, 15, 20, etc.)', required: 'NO' },
      { field: 'SEO Only', description: 'TRUE = Product hidden from website listings (only visible via direct URL/Google search)', required: 'NO' },
      { field: 'Show Customizer', description: 'TRUE = Show upgrade options on product page', required: 'NO' },
      { field: 'Show RAM Options', description: 'TRUE = Show RAM upgrade options', required: 'NO' },
      { field: 'Show SSD Options', description: 'TRUE = Show SSD upgrade options', required: 'NO' },
      { field: '', description: '', required: '' },
      { field: '🖼️ IMAGES', description: '', required: '' },
      { field: 'Image URL 1/2/3', description: 'Full URL to product images (optional)', required: 'NO' },
      { field: '', description: '', required: '' },
      { field: '⚠️ NOTES', description: '', required: '' },
      { field: '', description: '• Apple products should be added from Admin Panel directly', required: '' },
      { field: '', description: '• RAM/SSD/Chromebook products have separate import process', required: '' },
      { field: '', description: '• Sample data is provided - delete or modify as needed', required: '' },
      { field: '', description: '• All prices should be in PKR without commas', required: '' }
    ];

    instructions.forEach(inst => {
      const row = instructionsSheet.addRow(inst);
      if (inst.required === 'YES') {
        row.getCell(3).font = { bold: true, color: { argb: 'FFFF0000' } };
      }
    });

    // Generate Excel file buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Create response
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="laptop_import_template.xlsx"'
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
