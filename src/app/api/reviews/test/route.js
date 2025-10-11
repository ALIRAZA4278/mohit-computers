import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-db';

// GET - Test the reviews system setup
export async function GET() {
  try {
    // Test if product_reviews table exists
    const { data: tableCheck, error: tableError } = await supabase
      .from('product_reviews')
      .select('count(*)')
      .limit(1);

    if (tableError) {
      return NextResponse.json({
        success: false,
        error: 'Product reviews table not found',
        details: tableError,
        message: 'Please run the SQL script to create the product_reviews table'
      }, { status: 500 });
    }

    // Test if we can fetch some sample data
    const { data: reviews, error: reviewsError } = await supabase
      .from('product_reviews')
      .select('*')
      .limit(5);

    if (reviewsError) {
      return NextResponse.json({
        success: false,
        error: 'Error fetching reviews',
        details: reviewsError
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Reviews system is working correctly',
      tableExists: true,
      sampleReviews: reviews?.length || 0,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: error.message
    }, { status: 500 });
  }
}
