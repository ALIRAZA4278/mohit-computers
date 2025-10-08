import { NextResponse } from 'next/server';
import { productsAPI } from '@/lib/supabase-db';

// GET - Debug endpoint to check products and database structure
export async function GET() {
  try {
    // Get recent products
    const { data: products, error } = await productsAPI.getAll(10, false);
    
    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        details: 'Failed to fetch products from database'
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Products fetched successfully',
      data: {
        totalProducts: products?.length || 0,
        products: products || [],
        sampleProduct: products?.[0] || null
      }
    });

  } catch (error) {
    console.error('Debug API Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      details: 'Internal server error while debugging'
    });
  }
}