import { NextResponse } from 'next/server';
import { sendContactInquiryEmail, sendContactConfirmationEmail } from '@/lib/nodemailer';

export async function POST(request) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    const inquiryData = {
      name,
      email,
      subject,
      message
    };

    // Send email notification to admin
    const emailResult = await sendContactInquiryEmail(inquiryData);

    if (!emailResult.success) {
      console.error('Failed to send email:', emailResult.error);
      return NextResponse.json(
        { success: false, message: 'Failed to send message. Please try again.' },
        { status: 500 }
      );
    }

    // Send confirmation email to user
    await sendContactConfirmationEmail(inquiryData);

    return NextResponse.json({
      success: true,
      message: 'Thank you for contacting us! We will get back to you soon.'
    });

  } catch (error) {
    console.error('Contact inquiry error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process message' },
      { status: 500 }
    );
  }
}
