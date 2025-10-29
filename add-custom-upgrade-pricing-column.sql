-- Add custom_upgrade_pricing column to products table
-- This column stores per-product price overrides for upgrade options

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS custom_upgrade_pricing JSONB DEFAULT '{}'::jsonb;

COMMENT ON COLUMN products.custom_upgrade_pricing IS 'Stores custom pricing overrides for upgrade options. Format: {"ram-123": 3500, "ssd-456": 8000}';

-- Create index for better JSONB query performance
CREATE INDEX IF NOT EXISTS idx_products_custom_upgrade_pricing 
ON products USING gin(custom_upgrade_pricing);
