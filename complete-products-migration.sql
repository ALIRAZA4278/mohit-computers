-- Comprehensive Database Migration: Add All Missing Columns to Products Table
-- Run this SQL in Supabase Dashboard → SQL Editor

-- 1. Add show_ram_options column (for controlling RAM customizer visibility)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS show_ram_options BOOLEAN DEFAULT true;

COMMENT ON COLUMN products.show_ram_options IS 'Controls visibility of RAM upgrade options on product page';

-- 2. Add show_ssd_options column (for controlling SSD customizer visibility)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS show_ssd_options BOOLEAN DEFAULT true;

COMMENT ON COLUMN products.show_ssd_options IS 'Controls visibility of SSD upgrade options on product page';

-- 3. Add show_laptop_customizer column (for controlling entire laptop customizer)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS show_laptop_customizer BOOLEAN DEFAULT true;

COMMENT ON COLUMN products.show_laptop_customizer IS 'Controls visibility of laptop customizer component';

-- 4. Add show_ram_customizer column (for RAM products customizer)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS show_ram_customizer BOOLEAN DEFAULT true;

COMMENT ON COLUMN products.show_ram_customizer IS 'Controls visibility of RAM brand/speed customizer for RAM products';

-- 5. Add custom_upgrade_pricing column (for per-product pricing overrides)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS custom_upgrade_pricing JSONB DEFAULT '{}'::jsonb;

COMMENT ON COLUMN products.custom_upgrade_pricing IS 'Stores custom pricing overrides for upgrade options. Format: {"ram-123": 3500, "ssd-456": 8000}';

-- 6. Add is_workstation column (for workstation products)
ALTER TABLE products
ADD COLUMN IF NOT EXISTS is_workstation BOOLEAN DEFAULT false;

COMMENT ON COLUMN products.is_workstation IS 'Marks product as a workstation for filtering';

-- 7. Add is_rugged_tough column (for rugged/tough laptops)
ALTER TABLE products
ADD COLUMN IF NOT EXISTS is_rugged_tough BOOLEAN DEFAULT false;

COMMENT ON COLUMN products.is_rugged_tough IS 'Marks product as a rugged/tough laptop for filtering';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_show_ram_options ON products(show_ram_options);
CREATE INDEX IF NOT EXISTS idx_products_show_ssd_options ON products(show_ssd_options);
CREATE INDEX IF NOT EXISTS idx_products_is_workstation ON products(is_workstation);
CREATE INDEX IF NOT EXISTS idx_products_is_rugged_tough ON products(is_rugged_tough);
CREATE INDEX IF NOT EXISTS idx_products_custom_upgrade_pricing ON products USING gin(custom_upgrade_pricing);

-- Display success message
DO $$
BEGIN
  RAISE NOTICE 'Migration completed successfully! All columns added.';
END $$;
