import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendOrderStatusUpdateEmail } from '@/lib/nodemailer';

// Update order status (admin only)
export async function PUT(request) {
  try {
    // TODO: Add admin authentication check here

    const { order_id, order_status } = await request.json();

    if (!order_id || !order_status) {
      return NextResponse.json(
        { success: false, message: 'Order ID and status are required' },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(order_status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid order status' },
        { status: 400 }
      );
    }

    // Update order status
    const { data, error } = await supabase
      .from('orders')
      .update({ order_status })
      .eq('order_id', order_id)
      .select()
      .single();

    if (error) {
      console.error('Error updating order status:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to update order status', error: error.message },
        { status: 500 }
      );
    }

    // Parse order_items if it's a string
    const orderData = {
      ...data,
      order_items: typeof data.order_items === 'string'
        ? JSON.parse(data.order_items)
        : data.order_items
    };

    // Send status update email to customer (async, don't wait for it)
    sendOrderStatusUpdateEmail(orderData, order_status).catch(err => {
      console.error('Failed to send status update email:', err);
    });

    return NextResponse.json({
      success: true,
      message: 'Order status updated successfully',
      order: data
    });

  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
