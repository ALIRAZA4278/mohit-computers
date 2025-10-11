-- Comments table that matches your blog UUID schema
-- Run this in Supabase SQL Editor

-- Drop existing comments table
DROP TABLE IF EXISTS comments CASCADE;

-- Create comments table with UUID support for blog_id
CREATE TABLE public.comments (
  id SERIAL PRIMARY KEY,
  blog_id UUID NOT NULL,  -- Changed to UUID to match blogs.id
  user_id UUID NULL,      -- Changed to UUID to match your user system
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  comment_text TEXT NOT NULL,
  parent_id INTEGER NULL,
  is_approved BOOLEAN DEFAULT true,
  is_admin_comment BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Foreign key constraint to blogs table
  CONSTRAINT fk_comments_blog_id FOREIGN KEY (blog_id) REFERENCES blogs(id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_comments_blog_id ON comments(blog_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);
CREATE INDEX IF NOT EXISTS idx_comments_approved ON comments(is_approved);

-- Verify table creation
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'comments' 
ORDER BY ordinal_position;
