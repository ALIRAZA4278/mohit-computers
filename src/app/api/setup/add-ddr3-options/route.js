import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Pricing from the chart:
// DDR3/DDR3L (3rd-5th Gen): 4GB = Rs1,000, 8GB = Rs2,500
// DDR4 (6th-11th Gen): 4GB = Rs3,200, 8GB = Rs6,000, 16GB = Rs11,500
// SSD: 256GB = Rs3,000 (from 128GB), 512GB = Rs5,500-8,000, 1TB = Rs10,000-18,500

export async function GET(request) {
  try {
    // First delete all existing options to reset with correct pricing
    const { error: deleteError } = await supabase
      .from('laptop_upgrade_options')
      .delete()
      .gte('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows

    if (deleteError) {
      console.log('Delete error (may be ok):', deleteError.message);
    }

    // Define all upgrade options with correct pricing from the chart
    const allOptions = [
      // DDR3/DDR3L RAM options (3rd-5th Gen)
      {
        option_type: 'ram',
        size: '4GB',
        size_number: 4,
        price: 1000,
        display_label: '4GB DDR3',
        description: 'DDR3/DDR3L RAM upgrade',
        applicable_to: 'ddr3',
        min_generation: 3,
        max_generation: 5,
        is_active: true,
        display_order: 1
      },
      {
        option_type: 'ram',
        size: '8GB',
        size_number: 8,
        price: 2500,
        display_label: '8GB DDR3',
        description: 'DDR3/DDR3L RAM upgrade',
        applicable_to: 'ddr3',
        min_generation: 3,
        max_generation: 5,
        is_active: true,
        display_order: 2
      },
      // DDR4 RAM options (6th-11th Gen)
      {
        option_type: 'ram',
        size: '4GB',
        size_number: 4,
        price: 3200,
        display_label: '4GB DDR4',
        description: 'DDR4 RAM upgrade',
        applicable_to: 'ddr4',
        min_generation: 6,
        max_generation: 11,
        is_active: true,
        display_order: 3
      },
      {
        option_type: 'ram',
        size: '8GB',
        size_number: 8,
        price: 6000,
        display_label: '8GB DDR4',
        description: 'DDR4 RAM upgrade',
        applicable_to: 'ddr4',
        min_generation: 6,
        max_generation: 11,
        is_active: true,
        display_order: 4
      },
      {
        option_type: 'ram',
        size: '16GB',
        size_number: 16,
        price: 11500,
        display_label: '16GB DDR4',
        description: 'DDR4 RAM upgrade',
        applicable_to: 'ddr4',
        min_generation: 6,
        max_generation: 11,
        is_active: true,
        display_order: 5
      },
      // SSD options - prices based on upgrade from 128GB
      // 256GB: Rs3,000 from 128GB
      // 512GB: Rs8,000 from 128GB, Rs5,500 from 256GB
      // 1TB: Rs18,500 from 128GB, Rs15,500 from 256GB, Rs10,000 from 512GB
      {
        option_type: 'ssd',
        size: '256GB',
        size_number: 256,
        price: 3000,
        display_label: '256GB NVMe SSD',
        description: 'Upgrade from 128GB to 256GB SSD',
        applicable_to: 'all',
        is_active: true,
        display_order: 10
      },
      {
        option_type: 'ssd',
        size: '512GB',
        size_number: 512,
        price: 5500,
        display_label: '512GB NVMe SSD',
        description: 'Upgrade to 512GB SSD',
        applicable_to: 'all',
        is_active: true,
        display_order: 11
      },
      {
        option_type: 'ssd',
        size: '1TB',
        size_number: 1024,
        price: 10000,
        display_label: '1TB NVMe SSD',
        description: 'Upgrade to 1TB SSD',
        applicable_to: 'all',
        is_active: true,
        display_order: 12
      }
    ];

    const { data: insertedData, error: insertError } = await supabase
      .from('laptop_upgrade_options')
      .insert(allOptions)
      .select();

    if (insertError) {
      return NextResponse.json({
        success: false,
        error: insertError.message,
        hint: 'Table may not exist. Run the SQL below in Supabase SQL Editor.',
        sql: `
-- Run this SQL in Supabase SQL Editor:

-- First delete existing options
DELETE FROM laptop_upgrade_options;

-- Insert all options with correct pricing
INSERT INTO laptop_upgrade_options (option_type, size, size_number, price, display_label, description, applicable_to, min_generation, max_generation, is_active, display_order)
VALUES
  -- DDR3/DDR3L (3rd-5th Gen)
  ('ram', '4GB', 4, 1000, '4GB DDR3', 'DDR3/DDR3L RAM upgrade', 'ddr3', 3, 5, true, 1),
  ('ram', '8GB', 8, 2500, '8GB DDR3', 'DDR3/DDR3L RAM upgrade', 'ddr3', 3, 5, true, 2),
  -- DDR4 (6th-11th Gen)
  ('ram', '4GB', 4, 3200, '4GB DDR4', 'DDR4 RAM upgrade', 'ddr4', 6, 11, true, 3),
  ('ram', '8GB', 8, 6000, '8GB DDR4', 'DDR4 RAM upgrade', 'ddr4', 6, 11, true, 4),
  ('ram', '16GB', 16, 11500, '16GB DDR4', 'DDR4 RAM upgrade', 'ddr4', 6, 11, true, 5),
  -- SSD options
  ('ssd', '256GB', 256, 3000, '256GB NVMe SSD', 'Upgrade to 256GB SSD', 'all', NULL, NULL, true, 10),
  ('ssd', '512GB', 512, 5500, '512GB NVMe SSD', 'Upgrade to 512GB SSD', 'all', NULL, NULL, true, 11),
  ('ssd', '1TB', 1024, 10000, '1TB NVMe SSD', 'Upgrade to 1TB SSD', 'all', NULL, NULL, true, 12);
        `
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'All upgrade options added with correct pricing!',
      data: insertedData,
      pricing: {
        'DDR3 (3rd-5th Gen)': {
          '4GB': 'Rs 1,000',
          '8GB': 'Rs 2,500'
        },
        'DDR4 (6th-11th Gen)': {
          '4GB': 'Rs 3,200',
          '8GB': 'Rs 6,000',
          '16GB': 'Rs 11,500'
        },
        'SSD': {
          '256GB': 'Rs 3,000',
          '512GB': 'Rs 5,500',
          '1TB': 'Rs 10,000'
        }
      }
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
