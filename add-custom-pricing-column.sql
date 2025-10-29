-- SQL Migration: Add custom_upgrade_pricing column to products table
-- This allows individual products to override global upgrade pricing
-- Run this in Supabase SQL Editor

-- Add the custom_upgrade_pricing column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name='products'
    AND column_name='custom_upgrade_pricing'
  ) THEN
    ALTER TABLE products
    ADD COLUMN custom_upgrade_pricing JSONB DEFAULT '{}'::JSONB;

    RAISE NOTICE 'Added custom_upgrade_pricing column to products table';
  ELSE
    RAISE NOTICE 'custom_upgrade_pricing column already exists';
  END IF;
END $$;

-- Add a comment to document the column
COMMENT ON COLUMN products.custom_upgrade_pricing IS
'Stores product-specific custom upgrade pricing that overrides global laptop_upgrade_options pricing.
Format: {"ram-16-ddr4": 12000, "ssd-512": 4000}
Keys follow pattern: ram-{size}-{type} or ssd-{size}';

-- Display success message
DO $$
BEGIN
  RAISE NOTICE 'Migration completed successfully!';
  RAISE NOTICE 'Products can now have custom upgrade pricing.';
END $$;
