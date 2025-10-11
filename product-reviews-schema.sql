-- Enhanced Product Reviews Table with Foreign Key Constraints
-- Run this in Supabase SQL Editor

-- Drop existing table if exists
DROP TABLE IF EXISTS product_reviews CASCADE;

-- Create enhanced product_reviews table
CREATE TABLE public.product_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL,
  user_id UUID NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  order_id UUID NOT NULL,
  rating INTEGER NOT NULL,
  title VARCHAR(255) NULL,
  comment TEXT NULL,
  images TEXT[] NULL DEFAULT '{}'::text[],
  is_verified BOOLEAN NULL DEFAULT false,
  is_approved BOOLEAN NULL DEFAULT true, -- Auto-approve by default
  helpful_count INTEGER NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
  
  -- Primary key
  CONSTRAINT product_reviews_pkey PRIMARY KEY (id),
  
  -- Foreign key constraints
  CONSTRAINT fk_reviews_product_id FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  -- CONSTRAINT fk_reviews_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  -- CONSTRAINT fk_reviews_order_id FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  
  -- Rating constraint (1-5 stars)
  CONSTRAINT product_reviews_rating_check CHECK (
    (rating >= 1 AND rating <= 5)
  ),
  
  -- Unique constraint: One review per user per product per order
  CONSTRAINT unique_user_product_order_review UNIQUE (user_id, product_id, order_id)
) TABLESPACE pg_default;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_reviews_product ON public.product_reviews USING btree (product_id) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_reviews_user ON public.product_reviews USING btree (user_id) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_reviews_order ON public.product_reviews USING btree (order_id) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.product_reviews USING btree (rating) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON public.product_reviews USING btree (is_approved) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_reviews_verified ON public.product_reviews USING btree (is_verified) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.product_reviews USING btree (created_at) TABLESPACE pg_default;

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_product_reviews_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_reviews_updated_at_trigger
    BEFORE UPDATE ON product_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_product_reviews_updated_at();

-- Verify table creation
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'product_reviews'
ORDER BY ordinal_position;
