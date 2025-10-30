-- ========================================
-- CLEAR PRODUCTS QUERIES
-- Use these in Supabase SQL Editor
-- ========================================

-- 1. DELETE ALL PRODUCTS (⚠️ DANGEROUS - Deletes everything!)
-- DELETE FROM products;

-- 2. DELETE ONLY TEST PRODUCTS (Safer)
-- Delete products with "Test" in name
DELETE FROM products
WHERE name ILIKE '%test%';

-- 3. DELETE PRODUCTS CREATED TODAY
DELETE FROM products
WHERE created_at::date = CURRENT_DATE;

-- 4. DELETE PRODUCTS BY SPECIFIC NAMES
DELETE FROM products
WHERE name IN ('rw', 'rw 1');

-- 5. DELETE PRODUCTS BY CATEGORY
-- DELETE FROM products WHERE category_id = 'laptop';
-- DELETE FROM products WHERE category_id = 'ram';

-- 6. DELETE RECENT PRODUCTS (Last 1 hour)
DELETE FROM products
WHERE created_at > NOW() - INTERVAL '1 hour';

-- 7. DELETE INACTIVE PRODUCTS ONLY
DELETE FROM products
WHERE is_active = false;

-- 8. DELETE ALL AND RESET SEQUENCE (Complete Clean)
-- TRUNCATE TABLE products RESTART IDENTITY CASCADE;

-- ========================================
-- VERIFICATION QUERIES
-- ========================================

-- Check how many products exist
SELECT COUNT(*) as total_products FROM products;

-- See all product names and creation dates
SELECT id, name, category_id, created_at, is_active
FROM products
ORDER BY created_at DESC
LIMIT 20;

-- Count by category
SELECT category_id, COUNT(*) as count
FROM products
GROUP BY category_id;

-- ========================================
-- SAFE PRACTICE: Always check before deleting
-- ========================================

-- Step 1: First SELECT to see what will be deleted
SELECT id, name, category_id, created_at
FROM products
WHERE created_at::date = CURRENT_DATE;

-- Step 2: If looks good, run the DELETE
-- DELETE FROM products WHERE created_at::date = CURRENT_DATE;

-- ========================================
-- SCHEMA CACHE REFRESH (for SKU issue)
-- ========================================

-- Reload Supabase PostgREST schema cache
NOTIFY pgrst, 'reload schema';

-- ========================================
-- BACKUP BEFORE DELETE (Optional but recommended)
-- ========================================

-- Create backup table
-- CREATE TABLE products_backup AS SELECT * FROM products;

-- Restore from backup
-- INSERT INTO products SELECT * FROM products_backup;

-- Drop backup table
-- DROP TABLE products_backup;
