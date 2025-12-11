-- Add supported_ram_type column to products table
-- This field allows admin to specify which RAM type (DDR3/DDR4/DDR5) a laptop supports
-- Especially useful for 12th gen laptops which can have either DDR4 or DDR5

-- Run this in Supabase SQL Editor

ALTER TABLE products
ADD COLUMN IF NOT EXISTS supported_ram_type TEXT;

-- Add comment to explain the column
COMMENT ON COLUMN products.supported_ram_type IS 'Specifies which RAM type the laptop supports (ddr3/ddr4/ddr5). Leave empty for auto-detection based on generation. Required for 12th gen laptops to specify DDR4 or DDR5 support.';

-- Verify the column was added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'products'
AND column_name = 'supported_ram_type';
