import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getUserFromRequest } from '@/lib/auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// GET - Fetch user's wishlist
export async function GET(request) {
  try {
    const auth = getUserFromRequest(request);

    if (!auth.authenticated) {
      return NextResponse.json(
        { error: auth.error || 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('wishlist')
      .eq('id', auth.userId)
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch wishlist' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      wishlist: user.wishlist || []
    });

  } catch (error) {
    console.error('Wishlist fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Add item to wishlist
export async function POST(request) {
  try {
    const auth = getUserFromRequest(request);

    if (!auth.authenticated) {
      return NextResponse.json(
        { error: auth.error || 'Unauthorized' },
        { status: 401 }
      );
    }

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Get current wishlist
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('wishlist')
      .eq('id', auth.userId)
      .single();

    if (fetchError) {
      return NextResponse.json(
        { error: 'Failed to fetch user data' },
        { status: 500 }
      );
    }

    const currentWishlist = user.wishlist || [];

    // Check if product already in wishlist
    if (currentWishlist.includes(productId)) {
      return NextResponse.json(
        { error: 'Product already in wishlist' },
        { status: 400 }
      );
    }

    // Add product to wishlist
    const updatedWishlist = [...currentWishlist, productId];

    const { error: updateError } = await supabase
      .from('users')
      .update({ wishlist: updatedWishlist })
      .eq('id', auth.userId);

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update wishlist' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product added to wishlist',
      wishlist: updatedWishlist
    });

  } catch (error) {
    console.error('Wishlist add error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Remove item from wishlist
export async function DELETE(request) {
  try {
    const auth = getUserFromRequest(request);

    if (!auth.authenticated) {
      return NextResponse.json(
        { error: auth.error || 'Unauthorized' },
        { status: 401 }
      );
    }

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Get current wishlist
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('wishlist')
      .eq('id', auth.userId)
      .single();

    if (fetchError) {
      return NextResponse.json(
        { error: 'Failed to fetch user data' },
        { status: 500 }
      );
    }

    const currentWishlist = user.wishlist || [];

    // Remove product from wishlist
    const updatedWishlist = currentWishlist.filter(id => id !== productId);

    const { error: updateError } = await supabase
      .from('users')
      .update({ wishlist: updatedWishlist })
      .eq('id', auth.userId);

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update wishlist' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product removed from wishlist',
      wishlist: updatedWishlist
    });

  } catch (error) {
    console.error('Wishlist remove error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
