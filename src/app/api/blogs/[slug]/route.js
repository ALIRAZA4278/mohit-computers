import connectToDatabase from '../../../../lib/mongodb';
import Blog from '../../../../models/Blog';
import { NextResponse } from 'next/server';

// GET - Fetch single blog by slug
export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    
    const blog = await Blog.findOne({ 
      slug: params.slug, 
      status: 'published' 
    });
    
    if (!blog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Increment view count
    await Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } });

    return NextResponse.json({ 
      success: true, 
      blog 
    });
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog' },
      { status: 500 }
    );
  }
}