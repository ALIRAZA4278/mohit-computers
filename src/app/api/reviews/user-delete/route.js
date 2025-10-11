import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-db';

// DELETE - Allow users to delete their own reviews
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get('review_id');
    const userId = searchParams.get('user_id');

    if (!reviewId || !userId) {
      return NextResponse.json(
        { error: 'Review ID and User ID are required' },
        { status: 400 }
      );
    }

    // Ensure consistent UUID handling for user_id
    const isValidUUID = (str) => {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      return uuidRegex.test(str);
    };

    // For user_id, if it's not a UUID, generate one based on the string (same as in review creation)
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

    // First, verify that the review belongs to the user
    const { data: reviewCheck, error: checkError } = await supabase
      .from('product_reviews')
      .select('id, user_id')
      .eq('id', reviewId)
      .eq('user_id', validUserId)
      .single();

    if (checkError || !reviewCheck) {
      return NextResponse.json(
        { error: 'Review not found or you do not have permission to delete this review' },
        { status: 404 }
      );
    }

    // Delete the review
    const { error: deleteError } = await supabase
      .from('product_reviews')
      .delete()
      .eq('id', reviewId)
      .eq('user_id', validUserId);

    if (deleteError) {
      console.error('Error deleting review:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete review', details: deleteError },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Review deleted successfully'
    });

  } catch (error) {
    console.error('Error in DELETE /api/reviews/user-delete:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
