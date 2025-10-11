-- Update existing products to have default stock values
-- This script sets default stock values for products that don't have them

-- First, add the columns if they don't exist (safe to run multiple times)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 999,
ADD COLUMN IF NOT EXISTS in_stock BOOLEAN DEFAULT true;

-- Update existing products that have NULL or 0 stock_quantity
UPDATE products 
SET stock_quantity = 999 
WHERE stock_quantity IS NULL OR stock_quantity = 0;

-- Update existing products that have NULL in_stock
-- Default to true for laptops and workstations, false for accessories, RAM, SSD, chromebook
UPDATE products 
SET in_stock = CASE 
  WHEN LOWER(category_id) IN ('accessories', 'ram', 'ssd', 'chromebook') OR 
       LOWER(category_id) LIKE '%accessory%' OR 
       LOWER(category_id) LIKE '%ram%' OR 
       LOWER(category_id) LIKE '%ssd%' OR 
       LOWER(category_id) LIKE '%chromebook%' OR
       LOWER(name) LIKE '%ram%' OR 
       LOWER(name) LIKE '%ssd%' OR 
       LOWER(name) LIKE '%chromebook%' OR
       LOWER(name) LIKE '%accessory%' OR
       LOWER(name) LIKE '%accessories%'
  THEN false
  ELSE true
END
WHERE in_stock IS NULL;

-- Set stock quantity based on category
UPDATE products 
SET stock_quantity = CASE 
  WHEN LOWER(category_id) IN ('accessories', 'ram', 'ssd', 'chromebook') OR 
       LOWER(category_id) LIKE '%accessory%' OR 
       LOWER(category_id) LIKE '%ram%' OR 
       LOWER(category_id) LIKE '%ssd%' OR 
       LOWER(category_id) LIKE '%chromebook%' OR
       LOWER(name) LIKE '%ram%' OR 
       LOWER(name) LIKE '%ssd%' OR 
       LOWER(name) LIKE '%chromebook%' OR
       LOWER(name) LIKE '%accessory%' OR
       LOWER(name) LIKE '%accessories%'
  THEN 0
  ELSE 999
END
WHERE stock_quantity IS NULL OR stock_quantity = 0;

-- Optional: Set some products as low stock for testing (uncomment if needed)
-- UPDATE products 
-- SET stock_quantity = 3 
-- WHERE id IN (SELECT id FROM products LIMIT 2);

-- Optional: Set some products as out of stock for testing (uncomment if needed)
-- UPDATE products 
-- SET stock_quantity = 0, in_stock = false 
-- WHERE id IN (SELECT id FROM products LIMIT 1);

-- Show updated products count
SELECT 
  COUNT(*) as total_products,
  COUNT(CASE WHEN stock_quantity > 0 AND in_stock = true THEN 1 END) as available_products,
  COUNT(CASE WHEN stock_quantity <= 5 AND stock_quantity > 0 THEN 1 END) as low_stock_products,
  COUNT(CASE WHEN stock_quantity = 0 OR in_stock = false THEN 1 END) as out_of_stock_products
FROM products;
