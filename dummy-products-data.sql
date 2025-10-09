-- Dummy Data for Mohit Computers Products
-- This SQL will insert sample products for Workstation, Accessories, RAM, SSD, and Chromebook categories
-- All items are OUT OF STOCK (in_stock = false) but ACTIVE (is_active = true) so they SHOW but customers CANNOT order
-- All images are from Unsplash and will work properly

-- WORKSTATION COLLECTION (4 items)
INSERT INTO products (name, brand, category_id, price, description, featured_image, is_active, in_stock, created_at, updated_at)
VALUES
('Dell Precision 7920 Workstation', 'Dell', 'workstation', 299999, 'High-performance workstation with dual Xeon processors, 64GB RAM, NVIDIA Quadro RTX 5000 graphics, 1TB NVMe SSD. Perfect for 3D modeling, video editing, and professional CAD work.', 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=800&h=600&fit=crop', true, false, NOW(), NOW()),

('HP Z8 G4 Workstation', 'HP', 'workstation', 349999, 'Ultimate professional workstation featuring dual Intel Xeon Gold processors, 128GB ECC RAM, NVIDIA RTX A6000 48GB, 2TB NVMe SSD + 4TB HDD. Ideal for rendering, simulation, and heavy computational tasks.', 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=600&fit=crop', true, false, NOW(), NOW()),

('Lenovo ThinkStation P620', 'Lenovo', 'workstation', 279999, 'AMD Ryzen Threadripper PRO 3975WX, 64GB RAM, NVIDIA Quadro RTX 4000, 1TB NVMe SSD. Excellent for content creation, engineering, and data science applications.', 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&h=600&fit=crop', true, false, NOW(), NOW()),

('Custom Built Workstation Pro', 'Mohit Computers', 'workstation', 249999, 'Custom-built workstation: Intel Core i9-13900K, 64GB DDR5 RAM, NVIDIA RTX 4080 16GB, 2TB Gen4 NVMe SSD, 850W PSU, Liquid cooling. Built and tested by our expert team with 3-year warranty.', 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=800&h=600&fit=crop', true, false, NOW(), NOW());


-- ACCESSORIES (4 items)
INSERT INTO products (name, brand, category_id, price, description, featured_image, is_active, in_stock, created_at, updated_at)
VALUES
('Logitech MX Master 3S Wireless Mouse', 'Logitech', 'accessories', 12999, 'Premium wireless mouse with 8K DPI sensor, quiet clicks, USB-C fast charging, works on glass, customizable buttons. Perfect for professionals and power users.', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=600&fit=crop', true, false, NOW(), NOW()),

('Mechanical Gaming Keyboard RGB', 'Corsair', 'accessories', 8999, 'Corsair K70 RGB mechanical keyboard with Cherry MX switches, per-key RGB lighting, aluminum frame, dedicated media controls, wrist rest included.', 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=600&fit=crop', true, false, NOW(), NOW()),

('Dell UltraSharp U2723DE 27" Monitor', 'Dell', 'accessories', 45999, '27-inch QHD (2560x1440) IPS monitor, 99% sRGB, USB-C hub with 90W power delivery, height adjustable stand, built-in speakers. Perfect for productivity and content creation.', 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&h=600&fit=crop', true, false, NOW(), NOW()),

('APC Back-UPS 1100VA UPS', 'APC', 'accessories', 8499, 'Reliable power backup with 1100VA/660W capacity, 8 outlets, surge protection, automatic voltage regulation. Protects your valuable equipment from power outages and surges.', 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=800&h=600&fit=crop', true, false, NOW(), NOW());


-- RAM (4 items)
INSERT INTO products (name, brand, category_id, price, description, featured_image, is_active, in_stock, created_at, updated_at)
VALUES
('Corsair Vengeance 32GB (2x16GB) DDR4 3200MHz', 'Corsair', 'ram', 9999, 'High-performance DDR4 RAM kit, 32GB (2x16GB), 3200MHz, CL16, XMP 2.0 support, low-profile design, lifetime warranty. Perfect for gaming and content creation.', 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&h=600&fit=crop', true, false, NOW(), NOW()),

('Kingston Fury Beast 16GB DDR4 3600MHz', 'Kingston', 'ram', 4999, 'Kingston FURY Beast 16GB DDR4 3600MHz CL17, plug-and-play overclocking, Intel XMP support, sleek heat spreader design. Great value for gaming builds.', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&h=600&fit=crop', true, false, NOW(), NOW()),

('G.Skill Trident Z5 RGB 64GB DDR5 6000MHz', 'G.Skill', 'ram', 28999, 'Premium DDR5 RAM kit, 64GB (2x32GB), 6000MHz, CL36, Intel XMP 3.0, stunning RGB lighting. Top-tier performance for latest Intel and AMD platforms.', 'https://images.unsplash.com/photo-1591238371259-1a5c8524358f?w=800&h=600&fit=crop', true, false, NOW(), NOW()),

('Crucial 8GB DDR4 2666MHz Laptop RAM', 'Crucial', 'ram', 2499, 'Reliable laptop memory upgrade, 8GB DDR4 SODIMM 2666MHz, plug-and-play installation, compatible with most laptops. Boost your laptop performance instantly.', 'https://images.unsplash.com/photo-1563642286736-4c3d29f6e0f7?w=800&h=600&fit=crop', true, false, NOW(), NOW());


-- SSD (4 items)
INSERT INTO products (name, brand, category_id, price, description, featured_image, is_active, in_stock, created_at, updated_at)
VALUES
('Samsung 980 PRO 1TB NVMe Gen4 SSD', 'Samsung', 'ssd', 11999, 'Flagship NVMe Gen4 SSD, 1TB capacity, up to 7000MB/s read speed, PCIe 4.0 x4, V-NAND technology, 5-year warranty. Perfect for gaming and professional workloads.', 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&h=600&fit=crop', true, false, NOW(), NOW()),

('WD Black SN850X 2TB NVMe SSD', 'Western Digital', 'ssd', 16999, 'High-performance gaming SSD, 2TB capacity, up to 7300MB/s speeds, PCIe Gen4, Game Mode 2.0, RGB heatsink available. Ideal for PS5 and gaming PCs.', 'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=800&h=600&fit=crop', true, false, NOW(), NOW()),

('Crucial MX500 500GB SATA SSD', 'Crucial', 'ssd', 4499, 'Reliable SATA SSD, 500GB capacity, up to 560MB/s read speed, 3D NAND technology, 5-year warranty. Great for upgrading older systems and laptops.', 'https://images.unsplash.com/photo-1551058622-6f90defd7ad5?w=800&h=600&fit=crop', true, false, NOW(), NOW()),

('Kingston KC3000 1TB PCIe 4.0 NVMe SSD', 'Kingston', 'ssd', 9999, 'High-speed Gen4 NVMe SSD, 1TB capacity, up to 7000MB/s read, low-profile graphene aluminum heat spreader, 5-year warranty. Excellent price-to-performance ratio.', 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&h=600&fit=crop', true, false, NOW(), NOW());


-- CHROMEBOOK (4 items)
INSERT INTO products (name, brand, category_id, price, description, featured_image, is_active, in_stock, created_at, updated_at)
VALUES
('HP Chromebook 14a MediaTek MT8183', 'HP', 'chromebook', 32999, 'HP Chromebook 14a with MediaTek MT8183 processor, 4GB RAM, 64GB eMMC storage, 14-inch HD display. Fast boot, long battery life, automatic updates. Perfect for students and online learning.', 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&h=600&fit=crop', true, false, NOW(), NOW()),

('Lenovo Chromebook IdeaPad Slim 3', 'Lenovo', 'chromebook', 29999, 'Lenovo IdeaPad Slim 3 Chromebook with MediaTek processor, 4GB LPDDR4X RAM, 64GB storage, 14-inch FHD display, WiFi 6. Lightweight design, perfect for productivity and entertainment.', 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=600&fit=crop', true, false, NOW(), NOW()),

('Acer Chromebook 315 Celeron N4020', 'Acer', 'chromebook', 27999, 'Acer Chromebook 315 with Intel Celeron N4020, 4GB RAM, 64GB storage, 15.6-inch HD display. Large screen, comfortable keyboard, great battery life. Ideal for work and study.', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop', true, false, NOW(), NOW()),

('ASUS Chromebook Flip C434', 'ASUS', 'chromebook', 45999, 'Premium ASUS Chromebook Flip C434 2-in-1 convertible, Intel Core m3, 4GB RAM, 64GB storage, 14-inch FHD touchscreen, backlit keyboard. Sleek aluminum design, versatile tablet mode.', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop', true, false, NOW(), NOW());

-- Success message
SELECT 'Successfully inserted 20 OUT OF STOCK dummy products with working images: 4 Workstations, 4 Accessories, 4 RAM modules, 4 SSDs, and 4 Chromebooks. Products are ACTIVE (visible) but IN_STOCK is FALSE (cannot order).' AS message;
