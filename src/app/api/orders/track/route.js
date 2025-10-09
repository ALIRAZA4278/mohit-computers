import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Track order by order_id (public endpoint - no auth required)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('order_id');

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Find order by order_id
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (error || !order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    // Parse order_items JSON
    const orderWithParsedItems = {
      ...order,
      order_items: typeof order.order_items === 'string'
        ? JSON.parse(order.order_items)
        : order.order_items
    };

    return NextResponse.json({
      success: true,
      order: orderWithParsedItems
    });

  } catch (error) {
    console.error('Error tracking order:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
