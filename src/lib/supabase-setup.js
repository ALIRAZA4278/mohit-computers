// Automated Supabase Setup Script
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Need this for admin operations

// Initialize Supabase client with service role key for admin operations
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function setupSupabaseAutomatically() {
  const results = {
    buckets: [],
    errors: []
  }

  // Storage buckets to create
  const bucketsToCreate = [
    {
      id: 'images',
      name: 'images',
      public: true,
      fileSizeLimit: 52428800, // 50MB
      allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    },
    {
      id: 'blogs',
      name: 'blogs', 
      public: true,
      fileSizeLimit: 52428800, // 50MB
      allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    },
    {
      id: 'products',
      name: 'products',
      public: true,
      fileSizeLimit: 52428800, // 50MB
      allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    }
  ]

  // Create storage buckets
  for (const bucket of bucketsToCreate) {
    try {
      const { data, error } = await supabaseAdmin.storage.createBucket(bucket.id, {
        public: bucket.public,
        fileSizeLimit: bucket.fileSizeLimit,
        allowedMimeTypes: bucket.allowedMimeTypes
      })

      if (error) {
        if (error.message.includes('already exists')) {
          results.buckets.push({
            bucket: bucket.id,
            status: 'exists',
            message: 'Bucket already exists'
          })
        } else {
          results.errors.push({
            bucket: bucket.id,
            error: error.message
          })
        }
      } else {
        results.buckets.push({
          bucket: bucket.id,
          status: 'created',
          message: 'Bucket created successfully'
        })
      }
    } catch (error) {
      results.errors.push({
        bucket: bucket.id,
        error: error.message
      })
    }
  }

  return results
}

// Function to execute SQL schema
export async function executeSchemaSQL() {
  try {
    // We can't directly execute multi-statement SQL from the client
    // But we can try to execute individual table creations
    
    const sqlCommands = [
      // Enable UUID extension
      `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`,
      
      // User Profiles Table
      `CREATE TABLE IF NOT EXISTS user_profiles (
        id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
        full_name VARCHAR(255),
        avatar_url TEXT,
        phone VARCHAR(20),
        address JSONB DEFAULT '{}',
        date_of_birth DATE,
        gender VARCHAR(20),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );`,

      // Categories Table  
      `CREATE TABLE IF NOT EXISTS categories (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        image_url TEXT,
        parent_id UUID REFERENCES categories(id),
        sort_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );`,

      // Products Table
      `CREATE TABLE IF NOT EXISTS products (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        short_description TEXT,
        price DECIMAL(10,2) NOT NULL,
        sale_price DECIMAL(10,2),
        stock_quantity INTEGER DEFAULT 0,
        sku VARCHAR(100) UNIQUE,
        images TEXT[] DEFAULT '{}',
        category_id UUID REFERENCES categories(id),
        specifications JSONB DEFAULT '{}',
        tags TEXT[] DEFAULT '{}',
        weight DECIMAL(8,2),
        dimensions JSONB DEFAULT '{}',
        brand VARCHAR(100),
        model VARCHAR(100),
        warranty_period INTEGER,
        is_active BOOLEAN DEFAULT TRUE,
        is_featured BOOLEAN DEFAULT FALSE,
        meta_title VARCHAR(255),
        meta_description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );`,

      // Insert sample categories
      `INSERT INTO categories (name, slug, description) 
       SELECT 'Laptops', 'laptops', 'All types of laptops and notebooks'
       WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'laptops');`,

      `INSERT INTO categories (name, slug, description) 
       SELECT 'Desktops', 'desktops', 'Desktop computers and workstations'
       WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'desktops');`,

      `INSERT INTO categories (name, slug, description) 
       SELECT 'Components', 'components', 'Computer parts and components'
       WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'components');`
    ]

    const results = []
    
    for (const sql of sqlCommands) {
      try {
        const { data, error } = await supabaseAdmin.rpc('exec_sql', { sql_query: sql })
        
        results.push({
          sql: sql.substring(0, 50) + '...',
          status: error ? 'error' : 'success',
          error: error?.message
        })
      } catch (error) {
        results.push({
          sql: sql.substring(0, 50) + '...',
          status: 'error',
          error: error.message
        })
      }
    }

    return results
  } catch (error) {
    return {
      error: 'Failed to execute schema',
      message: error.message
    }
  }
}

// Main setup function
export async function autoSetupSupabase() {
  console.log('🚀 Starting automated Supabase setup...')
  
  const results = {
    buckets: null,
    schema: null,
    success: false
  }

  try {
    // Setup storage buckets
    console.log('📁 Creating storage buckets...')
    results.buckets = await setupSupabaseAutomatically()
    
    // Try to setup schema (limited functionality)
    console.log('🗄️ Setting up database schema...')
    results.schema = await executeSchemaSQL()
    
    results.success = true
    console.log('✅ Automated setup complete!')
    
  } catch (error) {
    console.error('❌ Setup failed:', error)
    results.error = error.message
  }

  return results
}