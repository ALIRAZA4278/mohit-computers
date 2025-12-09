import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// POST - Bulk add blogs
export async function POST(request) {
  try {
    const { blogs } = await request.json();

    if (!blogs || !Array.isArray(blogs)) {
      return NextResponse.json(
        { success: false, error: 'Blogs array is required' },
        { status: 400 }
      );
    }

    const processedBlogs = blogs.map(blog => {
      // Generate slug from title
      const slug = blog.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Auto-generate excerpt if not provided (first 200 chars of content)
      let excerpt = blog.excerpt;
      if (!excerpt && blog.content) {
        excerpt = blog.content
          .replace(/[#*_`\[\]]/g, '') // Remove markdown symbols
          .substring(0, 200)
          .trim() + '...';
      }

      return {
        title: blog.title,
        slug: slug,
        content: blog.content,
        excerpt: excerpt || '',
        category: blog.category || 'Tech Guides',
        tags: blog.tags || [],
        author_name: blog.author_name || 'Mohit Computers',
        featured_image: blog.featured_image || null,
        gallery_images: blog.gallery_images || [],
        is_featured: blog.is_featured || false,
        status: blog.status || 'published',
        views: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    });

    const { data, error } = await supabase
      .from('blogs')
      .insert(processedBlogs)
      .select();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: `${data.length} blog(s) added successfully`,
      blogs: data
    });
  } catch (error) {
    console.error('Error adding blogs:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to add blogs' },
      { status: 500 }
    );
  }
}
