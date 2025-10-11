import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-db';

// GET - Check if user can review a product (based on delivered orders)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const productId = searchParams.get('product_id');

    if (!userId || !productId) {
      return NextResponse.json(
        { error: 'User ID and Product ID are required' },
        { status: 400 }
      );
    }

    // Ensure consistent UUID handling
    const isValidUUID = (str) => {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      return uuidRegex.test(str);
    };

    // For user_id, if it's not a UUID, we'll generate one based on the string (same as in review creation)
    let validUserId = userId;
    if (!isValidUUID(userId)) {
      const crypto = require('crypto');
      const hash = crypto.createHash('sha256').update(userId.toString()).digest('hex');
      validUserId = [
        hash.substr(0, 8),
        hash.substr(8, 4),
        '4' + hash.substr(12, 3), // Version 4 UUID
        ((parseInt(hash.substr(16, 1), 16) & 0x3) | 0x8).toString(16) + hash.substr(17, 3),
        hash.substr(20, 12)
      ].join('-');
    }

    // TODO: In production, you would check the actual orders table
    // For now, we'll simulate the check
    
    // Check if user has any delivered orders containing this product
    /*
    const { data: eligibleOrders, error } = await supabase
      .from('orders')
      .select('id, order_items, status, created_at')
      .eq('user_id', userId)
      .eq('status', 'delivered')
      .contains('order_items', [{ product_id: productId }]);
    */

    // Simulated response for now - replace with actual order check
    const eligibleOrders = [
      {
        id: '550e8400-e29b-41d4-a716-446655440000', // Proper UUID format
        status: 'delivered',
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days ago
      },
      {
        id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8', // Another UUID
        status: 'delivered', 
        created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days ago
      }
    ];

    if (!eligibleOrders || eligibleOrders.length === 0) {
      return NextResponse.json({
        canReview: false,
        reason: 'You can only review products from delivered orders',
        eligibleOrders: []
      });
    }

    // Check if user has already reviewed this product for any of these orders
    const { data: existingReviews, error: reviewError } = await supabase
      .from('product_reviews')
      .select('order_id')
      .eq('user_id', validUserId)
      .eq('product_id', productId);

    if (reviewError) {
      console.error('Error checking existing reviews:', reviewError);
    }

    const reviewedOrderIds = existingReviews?.map(review => review.order_id) || [];
    const availableOrders = eligibleOrders.filter(order => !reviewedOrderIds.includes(order.id));

    return NextResponse.json({
      canReview: availableOrders.length > 0,
      reason: availableOrders.length > 0 
        ? 'You can review this product' 
        : 'You have already reviewed this product for all your orders',
      eligibleOrders: availableOrders,
      totalEligibleOrders: eligibleOrders.length,
      alreadyReviewedOrders: reviewedOrderIds.length
    });

  } catch (error) {
    console.error('Error in GET /api/reviews/check-eligibility:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
