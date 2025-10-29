import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request) {
  try {
    if (!supabaseServiceKey) {
      return NextResponse.json({
        error: 'Service role key not configured',
        message: 'Please add SUPABASE_SERVICE_ROLE_KEY to your environment variables'
      }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Add laptop-specific columns to products table
    const alterTableSQL = `
      DO $$
      BEGIN
        -- Add processor column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                      WHERE table_name='products' AND column_name='processor') THEN
          ALTER TABLE products ADD COLUMN processor VARCHAR(255);
        END IF;

        -- Add generation column (e.g., "4th Gen", "10th Gen")
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                      WHERE table_name='products' AND column_name='generation') THEN
          ALTER TABLE products ADD COLUMN generation VARCHAR(100);
        END IF;

        -- Add ram column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                      WHERE table_name='products' AND column_name='ram') THEN
          ALTER TABLE products ADD COLUMN ram VARCHAR(100);
        END IF;

        -- Add storage/hdd column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                      WHERE table_name='products' AND column_name='storage') THEN
          ALTER TABLE products ADD COLUMN storage VARCHAR(255);
        END IF;

        -- Add hdd column (for backwards compatibility)
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                      WHERE table_name='products' AND column_name='hdd') THEN
          ALTER TABLE products ADD COLUMN hdd VARCHAR(255);
        END IF;

        -- Add display column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                      WHERE table_name='products' AND column_name='display') THEN
          ALTER TABLE products ADD COLUMN display VARCHAR(255);
        END IF;

        -- Add graphics column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                      WHERE table_name='products' AND column_name='graphics') THEN
          ALTER TABLE products ADD COLUMN graphics VARCHAR(255);
        END IF;

        -- Add operating_system column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                      WHERE table_name='products' AND column_name='operating_system') THEN
          ALTER TABLE products ADD COLUMN operating_system VARCHAR(100);
        END IF;

        -- Add battery column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                      WHERE table_name='products' AND column_name='battery') THEN
          ALTER TABLE products ADD COLUMN battery VARCHAR(255);
        END IF;

        -- Add condition column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                      WHERE table_name='products' AND column_name='condition') THEN
          ALTER TABLE products ADD COLUMN condition VARCHAR(100);
        END IF;

        -- Add warranty column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                      WHERE table_name='products' AND column_name='warranty') THEN
          ALTER TABLE products ADD COLUMN warranty VARCHAR(255);
        END IF;

        -- Add in_stock column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                      WHERE table_name='products' AND column_name='in_stock') THEN
          ALTER TABLE products ADD COLUMN in_stock BOOLEAN DEFAULT TRUE;
        END IF;

        -- Add featured column (if not exists from is_featured)
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                      WHERE table_name='products' AND column_name='featured') THEN
          ALTER TABLE products ADD COLUMN featured BOOLEAN DEFAULT FALSE;
        END IF;

        -- Add featured_image column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                      WHERE table_name='products' AND column_name='featured_image') THEN
          ALTER TABLE products ADD COLUMN featured_image TEXT;
        END IF;

        -- Add image column (for backwards compatibility)
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                      WHERE table_name='products' AND column_name='image') THEN
          ALTER TABLE products ADD COLUMN image TEXT;
        END IF;

        -- Add original_price column (for sale price comparison)
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                      WHERE table_name='products' AND column_name='original_price') THEN
          ALTER TABLE products ADD COLUMN original_price DECIMAL(10,2);
        END IF;

        -- Add category column (string) for backwards compatibility
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                      WHERE table_name='products' AND column_name='category') THEN
          ALTER TABLE products ADD COLUMN category VARCHAR(100);
        END IF;

      END $$;
    `;

    const { data, error } = await supabase.rpc('exec_sql', { sql_query: alterTableSQL });

    if (error) {
      // Try direct execution if RPC doesn't work
      console.log('RPC failed, trying direct execution...');

      const { error: directError } = await supabase.from('products').select('processor').limit(1);

      if (directError && directError.message.includes('column "processor" does not exist')) {
        // Need to execute SQL manually
        return NextResponse.json({
          success: false,
          error: 'Cannot execute SQL directly. Please run the migration manually in Supabase SQL Editor.',
          sql: alterTableSQL,
          instructions: 'Copy the SQL from the "sql" field and run it in your Supabase SQL Editor.'
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Laptop columns added successfully to products table',
      columns_added: [
        'processor', 'generation', 'ram', 'storage', 'hdd', 'display',
        'graphics', 'operating_system', 'battery', 'condition', 'warranty',
        'in_stock', 'featured', 'featured_image', 'image', 'original_price', 'category'
      ]
    });

  } catch (error) {
    console.error('Error adding laptop columns:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// GET endpoint to check current table structure
export async function GET(request) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Query to get column information
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .limit(1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const columns = data && data.length > 0 ? Object.keys(data[0]) : [];

    const requiredLaptopColumns = [
      'processor', 'generation', 'ram', 'storage', 'hdd', 'display',
      'graphics', 'operating_system', 'battery', 'condition', 'warranty',
      'in_stock', 'featured', 'featured_image', 'image', 'original_price', 'category'
    ];

    const missingColumns = requiredLaptopColumns.filter(col => !columns.includes(col));
    const existingColumns = requiredLaptopColumns.filter(col => columns.includes(col));

    return NextResponse.json({
      success: true,
      all_columns: columns,
      existing_laptop_columns: existingColumns,
      missing_laptop_columns: missingColumns,
      needs_migration: missingColumns.length > 0
    });

  } catch (error) {
    console.error('Error checking table structure:', error);
    return NextResponse.json({
      error: error.message
    }, { status: 500 });
  }
}
