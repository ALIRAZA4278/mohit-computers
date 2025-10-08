import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-db';

// GET - Check total products count
export async function GET() {
  try {
    // Get total count
    const { count, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      return NextResponse.json({
        success: false,
        error: countError.message
      }, { status: 500 });
    }

    // Get active products count
    const { count: activeCount, error: activeError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    if (activeError) {
      return NextResponse.json({
        success: false,
        error: activeError.message
      }, { status: 500 });
    }

    // Get sample of first 5 products
    const { data: sampleProducts, error: sampleError } = await supabase
      .from('products')
      .select('id, name, brand, price, is_active, created_at')
      .limit(5)
      .order('created_at', { ascending: false });

    if (sampleError) {
      return NextResponse.json({
        success: false,
        error: sampleError.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        totalProducts: count,
        activeProducts: activeCount,
        inactiveProducts: count - activeCount,
        sampleProducts: sampleProducts || [],
        message: `Database contains ${count} total products, ${activeCount} are active`
      }
    });

  } catch (error) {
    console.error('Database check error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}