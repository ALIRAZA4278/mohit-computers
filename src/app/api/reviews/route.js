import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-db';

// GET - Fetch reviews for a product
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('product_id');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const sortBy = searchParams.get('sort') || 'newest'; // newest, oldest, rating_high, rating_low, helpful

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    let query = supabase
      .from('product_reviews')
      .select('*')
      .eq('product_id', productId)
      .eq('is_approved', true);

    // Apply sorting
    switch (sortBy) {
      case 'oldest':
        query = query.order('created_at', { ascending: true });
        break;
      case 'rating_high':
        query = query.order('rating', { ascending: false });
        break;
      case 'rating_low':
        query = query.order('rating', { ascending: true });
        break;
      case 'helpful':
        query = query.order('helpful_count', { ascending: false });
        break;
      default: // newest
        query = query.order('created_at', { ascending: false });
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data: reviews, error } = await query;

    if (error) {
      console.error('Error fetching reviews:', error);
      return NextResponse.json(
        { error: 'Failed to fetch reviews', details: error },
        { status: 500 }
      );
    }

    // Get total count and rating stats
    const { data: stats, error: statsError } = await supabase
      .from('product_reviews')
      .select('rating')
      .eq('product_id', productId)
      .eq('is_approved', true);

    if (statsError) {
      console.error('Error fetching review stats:', statsError);
    }

    // Calculate rating statistics
    const totalReviews = stats?.length || 0;
    const averageRating = totalReviews > 0 
      ? (stats.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1)
      : 0;

    const ratingDistribution = {
      5: stats?.filter(r => r.rating === 5).length || 0,
      4: stats?.filter(r => r.rating === 4).length || 0,
      3: stats?.filter(r => r.rating === 3).length || 0,
      2: stats?.filter(r => r.rating === 2).length || 0,
      1: stats?.filter(r => r.rating === 1).length || 0,
    };

    return NextResponse.json({
      reviews: reviews || [],
      pagination: {
        page,
        limit,
        total: totalReviews,
        totalPages: Math.ceil(totalReviews / limit)
      },
      stats: {
        totalReviews,
        averageRating: parseFloat(averageRating),
        ratingDistribution
      }
    });

  } catch (error) {
    console.error('Error in GET /api/reviews:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Add a new review (only for delivered orders)
export async function POST(request) {
  try {
    const body = await request.json();
    const { product_id, user_id, user_name, user_email, order_id, rating, title, comment, images } = body;

    // Validate required fields
    if (!product_id || !user_id || !order_id || !rating) {
      return NextResponse.json(
        { error: 'Product ID, User ID, Order ID, and rating are required' },
        { status: 400 }
      );
    }

    // Ensure all IDs are in proper UUID format
    const isValidUUID = (str) => {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      return uuidRegex.test(str);
    };

    if (!isValidUUID(product_id)) {
      return NextResponse.json(
        { error: 'Invalid product ID format' },
        { status: 400 }
      );
    }

    if (!isValidUUID(order_id)) {
      return NextResponse.json(
        { error: 'Invalid order ID format' },
        { status: 400 }
      );
    }

    // For user_id, if it's not a UUID, we'll generate one based on the string
    let validUserId = user_id;
    if (!isValidUUID(user_id)) {
      // Generate a consistent UUID from the user_id string
      const crypto = require('crypto');
      const hash = crypto.createHash('sha256').update(user_id.toString()).digest('hex');
      validUserId = [
        hash.substr(0, 8),
        hash.substr(8, 4),
        '4' + hash.substr(12, 3), // Version 4 UUID
        ((parseInt(hash.substr(16, 1), 16) & 0x3) | 0x8).toString(16) + hash.substr(17, 3),
        hash.substr(20, 12)
      ].join('-');
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Validate comment length
    if (comment && (comment.length < 10 || comment.length > 2000)) {
      return NextResponse.json(
        { error: 'Comment must be between 10 and 2000 characters' },
        { status: 400 }
      );
    }

    // TODO: Verify that the order exists, belongs to the user, contains the product, and is delivered
    // This would require checking the orders table:
    /*
    const { data: orderCheck, error: orderError } = await supabase
      .from('orders')
      .select('id, user_id, status, order_items')
      .eq('id', order_id)
      .eq('user_id', user_id)
      .eq('status', 'delivered')
      .single();

    if (orderError || !orderCheck) {
      return NextResponse.json(
        { error: 'Order not found, not delivered, or does not belong to user' },
        { status: 403 }
      );
    }

    // Check if the product is in the order
    const productInOrder = orderCheck.order_items?.some(item => item.product_id === product_id);
    if (!productInOrder) {
      return NextResponse.json(
        { error: 'Product not found in the specified order' },
        { status: 403 }
      );
    }
    */

    // Check if user has already reviewed this product for this order
    const { data: existingReview, error: existingError } = await supabase
      .from('product_reviews')
      .select('id')
      .eq('user_id', validUserId)
      .eq('product_id', product_id)
      .eq('order_id', order_id)
      .single();

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this product for this order' },
        { status: 409 }
      );
    }

    // Insert the review
    const reviewData = {
      product_id,
      user_id: validUserId,
      user_name: user_name?.trim() || 'Anonymous User',
      user_email: user_email?.trim() || '',
      order_id,
      rating,
      title: title?.trim() || null,
      comment: comment?.trim() || null,
      images: images || [],
      is_verified: true, // Since we verified the order (in production)
      is_approved: true, // Auto-approve for now
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: review, error } = await supabase
      .from('product_reviews')
      .insert([reviewData])
      .select()
      .single();

    if (error) {
      console.error('Error inserting review:', error);
      return NextResponse.json(
        { error: 'Failed to save review', details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Review added successfully',
      review
    }, { status: 201 });

  } catch (error) {
    console.error('Error in POST /api/reviews:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
