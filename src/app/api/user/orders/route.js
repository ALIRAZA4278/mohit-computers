import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getUserFromRequest } from '@/lib/auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// GET - Fetch user's orders
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
      .select('orders')
      .eq('id', auth.userId)
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch orders' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      orders: user.orders || []
    });

  } catch (error) {
    console.error('Orders fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new order
export async function POST(request) {
  try {
    const auth = getUserFromRequest(request);

    if (!auth.authenticated) {
      return NextResponse.json(
        { error: auth.error || 'Unauthorized' },
        { status: 401 }
      );
    }

    const orderData = await request.json();

    if (!orderData || !orderData.items || orderData.items.length === 0) {
      return NextResponse.json(
        { error: 'Order items are required' },
        { status: 400 }
      );
    }

    // Get current orders
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('orders')
      .eq('id', auth.userId)
      .single();

    if (fetchError) {
      return NextResponse.json(
        { error: 'Failed to fetch user data' },
        { status: 500 }
      );
    }

    const currentOrders = user.orders || [];

    // Create new order
    const newOrder = {
      id: `ORD-${Date.now()}`,
      items: orderData.items,
      total: orderData.total,
      status: 'pending',
      createdAt: new Date().toISOString(),
      shippingAddress: orderData.shippingAddress || null,
      paymentMethod: orderData.paymentMethod || null
    };

    // Add order to user's orders
    const updatedOrders = [...currentOrders, newOrder];

    const { error: updateError } = await supabase
      .from('users')
      .update({ orders: updatedOrders })
      .eq('id', auth.userId);

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      order: newOrder
    });

  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
