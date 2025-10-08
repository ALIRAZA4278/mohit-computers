-- Minimal Products Table Schema for CSV Import
-- Copy this and run in Supabase SQL Editor

-- Drop existing products table if exists
DROP TABLE IF EXISTS products CASCADE;

-- Create minimal products table - no required fields except basics
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255),
  slug VARCHAR(255),
  price DECIMAL(10,2) DEFAULT 0,
  category_id VARCHAR(100),
  brand VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  
  -- Product Images
  images TEXT[] DEFAULT '{}',
  featured_image TEXT,
  
  -- CSV Import Fields - All Optional
  processor VARCHAR(255),
  generation VARCHAR(50),
  ram VARCHAR(100),
  hdd VARCHAR(100),
  display_size VARCHAR(50),
  resolution VARCHAR(100),
  integrated_graphics VARCHAR(255),
  discrete_graphics VARCHAR(255),
  touch_type VARCHAR(100),
  operating_features TEXT,
  extra_features TEXT,
  condition VARCHAR(50) DEFAULT 'Good',
  battery VARCHAR(100),
  charger_included BOOLEAN DEFAULT false,
  warranty VARCHAR(100),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_condition ON products(condition);
CREATE INDEX IF NOT EXISTS idx_products_processor ON products(processor);

-- Function to auto-generate slug from name (only if name exists)
CREATE OR REPLACE FUNCTION generate_slug_from_name()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.name IS NOT NULL AND NEW.name != '' AND (NEW.slug IS NULL OR NEW.slug = '') THEN
        NEW.slug := LOWER(REGEXP_REPLACE(NEW.name, '[^a-zA-Z0-9]+', '-', 'g'));
        NEW.slug := TRIM(BOTH '-' FROM NEW.slug);
        -- Add random suffix for uniqueness
        IF EXISTS (SELECT 1 FROM products WHERE slug = NEW.slug AND id != NEW.id) THEN
            NEW.slug := NEW.slug || '-' || FLOOR(RANDOM() * 10000);
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate slug
CREATE TRIGGER generate_slug_trigger
    BEFORE INSERT OR UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION generate_slug_from_name();

-- Function to auto-extract brand from name (only if name exists)
CREATE OR REPLACE FUNCTION extract_brand_from_name()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.name IS NOT NULL AND NEW.name != '' AND (NEW.brand IS NULL OR NEW.brand = '') THEN
        NEW.brand := SPLIT_PART(NEW.name, ' ', 1);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-extract brand
CREATE TRIGGER extract_brand_trigger
    BEFORE INSERT OR UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION extract_brand_from_name();

-- Sample insert to test (completely optional - you can delete this)
INSERT INTO products (name) VALUES ('Sample Product') ON CONFLICT DO NOTHING;

COMMIT;