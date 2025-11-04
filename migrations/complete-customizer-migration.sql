-- Complete Migration: Add all customizer and feature fields to products table
-- Run this in Supabase SQL Editor to add all missing columns at once

-- Chromebook specific fields
ALTER TABLE products ADD COLUMN IF NOT EXISTS aue_year TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS show_chromebook_customizer BOOLEAN DEFAULT true;

-- Laptop customizer fields (if not already added)
ALTER TABLE products ADD COLUMN IF NOT EXISTS show_laptop_customizer BOOLEAN DEFAULT true;
ALTER TABLE products ADD COLUMN IF NOT EXISTS show_ram_options BOOLEAN DEFAULT true;
ALTER TABLE products ADD COLUMN IF NOT EXISTS show_ssd_options BOOLEAN DEFAULT true;

-- Custom upgrade pricing (JSONB for flexible pricing per product)
ALTER TABLE products ADD COLUMN IF NOT EXISTS custom_upgrade_pricing JSONB;

-- Workstation and rugged laptop flags
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_workstation BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_rugged_tough BOOLEAN DEFAULT false;

-- Add comments for documentation
COMMENT ON COLUMN products.aue_year IS 'Auto Update Expiration year for Chromebooks';
COMMENT ON COLUMN products.show_chromebook_customizer IS 'Show chromebook customizer on product page';
COMMENT ON COLUMN products.show_laptop_customizer IS 'Show laptop customizer on product page';
COMMENT ON COLUMN products.show_ram_options IS 'Show RAM upgrade options in customizer';
COMMENT ON COLUMN products.show_ssd_options IS 'Show SSD upgrade options in customizer';
COMMENT ON COLUMN products.custom_upgrade_pricing IS 'Custom pricing for upgrade options per product (JSON)';
COMMENT ON COLUMN products.is_workstation IS 'Flag to identify workstation laptops';
COMMENT ON COLUMN products.is_rugged_tough IS 'Flag to identify rugged/tough laptops';

-- Verify all columns were added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'products'
AND column_name IN (
  'aue_year',
  'show_chromebook_customizer',
  'show_laptop_customizer',
  'show_ram_options',
  'show_ssd_options',
  'custom_upgrade_pricing',
  'is_workstation',
  'is_rugged_tough'
)
ORDER BY column_name;

SELECT '✅ All customizer fields added successfully!' as status;
