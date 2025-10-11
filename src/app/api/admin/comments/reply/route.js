import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-db';

// POST - Admin reply to a comment
export async function POST(request) {
  try {
    const body = await request.json();
    const { comment_id, reply_text, admin_name, admin_email, blog_id } = body;

    // Validate required fields
    if (!comment_id || !reply_text || !admin_name || !blog_id) {
      return NextResponse.json(
        { error: 'Comment ID, reply text, admin name, and blog ID are required' },
        { status: 400 }
      );
    }

    // Validate reply length
    if (reply_text.length < 3 || reply_text.length > 1000) {
      return NextResponse.json(
        { error: 'Reply must be between 3 and 1000 characters' },
        { status: 400 }
      );
    }

    // Insert admin reply
    const { data: reply, error } = await supabase
      .from('comments')
      .insert([{
        blog_id: blog_id.toString(),
        user_id: null, // Admin doesn't have user_id
        user_name: admin_name,
        user_email: admin_email || 'admin@mohitcomputers.com',
        comment_text: reply_text.trim(),
        parent_id: parseInt(comment_id),
        is_approved: true,
        is_admin_comment: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error inserting admin reply:', error);
      return NextResponse.json(
        { error: 'Failed to save reply', details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: 'Reply posted successfully',
      reply 
    }, { status: 201 });

  } catch (error) {
    console.error('Error in POST /api/admin/comments/reply:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}