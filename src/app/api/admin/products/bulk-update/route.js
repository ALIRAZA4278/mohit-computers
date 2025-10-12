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

// Function to parse CSV content for updates
function parseCSVForUpdate(csvContent) {
  const lines = csvContent.split(/\r?\n/).filter(line => line.trim());
  if (lines.length === 0) return [];

  const headers = parseCSVLine(lines[0]);
  const products = [];

  // Check if ID column exists
  const idIndex = headers.findIndex(h => h.toLowerCase() === 'id');
  if (idIndex === -1) {
    throw new Error('ID column is required for product updates. Please use the export feature to get the correct format.');
  }

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);

    // Skip lines that don't have enough values or no ID
    if (values.length < 2 || !values[idIndex]) continue;

    const product = {};
    headers.forEach((header, index) => {
      product[header] = values[index] || '';
    });

    // Get the ID for updating
    const productId = product.ID || product.id;
    if (!productId) continue;

    // Convert to our database format
    const model = product.Model || product.model || '';
    const processor = product.Processor || product.processor || '';
    const brand = model.split(' ')[0] || processor.split(' ')[0] || 'Unknown';

    const dbProduct = {
      id: productId, // Important: Keep the ID for updates
      
      // Basic fields (mapped from CSV)
      name: model,
      category_id: product.Category || 'laptop',
      brand: brand,
      price: parseFloat(product['Selling Price'] || 0),
      original_price: parseFloat(product['Original Price'] || 0) || null,
      
      // Stock fields
      stock_quantity: parseInt(product['Stock Quantity'] || 0),
      in_stock: String(product['In Stock'] || 'true').toLowerCase() === 'true',
      is_active: String(product['Is Active'] || 'true').toLowerCase() === 'true',
      is_featured: String(product['Is Featured'] || 'false').toLowerCase() === 'true',

      // Image fields (from CSV import)
      images: [
        product['Image URL 1'],
        product['Image URL 2'],
        product['Image URL 3'],
        product['Image URL 4'],
        product['Image URL 5']
      ].filter(url => url && url.trim() !== ''),
      featured_image: product['Image URL 1'] || null,

      // Specification fields
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
      charger_included: String(product['Charger Included'] || 'false').toLowerCase() === 'true',
      warranty: product.Warranty || null,

      updated_at: new Date().toISOString()
    };

    // Generate slug from name if name exists
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

// Function to parse Excel file for updates
async function parseExcelForUpdate(file) {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });

  // Get first sheet
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // Convert to JSON with headers
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

  // Check if ID column exists
  const hasId = jsonData.length > 0 && (jsonData[0].ID || jsonData[0].id);
  if (!hasId) {
    throw new Error('ID column is required for product updates. Please use the export feature to get the correct format.');
  }

  return jsonData.map(row => {
    const productId = row.ID || row.id;
    if (!productId) return null;

    const model = row.Model || row.model || '';
    const processor = row.Processor || row.processor || '';
    const brand = model.split(' ')[0] || processor.split(' ')[0] || 'Unknown';

    const dbProduct = {
      id: productId, // Important: Keep the ID for updates
      
      // Basic fields (mapped from Excel)
      name: model,
      category_id: row.Category || 'laptop',
      brand: brand,
      price: parseFloat(row['Selling Price'] || 0),
      original_price: parseFloat(row['Original Price'] || 0) || null,
      
      // Stock fields
      stock_quantity: parseInt(row['Stock Quantity'] || 0),
      in_stock: String(row['In Stock'] || 'true').toLowerCase() === 'true',
      is_active: String(row['Is Active'] || 'true').toLowerCase() === 'true',
      is_featured: String(row['Is Featured'] || 'false').toLowerCase() === 'true',

      // Image fields (from Excel import)
      images: [
        row['Image URL 1'],
        row['Image URL 2'],
        row['Image URL 3'],
        row['Image URL 4'],
        row['Image URL 5']
      ].filter(url => url && url.trim() !== ''),
      featured_image: row['Image URL 1'] || null,

      // Specification fields
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
      charger_included: String(row['Charger Included'] || 'false').toLowerCase() === 'true',
      warranty: row.Warranty || null,

      updated_at: new Date().toISOString()
    };

    // Generate slug from name if name exists
    if (dbProduct.name) {
      dbProduct.slug = dbProduct.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    return dbProduct;
  }).filter(product => product !== null);
}

// POST - Bulk update products from CSV/Excel
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
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
    try {
      if (file.name.match(/\.(xlsx|xls)$/i)) {
        // Excel file
        products = await parseExcelForUpdate(file);
      } else {
        // CSV file
        const fileContent = await file.text();
        products = parseCSVForUpdate(fileContent);
      }
    } catch (parseError) {
      return NextResponse.json(
        { success: false, error: parseError.message },
        { status: 400 }
      );
    }

    if (products.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid products found in file for updating' },
        { status: 400 }
      );
    }

    // Update products in batches
    const batchSize = 10;
    const results = [];
    const errors = [];

    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      
      for (const product of batch) {
        try {
          // Check if product exists
          const { data: existingProduct, error: fetchError } = await productsAPI.getById(product.id);
          
          if (fetchError || !existingProduct) {
            errors.push({
              product: product.name || product.id,
              error: `Product with ID ${product.id} not found`
            });
            continue;
          }

          // Update the product
          const { data, error } = await productsAPI.update(product.id, product);
          
          if (error) {
            errors.push({
              product: product.name || product.id,
              error: error.message
            });
          } else {
            results.push(data);
          }
        } catch (error) {
          console.error('Error updating product:', error);
          errors.push({
            product: product.name || product.id,
            error: error.message
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${results.length} products`,
      updated: results.length,
      total: products.length,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('Error in bulk update:', error);
    return NextResponse.json(
      { success: false, error: 'Bulk update failed: ' + error.message },
      { status: 500 }
    );
  }
}
