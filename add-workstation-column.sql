-- Add is_workstation column to products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS is_workstation BOOLEAN DEFAULT false;

-- Update existing products: you can manually mark workstation products later
-- Or if you want to automatically mark products with category_id='workstation'
UPDATE products
SET is_workstation = true
WHERE category_id = 'workstation';
