-- Add is_rugged_tough column to products table
-- Run this SQL in Supabase Dashboard → SQL Editor

-- Add is_rugged_tough column
ALTER TABLE products
ADD COLUMN IF NOT EXISTS is_rugged_tough BOOLEAN DEFAULT false;

-- Add comment for documentation
COMMENT ON COLUMN products.is_rugged_tough IS 'Marks product as a rugged/tough laptop for filtering';

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_products_is_rugged_tough ON products(is_rugged_tough);

-- Display success message
DO $$
BEGIN
  RAISE NOTICE '✓ Successfully added is_rugged_tough column to products table!';
END $$;
