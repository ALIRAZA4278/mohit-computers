-- Update upgrade_options column default to have enabled: true
-- This will affect new products being created

-- Step 1: Alter the column default for future products
ALTER TABLE products
ALTER COLUMN upgrade_options
SET DEFAULT '{
  "ram8gb": {
    "price": "",
    "enabled": true
  },
  "ssd256": {
    "price": "",
    "enabled": true
  },
  "ssd512": {
    "price": "",
    "enabled": true
  },
  "ram16gb": {
    "price": "",
    "enabled": true
  },
  "ram32gb": {
    "price": "",
    "enabled": true
  }
}'::jsonb;

-- Step 2: Update existing laptop products to have enabled: true
-- This will update all existing products
UPDATE products
SET upgrade_options = '{
  "ram8gb": {
    "price": "",
    "enabled": true
  },
  "ssd256": {
    "price": "",
    "enabled": true
  },
  "ssd512": {
    "price": "",
    "enabled": true
  },
  "ram16gb": {
    "price": "",
    "enabled": true
  },
  "ram32gb": {
    "price": "",
    "enabled": true
  }
}'::jsonb
WHERE category_id = 'laptop';

-- Step 3: Verify the changes
SELECT
    id,
    name,
    category_id,
    generation,
    hdd,
    upgrade_options,
    custom_upgrades
FROM products
WHERE category_id = 'laptop'
LIMIT 10;

-- Check the column default
SELECT
    column_name,
    column_default
FROM information_schema.columns
WHERE table_name = 'products'
AND column_name = 'upgrade_options';
