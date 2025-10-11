import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-db';

// GET - Fetch comments for a blog post
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const blogId = searchParams.get('blog_id');

    if (!blogId) {
      return NextResponse.json(
        { error: 'Blog ID is required' },
        { status: 400 }
      );
    }

    // Fetch comments for the blog post
    const { data: comments, error } = await supabase
      .from('comments')
      .select('*')
      .eq('blog_id', blogId.toString()) // Ensure string
      .eq('is_approved', true)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching comments:', error);
      return NextResponse.json(
        { error: 'Failed to fetch comments', details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({ comments: comments || [] });

  } catch (error) {
    console.error('Error in GET /api/comments:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Add a new comment
export async function POST(request) {
  try {
    const body = await request.json();

    const { blog_id, user_name, user_email, comment_text, user_id, parent_id } = body;

    // Validate required fields
    if (!blog_id || !user_name || !user_email || !comment_text) {
      return NextResponse.json(
        { error: 'Blog ID, user name, email, and comment text are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user_email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate comment length
    if (comment_text.length < 3 || comment_text.length > 1000) {
      return NextResponse.json(
        { error: 'Comment must be between 3 and 1000 characters' },
        { status: 400 }
      );
    }

    // Prepare comment data
    const commentData = {
      blog_id: blog_id.toString(), // Ensure string for UUID support
      user_id: user_id || null,
      user_name: user_name.trim(),
      user_email: user_email.trim().toLowerCase(),
      comment_text: comment_text.trim(),
      parent_id: parent_id || null,
      is_approved: true,
      is_admin_comment: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Insert the comment
    const { data: comment, error } = await supabase
      .from('comments')
      .insert([commentData])
      .select()
      .single();

    if (error) {
      console.error('Error inserting comment:', error);
      return NextResponse.json(
        { error: 'Failed to save comment', details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: 'Comment added successfully',
      comment 
    }, { status: 201 });

  } catch (error) {
    console.error('Error in POST /api/comments:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}