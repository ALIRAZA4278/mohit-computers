import connectToDatabase from '../../../lib/mongodb';
import Blog from '../../../models/Blog';
import { NextResponse } from 'next/server';

// GET - Debug endpoint to check all blogs in database
export async function GET() {
  try {
    await connectToDatabase();
    
    const allBlogs = await Blog.find({});
    const publishedBlogs = await Blog.find({ status: 'published' });
    
    return NextResponse.json({ 
      success: true, 
      total: allBlogs.length,
      published: publishedBlogs.length,
      allBlogs: allBlogs.map(blog => ({
        _id: blog._id,
        title: blog.title,
        status: blog.status,
        createdAt: blog.createdAt,
        slug: blog.slug
      })),
      publishedBlogs: publishedBlogs.map(blog => ({
        _id: blog._id,
        title: blog.title,
        status: blog.status,
        createdAt: blog.createdAt,
        slug: blog.slug
      }))
    });
  } catch (error) {
    console.error('Error in debug:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}