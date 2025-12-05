-- SQL Migration: Add Apple MacBook specific columns to products table
-- Run this in Supabase SQL Editor

-- Apple MacBook specific fields
ALTER TABLE products ADD COLUMN IF NOT EXISTS apple_model TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS apple_processor TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS apple_ram TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS apple_storage TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS apple_screen_size TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS apple_display TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS apple_graphics TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS apple_condition TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS show_apple_customizer BOOLEAN DEFAULT true;

-- Apple SSD Upgrade Pricing (JSONB for processor-based pricing)
-- Structure: { "512GB": { "intel": 5000, "m1": 6000, "m2": 7000, "m3": 8000, "m4": 9000 }, "1TB": {...}, "2TB": {...} }
ALTER TABLE products ADD COLUMN IF NOT EXISTS apple_ssd_upgrades JSONB;

-- Add comments for documentation
COMMENT ON COLUMN products.apple_model IS 'MacBook Air or MacBook Pro';
COMMENT ON COLUMN products.apple_processor IS 'Apple processor type: Intel, M1, M2, M3, M4';
COMMENT ON COLUMN products.apple_ram IS 'Apple Unified Memory: 8GB, 16GB, 32GB+';
COMMENT ON COLUMN products.apple_storage IS 'Apple SSD Storage: 256GB, 512GB, 1TB+';
COMMENT ON COLUMN products.apple_screen_size IS 'Apple Screen Size: 13", 14", 15-16"';
COMMENT ON COLUMN products.apple_display IS 'Apple Display Type: Retina, Liquid Retina, XDR';
COMMENT ON COLUMN products.apple_graphics IS 'Apple Graphics: Intel Graphics, Apple GPU';
COMMENT ON COLUMN products.apple_condition IS 'Apple Condition: New, A-Grade Used, B-Grade Used';
COMMENT ON COLUMN products.show_apple_customizer IS 'Whether to show Apple customizer on product page';
COMMENT ON COLUMN products.apple_ssd_upgrades IS 'JSONB: SSD upgrade prices by processor type';

-- Verify columns were added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'products'
AND (column_name LIKE 'apple_%' OR column_name = 'show_apple_customizer')
ORDER BY column_name;
