import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { sendUserPasswordResetEmail } from '@/lib/nodemailer';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Generate random password
function generatePassword(length = 12) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

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
      .select('email, name')
      .eq('email', email)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { success: false, message: 'Email not found in our records' },
        { status: 404 }
      );
    }

    // Generate new temporary password
    const newPassword = generatePassword(12);

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password in database
    const { error: updateError } = await supabase
      .from('users')
      .update({ password: hashedPassword })
      .eq('email', email);

    if (updateError) {
      console.error('Error updating password:', updateError);
      return NextResponse.json(
        { success: false, message: 'Failed to reset password' },
        { status: 500 }
      );
    }

    // Send new password via email
    const emailResult = await sendUserPasswordResetEmail(user.email, newPassword, user.name);

    if (!emailResult.success) {
      return NextResponse.json(
        { success: false, message: 'Failed to send password email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'A new password has been sent to your email'
    });
  } catch (error) {
    console.error('Error in user forgot password:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process forgot password request' },
      { status: 500 }
    );
  }
}
