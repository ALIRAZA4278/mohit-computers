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

// GET - Fetch all laptop upgrade options
export async function GET(request) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const optionType = searchParams.get('type'); // 'ram' or 'ssd'
    const activeOnly = searchParams.get('active') === 'true';

    let query = supabase
      .from('laptop_upgrade_options')
      .select('*')
      .order('display_order', { ascending: true });

    if (optionType) {
      query = query.eq('option_type', optionType);
    }

    if (activeOnly) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ success: true, options: data || [] });
  } catch (error) {
    console.error('Error fetching laptop upgrade options:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch upgrade options' },
      { status: 500 }
    );
  }
}

// POST - Create new upgrade option (admin only)
export async function POST(request) {
  try {
    const supabase = createClient();

    // Check if user is admin
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const { data, error } = await supabase
      .from('laptop_upgrade_options')
      .insert({
        ...body,
        updated_by: session.user.email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      option: data,
      message: 'Upgrade option created successfully' 
    });
  } catch (error) {
    console.error('Error creating upgrade option:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create upgrade option' },
      { status: 500 }
    );
  }
}

// PUT - Update upgrade option (admin only)
export async function PUT(request) {
  try {
    const supabase = createClient();

    // Check if user is admin
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Option ID is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('laptop_upgrade_options')
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
        updated_by: session.user.email
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      option: data,
      message: 'Upgrade option updated successfully' 
    });
  } catch (error) {
    console.error('Error updating upgrade option:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update upgrade option' },
      { status: 500 }
    );
  }
}

// DELETE - Delete upgrade option (admin only)
export async function DELETE(request) {
  try {
    const supabase = createClient();

    // Check if user is admin
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Option ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('laptop_upgrade_options')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ 
      success: true,
      message: 'Upgrade option deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting upgrade option:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete upgrade option' },
      { status: 500 }
    );
  }
}
