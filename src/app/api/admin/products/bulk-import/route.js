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

    // Convert to our database format - supporting exact field names
    const model = product.Model || product.model || '';
    const processor = product.Processor || product.processor || '';
    const brand = model.split(' ')[0] || processor.split(' ')[0] || 'Unknown';

    const dbProduct = {
      // Basic fields (mapped from CSV)
      name: model, // From "Model" column
      category_id: product.Category || 'laptop',
      brand: brand, // Auto-extracted from Model
      price: parseFloat(product['Selling Price'] || 0),
      is_featured: false,
      is_active: true,

      // Image fields (from CSV import)
      images: [
        product['Image URL 1'],
        product['Image URL 2'],
        product['Image URL 3'],
        product['Image URL 4'],
        product['Image URL 5']
      ].filter(url => url && url.trim() !== ''),
      featured_image: product['Image URL 1'] || null,

      // CSV Import Fields (Exact Match)
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

      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

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

  return jsonData.map(row => {
    const model = row.Model || row.model || '';
    const processor = row.Processor || row.processor || '';
    const brand = model.split(' ')[0] || processor.split(' ')[0] || 'Unknown';

    const dbProduct = {
      // Basic fields (mapped from Excel)
      name: model, // From "Model" column
      category_id: row.Category || 'laptop',
      brand: brand, // Auto-extracted from Model
      price: parseFloat(row['Selling Price'] || 0),
      is_featured: false,
      is_active: true,

      // Image fields (from Excel import)
      images: [
        row['Image URL 1'],
        row['Image URL 2'],
        row['Image URL 3'],
        row['Image URL 4'],
        row['Image URL 5']
      ].filter(url => url && url.trim() !== ''),
      featured_image: row['Image URL 1'] || null,

      // Excel Import Fields (Exact Match)
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

      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

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

    for (let i = 0; i < validProducts.length; i += batchSize) {
      const batch = validProducts.slice(i, i + batchSize);
      
      for (const product of batch) {
        try {
          const { data, error } = await productsAPI.create(product);
          if (error) {
            errors.push({ product: product.name, error: error.message });
          } else {
            results.push(data);
          }
        } catch (error) {
          errors.push({ product: product.name, error: error.message });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${results.length} products`,
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

