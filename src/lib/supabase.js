import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl) {
  throw new Error('Missing env var: NEXT_PUBLIC_SUPABASE_URL')
}

if (!supabaseAnonKey) {
  throw new Error('Missing env var: NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Image upload function
export async function uploadImage(file, bucket = 'images') {
  try {
    // Generate unique filename with more randomness
    const fileExt = file.name.split('.').pop()
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 15)
    const fileName = `${timestamp}-${random}.${fileExt}`
    
    // Create a file path with folder structure
    const filePath = `uploads/${new Date().getFullYear()}/${new Date().getMonth() + 1}/${fileName}`
    
    console.log('Attempting to upload to bucket:', bucket, 'with path:', filePath)
    
    // Upload file to Supabase storage with options
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true, // Allow overwriting if file exists
        contentType: file.type
      })

    if (error) {
      console.error('Upload error:', error)
      
      // If RLS error, try without folder structure
      if (error.message.includes('row-level security') || error.message.includes('policy')) {
        console.log('RLS error detected, trying alternative upload...')
        
        const simpleFileName = `${timestamp}-${random}.${fileExt}`
        const { data: retryData, error: retryError } = await supabase.storage
          .from(bucket)
          .upload(simpleFileName, file, {
            cacheControl: '3600',
            upsert: true
          })
          
        if (retryError) {
          throw new Error(`Storage upload failed: ${retryError.message}. Please check storage bucket policies.`)
        }
        
        // Get public URL for retry
        const { data: publicData } = supabase.storage
          .from(bucket)
          .getPublicUrl(simpleFileName)

        return {
          success: true,
          url: publicData.publicUrl,
          fileName: simpleFileName,
          path: retryData.path
        }
      }
      
      throw error
    }

    // Get public URL
    const { data: publicData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    return {
      success: true,
      url: publicData.publicUrl,
      fileName: fileName,
      path: data.path
    }
  } catch (error) {
    console.error('Error uploading image:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Delete image function
export async function deleteImage(fileName, bucket = 'images') {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName])

    if (error) {
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error('Error deleting image:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Get all images from bucket
export async function listImages(bucket = 'images') {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list('', {
        limit: 100,
        offset: 0
      })

    if (error) {
      throw error
    }

    return {
      success: true,
      images: data
    }
  } catch (error) {
    console.error('Error listing images:', error)
    return {
      success: false,
      error: error.message
    }
  }
}