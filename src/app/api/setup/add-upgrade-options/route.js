import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  try {
    // First, check if column exists
    const { data: existingColumn } = await supabase
      .from('products')
      .select('upgrade_options')
      .limit(1);

    // If we can query upgrade_options, it already exists
    if (existingColumn !== null) {
      return NextResponse.json({
        success: true,
        message: 'Upgrade options column already exists!',
        details: {
          column: 'upgrade_options',
          type: 'JSONB',
          description: 'Stores SSD and RAM upgrade options with prices for laptop products'
        }
      });
    }

    // If column doesn't exist, return SQL for manual execution
    const error = new Error('Column needs to be created manually');
    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          hint: 'You may need to run this SQL manually in Supabase SQL Editor',
          sql: `
-- Add upgrade_options column
ALTER TABLE products ADD COLUMN IF NOT EXISTS upgrade_options JSONB DEFAULT '{
  "ssd256": {"enabled": false, "price": ""},
  "ssd512": {"enabled": false, "price": ""},
  "ram8gb": {"enabled": false, "price": ""},
  "ram16gb": {"enabled": false, "price": ""},
  "ram32gb": {"enabled": false, "price": ""}
}'::JSONB;

-- Add custom_upgrades column
ALTER TABLE products ADD COLUMN IF NOT EXISTS custom_upgrades JSONB DEFAULT '[]'::JSONB;

-- Create GIN indexes
CREATE INDEX IF NOT EXISTS idx_products_upgrade_options ON products USING GIN (upgrade_options);
CREATE INDEX IF NOT EXISTS idx_products_custom_upgrades ON products USING GIN (custom_upgrades);
          `
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Upgrade options field added to products table successfully!',
      details: {
        column: 'upgrade_options',
        type: 'JSONB',
        description: 'Stores SSD and RAM upgrade options with prices for laptop products'
      },
      data
    });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        instruction: 'Please run the SQL manually in Supabase Dashboard → SQL Editor',
        sql: `
-- Run this SQL in Supabase SQL Editor:

ALTER TABLE products ADD COLUMN IF NOT EXISTS upgrade_options JSONB DEFAULT '{
  "ssd256": {"enabled": false, "price": ""},
  "ssd512": {"enabled": false, "price": ""},
  "ram8gb": {"enabled": false, "price": ""},
  "ram16gb": {"enabled": false, "price": ""},
  "ram32gb": {"enabled": false, "price": ""}
}'::JSONB;

CREATE INDEX IF NOT EXISTS idx_products_upgrade_options ON products USING GIN (upgrade_options);
        `
      },
      { status: 500 }
    );
  }
}
