import { NextResponse } from 'next/server';
import { productsAPI } from '@/lib/supabase-db';
import * as XLSX from 'xlsx';

// Function to parse CSV line properly handling quoted fields
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      // Handle escaped quotes ("")
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  // Add last field
  result.push(current.trim());
  return result;
}

// Function to parse CSV content
function parseCSV(csvContent) {
  const lines = csvContent.split(/\r?\n/).filter(line => line.trim());
  if (lines.length === 0) return [];

  const headers = parseCSVLine(lines[0]);
  const products = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);

    // Skip lines that don't have enough values
    if (values.length < 2 || !values[0]) continue;

    const product = {};
    headers.forEach((header, index) => {
      product[header] = values[index] || '';
    });

    // Convert to our database format - supporting all fields
    const model = product.Model || product.model || '';
    const processor = product.Processor || product.processor || '';
    const brandFromCSV = product.Brand || product.brand || '';
    const brand = brandFromCSV || model.split(' ')[0] || processor.split(' ')[0] || 'Unknown';

    // Helper function to parse boolean values
    const parseBool = (value) => {
      if (typeof value === 'boolean') return value;
      if (typeof value === 'string') {
        const lower = value.toLowerCase().trim();
        return lower === 'true' || lower === '1' || lower === 'yes';
      }
      return false;
    };

    // Build product object with only essential fields first
    const dbProduct = {
      // Core required fields (these definitely exist in database)
      name: model,
      category_id: product.Category || 'laptop',
      brand: brand,
      price: parseFloat(product['Selling Price'] || 0),
      is_featured: parseBool(product['Is Featured'] || false),
      is_active: parseBool(product['Is Active'] !== undefined ? product['Is Active'] : true),

      // Image fields
      images: [
        product['Image URL 1'],
        product['Image URL 2'],
        product['Image URL 3'],
        product['Image URL 4'],
        product['Image URL 5']
      ].filter(url => url && url.trim() !== ''),
      featured_image: product['Image URL 1'] || null,

      // Laptop-specific Fields (core fields that exist)
      processor: product.Processor || null,
      generation: product.Generation || null,
      ram: product.Ram || null,
      hdd: product.HDD || null,
      display_size: product['Display Size'] || null,
      resolution: product['Resolution (Options)'] || null,
      integrated_graphics: product['Integrated Graphics'] || null,
      discrete_graphics: product['Discrete/Dedicated Graphics'] || null,
      touch_type: product['Touch / Non touch / X360'] || null,
      operating_features: product['Operating Features'] || null,
      extra_features: product['Extra Features (Connectivity/Ports/Other)'] || null,
      condition: product.Condition || 'Good',
      battery: product.Battery || null,
      charger_included: parseBool(product['Charger Included'] || false),
      warranty: product.Warranty || null,

      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Add optional fields only if they have values (safer for backward compatibility)
    if (product.Description) dbProduct.description = product.Description;
    if (product['Original Price']) dbProduct.original_price = parseFloat(product['Original Price']);
    if (product['Stock Quantity']) dbProduct.stock_quantity = parseInt(product['Stock Quantity']);
    // Temporarily skip SKU to avoid schema cache issues
    // if (product.SKU) dbProduct.sku = product.SKU;
    if (product['In Stock'] !== undefined) dbProduct.in_stock = parseBool(product['In Stock']);

    // New fields (add only if provided)
    if (product['Is Workstation']) dbProduct.is_workstation = parseBool(product['Is Workstation']);
    if (product['Is Rugged Tough']) dbProduct.is_rugged_tough = parseBool(product['Is Rugged Tough']);
    if (product['Is Clearance']) dbProduct.is_clearance = parseBool(product['Is Clearance']);
    if (product['Clearance Reason']) dbProduct.clearance_reason = product['Clearance Reason'];
    if (product['Is Discounted']) dbProduct.is_discounted = parseBool(product['Is Discounted']);
    if (product['Discount Percentage']) dbProduct.discount_percentage = parseFloat(product['Discount Percentage']);

    // Customization control fields
    if (product['Show Laptop Customizer'] !== undefined) dbProduct.show_laptop_customizer = parseBool(product['Show Laptop Customizer']);
    if (product['Show RAM Options'] !== undefined) dbProduct.show_ram_options = parseBool(product['Show RAM Options']);
    if (product['Show SSD Options'] !== undefined) dbProduct.show_ssd_options = parseBool(product['Show SSD Options']);

    // RAM-specific fields
    if (product['RAM Type']) dbProduct.ram_type = product['RAM Type'];
    if (product['RAM Capacity']) dbProduct.ram_capacity = product['RAM Capacity'];
    if (product['RAM Speed']) dbProduct.ram_speed = product['RAM Speed'];
    if (product['RAM Form Factor']) dbProduct.ram_form_factor = product['RAM Form Factor'];
    if (product['RAM Condition']) dbProduct.ram_condition = product['RAM Condition'];
    if (product['RAM Warranty']) dbProduct.ram_warranty = product['RAM Warranty'];
    if (product['Show RAM Customizer'] !== undefined) dbProduct.show_ram_customizer = parseBool(product['Show RAM Customizer']);

    // Generate slug from name
    if (dbProduct.name) {
      dbProduct.slug = dbProduct.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    products.push(dbProduct);
  }

  return products;
}

// Function to parse Excel file
async function parseExcel(file) {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });

  // Get first sheet
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // Convert to JSON with headers
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

  // Helper function to parse boolean values
  const parseBool = (value) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      const lower = value.toLowerCase().trim();
      return lower === 'true' || lower === '1' || lower === 'yes';
    }
    return false;
  };

  return jsonData.map(row => {
    const model = row.Model || row.model || '';
    const processor = row.Processor || row.processor || '';
    const brandFromExcel = row.Brand || row.brand || '';
    const brand = brandFromExcel || model.split(' ')[0] || processor.split(' ')[0] || 'Unknown';

    // Build product object with only essential fields first
    const dbProduct = {
      // Core required fields (these definitely exist in database)
      name: model,
      category_id: row.Category || 'laptop',
      brand: brand,
      price: parseFloat(row['Selling Price'] || 0),
      is_featured: parseBool(row['Is Featured'] || false),
      is_active: parseBool(row['Is Active'] !== undefined ? row['Is Active'] : true),

      // Image fields
      images: [
        row['Image URL 1'],
        row['Image URL 2'],
        row['Image URL 3'],
        row['Image URL 4'],
        row['Image URL 5']
      ].filter(url => url && url.trim() !== ''),
      featured_image: row['Image URL 1'] || null,

      // Laptop-specific Fields (core fields that exist)
      processor: row.Processor || null,
      generation: row.Generation || null,
      ram: row.Ram || null,
      hdd: row.HDD || null,
      display_size: row['Display Size'] || null,
      resolution: row['Resolution (Options)'] || null,
      integrated_graphics: row['Integrated Graphics'] || null,
      discrete_graphics: row['Discrete/Dedicated Graphics'] || null,
      touch_type: row['Touch / Non touch / X360'] || null,
      operating_features: row['Operating Features'] || null,
      extra_features: row['Extra Features (Connectivity/Ports/Other)'] || null,
      condition: row.Condition || 'Good',
      battery: row.Battery || null,
      charger_included: parseBool(row['Charger Included'] || false),
      warranty: row.Warranty || null,

      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Add optional fields only if they have values (safer for backward compatibility)
    if (row.Description) dbProduct.description = row.Description;
    if (row['Original Price']) dbProduct.original_price = parseFloat(row['Original Price']);
    if (row['Stock Quantity']) dbProduct.stock_quantity = parseInt(row['Stock Quantity']);
    // Temporarily skip SKU to avoid schema cache issues
    // if (row.SKU) dbProduct.sku = row.SKU;
    if (row['In Stock'] !== undefined) dbProduct.in_stock = parseBool(row['In Stock']);

    // New fields (add only if provided)
    if (row['Is Workstation']) dbProduct.is_workstation = parseBool(row['Is Workstation']);
    if (row['Is Rugged Tough']) dbProduct.is_rugged_tough = parseBool(row['Is Rugged Tough']);
    if (row['Is Clearance']) dbProduct.is_clearance = parseBool(row['Is Clearance']);
    if (row['Clearance Reason']) dbProduct.clearance_reason = row['Clearance Reason'];
    if (row['Is Discounted']) dbProduct.is_discounted = parseBool(row['Is Discounted']);
    if (row['Discount Percentage']) dbProduct.discount_percentage = parseFloat(row['Discount Percentage']);

    // Customization control fields
    if (row['Show Laptop Customizer'] !== undefined) dbProduct.show_laptop_customizer = parseBool(row['Show Laptop Customizer']);
    if (row['Show RAM Options'] !== undefined) dbProduct.show_ram_options = parseBool(row['Show RAM Options']);
    if (row['Show SSD Options'] !== undefined) dbProduct.show_ssd_options = parseBool(row['Show SSD Options']);

    // RAM-specific fields
    if (row['RAM Type']) dbProduct.ram_type = row['RAM Type'];
    if (row['RAM Capacity']) dbProduct.ram_capacity = row['RAM Capacity'];
    if (row['RAM Speed']) dbProduct.ram_speed = row['RAM Speed'];
    if (row['RAM Form Factor']) dbProduct.ram_form_factor = row['RAM Form Factor'];
    if (row['RAM Condition']) dbProduct.ram_condition = row['RAM Condition'];
    if (row['RAM Warranty']) dbProduct.ram_warranty = row['RAM Warranty'];
    if (row['Show RAM Customizer'] !== undefined) dbProduct.show_ram_customizer = parseBool(row['Show RAM Customizer']);

    // Generate slug from name
    if (dbProduct.name) {
      dbProduct.slug = dbProduct.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    return dbProduct;
  });
}

// POST - Bulk import products from CSV/Excel
export async function POST(request) {
  try {
    console.log('[BULK IMPORT] API called - Starting bulk import...');

    const formData = await request.formData();
    const file = formData.get('file');

    console.log('[BULK IMPORT] File received:', file?.name, file?.type, file?.size);

    if (!file) {
      console.error('[BULK IMPORT] No file provided');
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Check file type
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(csv|xlsx|xls)$/i)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Please upload CSV or Excel file.' },
        { status: 400 }
      );
    }

    let products = [];

    // Parse based on file type
    if (file.name.match(/\.(xlsx|xls)$/i)) {
      // Excel file
      products = await parseExcel(file);
    } else {
      // CSV file
      const fileContent = await file.text();
      products = parseCSV(fileContent);
    }

    if (products.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid products found in file' },
        { status: 400 }
      );
    }

    // Filter out completely empty products (no validation required)
    const validProducts = products.filter(product =>
      product.name || product.model || product.processor
    );

    if (validProducts.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid products found in the file' },
        { status: 400 }
      );
    }

    // Insert products in batches
    const batchSize = 10;
    const results = [];
    const errors = [];

    console.log(`[BULK IMPORT] Starting to import ${validProducts.length} products...`);

    for (let i = 0; i < validProducts.length; i += batchSize) {
      const batch = validProducts.slice(i, i + batchSize);

      for (const product of batch) {
        try {
          console.log(`[BULK IMPORT] Attempting to insert product: ${product.name}`);
          console.log(`[BULK IMPORT] Product data:`, JSON.stringify(product, null, 2));

          const { data, error } = await productsAPI.create(product);

          if (error) {
            console.error(`[BULK IMPORT] Database error for ${product.name}:`, error);
            errors.push({
              product: product.name,
              error: error.message || JSON.stringify(error),
              code: error.code,
              details: error.details
            });
          } else {
            console.log(`[BULK IMPORT] Successfully inserted: ${product.name} with ID: ${data.id}`);
            results.push(data);
          }
        } catch (error) {
          console.error(`[BULK IMPORT] Exception for ${product.name}:`, error);
          errors.push({
            product: product.name,
            error: error.message,
            stack: error.stack?.substring(0, 200)
          });
        }
      }
    }

    console.log(`[BULK IMPORT] Import complete. Success: ${results.length}, Errors: ${errors.length}`);
    if (errors.length > 0) {
      console.error(`[BULK IMPORT] Error details:`, errors);
    }

    return NextResponse.json({
      success: results.length > 0,
      message: results.length > 0
        ? `Successfully imported ${results.length} products`
        : 'No products were imported',
      imported: results.length,
      total: validProducts.length,
      errors: errors.length > 0 ? errors : null
    });

  } catch (error) {
    console.error('Error importing products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to import products: ' + error.message },
      { status: 500 }
    );
  }
}

