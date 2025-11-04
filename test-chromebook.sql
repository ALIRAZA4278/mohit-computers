-- Test Chromebook Product
-- Run this in Supabase SQL Editor to add a test chromebook

INSERT INTO products (
  name,
  slug,
  category_id,
  category,
  brand,
  price,
  original_price,
  description,
  processor,
  ram,
  storage,
  display_size,
  resolution,
  touch_type,
  os,
  aue_year,
  condition,
  in_stock,
  is_active,
  is_featured,
  featured_image,
  created_at,
  updated_at
) VALUES (
  'Test Chromebook RW',
  'test-chromebook-rw',
  'chromebook',
  'chromebook',
  'Dell',
  38000,
  45000,
  'Test Chromebook with all specifications filled for testing purposes. Features touchscreen display and long AUE support.',
  'Intel Celeron N4120',
  '8GB',
  '128GB SSD',
  '14"',
  'Full HD (1920x1080)',
  'Touchscreen',
  'Chrome OS',
  '2030',
  'Excellent',
  true,
  true,
  false,
  '/images/chromebook-placeholder.jpg',
  NOW(),
  NOW()
);

SELECT 'Test Chromebook RW added successfully!' as message;
