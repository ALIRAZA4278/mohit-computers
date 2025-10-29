-- Add customizer columns to products table
-- Run this SQL in your Supabase SQL editor or database client

-- Add show_ram_customizer column (boolean flag to show/hide RAM customizer on product page)
ALTER TABLE products
ADD COLUMN IF NOT EXISTS show_ram_customizer BOOLEAN DEFAULT true;

-- Add show_laptop_customizer column (boolean flag to show/hide Laptop customizer on product page)
ALTER TABLE products
ADD COLUMN IF NOT EXISTS show_laptop_customizer BOOLEAN DEFAULT true;

-- Add ram_speed_prices column (JSON object to store custom speed upgrade prices)
ALTER TABLE products
ADD COLUMN IF NOT EXISTS ram_speed_prices JSONB DEFAULT '{"2400": 0, "2666": 0, "3200": 0}'::jsonb;

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_products_show_ram_customizer ON products(show_ram_customizer);
CREATE INDEX IF NOT EXISTS idx_products_show_laptop_customizer ON products(show_laptop_customizer);

-- Create GIN index for JSONB column for faster queries
CREATE INDEX IF NOT EXISTS idx_products_ram_speed_prices ON products USING GIN (ram_speed_prices);

-- Comments
COMMENT ON COLUMN products.show_ram_customizer IS 'Flag to show/hide RAM customizer on product detail page (default: true)';
COMMENT ON COLUMN products.show_laptop_customizer IS 'Flag to show/hide Laptop customizer (RAM/SSD upgrades) on product detail page (default: true)';
COMMENT ON COLUMN products.ram_speed_prices IS 'JSON object storing custom prices for different RAM speeds (2400, 2666, 3200 MHz)';

-- Success message
SELECT 'Successfully added customizer control columns (show_ram_customizer, show_laptop_customizer, ram_speed_prices) to products table' AS message;
