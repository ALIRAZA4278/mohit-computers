import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST() {
  try {
    // Migration to fix blog_id column type from INTEGER to VARCHAR
    const migrationSQL = `
      -- Drop the existing table if it exists and recreate with correct schema
      DROP TABLE IF EXISTS comments CASCADE;

      -- Create comments table with VARCHAR blog_id to support UUIDs
      CREATE TABLE comments (
        id SERIAL PRIMARY KEY,
        blog_id VARCHAR(255) NOT NULL,
        user_id INTEGER,
        user_name VARCHAR(255) NOT NULL,
        user_email VARCHAR(255) NOT NULL,
        comment_text TEXT NOT NULL,
        parent_id INTEGER DEFAULT NULL,
        is_approved BOOLEAN DEFAULT true,
        is_admin_comment BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Create indexes for better performance
      CREATE INDEX IF NOT EXISTS idx_comments_blog_id ON comments(blog_id);
      CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
      CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
      CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);
    `;

    const { error } = await supabase.rpc('exec_sql', {
      sql: migrationSQL
    });

    if (error) {
      console.error('Error running migration:', error);
      return NextResponse.json(
        { error: 'Failed to run migration', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Comments table migration completed successfully' 
    });

  } catch (error) {
    console.error('Error in migration:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
