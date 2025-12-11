import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    // First, delete all existing options
    const { error: deleteError } = await supabase
      .from('laptop_upgrade_options')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows

    if (deleteError) {
      console.error('Error deleting old options:', deleteError);
    }

    // Define all upgrade options with correct pricing
    const allOptions = [
      // DDR3/DDR3L RAM (3rd-5th Gen)
      {
        option_type: 'ram',
        size: '4GB',
        size_number: 4,
        price: 1000,
        display_label: '4GB DDR3',
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
        applicable_to: 'ddr3',
        min_generation: 3,
        max_generation: 5,
        is_active: true,
        display_order: 2
      },

      // DDR4 RAM (6th-12th Gen)
      {
        option_type: 'ram',
        size: '4GB',
        size_number: 4,
        price: 3200,
        display_label: '4GB DDR4',
        applicable_to: 'ddr4',
        min_generation: 6,
        max_generation: 12,
        is_active: true,
        display_order: 3
      },
      {
        option_type: 'ram',
        size: '8GB',
        size_number: 8,
        price: 6000,
        display_label: '8GB DDR4',
        applicable_to: 'ddr4',
        min_generation: 6,
        max_generation: 12,
        is_active: true,
        display_order: 4
      },
      {
        option_type: 'ram',
        size: '16GB',
        size_number: 16,
        price: 11500,
        display_label: '16GB DDR4',
        applicable_to: 'ddr4',
        min_generation: 6,
        max_generation: 12,
        is_active: true,
        display_order: 5
      },

      // DDR5 RAM (12th Gen onwards)
      {
        option_type: 'ram',
        size: '4GB',
        size_number: 4,
        price: 5000,
        display_label: '4GB DDR5',
        applicable_to: 'ddr5',
        min_generation: 12,
        max_generation: null,
        is_active: true,
        display_order: 6
      },
      {
        option_type: 'ram',
        size: '8GB',
        size_number: 8,
        price: 8000,
        display_label: '8GB DDR5',
        applicable_to: 'ddr5',
        min_generation: 12,
        max_generation: null,
        is_active: true,
        display_order: 7
      },
      {
        option_type: 'ram',
        size: '16GB',
        size_number: 16,
        price: 15000,
        display_label: '16GB DDR5',
        applicable_to: 'ddr5',
        min_generation: 12,
        max_generation: null,
        is_active: true,
        display_order: 8
      },
      {
        option_type: 'ram',
        size: '32GB',
        size_number: 32,
        price: 28000,
        display_label: '32GB DDR5',
        applicable_to: 'ddr5',
        min_generation: 12,
        max_generation: null,
        is_active: true,
        display_order: 9
      },

      // SSD options (All generations)
      {
        option_type: 'ssd',
        size: '256GB',
        size_number: 256,
        price: 3000,
        display_label: '256GB NVMe SSD',
        applicable_to: 'all',
        min_generation: null,
        max_generation: null,
        is_active: true,
        display_order: 10
      },
      {
        option_type: 'ssd',
        size: '512GB',
        size_number: 512,
        price: 5500,
        display_label: '512GB NVMe SSD',
        applicable_to: 'all',
        min_generation: null,
        max_generation: null,
        is_active: true,
        display_order: 11
      },
      {
        option_type: 'ssd',
        size: '1TB',
        size_number: 1024,
        price: 10000,
        display_label: '1TB NVMe SSD',
        applicable_to: 'all',
        min_generation: null,
        max_generation: null,
        is_active: true,
        display_order: 12
      }
    ];

    // Insert all options
    const { data, error } = await supabase
      .from('laptop_upgrade_options')
      .insert(allOptions)
      .select();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${data.length} upgrade options`,
      options: data
    });
  } catch (error) {
    console.error('Error updating upgrade prices:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update upgrade prices' },
      { status: 500 }
    );
  }
}
