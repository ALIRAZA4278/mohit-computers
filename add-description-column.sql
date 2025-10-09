-- Add description column to products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS description TEXT;

-- Verify column was added
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'products'
AND column_name = 'description';
