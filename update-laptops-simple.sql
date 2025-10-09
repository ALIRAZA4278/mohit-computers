-- Step 1: Add description column if not exists
ALTER TABLE products
ADD COLUMN IF NOT EXISTS description TEXT;

-- Step 2: Update Dell laptops (2 images) - REPLACE existing images
UPDATE products
SET
  description = 'Experience powerful performance with this Dell laptop featuring ' || COALESCE(processor, 'powerful processor') || ', ' || COALESCE(ram, '8GB RAM') || ' of RAM, and ' || COALESCE(hdd, '256GB SSD') || '. Perfect for students, professionals, and everyday computing needs. Contact Mohit Computers for best prices!',
  featured_image = 'https://myshop.pk/pub/media/catalog/product/cache/26f8091d81cea4b38d820a1d1a4f62be/_/d/_dell_-myshop-pk-2_3_1.jpg',
  images = ARRAY['https://myshop.pk/pub/media/catalog/product/cache/26f8091d81cea4b38d820a1d1a4f62be/_/d/_dell_-myshop-pk-2_3_1.jpg','https://myshop.pk/pub/media/catalog/product/cache/26f8091d81cea4b38d820a1d1a4f62be/_/d/_dell_-myshop-pk-3_3_1.jpg', 'https://myshop.pk/pub/media/catalog/product/cache/26f8091d81cea4b38d820a1d1a4f62be/_/d/_dell_-myshop-pk-6_2_1.jpg', 'https://myshop.pk/pub/media/catalog/product/cache/26f8091d81cea4b38d820a1d1a4f62be/_/d/_dell_-myshop-pk-1_3_1.jpg']
WHERE (category_id = 'laptop' OR category_id = 'used-laptop' OR category_id = 'chromebook')
  AND LOWER(COALESCE(brand, '')) LIKE '%dell%';

-- Step 3: Update HP laptops (2 images) - REPLACE existing images
UPDATE products
SET
  description = 'Discover reliability with this HP laptop powered by ' || COALESCE(processor, 'powerful processor') || ', ' || COALESCE(ram, '8GB RAM') || ' RAM, and ' || COALESCE(hdd, '256GB SSD') || '. Designed for professionals and students. Great value at Mohit Computers!',
  featured_image = 'https://myshop.pk/pub/media/catalog/product/cache/26f8091d81cea4b38d820a1d1a4f62be/_/h/_hp-fd0532_-myshop-pk-4.jpg',
  images = ARRAY['https://myshop.pk/pub/media/catalog/product/cache/26f8091d81cea4b38d820a1d1a4f62be/_/h/_hp-fd0532_-myshop-pk-4.jpg','https://myshop.pk/pub/media/catalog/product/cache/26f8091d81cea4b38d820a1d1a4f62be/_/h/_hp-fd0532_-myshop-pk-3.jpg', 'https://myshop.pk/pub/media/catalog/product/cache/26f8091d81cea4b38d820a1d1a4f62be/_/h/_hp-fd0532_-myshop-pk-5.jpg']
WHERE (category_id = 'laptop' OR category_id = 'used-laptop' OR category_id = 'chromebook')
  AND LOWER(COALESCE(brand, '')) LIKE '%hp%';

-- Step 4: Update Lenovo laptops (2 images) - REPLACE existing images
UPDATE products
SET
  description = 'Unleash productivity with this Lenovo laptop equipped with ' || COALESCE(processor, 'powerful processor') || ', ' || COALESCE(ram, '8GB RAM') || ' memory, and ' || COALESCE(hdd, '256GB SSD') || '. Renowned for durability and innovation. Best deals at Mohit Computers!',
  featured_image = 'https://myshop.pk/pub/media/catalog/product/cache/26f8091d81cea4b38d820a1d1a4f62be/_/h/_hp-v14_-myshop-pk-5.jpg',
  images = ARRAY['https://myshop.pk/pub/media/catalog/product/cache/26f8091d81cea4b38d820a1d1a4f62be/_/h/_hp-v14_-myshop-pk-5.jpg','https://myshop.pk/pub/media/catalog/product/cache/26f8091d81cea4b38d820a1d1a4f62be/_/h/_hp-v14_-myshop-pk-6.jpg']
WHERE (category_id = 'laptop' OR category_id = 'used-laptop' OR category_id = 'chromebook')
  AND LOWER(COALESCE(brand, '')) LIKE '%lenovo%';

-- Step 5: Update Asus laptops (2 images) - REPLACE existing images
UPDATE products
SET
  description = 'Elevate your computing with this ASUS laptop featuring ' || COALESCE(processor, 'powerful processor') || ', ' || COALESCE(ram, '8GB RAM') || ' of RAM, and ' || COALESCE(hdd, '256GB SSD') || '. Perfect for gamers and power users. Available at Mohit Computers!',
  featured_image = 'https://myshop.pk/pub/media/catalog/product/cache/26f8091d81cea4b38d820a1d1a4f62be/a/s/asus_myshop-pk-1_61.jpg',
  images = ARRAY['https://myshop.pk/pub/media/catalog/product/cache/26f8091d81cea4b38d820a1d1a4f62be/a/s/asus_myshop-pk-1_61.jpg','https://myshop.pk/pub/media/catalog/product/cache/26f8091d81cea4b38d820a1d1a4f62be/a/s/asus_myshop-pk-2_60.jpg']
WHERE (category_id = 'laptop' OR category_id = 'used-laptop' OR category_id = 'chromebook')
  AND LOWER(COALESCE(brand, '')) LIKE '%asus%';

-- Step 6: Update Acer laptops (2 images) - REPLACE existing images
UPDATE products
SET
  description = 'Boost productivity with this Acer laptop powered by ' || COALESCE(processor, 'powerful processor') || ', ' || COALESCE(ram, '8GB RAM') || ' RAM, and ' || COALESCE(hdd, '256GB SSD') || '. Great value for students and professionals. Shop at Mohit Computers!',
  featured_image = 'https://myshop.pk/pub/media/catalog/product/cache/26f8091d81cea4b38d820a1d1a4f62be/_/n/_nitro_-myshop-pk-2_2.jpg',
  images = ARRAY['https://myshop.pk/pub/media/catalog/product/cache/26f8091d81cea4b38d820a1d1a4f62be/_/n/_nitro_-myshop-pk-2_2.jpg','https://myshop.pk/pub/media/catalog/product/cache/26f8091d81cea4b38d820a1d1a4f62be/_/n/_nitro_-myshop-pk-4_2.jpg']
WHERE (category_id = 'laptop' OR category_id = 'used-laptop' OR category_id = 'chromebook')
  AND LOWER(COALESCE(brand, '')) LIKE '%acer%';

-- Step 7: Update Apple/MacBook (2 images) - REPLACE existing images
UPDATE products
SET
  description = 'Experience premium computing with this Apple MacBook featuring ' || COALESCE(processor, 'M1/M2 chip') || ', ' || COALESCE(ram, '8GB') || ' unified memory, and ' || COALESCE(hdd, '256GB SSD') || '. The choice of creative professionals. Available at Mohit Computers!',
  featured_image = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
  images = ARRAY['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800','https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800']
WHERE (category_id = 'laptop' OR category_id = 'used-laptop' OR category_id = 'chromebook')
  AND (LOWER(COALESCE(brand, '')) LIKE '%apple%' OR LOWER(COALESCE(brand, '')) LIKE '%macbook%');

-- Step 8: Update remaining laptops (generic) - REPLACE existing images
UPDATE products
SET
  description = 'Powerful laptop featuring ' || COALESCE(processor, 'modern processor') || ', ' || COALESCE(ram, '8GB RAM') || ' RAM, and ' || COALESCE(hdd, '256GB SSD') || '. Perfect for everyday computing, work, and entertainment. Best prices at Mohit Computers Pakistan!',
  featured_image = 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
  images = ARRAY['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800']
WHERE (category_id = 'laptop' OR category_id = 'used-laptop' OR category_id = 'chromebook')
  AND description IS NULL;

-- Step 9: Verify results
SELECT
  COUNT(*) as total_laptops,
  COUNT(CASE WHEN description IS NOT NULL THEN 1 END) as with_description,
  COUNT(CASE WHEN featured_image IS NOT NULL THEN 1 END) as with_image,
  COUNT(CASE WHEN images IS NOT NULL THEN 1 END) as with_images_array,
  COUNT(CASE WHEN description IS NOT NULL AND featured_image IS NOT NULL THEN 1 END) as complete
FROM products
WHERE category_id IN ('laptop', 'used-laptop', 'chromebook');

-- Step 10: Sample results
SELECT name, brand,
       SUBSTRING(description, 1, 80) || '...' as description_preview,
       featured_image,
       array_length(images, 1) as image_count
FROM products
WHERE category_id IN ('laptop', 'used-laptop', 'chromebook')
  AND description IS NOT NULL
LIMIT 10;
