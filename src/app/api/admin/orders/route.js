import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Get all orders (admin only)
export async function GET(request) {
  try {
    // TODO: Add admin authentication check here

    // Get all orders
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch orders', error: error.message },
        { status: 500 }
      );
    }

    // Parse order_items JSON
    const ordersWithParsedItems = orders.map(order => ({
      ...order,
      order_items: typeof order.order_items === 'string'
        ? JSON.parse(order.order_items)
        : order.order_items
    }));

    return NextResponse.json({
      success: true,
      orders: ordersWithParsedItems
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
