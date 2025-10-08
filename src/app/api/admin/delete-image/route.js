import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-db'

export async function DELETE(request) {
  try {
    const { imageUrl } = await request.json()

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: 'Image URL is required' },
        { status: 400 }
      )
    }

    // Check if it's a Supabase URL
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!imageUrl.includes(supabaseUrl)) {
      return NextResponse.json(
        { success: false, error: 'Invalid Supabase URL' },
        { status: 400 }
      )
    }

    // Extract the file path from URL
    // URL format: https://project.supabase.co/storage/v1/object/public/bucket/path/filename
    const urlParts = imageUrl.split('/storage/v1/object/public/')
    if (urlParts.length !== 2) {
      return NextResponse.json(
        { success: false, error: 'Invalid image URL format' },
        { status: 400 }
      )
    }

    const fullPath = urlParts[1] // bucket/path/filename
    const pathParts = fullPath.split('/')
    const bucket = pathParts[0]
    const filePath = pathParts.slice(1).join('/')

    console.log('🗑️ Deleting image from Supabase:', { 
      bucket, 
      filePath, 
      fullUrl: imageUrl 
    })

    // Use service role key for admin operations if available
    let supabaseClient = supabase
    const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (hasServiceKey) {
      console.log('🔑 Using service role key for deletion')
      const { createClient } = await import('@supabase/supabase-js')
      supabaseClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      )
    } else {
      console.log('⚠️ No service role key found, using anon client')
    }

    // Delete from Supabase storage
    const { error } = await supabaseClient.storage
      .from(bucket)
      .remove([filePath])

    if (error) {
      console.error('Supabase delete error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to delete image from storage' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully from Supabase storage',
      deletedPath: filePath
    })

  } catch (error) {
    console.error('Delete image API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}