import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST() {
  try {
    // Create comments table
    const { error: createTableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS comments (
          id SERIAL PRIMARY KEY,
          blog_id INTEGER NOT NULL,
          user_id INTEGER,
          user_name VARCHAR(255) NOT NULL,
          user_email VARCHAR(255) NOT NULL,
          comment_text TEXT NOT NULL,
          parent_id INTEGER DEFAULT NULL,
          is_approved BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Create indexes for better performance
        CREATE INDEX IF NOT EXISTS idx_comments_blog_id ON comments(blog_id);
        CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
        CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
        CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);

        -- Insert sample comments for testing
        INSERT INTO comments (blog_id, user_name, user_email, comment_text) 
        SELECT 1, 'John Doe', 'john@example.com', 'Great article! Very informative and well written.'
        WHERE NOT EXISTS (SELECT 1 FROM comments WHERE user_email = 'john@example.com' AND blog_id = 1);

        INSERT INTO comments (blog_id, user_name, user_email, comment_text) 
        SELECT 1, 'Sarah Smith', 'sarah@example.com', 'Thanks for sharing this. It helped me understand the topic better.'
        WHERE NOT EXISTS (SELECT 1 FROM comments WHERE user_email = 'sarah@example.com' AND blog_id = 1);

        INSERT INTO comments (blog_id, user_name, user_email, comment_text) 
        SELECT 1, 'Mike Johnson', 'mike@example.com', 'I have a question about the second point you mentioned. Could you elaborate?'
        WHERE NOT EXISTS (SELECT 1 FROM comments WHERE user_email = 'mike@example.com' AND blog_id = 1);
      `
    });

    if (createTableError) {
      console.error('Error creating comments table:', createTableError);
      return NextResponse.json(
        { error: 'Failed to create comments table', details: createTableError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Comments table created successfully with sample data' 
    });

  } catch (error) {
    console.error('Error in comments table setup:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
