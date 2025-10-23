import { NextResponse } from 'next/server';
import { productsAPI } from '@/lib/supabase-db';

// GET /api/clearance - Get all clearance products
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 100;

    const { data, error } = await productsAPI.getClearance(limit);
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      data: data || [],
      count: data?.length || 0
    });
  } catch (error) {
    console.error('Error fetching clearance products:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/clearance - Mark product as clearance (Admin only)
export async function POST(request) {
  try {
    const { productId, reason } = await request.json();

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const { data, error } = await productsAPI.markAsClearance(productId, reason);
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Product marked as clearance',
      data
    });
  } catch (error) {
    console.error('Error marking product as clearance:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/clearance - Remove product from clearance (Admin only)
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const { data, error } = await productsAPI.removeFromClearance(productId);
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Product removed from clearance',
      data
    });
  } catch (error) {
    console.error('Error removing product from clearance:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}