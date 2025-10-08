-- Simple Products Table Schema for CSV Import
-- Copy this and run in Supabase SQL Editor

-- Drop existing products table if exists
DROP TABLE IF EXISTS products CASCADE;

-- Create fresh products table optimized for CSV import
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category_id VARCHAR(100) DEFAULT 'laptop',
  brand VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  
  -- Product Images (Multiple images support)
  images TEXT[] DEFAULT '{}', -- Array of image URLs
  featured_image TEXT, -- Main product image
  
  -- CSV Import Fields (Exact Match)
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
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_condition ON products(condition);
CREATE INDEX idx_products_processor ON products(processor);

-- Function to auto-generate slug from name
CREATE OR REPLACE FUNCTION generate_slug_from_name()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        NEW.slug := LOWER(REGEXP_REPLACE(NEW.name, '[^a-zA-Z0-9]+', '-', 'g'));
        NEW.slug := TRIM(BOTH '-' FROM NEW.slug);
        -- Ensure uniqueness
        WHILE EXISTS (SELECT 1 FROM products WHERE slug = NEW.slug AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)) LOOP
            NEW.slug := NEW.slug || '-' || EXTRACT(EPOCH FROM NOW())::bigint;
        END LOOP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate slug
CREATE TRIGGER generate_slug_trigger
    BEFORE INSERT OR UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION generate_slug_from_name();

-- Function to auto-extract brand from name
CREATE OR REPLACE FUNCTION extract_brand_from_name()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.brand IS NULL OR NEW.brand = '' THEN
        NEW.brand := SPLIT_PART(NEW.name, ' ', 1);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER extract_brand_trigger
    BEFORE INSERT OR UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION extract_brand_from_name();

COMMIT;