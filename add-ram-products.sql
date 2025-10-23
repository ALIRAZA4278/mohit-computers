-- Add DDR4 RAM Products to Mohit Computers Database
-- Products will be ACTIVE and IN STOCK
-- Image path: /Ram/Ram/DDR4/{capacity}/1.jpg

-- ====================================
-- 4GB DDR4 RAM Products
-- ====================================

-- 4GB DDR4 2133 MHz - Rs 3500
INSERT INTO products (
    name, brand, category_id, price, description,
    featured_image, images, is_active, in_stock,
    ram_type, ram_capacity, ram_speed, ram_form_factor,
    ram_condition, ram_warranty,
    created_at, updated_at
) VALUES (
    '4GB DDR4 2133 MHz Laptop RAM',
    'Kingston',
    'ram',
    3500,
    'High-quality 4GB DDR4 2133 MHz laptop RAM module. Perfect for upgrading your laptop''s memory for better multitasking and performance. Compatible with most laptops supporting DDR4 memory.',
    '/Ram/Ram/DDR4/4GB DDR4/1.jpg',
    ARRAY['/Ram/Ram/DDR4/4GB DDR4/1.jpg']::text[],
    true,
    true,
    'DDR4',
    '4GB',
    '2133 MHz',
    'Laptop (SO-DIMM)',
    'Used',
    '6 Months',
    NOW(),
    NOW()
);

-- 4GB DDR4 2400 MHz - Rs 3550
INSERT INTO products (
    name, brand, category_id, price, description,
    featured_image, images, is_active, in_stock,
    ram_type, ram_capacity, ram_speed, ram_form_factor,
    ram_condition, ram_warranty,
    created_at, updated_at
) VALUES (
    '4GB DDR4 2400 MHz Laptop RAM',
    'Kingston',
    'ram',
    3550,
    'Reliable 4GB DDR4 2400 MHz laptop RAM module. Faster speed for improved system responsiveness. Compatible with laptops supporting DDR4-2400 memory.',
    '/Ram/Ram/DDR4/4GB DDR4/1.jpg',
    ARRAY['/Ram/Ram/DDR4/4GB DDR4/1.jpg']::text[],
    true,
    true,
    'DDR4',
    '4GB',
    '2400 MHz',
    'Laptop (SO-DIMM)',
    'Used',
    '6 Months',
    NOW(),
    NOW()
);

-- 4GB DDR4 2666 MHz - Rs 3600
INSERT INTO products (
    name, brand, category_id, price, description,
    featured_image, images, is_active, in_stock,
    ram_type, ram_capacity, ram_speed, ram_form_factor,
    ram_condition, ram_warranty,
    created_at, updated_at
) VALUES (
    '4GB DDR4 2666 MHz Laptop RAM',
    'Samsung',
    'ram',
    3600,
    'Quality 4GB DDR4 2666 MHz laptop RAM module. Enhanced performance for modern laptops. Perfect for everyday computing and light multitasking.',
    '/Ram/Ram/DDR4/4GB DDR4/1.jpg',
    ARRAY['/Ram/Ram/DDR4/4GB DDR4/1.jpg']::text[],
    true,
    true,
    'DDR4',
    '4GB',
    '2666 MHz',
    'Laptop (SO-DIMM)',
    'Used',
    '6 Months',
    NOW(),
    NOW()
);

-- 4GB DDR4 3200 MHz - Rs 3800
INSERT INTO products (
    name, brand, category_id, price, description,
    featured_image, images, is_active, in_stock,
    ram_type, ram_capacity, ram_speed, ram_form_factor,
    ram_condition, ram_warranty,
    created_at, updated_at
) VALUES (
    '4GB DDR4 3200 MHz Laptop RAM',
    'Crucial',
    'ram',
    3800,
    'Premium 4GB DDR4 3200 MHz laptop RAM module. High-speed memory for faster data access and better overall system performance. Compatible with latest generation laptops.',
    '/Ram/Ram/DDR4/4GB DDR4/1.jpg',
    ARRAY['/Ram/Ram/DDR4/4GB DDR4/1.jpg']::text[],
    true,
    true,
    'DDR4',
    '4GB',
    '3200 MHz',
    'Laptop (SO-DIMM)',
    'Used',
    '6 Months',
    NOW(),
    NOW()
);

-- ====================================
-- 8GB DDR4 RAM Products
-- ====================================

-- 8GB DDR4 2133 MHz - Rs 8000
INSERT INTO products (
    name, brand, category_id, price, description,
    featured_image, images, is_active, in_stock,
    ram_type, ram_capacity, ram_speed, ram_form_factor,
    ram_condition, ram_warranty,
    created_at, updated_at
) VALUES (
    '8GB DDR4 2133 MHz Laptop RAM',
    'Kingston',
    'ram',
    8000,
    'High-performance 8GB DDR4 2133 MHz laptop RAM module. Ideal for multitasking, office work, and general computing. Provides smooth performance for everyday tasks.',
    '/Ram/Ram/DDR4/8GB DDR4/1.jpg',
    ARRAY['/Ram/Ram/DDR4/8GB DDR4/1.jpg']::text[],
    true,
    true,
    'DDR4',
    '8GB',
    '2133 MHz',
    'Laptop (SO-DIMM)',
    'Used',
    '6 Months',
    NOW(),
    NOW()
);

-- 8GB DDR4 2400 MHz - Rs 8200
INSERT INTO products (
    name, brand, category_id, price, description,
    featured_image, images, is_active, in_stock,
    ram_type, ram_capacity, ram_speed, ram_form_factor,
    ram_condition, ram_warranty,
    created_at, updated_at
) VALUES (
    '8GB DDR4 2400 MHz Laptop RAM',
    'Samsung',
    'ram',
    8200,
    'Quality 8GB DDR4 2400 MHz laptop RAM module. Enhanced speed for better responsiveness. Perfect for students and professionals running multiple applications.',
    '/Ram/Ram/DDR4/8GB DDR4/1.jpg',
    ARRAY['/Ram/Ram/DDR4/8GB DDR4/1.jpg']::text[],
    true,
    true,
    'DDR4',
    '8GB',
    '2400 MHz',
    'Laptop (SO-DIMM)',
    'Used',
    '6 Months',
    NOW(),
    NOW()
);

-- 8GB DDR4 2666 MHz - Rs 8400
INSERT INTO products (
    name, brand, category_id, price, description,
    featured_image, images, is_active, in_stock,
    ram_type, ram_capacity, ram_speed, ram_form_factor,
    ram_condition, ram_warranty,
    created_at, updated_at
) VALUES (
    '8GB DDR4 2666 MHz Laptop RAM',
    'Crucial',
    'ram',
    8400,
    'Reliable 8GB DDR4 2666 MHz laptop RAM module. Great for modern applications and light gaming. Boosts your laptop''s performance significantly.',
    '/Ram/Ram/DDR4/8GB DDR4/1.jpg',
    ARRAY['/Ram/Ram/DDR4/8GB DDR4/1.jpg']::text[],
    true,
    true,
    'DDR4',
    '8GB',
    '2666 MHz',
    'Laptop (SO-DIMM)',
    'Used',
    '6 Months',
    NOW(),
    NOW()
);

-- 8GB DDR4 3200 MHz - Rs 8600
INSERT INTO products (
    name, brand, category_id, price, description,
    featured_image, images, is_active, in_stock,
    ram_type, ram_capacity, ram_speed, ram_form_factor,
    ram_condition, ram_warranty,
    created_at, updated_at
) VALUES (
    '8GB DDR4 3200 MHz Laptop RAM',
    'Hynix',
    'ram',
    8600,
    'Premium 8GB DDR4 3200 MHz laptop RAM module. High-speed memory for demanding applications and gaming. Compatible with latest generation Intel and AMD laptops.',
    '/Ram/Ram/DDR4/8GB DDR4/1.jpg',
    ARRAY['/Ram/Ram/DDR4/8GB DDR4/1.jpg']::text[],
    true,
    true,
    'DDR4',
    '8GB',
    '3200 MHz',
    'Laptop (SO-DIMM)',
    'Used',
    '6 Months',
    NOW(),
    NOW()
);

-- ====================================
-- 16GB DDR4 RAM Products
-- ====================================

-- 16GB DDR4 2133 MHz - Rs 16000
INSERT INTO products (
    name, brand, category_id, price, description,
    featured_image, images, is_active, in_stock,
    ram_type, ram_capacity, ram_speed, ram_form_factor,
    ram_condition, ram_warranty,
    created_at, updated_at
) VALUES (
    '16GB DDR4 2133 MHz Laptop RAM',
    'Kingston',
    'ram',
    16000,
    'Professional-grade 16GB DDR4 2133 MHz laptop RAM module. Excellent for heavy multitasking, content creation, and professional applications. Provides ample memory for demanding workloads.',
    '/Ram/Ram/DDR4/16GB DDR4/1.jpg',
    ARRAY['/Ram/Ram/DDR4/16GB DDR4/1.jpg']::text[],
    true,
    true,
    'DDR4',
    '16GB',
    '2133 MHz',
    'Laptop (SO-DIMM)',
    'Used',
    '6 Months',
    NOW(),
    NOW()
);

-- 16GB DDR4 2400 MHz - Rs 16300
INSERT INTO products (
    name, brand, category_id, price, description,
    featured_image, images, is_active, in_stock,
    ram_type, ram_capacity, ram_speed, ram_form_factor,
    ram_condition, ram_warranty,
    created_at, updated_at
) VALUES (
    '16GB DDR4 2400 MHz Laptop RAM',
    'Samsung',
    'ram',
    16300,
    'High-capacity 16GB DDR4 2400 MHz laptop RAM module. Perfect for developers, designers, and content creators. Run multiple demanding applications simultaneously without slowdown.',
    '/Ram/Ram/DDR4/16GB DDR4/1.jpg',
    ARRAY['/Ram/Ram/DDR4/16GB DDR4/1.jpg']::text[],
    true,
    true,
    'DDR4',
    '16GB',
    '2400 MHz',
    'Laptop (SO-DIMM)',
    'Used',
    '6 Months',
    NOW(),
    NOW()
);

-- 16GB DDR4 2666 MHz - Rs 16600
INSERT INTO products (
    name, brand, category_id, price, description,
    featured_image, images, is_active, in_stock,
    ram_type, ram_capacity, ram_speed, ram_form_factor,
    ram_condition, ram_warranty,
    created_at, updated_at
) VALUES (
    '16GB DDR4 2666 MHz Laptop RAM',
    'Crucial',
    'ram',
    16600,
    'Premium 16GB DDR4 2666 MHz laptop RAM module. Ideal for gaming, video editing, and 3D modeling. Enhanced speed for professional workflows and content creation.',
    '/Ram/Ram/DDR4/16GB DDR4/1.jpg',
    ARRAY['/Ram/Ram/DDR4/16GB DDR4/1.jpg']::text[],
    true,
    true,
    'DDR4',
    '16GB',
    '2666 MHz',
    'Laptop (SO-DIMM)',
    'Used',
    '6 Months',
    NOW(),
    NOW()
);

-- 16GB DDR4 3200 MHz - Rs 16900
INSERT INTO products (
    name, brand, category_id, price, description,
    featured_image, images, is_active, in_stock,
    ram_type, ram_capacity, ram_speed, ram_form_factor,
    ram_condition, ram_warranty,
    created_at, updated_at
) VALUES (
    '16GB DDR4 3200 MHz Laptop RAM',
    'Hynix',
    'ram',
    16900,
    'Top-tier 16GB DDR4 3200 MHz laptop RAM module. Maximum performance for gaming laptops and workstations. High-speed memory for the most demanding applications and tasks.',
    '/Ram/Ram/DDR4/16GB DDR4/1.jpg',
    ARRAY['/Ram/Ram/DDR4/16GB DDR4/1.jpg']::text[],
    true,
    true,
    'DDR4',
    '16GB',
    '3200 MHz',
    'Laptop (SO-DIMM)',
    'Used',
    '6 Months',
    NOW(),
    NOW()
);

-- Success message
SELECT '✅ Successfully inserted 12 DDR4 RAM products: 4x 4GB, 4x 8GB, and 4x 16GB variants with speeds from 2133MHz to 3200MHz. All products are ACTIVE and IN STOCK.' AS message;
