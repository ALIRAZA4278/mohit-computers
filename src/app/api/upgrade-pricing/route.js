import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Helper to create Supabase client
function createClient() {
  const cookieStore = cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
}

// GET - Fetch upgrade pricing
export async function GET() {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('upgrade_pricing')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching upgrade pricing:', error);
    return NextResponse.json(
      { error: 'Failed to fetch upgrade pricing' },
      { status: 500 }
    );
  }
}

// PUT - Update upgrade pricing (admin only)
export async function PUT(request) {
  try {
    const supabase = createClient();

    // Check if user is admin
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const { data, error } = await supabase
      .from('upgrade_pricing')
      .update({
        ...body,
        updated_at: new Date().toISOString(),
        updated_by: session.user.email
      })
      .eq('id', 1)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      data,
      message: 'Upgrade pricing updated successfully' 
    });
  } catch (error) {
    console.error('Error updating upgrade pricing:', error);
    return NextResponse.json(
      { error: 'Failed to update upgrade pricing' },
      { status: 500 }
    );
  }
}
