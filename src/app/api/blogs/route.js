import { NextResponse } from 'next/server'
import { blogsAPI } from '@/lib/supabase-db'

// GET - Fetch published blogs for public view
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit')) || 50
    const featured = searchParams.get('featured')

    let result
    if (featured) {
      result = await blogsAPI.getFeatured()
    } else {
      result = await blogsAPI.getAll(limit)
    }

    const { data: blogs, error } = result

    if (error) {
      console.error('Error fetching blogs:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch blogs' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      blogs: blogs || [],
      count: blogs?.length || 0
    })

  } catch (error) {
    console.error('Error fetching blogs:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blogs' },
      { status: 500 }
    )
  }
}

// POST - Create new blog (Admin)
export async function POST(request) {
  try {
    const blogData = await request.json()

    // Generate slug if not provided
    if (!blogData.slug) {
      blogData.slug = blogData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
    }

    // Set published_at if status is published
    if (blogData.status === 'published' && !blogData.published_at) {
      blogData.published_at = new Date().toISOString()
    }

    const { data: blog, error } = await blogsAPI.create(blogData)

    if (error) {
      console.error('Error creating blog:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to create blog' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      blog
    }, { status: 201 })

  } catch (error) {
    console.error('Create blog error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}