import connectToDatabase from '../../../../../lib/mongodb';
import Blog from '../../../../../models/Blog';
import { NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import path from 'path';

// Helper function to delete image file
async function deleteImageFile(imageUrl) {
  try {
    if (!imageUrl) return;
    
    const filename = imageUrl.split('/').pop();
    if (filename) {
      const filePath = path.join(process.cwd(), 'public', 'uploads', 'blogs', filename);
      await unlink(filePath);
      console.log('File deleted successfully:', filePath);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
  }
}

// GET - Fetch single blog
export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    const blog = await Blog.findById(params.id);
    
    if (!blog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      );
    }

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

// PUT - Update blog
export async function PUT(request, { params }) {
  try {
    const body = await request.json();
    await connectToDatabase();

    const blog = await Blog.findByIdAndUpdate(
      params.id,
      {
        title: body.title,
        content: body.content,
        excerpt: body.excerpt,
        category: body.category || 'Tech Guides',
        tags: body.tags || [],
        status: body.status || 'draft',
        featured: body.featured || false,
        featuredImage: body.featuredImage || '',
        images: body.images || [],
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!blog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      blog,
      message: 'Blog updated successfully' 
    });
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update blog' },
      { status: 500 }
    );
  }
}

// DELETE - Delete blog
export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();
    
    // First get the blog to access its images
    const blog = await Blog.findById(params.id);

    if (!blog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Delete associated image files
    if (blog.featuredImage) {
      await deleteImageFile(blog.featuredImage);
    }
    
    if (blog.images && blog.images.length > 0) {
      for (const imageUrl of blog.images) {
        await deleteImageFile(imageUrl);
      }
    }

    // Delete the blog from database
    await Blog.findByIdAndDelete(params.id);

    return NextResponse.json({ 
      success: true,
      message: 'Blog and associated images deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete blog' },
      { status: 500 }
    );
  }
}