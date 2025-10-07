import connectToDatabase from '../../../../../../lib/mongodb';
import Blog from '../../../../../../models/Blog';
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

// DELETE - Remove specific image from blog
export async function DELETE(request, { params }) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('imageUrl');
    const imageType = searchParams.get('type'); // 'featured' or 'gallery'

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: 'Image URL is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find the blog
    const blog = await Blog.findById(params.id);
    if (!blog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Delete the image file from server
    await deleteImageFile(imageUrl);

    // Update the blog in database
    let updateData = {};
    
    if (imageType === 'featured') {
      // Remove featured image
      updateData.featuredImage = '';
    } else {
      // Remove from gallery images array
      updateData.images = blog.images.filter(img => img !== imageUrl);
    }

    updateData.updatedAt = Date.now();

    const updatedBlog = await Blog.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Image removed from blog successfully',
      blog: updatedBlog
    });

  } catch (error) {
    console.error('Error removing image from blog:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove image from blog' },
      { status: 500 }
    );
  }
}