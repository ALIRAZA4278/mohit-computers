import { NextResponse } from 'next/server'
import { authAPI } from '@/lib/supabase-db'

export async function POST(request) {
  try {
    const { email, password, full_name, phone } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const { data, error } = await authAPI.signUp(email, password, {
      full_name,
      phone
    })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Registration successful! Please check your email to verify your account.',
      user: data.user
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}