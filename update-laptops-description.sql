-- Update laptop descriptions and images for all laptops without them

-- Dell Laptops
UPDATE products
SET
  description = 'Experience powerful performance with this Dell laptop featuring ' || processor || ' processor, ' || ram || ' of RAM, and ' || COALESCE(hdd, storage, 'ample storage') || '. The ' || COALESCE(display_size, display, 'vibrant display') || ' provides crystal-clear visuals for work and entertainment. Perfect for students, professionals, and everyday computing needs. This reliable Dell machine offers excellent value for money and comes with warranty support. Ideal for multitasking, browsing, office work, and light gaming. Contact Mohit Computers for the best deals in Pakistan!',
  featured_image = 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800'
WHERE (category_id = 'laptop' OR category_id = 'used-laptop' OR category_id = 'chromebook')
  AND (description IS NULL OR description = '' OR featured_image IS NULL OR featured_image = '')
  AND LOWER(brand) LIKE '%dell%';

-- HP Laptops
UPDATE products
SET
  description = 'Discover reliability and performance with this HP laptop powered by ' || processor || ' processor, ' || ram || ' RAM, and ' || COALESCE(hdd, storage, 'spacious storage') || '. The ' || COALESCE(display_size, display, 'stunning display') || ' delivers exceptional visuals. Designed for professionals, students, and home users who demand quality and durability. This HP laptop combines style with substance, offering seamless multitasking and efficient performance. Perfect for business, education, and entertainment. Get the best price at Mohit Computers Pakistan!',
  featured_image = 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800'
WHERE (category_id = 'laptop' OR category_id = 'used-laptop' OR category_id = 'chromebook')
  AND (description IS NULL OR description = '' OR featured_image IS NULL OR featured_image = '')
  AND LOWER(brand) LIKE '%hp%';

-- Lenovo Laptops
UPDATE products
SET
  description = 'Unleash productivity with this Lenovo laptop equipped with ' || processor || ' processor, ' || ram || ' memory, and ' || COALESCE(hdd, storage, 'large storage capacity') || '. The ' || COALESCE(display_size, display, 'brilliant display') || ' ensures comfortable viewing for extended work sessions. Renowned for durability and innovation, this Lenovo laptop is perfect for business professionals and creative users. Enjoy smooth performance, long battery life, and cutting-edge features. Available now at competitive prices from Mohit Computers!',
  featured_image = 'https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=800'
WHERE (category_id = 'laptop' OR category_id = 'used-laptop' OR category_id = 'chromebook')
  AND (description IS NULL OR description = '' OR featured_image IS NULL OR featured_image = '')
  AND LOWER(brand) LIKE '%lenovo%';

-- Asus Laptops
UPDATE products
SET
  description = 'Elevate your computing experience with this ASUS laptop featuring ' || processor || ' processor, ' || ram || ' of high-speed RAM, and ' || COALESCE(hdd, storage, 'generous storage') || '. The ' || COALESCE(display_size, display, 'premium display') || ' offers vivid colors and sharp details. ASUS combines innovation with reliability, making it ideal for gamers, designers, and power users. Experience superior performance, advanced cooling, and sleek design. Get yours today from Mohit Computers at unbeatable prices!',
  featured_image = 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800'
WHERE (category_id = 'laptop' OR category_id = 'used-laptop' OR category_id = 'chromebook')
  AND (description IS NULL OR description = '' OR featured_image IS NULL OR featured_image = '')
  AND LOWER(brand) LIKE '%asus%';

-- Acer Laptops
UPDATE products
SET
  description = 'Boost your productivity with this Acer laptop powered by ' || processor || ' processor, ' || ram || ' RAM, and ' || COALESCE(hdd, storage, 'ample storage space') || '. The ' || COALESCE(display_size, display, 'clear display') || ' provides excellent viewing quality. Acer laptops are known for affordability without compromising performance, making them perfect for students and budget-conscious users. Enjoy reliable computing, modern design, and great value. Shop now at Mohit Computers Pakistan!',
  featured_image = 'https://images.unsplash.com/photo-1594762645655-15c8c1ebc1d6?w=800'
WHERE (category_id = 'laptop' OR category_id = 'used-laptop' OR category_id = 'chromebook')
  AND (description IS NULL OR description = '' OR featured_image IS NULL OR featured_image = '')
  AND LOWER(brand) LIKE '%acer%';

-- Apple/MacBook
UPDATE products
SET
  description = 'Experience the pinnacle of innovation with this Apple MacBook featuring ' || processor || ' chip, ' || ram || ' unified memory, and ' || COALESCE(hdd, storage, 'ultra-fast SSD') || '. The ' || COALESCE(display_size, display, 'Retina display') || ' delivers stunning visuals with incredible detail. MacBooks are the choice of creative professionals, offering unmatched performance, battery life, and build quality. Perfect for design, development, and content creation. Available at Mohit Computers with warranty!',
  featured_image = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800'
WHERE (category_id = 'laptop' OR category_id = 'used-laptop' OR category_id = 'chromebook')
  AND (description IS NULL OR description = '' OR featured_image IS NULL OR featured_image = '')
  AND (LOWER(brand) LIKE '%apple%' OR LOWER(brand) LIKE '%macbook%');

-- Toshiba Laptops
UPDATE products
SET
  description = 'Discover reliable performance with this Toshiba laptop featuring ' || processor || ' processor, ' || ram || ' RAM, and ' || COALESCE(hdd, storage, 'spacious storage') || '. The ' || COALESCE(display_size, display, 'quality display') || ' ensures comfortable viewing. Toshiba laptops are built for durability and everyday computing, perfect for home users and small businesses. Enjoy dependable performance, long-lasting battery, and affordable pricing. Contact Mohit Computers for the best deals!',
  featured_image = 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800'
WHERE (category_id = 'laptop' OR category_id = 'used-laptop' OR category_id = 'chromebook')
  AND (description IS NULL OR description = '' OR featured_image IS NULL OR featured_image = '')
  AND LOWER(brand) LIKE '%toshiba%';

-- Generic laptops (no specific brand or other brands)
UPDATE products
SET
  description = 'Powerful and reliable laptop featuring ' || processor || ' processor, ' || ram || ' RAM, and ' || COALESCE(hdd, storage, 'sufficient storage') || '. The ' || COALESCE(display_size, display, 'clear display') || ' provides great visuals for work and entertainment. This laptop offers excellent performance for everyday computing, office work, browsing, and multimedia. Perfect for students, professionals, and home users seeking quality at an affordable price. Available now at Mohit Computers with competitive pricing and warranty support!',
  featured_image = 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800'
WHERE (category_id = 'laptop' OR category_id = 'used-laptop' OR category_id = 'chromebook')
  AND (description IS NULL OR description = '' OR featured_image IS NULL OR featured_image = '')
  AND (brand IS NULL OR brand NOT ILIKE '%dell%' AND brand NOT ILIKE '%hp%' AND brand NOT ILIKE '%lenovo%'
       AND brand NOT ILIKE '%asus%' AND brand NOT ILIKE '%acer%' AND brand NOT ILIKE '%apple%'
       AND brand NOT ILIKE '%macbook%' AND brand NOT ILIKE '%toshiba%');

-- Verify updates
SELECT
  COUNT(*) as total_laptops,
  COUNT(CASE WHEN description IS NOT NULL AND description != '' THEN 1 END) as with_description,
  COUNT(CASE WHEN featured_image IS NOT NULL AND featured_image != '' THEN 1 END) as with_image
FROM products
WHERE category_id IN ('laptop', 'used-laptop', 'chromebook');
