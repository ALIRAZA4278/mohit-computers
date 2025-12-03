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

    // Add is_new_arrival column to products table
    const alterTableSQL = `
      DO $$
      BEGIN
        -- Add is_new_arrival column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                      WHERE table_name='products' AND column_name='is_new_arrival') THEN
          ALTER TABLE products ADD COLUMN is_new_arrival BOOLEAN DEFAULT FALSE;
        END IF;
      END $$;
    `;

    const { data, error } = await supabase.rpc('exec_sql', { sql_query: alterTableSQL });

    if (error) {
      console.log('RPC failed, trying direct execution...');

      // Test if column exists
      const { error: directError } = await supabase.from('products').select('is_new_arrival').limit(1);

      if (directError && directError.message.includes('column "is_new_arrival" does not exist')) {
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
      message: 'New Arrival field added successfully to products table',
      field_added: 'is_new_arrival (BOOLEAN)'
    });

  } catch (error) {
    console.error('Error adding new arrival field:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// GET endpoint to check if field exists
export async function GET(request) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .limit(1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const columns = data && data.length > 0 ? Object.keys(data[0]) : [];
    const hasNewArrivalField = columns.includes('is_new_arrival');

    return NextResponse.json({
      success: true,
      has_new_arrival_field: hasNewArrivalField,
      all_columns: columns
    });

  } catch (error) {
    console.error('Error checking field:', error);
    return NextResponse.json({
      error: error.message
    }, { status: 500 });
  }
}
