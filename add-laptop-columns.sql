-- SQL Migration Script: Add Laptop Specification Columns to Products Table
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/YOUR_PROJECT/sql/new

-- Add laptop-specific columns to products table
DO $$
BEGIN
  -- Add processor column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                WHERE table_name='products' AND column_name='processor') THEN
    ALTER TABLE products ADD COLUMN processor VARCHAR(255);
    RAISE NOTICE 'Added processor column';
  END IF;

  -- Add generation column (e.g., "4th Gen", "10th Gen")
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                WHERE table_name='products' AND column_name='generation') THEN
    ALTER TABLE products ADD COLUMN generation VARCHAR(100);
    RAISE NOTICE 'Added generation column';
  END IF;

  -- Add ram column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                WHERE table_name='products' AND column_name='ram') THEN
    ALTER TABLE products ADD COLUMN ram VARCHAR(100);
    RAISE NOTICE 'Added ram column';
  END IF;

  -- Add storage column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                WHERE table_name='products' AND column_name='storage') THEN
    ALTER TABLE products ADD COLUMN storage VARCHAR(255);
    RAISE NOTICE 'Added storage column';
  END IF;

  -- Add hdd column (for backwards compatibility)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                WHERE table_name='products' AND column_name='hdd') THEN
    ALTER TABLE products ADD COLUMN hdd VARCHAR(255);
    RAISE NOTICE 'Added hdd column';
  END IF;

  -- Add display column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                WHERE table_name='products' AND column_name='display') THEN
    ALTER TABLE products ADD COLUMN display VARCHAR(255);
    RAISE NOTICE 'Added display column';
  END IF;

  -- Add graphics column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                WHERE table_name='products' AND column_name='graphics') THEN
    ALTER TABLE products ADD COLUMN graphics VARCHAR(255);
    RAISE NOTICE 'Added graphics column';
  END IF;

  -- Add operating_system column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                WHERE table_name='products' AND column_name='operating_system') THEN
    ALTER TABLE products ADD COLUMN operating_system VARCHAR(100);
    RAISE NOTICE 'Added operating_system column';
  END IF;

  -- Add battery column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                WHERE table_name='products' AND column_name='battery') THEN
    ALTER TABLE products ADD COLUMN battery VARCHAR(255);
    RAISE NOTICE 'Added battery column';
  END IF;

  -- Add condition column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                WHERE table_name='products' AND column_name='condition') THEN
    ALTER TABLE products ADD COLUMN condition VARCHAR(100);
    RAISE NOTICE 'Added condition column';
  END IF;

  -- Add warranty column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                WHERE table_name='products' AND column_name='warranty') THEN
    ALTER TABLE products ADD COLUMN warranty VARCHAR(255);
    RAISE NOTICE 'Added warranty column';
  END IF;

  -- Add in_stock column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                WHERE table_name='products' AND column_name='in_stock') THEN
    ALTER TABLE products ADD COLUMN in_stock BOOLEAN DEFAULT TRUE;
    RAISE NOTICE 'Added in_stock column';
  END IF;

  -- Add featured column (if not exists from is_featured)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                WHERE table_name='products' AND column_name='featured') THEN
    ALTER TABLE products ADD COLUMN featured BOOLEAN DEFAULT FALSE;
    RAISE NOTICE 'Added featured column';
  END IF;

  -- Add featured_image column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                WHERE table_name='products' AND column_name='featured_image') THEN
    ALTER TABLE products ADD COLUMN featured_image TEXT;
    RAISE NOTICE 'Added featured_image column';
  END IF;

  -- Add image column (for backwards compatibility)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                WHERE table_name='products' AND column_name='image') THEN
    ALTER TABLE products ADD COLUMN image TEXT;
    RAISE NOTICE 'Added image column';
  END IF;

  -- Add original_price column (for sale price comparison)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                WHERE table_name='products' AND column_name='original_price') THEN
    ALTER TABLE products ADD COLUMN original_price DECIMAL(10,2);
    RAISE NOTICE 'Added original_price column';
  END IF;

  -- Add category column (string) for backwards compatibility
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                WHERE table_name='products' AND column_name='category') THEN
    ALTER TABLE products ADD COLUMN category VARCHAR(100);
    RAISE NOTICE 'Added category column';
  END IF;

END $$;

-- Optional: Sync is_featured to featured column if needed
UPDATE products SET featured = is_featured WHERE featured IS NULL;

-- Optional: Set default values for new columns
UPDATE products SET in_stock = TRUE WHERE in_stock IS NULL;
UPDATE products SET featured = FALSE WHERE featured IS NULL;

-- Display success message
DO $$
BEGIN
  RAISE NOTICE 'Migration completed successfully!';
  RAISE NOTICE 'All laptop specification columns have been added to the products table.';
END $$;
