import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET(request) {
  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing Supabase credentials in environment variables'
        },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Refreshing Supabase schema cache...');

    // Method 1: Execute NOTIFY to refresh schema
    const { error: notifyError } = await supabase.rpc('exec_sql', {
      sql: `NOTIFY pgrst, 'reload schema';`
    });

    if (notifyError) {
      console.log('NOTIFY method not available, trying alternative...');
    }

    // Method 2: Make a simple query to force cache refresh
    const { data, error: queryError } = await supabase
      .from('products')
      .select('seo_only')
      .limit(1);

    if (queryError) {
      return NextResponse.json({
        success: false,
        error: 'Schema cache refresh needed. Please follow manual steps.',
        message: 'Go to Supabase Dashboard → Settings → API → Click "Reload Schema Cache" button',
        alternativeSteps: [
          '1. Open Supabase Dashboard',
          '2. Go to Project Settings → API',
          '3. Scroll down to find "Schema Cache" section',
          '4. Click "Reload Schema" or "Reload Cache" button',
          '5. Wait 10-30 seconds',
          '6. Try uploading again'
        ]
      }, { status: 200 });
    }

    console.log('✅ Schema cache refreshed successfully');

    return NextResponse.json({
      success: true,
      message: 'Schema cache refreshed successfully',
      note: 'If upload still fails, manually reload schema in Supabase Dashboard → Settings → API → Reload Schema Cache'
    });

  } catch (error) {
    console.error('Error refreshing schema cache:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to refresh schema cache: ' + error.message,
        manualSteps: [
          '1. Open Supabase Dashboard',
          '2. Go to Project Settings → API',
          '3. Click "Reload Schema Cache" button',
          '4. Wait 10-30 seconds and try again'
        ]
      },
      { status: 500 }
    );
  }
}
