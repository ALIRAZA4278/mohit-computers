import connectToDatabase from '../../../lib/mongodb';
import Blog from '../../../models/Blog';
import { NextResponse } from 'next/server';

// GET - Fetch published blogs for public view
export async function GET(request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 10;
    const page = parseInt(searchParams.get('page')) || 1;
    const skip = (page - 1) * limit;

    const blogs = await Blog.find({ status: 'published' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('title excerpt author createdAt slug featured tags category featuredImage');

    const total = await Blog.countDocuments({ status: 'published' });

    return NextResponse.json({ 
      success: true, 
      blogs,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}