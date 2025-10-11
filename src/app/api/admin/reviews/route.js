import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-db';

// GET - Fetch all reviews for admin
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all'; // all, approved, pending
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const search = searchParams.get('search') || '';
    const productId = searchParams.get('product_id') || '';

    let query = supabase
      .from('product_reviews')
      .select(`
        *,
        products!inner(name, slug)
      `)
      .order('created_at', { ascending: false });

    // Filter by approval status
    if (status === 'approved') {
      query = query.eq('is_approved', true);
    } else if (status === 'pending') {
      query = query.eq('is_approved', false);
    }

    // Filter by product
    if (productId) {
      query = query.eq('product_id', productId);
    }

    // Search functionality
    if (search) {
      query = query.or(`title.ilike.%${search}%,comment.ilike.%${search}%`);
    }

    // Pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data: reviews, error } = await query;

    if (error) {
      console.error('Error fetching admin reviews:', error);
      return NextResponse.json(
        { error: 'Failed to fetch reviews', details: error },
        { status: 500 }
      );
    }

    // Get total count for pagination
    let countQuery = supabase
      .from('product_reviews')
      .select('*', { count: 'exact', head: true });

    if (status === 'approved') {
      countQuery = countQuery.eq('is_approved', true);
    } else if (status === 'pending') {
      countQuery = countQuery.eq('is_approved', false);
    }

    if (productId) {
      countQuery = countQuery.eq('product_id', productId);
    }

    if (search) {
      countQuery = countQuery.or(`title.ilike.%${search}%,comment.ilike.%${search}%`);
    }

    const { count, error: countError } = await countQuery;

    if (countError) {
      console.error('Error getting reviews count:', countError);
    }

    return NextResponse.json({
      reviews: reviews || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    });

  } catch (error) {
    console.error('Error in GET /api/admin/reviews:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update review status (approve/reject)
export async function PUT(request) {
  try {
    const body = await request.json();
    const { review_id, is_approved } = body;

    if (!review_id || is_approved === undefined) {
      return NextResponse.json(
        { error: 'Review ID and approval status are required' },
        { status: 400 }
      );
    }

    const { data: review, error } = await supabase
      .from('product_reviews')
      .update({
        is_approved,
        updated_at: new Date().toISOString()
      })
      .eq('id', review_id)
      .select()
      .single();

    if (error) {
      console.error('Error updating review:', error);
      return NextResponse.json(
        { error: 'Failed to update review', details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: `Review ${is_approved ? 'approved' : 'rejected'} successfully`,
      review
    });

  } catch (error) {
    console.error('Error in PUT /api/admin/reviews:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete a review
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const review_id = searchParams.get('review_id');

    if (!review_id) {
      return NextResponse.json(
        { error: 'Review ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('product_reviews')
      .delete()
      .eq('id', review_id);

    if (error) {
      console.error('Error deleting review:', error);
      return NextResponse.json(
        { error: 'Failed to delete review', details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Review deleted successfully'
    });

  } catch (error) {
    console.error('Error in DELETE /api/admin/reviews:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
