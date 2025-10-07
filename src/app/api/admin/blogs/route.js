import connectToDatabase from '../../../../lib/mongodb';
import Blog from '../../../../models/Blog';
import { NextResponse } from 'next/server';

// GET - Fetch all blogs
export async function GET() {
  try {
    await connectToDatabase();
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({ 
      success: true, 
      blogs 
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}

// POST - Create new blog
export async function POST(request) {
  try {
    const body = await request.json();
    await connectToDatabase();

    // helper to generate slug
    const generateSlug = (title) => {
      if (!title) return '';
      return title
        .toString()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    };

    let slug = generateSlug(body.title || 'untitled');

    // ensure slug uniqueness
    let existing = await Blog.findOne({ slug });
    let suffix = 1;
    while (existing) {
      const newSlug = `${slug}-${suffix}`;
      // check again
      existing = await Blog.findOne({ slug: newSlug });
      if (!existing) {
        slug = newSlug;
        break;
      }
      suffix += 1;
    }

    const blog = new Blog({
      title: body.title,
      content: body.content,
      excerpt: body.excerpt,
      category: body.category || 'Tech Guides',
      tags: body.tags || [],
      status: body.status || 'draft',
      featured: body.featured || false,
      featuredImage: body.featuredImage || '',
      images: body.images || [],
      author: 'Admin', // You can modify this to use actual user data
      slug
    });

    await blog.save();

    return NextResponse.json({ 
      success: true, 
      blog,
      message: 'Blog created successfully' 
    });
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create blog' },
      { status: 500 }
    );
  }
}