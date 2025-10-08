import { NextResponse } from 'next/server'
import { uploadImage, deleteImage } from '@/lib/supabase'

// Handle image upload
export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const bucket = formData.get('bucket') || 'images'

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only images are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File size too large. Maximum 5MB allowed.' },
        { status: 400 }
      )
    }

    // Try server-side upload with service role key if available
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const { createClient } = await import('@supabase/supabase-js')
        
        const supabaseAdmin = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.SUPABASE_SERVICE_ROLE_KEY
        )

        // Generate unique filename
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
        
        // Upload using service role (bypasses RLS)
        const { data, error } = await supabaseAdmin.storage
          .from(bucket)
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: true
          })

        if (error) {
          throw error
        }

        // Get public URL
        const { data: publicData } = supabaseAdmin.storage
          .from(bucket)
          .getPublicUrl(fileName)

        return NextResponse.json({
          success: true,
          url: publicData.publicUrl,
          fileName: fileName,
          message: 'Image uploaded successfully (server-side)'
        })

      } catch (adminError) {
        console.error('Admin upload failed, trying client upload:', adminError)
      }
    }

    // Fallback to client-side upload
    const result = await uploadImage(file, bucket)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      url: result.url,
      fileName: result.fileName,
      message: 'Image uploaded successfully'
    })

  } catch (error) {
    console.error('Upload API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handle image deletion
export async function DELETE(request) {
  try {
    const { fileName, bucket = 'images' } = await request.json()

    if (!fileName) {
      return NextResponse.json(
        { success: false, error: 'No fileName provided' },
        { status: 400 }
      )
    }

    const result = await deleteImage(fileName, bucket)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully'
    })

  } catch (error) {
    console.error('Delete API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}