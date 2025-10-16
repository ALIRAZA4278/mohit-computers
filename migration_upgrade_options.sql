-- Migration for Dynamic Upgrade Options System
-- This migration adds columns to support generation-based RAM upgrades and storage-based SSD upgrades

-- Step 1: Add upgrade_options column if it doesn't exist
-- This stores the upgrade options (RAM and SSD) with their prices
ALTER TABLE products
ADD COLUMN IF NOT EXISTS upgrade_options JSONB DEFAULT '{}'::JSONB;

-- Step 2: Add custom_upgrades column if it doesn't exist
-- This stores custom upgrade options added manually by admin
ALTER TABLE products
ADD COLUMN IF NOT EXISTS custom_upgrades JSONB DEFAULT '[]'::JSONB;

-- Step 3: Create GIN indexes for faster JSON queries
CREATE INDEX IF NOT EXISTS idx_products_upgrade_options
ON products USING GIN (upgrade_options);

CREATE INDEX IF NOT EXISTS idx_products_custom_upgrades
ON products USING GIN (custom_upgrades);

-- Step 4: Update existing laptop products to have empty upgrade options if NULL
UPDATE products
SET upgrade_options = '{}'::JSONB
WHERE category_id = 'laptop' AND upgrade_options IS NULL;

UPDATE products
SET custom_upgrades = '[]'::JSONB
WHERE category_id = 'laptop' AND custom_upgrades IS NULL;

-- Example data structure for upgrade_options:
-- {
--   "ram": [
--     {
--       "capacity": "4GB",
--       "label": "4GB DDR3",
--       "price": 1000,
--       "enabled": true
--     },
--     {
--       "capacity": "8GB",
--       "label": "8GB DDR3",
--       "price": 2500,
--       "enabled": true
--     }
--   ],
--   "ssd": [
--     {
--       "capacity": "256GB",
--       "label": "Upgrade to 256GB SSD",
--       "price": 3000,
--       "from": "128GB",
--       "enabled": true
--     },
--     {
--       "capacity": "512GB",
--       "label": "Upgrade to 512GB SSD",
--       "price": 8000,
--       "from": "128GB",
--       "enabled": true
--     }
--   ]
-- }

-- Example data structure for custom_upgrades:
-- [
--   {
--     "type": "storage",
--     "label": "Premium",
--     "capacity": "1TB SSD",
--     "price": 15000
--   },
--   {
--     "type": "memory",
--     "label": "Ultimate",
--     "capacity": "64GB DDR4",
--     "price": 20000
--   }
-- ]

-- Verify the changes
SELECT
    id,
    name,
    category_id,
    generation,
    hdd,
    ram,
    upgrade_options,
    custom_upgrades
FROM products
WHERE category_id = 'laptop'
LIMIT 5;

COMMENT ON COLUMN products.upgrade_options IS 'JSONB column storing dynamic upgrade options for RAM and SSD based on generation and current storage';
COMMENT ON COLUMN products.custom_upgrades IS 'JSONB array storing custom/manual upgrade options added by admin';
