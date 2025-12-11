-- Update RAM and SSD upgrade prices according to latest pricing chart
-- Run this in Supabase SQL Editor

-- First, delete all existing options to start fresh
DELETE FROM laptop_upgrade_options;

-- Insert DDR3/DDR3L RAM options (3rd to 5th Generation)
INSERT INTO laptop_upgrade_options (
  option_type, size, size_number, price, display_label,
  applicable_to, min_generation, max_generation, is_active, display_order
) VALUES
  ('ram', '4GB', 4, 1000, '4GB DDR3', 'ddr3', 3, 5, true, 1),
  ('ram', '8GB', 8, 2500, '8GB DDR3', 'ddr3', 3, 5, true, 2);

-- Insert DDR4 RAM options (6th to 11th Generation)
INSERT INTO laptop_upgrade_options (
  option_type, size, size_number, price, display_label,
  applicable_to, min_generation, max_generation, is_active, display_order
) VALUES
  ('ram', '4GB', 4, 3200, '4GB DDR4', 'ddr4', 6, 11, true, 3),
  ('ram', '8GB', 8, 6000, '8GB DDR4', 'ddr4', 6, 11, true, 4),
  ('ram', '16GB', 16, 11500, '16GB DDR4', 'ddr4', 6, 11, true, 5);

-- Insert SSD upgrade options (applicable to all generations)
-- Note: Pricing structure is simplified - showing upgrade price from common base sizes
INSERT INTO laptop_upgrade_options (
  option_type, size, size_number, price, display_label,
  applicable_to, is_active, display_order
) VALUES
  ('ssd', '256GB', 256, 3000, '256GB NVMe SSD', 'all', true, 10),
  ('ssd', '512GB', 512, 5500, '512GB NVMe SSD', 'all', true, 11),
  ('ssd', '1TB', 1024, 10000, '1TB NVMe SSD', 'all', true, 12);

-- Verify the data
SELECT
  option_type,
  size,
  price,
  display_label,
  applicable_to,
  min_generation,
  max_generation,
  is_active
FROM laptop_upgrade_options
ORDER BY option_type, display_order;
