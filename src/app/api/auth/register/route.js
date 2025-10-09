import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { sendWelcomeEmail } from '@/lib/nodemailer';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const {
      email,
      password,
      name,
      phone,
      address,
      address_line1,
      address_line2,
      city,
      state,
      postal_code,
      country
    } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists with email
    const { data: existingEmail } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    if (existingEmail) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Check if phone number already exists (if phone is provided)
    if (phone) {
      const { data: existingPhone } = await supabase
        .from('users')
        .select('phone')
        .eq('phone', phone)
        .single();

      if (existingPhone) {
        return NextResponse.json(
          { error: 'User with this phone number already exists' },
          { status: 400 }
        );
      }
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in database
    const { data: newUser, error: dbError } = await supabase
      .from('users')
      .insert([
        {
          email,
          password: hashedPassword,
          name: name || null,
          phone: phone || null,
          address_line1: address_line1 || address || null,
          address_line2: address_line2 || null,
          city: city || null,
          state: state || null,
          postal_code: postal_code || null,
          country: country || 'Pakistan',
          wishlist: [],
          orders: []
        }
      ])
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to create user account' },
        { status: 500 }
      );
    }

    // Send welcome email with password
    const emailResult = await sendWelcomeEmail(email, password, name);

    if (!emailResult.success) {
      console.error('Failed to send email:', emailResult.error);
      // User is created but email failed - still return success
    }

    return NextResponse.json({
      success: true,
      message: 'Registration successful! Please check your email for your login credentials.',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}