import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  try {
    // Add RAM-specific fields to products table
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        -- Add RAM-specific columns to products table if they don't exist
        DO $$
        BEGIN
          -- RAM Type (DDR3, DDR4, DDR5, etc.)
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                         WHERE table_name='products' AND column_name='ram_type') THEN
            ALTER TABLE products ADD COLUMN ram_type VARCHAR(50);
          END IF;

          -- RAM Capacity (2GB, 4GB, 8GB, etc.)
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                         WHERE table_name='products' AND column_name='ram_capacity') THEN
            ALTER TABLE products ADD COLUMN ram_capacity VARCHAR(50);
          END IF;

          -- RAM Speed (1600 MHz, 2400 MHz, etc.)
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                         WHERE table_name='products' AND column_name='ram_speed') THEN
            ALTER TABLE products ADD COLUMN ram_speed VARCHAR(50);
          END IF;

          -- RAM Form Factor (SO-DIMM for Laptop, DIMM for Desktop)
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                         WHERE table_name='products' AND column_name='ram_form_factor') THEN
            ALTER TABLE products ADD COLUMN ram_form_factor VARCHAR(100);
          END IF;

          -- RAM Condition (New, Used, Refurbished)
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                         WHERE table_name='products' AND column_name='ram_condition') THEN
            ALTER TABLE products ADD COLUMN ram_condition VARCHAR(50);
          END IF;

          -- RAM Warranty (15 Days, 3 Months, 6 Months, 1 Year, 2 Years)
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                         WHERE table_name='products' AND column_name='ram_warranty') THEN
            ALTER TABLE products ADD COLUMN ram_warranty VARCHAR(50);
          END IF;
        END $$;

        -- Create indexes for better query performance
        CREATE INDEX IF NOT EXISTS idx_products_ram_type ON products(ram_type);
        CREATE INDEX IF NOT EXISTS idx_products_ram_capacity ON products(ram_capacity);
        CREATE INDEX IF NOT EXISTS idx_products_ram_speed ON products(ram_speed);
        CREATE INDEX IF NOT EXISTS idx_products_ram_form_factor ON products(ram_form_factor);
      `
    });

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          hint: 'You may need to run this SQL manually in Supabase SQL Editor'
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'RAM fields added to products table successfully!',
      fields: [
        'ram_type',
        'ram_capacity',
        'ram_speed',
        'ram_form_factor',
        'ram_condition',
        'ram_warranty'
      ],
      data
    });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        instruction: 'Please run the SQL manually in Supabase Dashboard → SQL Editor'
      },
      { status: 500 }
    );
  }
}
