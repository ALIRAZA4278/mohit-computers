-- Comments table ke liye complete SQL query
-- Ye query directly database mein run karni hai

-- Pehle purana table drop karo (agar data save karna hai to backup le lo)
DROP TABLE IF EXISTS comments CASCADE;

-- Naya table banao with correct schema
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  blog_id VARCHAR(255) NOT NULL,  -- UUID support ke liye VARCHAR
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

-- Indexes banao performance ke liye
CREATE INDEX IF NOT EXISTS idx_comments_blog_id ON comments(blog_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);
