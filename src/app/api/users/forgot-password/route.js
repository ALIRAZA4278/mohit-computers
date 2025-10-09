import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendUserPasswordEmail } from '@/lib/nodemailer';

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

    // Fetch user from database
    const { data: user, error } = await supabase
      .from('users')
      .select('email, password, name')
      .eq('email', email)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { success: false, message: 'Email not found in our records' },
        { status: 404 }
      );
    }

    // Send password email
    const emailResult = await sendUserPasswordEmail(user.email, user.password, user.name);

    if (!emailResult.success) {
      return NextResponse.json(
        { success: false, message: 'Failed to send password email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Password has been sent to your email'
    });
  } catch (error) {
    console.error('Error in user forgot password:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process forgot password request' },
      { status: 500 }
    );
  }
}
