import { NextResponse } from 'next/server';
import { blogsAPI, supabase } from '@/lib/supabase-db';

// GET - Fetch single blog (Admin)
export async function GET(request, { params }) {
  try {
    const { data: blog, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', params.id)
      .single()
    
    if (error || !blog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      blog 
    })
  } catch (error) {
    console.error('Error fetching blog:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog' },
      { status: 500 }
    )
  }
}

// PUT - Update blog
export async function PUT(request, { params }) {
  try {
    const body = await request.json()

    // Prepare blog data for Supabase
    const blogData = {
      title: body.title,
      content: body.content,
      excerpt: body.excerpt,
      category: body.category || 'Tech Guides',
      tags: body.tags || [],
      status: body.status || 'draft',
      is_featured: body.featured || false,
      featured_image: body.featuredImage || '',
      gallery_images: body.images || [],
      reading_time: Math.ceil((body.content || '').split(' ').length / 200),
      meta_title: body.title,
      meta_description: body.excerpt || body.title
    }

    // Set published_at if status changes to published
    if (blogData.status === 'published') {
      blogData.published_at = new Date().toISOString()
    }

    const { data: blog, error } = await blogsAPI.update(params.id, blogData)

    if (error) {
      console.error('Error updating blog:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to update blog' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      blog,
      message: 'Blog updated successfully in Supabase!' 
    })
  } catch (error) {
    console.error('Error updating blog:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update blog' },
      { status: 500 }
    )
  }
}

// DELETE - Delete blog
export async function DELETE(request, { params }) {
  try {
    const { error } = await blogsAPI.delete(params.id)

    if (error) {
      console.error('Error deleting blog:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to delete blog' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true,
      message: 'Blog deleted successfully from Supabase!' 
    })
  } catch (error) {
    console.error('Error deleting blog:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete blog' },
      { status: 500 }
    )
  }
}