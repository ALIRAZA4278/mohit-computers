import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// GET - Fetch all banners (admin)
export async function GET(request) {
  try {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, banners: data || [] });
  } catch (error) {
    console.error('Error fetching banners:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch banners' },
      { status: 500 }
    );
  }
}

// POST - Create new banner
export async function POST(request) {
  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('banners')
      .insert({
        title: body.title || null,
        subtitle: body.subtitle || null,
        desktop_image_url: body.desktop_image_url,
        mobile_image_url: body.mobile_image_url || null,
        link_url: body.link_url || null,
        display_order: body.display_order || 0,
        is_active: body.is_active !== false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      banner: data,
      message: 'Banner created successfully'
    });
  } catch (error) {
    console.error('Error creating banner:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create banner' },
      { status: 500 }
    );
  }
}

// PUT - Update banner
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Banner ID is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('banners')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      banner: data,
      message: 'Banner updated successfully'
    });
  } catch (error) {
    console.error('Error updating banner:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update banner' },
      { status: 500 }
    );
  }
}

// DELETE - Delete banner
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Banner ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('banners')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Banner deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting banner:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete banner' },
      { status: 500 }
    );
  }
}
