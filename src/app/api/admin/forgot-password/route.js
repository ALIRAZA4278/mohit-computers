import { NextResponse } from 'next/server';
import { sendAdminPasswordEmail } from '@/lib/nodemailer';

export async function POST(request) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if email matches admin email
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL 

    if (email !== adminEmail) {
      return NextResponse.json(
        { success: false, message: 'Email not found in our records' },
        { status: 404 }
      );
    }

    // Get admin password from environment
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ;

    // Send password email
    await sendAdminPasswordEmail(email, adminPassword);

    return NextResponse.json({
      success: true,
      message: 'Password has been sent to your email'
    });

  } catch (error) {
    console.error('Error in forgot password:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send password email' },
      { status: 500 }
    );
  }
}
