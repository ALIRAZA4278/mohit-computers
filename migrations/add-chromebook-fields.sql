-- Migration: Add Chromebook-specific fields to products table
-- Run this in Supabase SQL Editor

-- Add AUE (Auto Update Expiration) Year field for Chromebooks
ALTER TABLE products
ADD COLUMN IF NOT EXISTS aue_year TEXT;

-- Add show_chromebook_customizer field to enable/disable customizer per product
ALTER TABLE products
ADD COLUMN IF NOT EXISTS show_chromebook_customizer BOOLEAN DEFAULT true;

-- Add comment for documentation
COMMENT ON COLUMN products.aue_year IS 'Auto Update Expiration year for Chromebooks (e.g., 2028, 2029, 2030)';
COMMENT ON COLUMN products.show_chromebook_customizer IS 'Toggle to show/hide chromebook customizer on product detail page';

-- Verify the columns were added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'products'
AND column_name IN ('aue_year', 'show_chromebook_customizer')
ORDER BY column_name;

SELECT '✅ Chromebook fields added successfully!' as status;
