-- Ultra Minimal Products Table - Absolutely No Required Fields
-- Copy this and run in Supabase SQL Editor

-- Drop existing products table if exists
DROP TABLE IF EXISTS products CASCADE;

-- Create ultra minimal products table - everything is optional
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255),
  slug VARCHAR(255),
  price DECIMAL(10,2),
  category_id VARCHAR(100),
  brand VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  
  -- Images
  images TEXT[],
  featured_image TEXT,
  
  -- Laptop specs
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
  condition VARCHAR(50),
  battery VARCHAR(100),
  charger_included BOOLEAN,
  warranty VARCHAR(100),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Basic indexes
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);

-- Auto-generate slug if name exists
CREATE OR REPLACE FUNCTION auto_generate_slug()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.name IS NOT NULL AND (NEW.slug IS NULL OR NEW.slug = '') THEN
        NEW.slug := LOWER(REGEXP_REPLACE(NEW.name, '[^a-zA-Z0-9]+', '-', 'g'));
        NEW.slug := TRIM(BOTH '-' FROM NEW.slug);
        -- Make unique
        WHILE EXISTS (SELECT 1 FROM products WHERE slug = NEW.slug AND id != COALESCE(NEW.id, gen_random_uuid())) LOOP
            NEW.slug := NEW.slug || '-' || EXTRACT(EPOCH FROM NOW())::bigint;
        END LOOP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_slug_trigger
    BEFORE INSERT OR UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION auto_generate_slug();

COMMIT;