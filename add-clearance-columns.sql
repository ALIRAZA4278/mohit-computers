-- Add clearance-related columns to products table
-- Run this SQL in your Supabase SQL editor or database client

-- Add is_clearance column (boolean flag to mark products as clearance)
ALTER TABLE products
ADD COLUMN IF NOT EXISTS is_clearance BOOLEAN DEFAULT false;

-- Add clearance_reason column (optional text explaining why it's on clearance)
ALTER TABLE products
ADD COLUMN IF NOT EXISTS clearance_reason TEXT;

-- Add clearance_date column (when the product was marked for clearance)
ALTER TABLE products
ADD COLUMN IF NOT EXISTS clearance_date TIMESTAMP;

-- Add is_discounted column (boolean flag to mark products as having special discount)
ALTER TABLE products
ADD COLUMN IF NOT EXISTS is_discounted BOOLEAN DEFAULT false;

-- Add discount_percentage column (actual discount percentage for admin tracking)
ALTER TABLE products
ADD COLUMN IF NOT EXISTS discount_percentage INTEGER;

-- Create index on is_clearance for faster queries
CREATE INDEX IF NOT EXISTS idx_products_is_clearance ON products(is_clearance);

-- Create index on clearance_date for sorting
CREATE INDEX IF NOT EXISTS idx_products_clearance_date ON products(clearance_date);

-- Create index on is_discounted for faster queries
CREATE INDEX IF NOT EXISTS idx_products_is_discounted ON products(is_discounted);

-- Comments
COMMENT ON COLUMN products.is_clearance IS 'Flag to mark products as clearance items';
COMMENT ON COLUMN products.clearance_reason IS 'Optional reason why product is on clearance (e.g., "End of line", "Overstock", "Damaged box")';
COMMENT ON COLUMN products.clearance_date IS 'Date when product was marked for clearance';
COMMENT ON COLUMN products.is_discounted IS 'Flag to mark products as having special discount pricing';
COMMENT ON COLUMN products.discount_percentage IS 'Actual discount percentage (0-100) for admin tracking and display';

-- Success message
SELECT 'Successfully added clearance and discount columns to products table: is_clearance, clearance_reason, clearance_date, is_discounted, discount_percentage' AS message;