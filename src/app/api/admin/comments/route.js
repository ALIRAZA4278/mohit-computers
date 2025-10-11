import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-db';

// GET - Fetch all comments for admin
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const search = searchParams.get('search') || '';

    let query = supabase
      .from('comments')
      .select('*')
      .order('created_at', { ascending: false });

    // Filter by status
    if (status === 'approved') {
      query = query.eq('is_approved', true);
    } else if (status === 'pending') {
      query = query.eq('is_approved', false);
    }

    // Search functionality
    if (search) {
      query = query.or(`user_name.ilike.%${search}%,user_email.ilike.%${search}%,comment_text.ilike.%${search}%`);
    }

    // Pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data: comments, error } = await query;

    if (error) {
      console.error('Error fetching admin comments:', error);
      return NextResponse.json(
        { error: 'Failed to fetch comments', details: error },
        { status: 500 }
      );
    }

    // Get total count for pagination
    let countQuery = supabase
      .from('comments')
      .select('*', { count: 'exact', head: true });

    if (status === 'approved') {
      countQuery = countQuery.eq('is_approved', true);
    } else if (status === 'pending') {
      countQuery = countQuery.eq('is_approved', false);
    }

    if (search) {
      countQuery = countQuery.or(`user_name.ilike.%${search}%,user_email.ilike.%${search}%,comment_text.ilike.%${search}%`);
    }

    const { count, error: countError } = await countQuery;

    if (countError) {
      console.error('Error getting comments count:', countError);
    }

    return NextResponse.json({ 
      comments: comments || [], 
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    });

  } catch (error) {
    console.error('Error in GET /api/admin/comments:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update comment status (approve/reject)
export async function PUT(request) {
  try {
    const body = await request.json();
    const { comment_id, is_approved } = body;

    if (!comment_id || is_approved === undefined) {
      return NextResponse.json(
        { error: 'Comment ID and approval status are required' },
        { status: 400 }
      );
    }

    const { data: comment, error } = await supabase
      .from('comments')
      .update({ 
        is_approved,
        updated_at: new Date().toISOString()
      })
      .eq('id', comment_id)
      .select()
      .single();

    if (error) {
      console.error('Error updating comment:', error);
      return NextResponse.json(
        { error: 'Failed to update comment', details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: `Comment ${is_approved ? 'approved' : 'rejected'} successfully`,
      comment 
    });

  } catch (error) {
    console.error('Error in PUT /api/admin/comments:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete a comment
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const comment_id = searchParams.get('comment_id');

    if (!comment_id) {
      return NextResponse.json(
        { error: 'Comment ID is required' },
        { status: 400 }
      );
    }

    // First delete any replies to this comment
    const { error: repliesError } = await supabase
      .from('comments')
      .delete()
      .eq('parent_id', comment_id);

    if (repliesError) {
      console.error('Error deleting replies:', repliesError);
    }

    // Then delete the main comment
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', comment_id);

    if (error) {
      console.error('Error deleting comment:', error);
      return NextResponse.json(
        { error: 'Failed to delete comment', details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: 'Comment deleted successfully' 
    });

  } catch (error) {
    console.error('Error in DELETE /api/admin/comments:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}