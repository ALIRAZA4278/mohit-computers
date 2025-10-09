-- Add in_stock column to products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS in_stock BOOLEAN DEFAULT true;

-- Set all existing products to in_stock = true by default
UPDATE products
SET in_stock = true
WHERE in_stock IS NULL;
