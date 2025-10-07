import { NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import path from 'path';

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('imageUrl');

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: 'Image URL is required' },
        { status: 400 }
      );
    }

    // Extract filename from URL (e.g., '/uploads/blogs/123456-image.jpg' -> '123456-image.jpg')
    const filename = imageUrl.split('/').pop();
    
    if (!filename) {
      return NextResponse.json(
        { success: false, error: 'Invalid image URL' },
        { status: 400 }
      );
    }

    // Construct full file path
    const filePath = path.join(process.cwd(), 'public', 'uploads', 'blogs', filename);

    try {
      // Delete the file
      await unlink(filePath);
      console.log('File deleted successfully:', filePath);
    } catch (fileError) {
      console.error('Error deleting file:', fileError);
      // Even if file deletion fails, we continue (file might not exist)
    }

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully'
    });

  } catch (error) {
    console.error('Error in delete image API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}