import { NextResponse } from 'next/server';
import { blogsAPI } from '@/lib/supabase-db';
import { deleteImage } from '@/lib/supabase';

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

    // Find the blog
    const { data: blog, error: fetchError } = await blogsAPI.getById(params.id);
    if (fetchError || !blog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Delete the image from Supabase storage
    try {
      await deleteImage(imageUrl);
    } catch (error) {
      console.error('Error deleting image from storage:', error);
    }

    // Update the blog in database
    let updateData = {};
    
    if (imageType === 'featured') {
      // Remove featured image
      updateData.featured_image = '';
    } else {
      // Remove from gallery images array
      const currentImages = blog.images || [];
      updateData.images = currentImages.filter(img => img !== imageUrl);
    }

    updateData.updated_at = new Date().toISOString();

    const updatedBlog = await blogsAPI.update(params.id, updateData);

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