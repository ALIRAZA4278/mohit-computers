import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST() {
  try {
    // Use service role key for admin operations
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Execute the ALTER TABLE command
    const { data, error } = await supabase
      .from('comments')
      .select('id')
      .limit(1);

    if (error && error.message.includes('relation "comments" does not exist')) {
      // Table doesn't exist, create it with correct schema
      const { error: createError } = await supabase.rpc('exec_sql', {
        sql: `
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
          
          CREATE INDEX IF NOT EXISTS idx_comments_blog_id ON comments(blog_id);
          CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
          CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
          CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);
        `
      });

      if (createError) {
        throw createError;
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Comments table created with VARCHAR blog_id' 
      });
    } else {
      // Table exists, alter the column type
      const { error: alterError } = await supabase.rpc('exec_sql', {
        sql: 'ALTER TABLE comments ALTER COLUMN blog_id TYPE VARCHAR(255);'
      });

      if (alterError) {
        throw alterError;
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Comments table blog_id column updated to VARCHAR(255)' 
      });
    }

  } catch (error) {
    console.error('Error updating comments table:', error);
    
    // If rpc doesn't work, try direct SQL execution
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );

      // Try using a raw SQL query
      const { error: sqlError } = await supabase
        .rpc('alter_comments_table', {});

      if (sqlError) {
        return NextResponse.json({
          error: 'Please run this SQL manually in your database:',
          sql: 'ALTER TABLE comments ALTER COLUMN blog_id TYPE VARCHAR(255);',
          originalError: error.message
        }, { status: 500 });
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Comments table updated successfully' 
      });

    } catch (finalError) {
      return NextResponse.json({
        error: 'Please run this SQL manually in your database:',
        sql: 'ALTER TABLE comments ALTER COLUMN blog_id TYPE VARCHAR(255);',
        details: finalError.message
      }, { status: 500 });
    }
  }
}
