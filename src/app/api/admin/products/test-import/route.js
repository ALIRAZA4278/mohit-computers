import { NextResponse } from 'next/server';
import { productsAPI } from '@/lib/supabase-db';

// Simple test import - just one product
export async function POST(request) {
  try {
    console.log('='.repeat(50));
    console.log('[TEST IMPORT] Starting test import...');

    // Create a simple test product
    const testProduct = {
      name: 'Test Laptop Import',
      slug: 'test-laptop-import-' + Date.now(),
      category_id: 'laptop',
      brand: 'HP',
      price: 35000,
      is_featured: false,
      is_active: true,
      processor: 'Intel Core i5',
      generation: '8th Gen',
      ram: '8GB DDR4',
      hdd: '256GB SSD',
      display_size: '14 inch',
      condition: 'Good',
      warranty: '6 months',
      charger_included: true,
      featured_image: 'https://picsum.photos/400/300',
      images: ['https://picsum.photos/400/300'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('[TEST IMPORT] Test product:', JSON.stringify(testProduct, null, 2));
    console.log('[TEST IMPORT] Attempting to insert into database...');

    const { data, error } = await productsAPI.create(testProduct);

    if (error) {
      console.error('[TEST IMPORT] Database error:', error);
      return NextResponse.json({
        success: false,
        error: 'Database error',
        details: {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        }
      }, { status: 500 });
    }

    console.log('[TEST IMPORT] Success! Product ID:', data.id);
    console.log('='.repeat(50));

    return NextResponse.json({
      success: true,
      message: 'Test product created successfully',
      product: data
    });

  } catch (error) {
    console.error('[TEST IMPORT] Exception:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}

// GET - Test database connection
export async function GET() {
  try {
    console.log('[TEST IMPORT] Testing database connection...');

    const { data, error } = await productsAPI.getAll(1, false);

    if (error) {
      return NextResponse.json({
        success: false,
        error: 'Database connection failed',
        details: error
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Database connection working',
      productCount: data?.length || 0
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    });
  }
}
