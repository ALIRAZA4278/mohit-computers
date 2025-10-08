import { NextResponse } from 'next/server'
import { blogsAPI } from '@/lib/supabase-db'

// GET - Fetch single blog by slug
export async function GET(request, { params }) {
  try {
    const { data: blog, error } = await blogsAPI.getBySlug(params.slug)
    
    if (error || !blog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      )
    }

    // Increment view count
    await blogsAPI.incrementViews(blog.id)

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

// PUT - Update blog (Admin)
export async function PUT(request, { params }) {
  try {
    const blogData = await request.json()

    // Set published_at if status changes to published
    if (blogData.status === 'published' && !blogData.published_at) {
      blogData.published_at = new Date().toISOString()
    }

    const { data: blog, error } = await blogsAPI.update(params.slug, blogData)

    if (error) {
      console.error('Error updating blog:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to update blog' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      blog
    })

  } catch (error) {
    console.error('Update blog error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete blog (Admin)
export async function DELETE(request, { params }) {
  try {
    const { error } = await blogsAPI.delete(params.slug)

    if (error) {
      console.error('Error deleting blog:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to delete blog' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Blog deleted successfully'
    })

  } catch (error) {
    console.error('Delete blog error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}