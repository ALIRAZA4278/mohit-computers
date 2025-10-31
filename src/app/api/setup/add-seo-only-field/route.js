import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET(request) {
  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing Supabase credentials in environment variables'
        },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Adding seo_only field to products table...');

    // Add seo_only column (default false)
    const { error: alterError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE products
        ADD COLUMN IF NOT EXISTS seo_only BOOLEAN DEFAULT false;

        COMMENT ON COLUMN products.seo_only IS 'If true, product is only visible via direct URL and to search engines (not in catalog listings)';
      `
    });

    if (alterError) {
      // If RPC doesn't exist, try direct query
      console.log('RPC not available, trying direct query...');

      const { error: directError } = await supabase
        .from('products')
        .select('seo_only')
        .limit(1);

      if (directError && directError.message.includes('column "seo_only" does not exist')) {
        return NextResponse.json({
          success: false,
          error: 'Please add the seo_only column manually using Supabase SQL Editor',
          sql: `
            ALTER TABLE products
            ADD COLUMN IF NOT EXISTS seo_only BOOLEAN DEFAULT false;

            COMMENT ON COLUMN products.seo_only IS 'If true, product is only visible via direct URL and to search engines (not in catalog listings)';
          `,
          message: 'Copy the SQL above and run it in Supabase SQL Editor'
        }, { status: 500 });
      }
    }

    console.log('✅ Successfully added seo_only field to products table');

    return NextResponse.json({
      success: true,
      message: 'Successfully added seo_only field to products table',
      changes: [
        'Added seo_only column (boolean, default false)',
        'Products with seo_only=true will only be visible via direct URL',
        'SEO-only products will be hidden from catalog/category/search listings'
      ]
    });

  } catch (error) {
    console.error('Error adding seo_only field:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to add seo_only field: ' + error.message,
        sql: `
          ALTER TABLE products
          ADD COLUMN IF NOT EXISTS seo_only BOOLEAN DEFAULT false;

          COMMENT ON COLUMN products.seo_only IS 'If true, product is only visible via direct URL and to search engines (not in catalog listings)';
        `,
        message: 'If automatic migration failed, copy the SQL above and run it manually in Supabase SQL Editor'
      },
      { status: 500 }
    );
  }
}
