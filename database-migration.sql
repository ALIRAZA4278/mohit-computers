-- Database Migration Script for CSV Import Optimization
-- Run this in Supabase SQL Editor to update existing products table

-- Remove unnecessary columns that are not in CSV
ALTER TABLE products DROP COLUMN IF EXISTS original_price;
ALTER TABLE products DROP COLUMN IF EXISTS short_description;
ALTER TABLE products DROP COLUMN IF EXISTS description;
ALTER TABLE products DROP COLUMN IF EXISTS stock_quantity;
ALTER TABLE products DROP COLUMN IF EXISTS sku;
ALTER TABLE products DROP COLUMN IF EXISTS images;
ALTER TABLE products DROP COLUMN IF EXISTS specifications;
ALTER TABLE products DROP COLUMN IF EXISTS tags;
ALTER TABLE products DROP COLUMN IF EXISTS weight;
ALTER TABLE products DROP COLUMN IF EXISTS dimensions;
ALTER TABLE products DROP COLUMN IF EXISTS model;
ALTER TABLE products DROP COLUMN IF EXISTS meta_title;
ALTER TABLE products DROP COLUMN IF EXISTS meta_description;

-- Add CSV-specific columns
ALTER TABLE products ADD COLUMN IF NOT EXISTS condition VARCHAR(50) DEFAULT 'Good';
ALTER TABLE products ADD COLUMN IF NOT EXISTS processor VARCHAR(255);
ALTER TABLE products ADD COLUMN IF NOT EXISTS generation VARCHAR(50);
ALTER TABLE products ADD COLUMN IF NOT EXISTS ram VARCHAR(100);
ALTER TABLE products ADD COLUMN IF NOT EXISTS hdd VARCHAR(100);
ALTER TABLE products ADD COLUMN IF NOT EXISTS display_size VARCHAR(50);
ALTER TABLE products ADD COLUMN IF NOT EXISTS resolution VARCHAR(100);
ALTER TABLE products ADD COLUMN IF NOT EXISTS integrated_graphics VARCHAR(255);
ALTER TABLE products ADD COLUMN IF NOT EXISTS discrete_graphics VARCHAR(255);
ALTER TABLE products ADD COLUMN IF NOT EXISTS touch_type VARCHAR(100);
ALTER TABLE products ADD COLUMN IF NOT EXISTS operating_features TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS extra_features TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS battery VARCHAR(100);
ALTER TABLE products ADD COLUMN IF NOT EXISTS charger_included BOOLEAN DEFAULT false;

-- Update warranty column if it exists with different name
ALTER TABLE products ADD COLUMN IF NOT EXISTS warranty VARCHAR(100);

-- Change category_id to VARCHAR if it's currently UUID
ALTER TABLE products ALTER COLUMN category_id TYPE VARCHAR(100);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_condition ON products(condition);
CREATE INDEX IF NOT EXISTS idx_products_processor ON products(processor);

-- Update existing products to have proper category_id values
UPDATE products SET category_id = 'laptop' WHERE category_id IS NULL OR category_id = '';

COMMIT;