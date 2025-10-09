import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getUserFromRequest } from '@/lib/auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function PUT(request) {
  try {
    const auth = getUserFromRequest(request);

    if (!auth.authenticated) {
      return NextResponse.json(
        { error: auth.error || 'Unauthorized' },
        { status: 401 }
      );
    }

    const {
      name,
      phone,
      address_line1,
      address_line2,
      city,
      state,
      postal_code,
      country,
      current_address
    } = await request.json();

    // Update user profile
    const { data, error } = await supabase
      .from('users')
      .update({
        name: name || null,
        phone: phone || null,
        address_line1: address_line1 || null,
        address_line2: address_line2 || null,
        city: city || null,
        state: state || null,
        postal_code: postal_code || null,
        country: country || 'Pakistan',
        current_address: current_address || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', auth.userId)
      .select()
      .single();

    if (error) {
      console.error('Profile update error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return NextResponse.json(
        { error: 'Failed to update profile', details: error.message },
        { status: 500 }
      );
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = data;

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
