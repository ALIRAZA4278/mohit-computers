import { NextResponse } from 'next/server';
import { blogsAPI, supabase } from '@/lib/supabase-db';

// GET - Fetch all blogs (Admin - including drafts)
export async function GET() {
  try {
    // Get all blogs regardless of status for admin
    const { data: blogs, error } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching blogs:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch blogs' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      blogs: blogs || []
    })
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blogs' },
      { status: 500 }
    )
  }
}

// POST - Create new blog
export async function POST(request) {
  try {
    const body = await request.json()

    // Helper to generate slug
    const generateSlug = (title) => {
      if (!title) return ''
      return title
        .toString()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
    }

    let slug = generateSlug(body.title || 'untitled')

    // Ensure slug uniqueness
    let slugCounter = 1
    let uniqueSlug = slug
    
    // Keep checking until we find a unique slug
    while (true) {
      const { data: existingBlog } = await supabase
        .from('blogs')
        .select('slug')
        .eq('slug', uniqueSlug)
        .single()
      
      if (!existingBlog) {
        slug = uniqueSlug
        break
      } else {
        uniqueSlug = `${slug}-${slugCounter}`
        slugCounter++
      }
    }

    // Prepare blog data
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
      author_name: 'Admin',
      slug,
      reading_time: Math.ceil((body.content || '').split(' ').length / 200), // Estimate reading time
      meta_title: body.title,
      meta_description: body.excerpt || body.title
    }

    // Set published_at if status is published
    if (blogData.status === 'published') {
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
      blog,
      message: 'Blog created successfully in Supabase!' 
    })

  } catch (error) {
    console.error('Error creating blog:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create blog' },
      { status: 500 }
    )
  }
}