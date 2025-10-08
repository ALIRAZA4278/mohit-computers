import { NextResponse } from 'next/server'
import { autoSetupSupabase } from '@/lib/supabase-setup'

export async function POST() {
  try {
    console.log('🚀 Starting Supabase auto-setup...')
    
    // Check if service role key is available
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({
        success: false,
        error: 'SUPABASE_SERVICE_ROLE_KEY not found in environment variables',
        message: 'Please add your Supabase service role key to .env.local',
        instructions: [
          '1. Go to Supabase Dashboard → Settings → API',
          '2. Copy the "service_role" key (not anon key)',
          '3. Add to .env.local: SUPABASE_SERVICE_ROLE_KEY=your_key_here',
          '4. Restart the development server'
        ]
      }, { status: 400 })
    }

    const results = await autoSetupSupabase()

    return NextResponse.json({
      success: results.success,
      message: results.success ? 'Supabase setup completed!' : 'Setup completed with some issues',
      results: {
        buckets: results.buckets,
        schema: results.schema
      },
      manualSteps: [
        {
          step: 'Database Schema',
          status: 'manual_required',
          instructions: [
            '1. Go to Supabase Dashboard → SQL Editor',
            '2. Copy the content from supabase-schema.sql file',
            '3. Paste and click RUN to create all tables',
            '4. This will create the complete database structure'
          ]
        }
      ]
    })

  } catch (error) {
    console.error('Auto-setup error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Auto-setup failed',
      message: error.message,
      fallback: {
        title: 'Manual Setup Required',
        instructions: [
          '1. Go to Supabase Dashboard (https://supabase.com/dashboard)',
          '2. SQL Editor → Paste supabase-schema.sql → Run',
          '3. Storage → Create buckets: images, blogs, products (all public)',
          '4. Your system will be ready to use!'
        ]
      }
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Supabase Auto-Setup API',
    instructions: 'Send POST request to run automated setup',
    requirements: [
      'NEXT_PUBLIC_SUPABASE_URL in .env.local',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local', 
      'SUPABASE_SERVICE_ROLE_KEY in .env.local (for admin operations)'
    ],
    manual_alternative: [
      '1. Supabase Dashboard → SQL Editor → Run supabase-schema.sql',
      '2. Storage → Create buckets: images, blogs, products (public)',
      '3. Done!'
    ]
  })
}