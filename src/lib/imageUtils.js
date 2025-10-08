// Utility functions for image handling in your existing blog system

import { uploadImage, deleteImage } from './supabase'

/**
 * Upload single image and return URL
 * Use this in your blog forms
 */
export async function uploadBlogImage(file) {
  try {
    const result = await uploadImage(file, 'blogs')
    if (result.success) {
      return {
        success: true,
        url: result.url,
        fileName: result.fileName
      }
    } else {
      throw new Error(result.error)
    }
  } catch (error) {
    console.error('Blog image upload error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Upload multiple images for gallery
 */
export async function uploadGalleryImages(files) {
  try {
    const uploadPromises = Array.from(files).map(file => 
      uploadImage(file, 'gallery')
    )
    
    const results = await Promise.all(uploadPromises)
    const successfulUploads = results.filter(r => r.success)
    const failedUploads = results.filter(r => !r.success)
    
    return {
      success: successfulUploads.length > 0,
      uploaded: successfulUploads,
      failed: failedUploads,
      urls: successfulUploads.map(r => r.url)
    }
  } catch (error) {
    console.error('Gallery upload error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Replace old local uploads with Supabase URLs
 * Helper function to migrate existing images
 */
export function replaceLocalImageUrls(content, baseUrl) {
  // Replace local upload paths with Supabase URLs
  return content.replace(
    /\/uploads\/([^"'\s]+)/g, 
    `${baseUrl}/$1`
  )
}

/**
 * Extract image URLs from content for cleanup
 */
export function extractImageUrls(content) {
  const imageRegex = /https:\/\/[^"'\s]+\.(?:jpg|jpeg|png|gif|webp)/gi
  return content.match(imageRegex) || []
}

/**
 * Clean up unused images
 */
export async function cleanupUnusedImages(usedUrls, bucket = 'images') {
  try {
    // This would require admin privileges
    // Implementation depends on your cleanup strategy
    console.log('Cleanup function called for:', usedUrls)
    return { success: true }
  } catch (error) {
    console.error('Cleanup error:', error)
    return { success: false, error: error.message }
  }
}