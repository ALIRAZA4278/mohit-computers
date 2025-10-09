import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendNewsletterSubscriptionEmail } from '@/lib/nodemailer';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Check if email already subscribed
    const { data: existing, error: checkError } = await supabase
      .from('newsletter_subscribers')
      .select('email')
      .eq('email', email)
      .maybeSingle();

    // Log error for debugging
    if (checkError) {
      console.error('Check error:', checkError);
      console.error('Error code:', checkError.code);
      console.error('Error message:', checkError.message);
    }

    if (existing) {
      return NextResponse.json(
        { success: false, message: 'This email is already subscribed!' },
        { status: 400 }
      );
    }

    // Add subscriber to database
    const { data: newSubscriber, error: dbError } = await supabase
      .from('newsletter_subscribers')
      .insert([{
        email,
        subscribed_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (dbError) {
      console.error('Database insert error:', dbError);
      console.error('Error code:', dbError.code);
      console.error('Error message:', dbError.message);

      // If constraint violation (duplicate email)
      if (dbError.code === '23505') {
        return NextResponse.json(
          { success: false, message: 'This email is already subscribed!' },
          { status: 400 }
        );
      }

      // If table doesn't exist
      if (dbError.code === '42P01') {
        return NextResponse.json(
          { success: false, message: 'Newsletter table not found. Please run create-newsletter-table.sql in Supabase SQL Editor first.' },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { success: false, message: `Database error: ${dbError.message}` },
        { status: 500 }
      );
    }

    // Send confirmation email
    try {
      await sendNewsletterSubscriptionEmail(email);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the subscription if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter!'
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error: ' + error.message },
      { status: 500 }
    );
  }
}
