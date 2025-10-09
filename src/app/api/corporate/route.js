import { NextResponse } from 'next/server';
import { sendCorporateInquiryEmail, sendCorporateConfirmationEmail } from '@/lib/nodemailer';

export async function POST(request) {
  try {
    const { name, email, phone, whatsapp, message, interests } = await request.json();

    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: 'Name and email are required' },
        { status: 400 }
      );
    }

    const inquiryData = {
      name,
      email,
      phone,
      whatsapp,
      message,
      interests
    };

    // Send email notification to admin
    const emailResult = await sendCorporateInquiryEmail(inquiryData);

    if (!emailResult.success) {
      console.error('Failed to send email:', emailResult.error);
      return NextResponse.json(
        { success: false, message: 'Failed to send inquiry. Please try again.' },
        { status: 500 }
      );
    }

    // Send confirmation email to user
    await sendCorporateConfirmationEmail(inquiryData);

    return NextResponse.json({
      success: true,
      message: 'Thank you for your inquiry! We will contact you shortly.'
    });

  } catch (error) {
    console.error('Corporate inquiry error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process inquiry' },
      { status: 500 }
    );
  }
}
