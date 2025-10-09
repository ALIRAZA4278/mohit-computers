import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getUserFromRequest } from '@/lib/auth';
import { sendOrderConfirmationEmail, sendAdminOrderNotification } from '@/lib/nodemailer';

// Create new order
export async function POST(request) {
  try {
    const auth = getUserFromRequest(request);

    if (!auth.authenticated) {
      return NextResponse.json(
        { success: false, message: 'Please login to place an order' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      shipping_city,
      shipping_postal_code,
      order_items,
      total_amount,
      order_notes
    } = body;

    // Validation
    if (!customer_name || !customer_email || !customer_phone || !shipping_address || !shipping_city || !order_items || !total_amount) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    if (!Array.isArray(order_items) || order_items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Order must contain at least one item' },
        { status: 400 }
      );
    }

    // Insert order into database
    const { data: order, error } = await supabase
      .from('orders')
      .insert([
        {
          user_id: auth.userId,
          customer_name,
          customer_email,
          customer_phone,
          shipping_address,
          shipping_city,
          shipping_postal_code: shipping_postal_code || null,
          order_items: JSON.stringify(order_items),
          total_amount,
          payment_method: 'COD',
          order_status: 'pending',
          payment_status: 'pending',
          order_notes: order_notes || null
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating order:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to create order', error: error.message },
        { status: 500 }
      );
    }

    // Send emails (don't wait for them to complete)
    const emailData = {
      ...order,
      order_items: order_items, // Use parsed order items
      customer_phone
    };

    // Send confirmation email to customer
    sendOrderConfirmationEmail(emailData).catch(err =>
      console.error('Failed to send customer confirmation email:', err)
    );

    // Send notification email to admin
    sendAdminOrderNotification(emailData).catch(err =>
      console.error('Failed to send admin notification email:', err)
    );

    return NextResponse.json({
      success: true,
      message: 'Order placed successfully',
      order: {
        id: order.id,
        order_id: order.order_id,
        total_amount: order.total_amount,
        order_status: order.order_status,
        created_at: order.created_at
      }
    });

  } catch (error) {
    console.error('Error placing order:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}

// Get user's orders
export async function GET(request) {
  try {
    const auth = getUserFromRequest(request);

    if (!auth.authenticated) {
      return NextResponse.json(
        { success: false, message: 'Please login to view orders' },
        { status: 401 }
      );
    }

    // Get user's orders
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', auth.userId)
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
