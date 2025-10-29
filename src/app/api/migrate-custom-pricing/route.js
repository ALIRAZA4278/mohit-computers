import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET(request) {
  try {
    console.log('Starting migration: Adding missing columns to products table...');

    // Test if columns exist
    const missingColumns = [];
    
    // Test each column
    const columnsToTest = [
      'show_ram_options',
      'show_ssd_options', 
      'show_laptop_customizer',
      'show_ram_customizer',
      'custom_upgrade_pricing',
      'is_workstation'
    ];

    for (const column of columnsToTest) {
      try {
        await supabase.from('products').select(column).limit(1);
      } catch (error) {
        if (error.message && error.message.includes(column)) {
          missingColumns.push(column);
        }
      }
    }

    if (missingColumns.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'All columns already exist!',
        alreadyExists: true
      });
    }

    // Generate SQL for missing columns
    const sql = `
-- Comprehensive Database Migration: Add All Missing Columns to Products Table

-- 1. Add show_ram_options column
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS show_ram_options BOOLEAN DEFAULT true;

-- 2. Add show_ssd_options column
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS show_ssd_options BOOLEAN DEFAULT true;

-- 3. Add show_laptop_customizer column
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS show_laptop_customizer BOOLEAN DEFAULT true;

-- 4. Add show_ram_customizer column
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS show_ram_customizer BOOLEAN DEFAULT true;

-- 5. Add custom_upgrade_pricing column
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS custom_upgrade_pricing JSONB DEFAULT '{}'::jsonb;

-- 6. Add is_workstation column
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_workstation BOOLEAN DEFAULT false;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_products_show_ram_options ON products(show_ram_options);
CREATE INDEX IF NOT EXISTS idx_products_show_ssd_options ON products(show_ssd_options);
CREATE INDEX IF NOT EXISTS idx_products_is_workstation ON products(is_workstation);
CREATE INDEX IF NOT EXISTS idx_products_custom_upgrade_pricing ON products USING gin(custom_upgrade_pricing);
    `;

    return NextResponse.json({
      success: false,
      needsMigration: true,
      missingColumns: missingColumns,
      message: 'Please run the SQL migration in Supabase Dashboard',
      instruction: '⚠️ REQUIRED: Database Migration Needed',
      sql: sql,
      steps: [
        '1. Go to https://supabase.com/dashboard',
        '2. Select your project',
        '3. Click on "SQL Editor" in the left sidebar',
        '4. Click "New query"',
        '5. Copy the SQL shown above (or from complete-products-migration.sql)',
        '6. Paste it in the editor',
        '7. Click "Run" or press Ctrl+Enter',
        '8. Wait for success message',
        '9. Refresh this page to verify'
      ],
      quickFile: 'The SQL is also saved in: complete-products-migration.sql'
    });

  } catch (error) {
    console.error('Migration check error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'Please run the complete migration SQL',
      file: 'complete-products-migration.sql',
      sql: `-- See complete-products-migration.sql file for full migration SQL`
    }, { status: 500 });
  }
}

export async function POST(request) {
  // Alternative endpoint to test if migration was successful
  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, custom_upgrade_pricing')
      .limit(1);

    if (error) {
      return NextResponse.json({
        success: false,
        migrationComplete: false,
        error: error.message,
        message: 'Column does not exist yet. Please run the migration SQL in Supabase Dashboard.'
      });
    }

    return NextResponse.json({
      success: true,
      migrationComplete: true,
      message: 'Migration successful! The custom_upgrade_pricing column exists and is working.',
      sampleData: data
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
