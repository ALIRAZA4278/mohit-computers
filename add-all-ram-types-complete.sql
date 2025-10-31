-- ============================================================================
-- COMPLETE RAM UPGRADE OPTIONS SETUP
-- ============================================================================
-- This script adds all DDR3, DDR4, and DDR5 RAM options
-- Future-proof setup - just run once and all options will be available
-- ============================================================================

-- Clean up any existing test data if needed (optional - comment out if not needed)
-- DELETE FROM laptop_upgrade_options WHERE option_type = 'ram';

-- ============================================================================
-- DDR3 RAM OPTIONS (3rd-5th Generation Intel Processors)
-- ============================================================================

INSERT INTO laptop_upgrade_options (
  option_type, size, size_number, display_label, description,
  applicable_to, min_generation, max_generation, price,
  display_order, is_active, created_at, updated_at
)
VALUES
  -- DDR3 for 3rd-5th Gen
  ('ram', '4GB', 4, '4GB DDR3', 'Upgrade to 4GB DDR3 RAM - Compatible with 3rd to 5th Gen Intel processors',
   'ddr3', 3, 5, 1000, 1, true, NOW(), NOW()),

  ('ram', '8GB', 8, '8GB DDR3', 'Upgrade to 8GB DDR3 RAM - Compatible with 3rd to 5th Gen Intel processors',
   'ddr3', 3, 5, 2500, 2, true, NOW(), NOW())

ON CONFLICT (option_type, size, applicable_to)
DO UPDATE SET
  display_label = EXCLUDED.display_label,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  min_generation = EXCLUDED.min_generation,
  max_generation = EXCLUDED.max_generation,
  updated_at = NOW();

-- ============================================================================
-- DDR3 RAM OPTIONS (6th Generation - Special Case)
-- ============================================================================
-- Some 6th Gen laptops use DDR3 RAM

INSERT INTO laptop_upgrade_options (
  option_type, size, size_number, display_label, description,
  applicable_to, min_generation, max_generation, price,
  display_order, is_active, created_at, updated_at
)
VALUES
  ('ram', '4GB', 4, '4GB DDR3 (6th Gen)', 'Upgrade to 4GB DDR3 RAM - For 6th Gen processors with DDR3 support',
   'ddr3_6th', 6, 6, 1200, 3, true, NOW(), NOW()),

  ('ram', '8GB', 8, '8GB DDR3 (6th Gen)', 'Upgrade to 8GB DDR3 RAM - For 6th Gen processors with DDR3 support',
   'ddr3_6th', 6, 6, 2800, 4, true, NOW(), NOW())

ON CONFLICT (option_type, size, applicable_to)
DO UPDATE SET
  display_label = EXCLUDED.display_label,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  min_generation = EXCLUDED.min_generation,
  max_generation = EXCLUDED.max_generation,
  updated_at = NOW();

-- ============================================================================
-- DDR4 RAM OPTIONS (6th-11th Generation Intel Processors)
-- ============================================================================

INSERT INTO laptop_upgrade_options (
  option_type, size, size_number, display_label, description,
  applicable_to, min_generation, max_generation, price,
  display_order, is_active, created_at, updated_at
)
VALUES
  -- DDR4 for 6th-11th Gen
  ('ram', '4GB', 4, '4GB DDR4', 'Upgrade to 4GB DDR4 RAM - Compatible with 6th to 11th Gen Intel processors',
   'ddr4', 6, 11, 3200, 10, true, NOW(), NOW()),

  ('ram', '8GB', 8, '8GB DDR4', 'Upgrade to 8GB DDR4 RAM - Compatible with 6th to 11th Gen Intel processors',
   'ddr4', 6, 11, 6000, 11, true, NOW(), NOW()),

  ('ram', '16GB', 16, '16GB DDR4', 'Upgrade to 16GB DDR4 RAM - Compatible with 6th to 11th Gen Intel processors',
   'ddr4', 6, 11, 11500, 12, true, NOW(), NOW()),

  ('ram', '32GB', 32, '32GB DDR4', 'Upgrade to 32GB DDR4 RAM - Compatible with 6th to 11th Gen Intel processors',
   'ddr4', 6, 11, 25000, 13, true, NOW(), NOW())

ON CONFLICT (option_type, size, applicable_to)
DO UPDATE SET
  display_label = EXCLUDED.display_label,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  min_generation = EXCLUDED.min_generation,
  max_generation = EXCLUDED.max_generation,
  updated_at = NOW();

-- ============================================================================
-- DDR4 RAM OPTIONS (12th Generation - Special Case)
-- ============================================================================
-- 12th Gen supports both DDR4 and DDR5

INSERT INTO laptop_upgrade_options (
  option_type, size, size_number, display_label, description,
  applicable_to, min_generation, max_generation, price,
  display_order, is_active, created_at, updated_at
)
VALUES
  ('ram', '8GB', 8, '8GB DDR4 (12th Gen)', 'Upgrade to 8GB DDR4 RAM - For 12th Gen processors with DDR4 support',
   'ddr4_12th', 12, 12, 6500, 20, true, NOW(), NOW()),

  ('ram', '16GB', 16, '16GB DDR4 (12th Gen)', 'Upgrade to 16GB DDR4 RAM - For 12th Gen processors with DDR4 support',
   'ddr4_12th', 12, 12, 12000, 21, true, NOW(), NOW()),

  ('ram', '32GB', 32, '32GB DDR4 (12th Gen)', 'Upgrade to 32GB DDR4 RAM - For 12th Gen processors with DDR4 support',
   'ddr4_12th', 12, 12, 26000, 22, true, NOW(), NOW())

ON CONFLICT (option_type, size, applicable_to)
DO UPDATE SET
  display_label = EXCLUDED.display_label,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  min_generation = EXCLUDED.min_generation,
  max_generation = EXCLUDED.max_generation,
  updated_at = NOW();

-- ============================================================================
-- DDR5 RAM OPTIONS (12th-15th Generation Intel Processors)
-- ============================================================================
-- Latest generation RAM - Higher performance and efficiency

INSERT INTO laptop_upgrade_options (
  option_type, size, size_number, display_label, description,
  applicable_to, min_generation, max_generation, price,
  display_order, is_active, created_at, updated_at
)
VALUES
  ('ram', '8GB', 8, '8GB DDR5', 'Upgrade to 8GB DDR5 RAM - Latest generation, compatible with 12th to 15th Gen Intel processors',
   'ddr5', 12, 15, 8000, 30, true, NOW(), NOW()),

  ('ram', '16GB', 16, '16GB DDR5', 'Upgrade to 16GB DDR5 RAM - Latest generation, compatible with 12th to 15th Gen Intel processors',
   'ddr5', 12, 15, 15000, 31, true, NOW(), NOW()),

  ('ram', '32GB', 32, '32GB DDR5', 'Upgrade to 32GB DDR5 RAM - Latest generation, compatible with 12th to 15th Gen Intel processors',
   'ddr5', 12, 15, 30000, 32, true, NOW(), NOW()),

  ('ram', '64GB', 64, '64GB DDR5', 'Upgrade to 64GB DDR5 RAM - Maximum capacity, compatible with 12th to 15th Gen Intel processors',
   'ddr5', 12, 15, 60000, 33, true, NOW(), NOW())

ON CONFLICT (option_type, size, applicable_to)
DO UPDATE SET
  display_label = EXCLUDED.display_label,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  min_generation = EXCLUDED.min_generation,
  max_generation = EXCLUDED.max_generation,
  updated_at = NOW();

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Show all RAM options organized by type
SELECT
  '=== DDR3 OPTIONS (3rd-5th Gen) ===' as category,
  id, size, display_label, applicable_to,
  min_generation, max_generation, price, is_active
FROM laptop_upgrade_options
WHERE applicable_to = 'ddr3'
ORDER BY display_order

UNION ALL

SELECT
  '=== DDR3 OPTIONS (6th Gen Special) ===' as category,
  id, size, display_label, applicable_to,
  min_generation, max_generation, price, is_active
FROM laptop_upgrade_options
WHERE applicable_to = 'ddr3_6th'
ORDER BY display_order

UNION ALL

SELECT
  '=== DDR4 OPTIONS (6th-11th Gen) ===' as category,
  id, size, display_label, applicable_to,
  min_generation, max_generation, price, is_active
FROM laptop_upgrade_options
WHERE applicable_to = 'ddr4'
ORDER BY display_order

UNION ALL

SELECT
  '=== DDR4 OPTIONS (12th Gen Special) ===' as category,
  id, size, display_label, applicable_to,
  min_generation, max_generation, price, is_active
FROM laptop_upgrade_options
WHERE applicable_to = 'ddr4_12th'
ORDER BY display_order

UNION ALL

SELECT
  '=== DDR5 OPTIONS (12th-15th Gen) ===' as category,
  id, size, display_label, applicable_to,
  min_generation, max_generation, price, is_active
FROM laptop_upgrade_options
WHERE applicable_to = 'ddr5'
ORDER BY display_order;

-- Summary count
SELECT
  applicable_to as ram_type,
  COUNT(*) as total_options,
  MIN(min_generation) as from_gen,
  MAX(max_generation) as to_gen,
  MIN(price) as min_price,
  MAX(price) as max_price
FROM laptop_upgrade_options
WHERE option_type = 'ram'
GROUP BY applicable_to
ORDER BY applicable_to;

-- Success message
SELECT
  '✅ SUCCESS: All RAM options added!' as status,
  COUNT(*) as total_ram_options
FROM laptop_upgrade_options
WHERE option_type = 'ram';
