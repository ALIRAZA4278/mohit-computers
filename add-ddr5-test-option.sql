-- Add DDR5 RAM test option for 12th-15th Gen laptops
-- This is a test option to verify DDR5 support works correctly

INSERT INTO laptop_upgrade_options (
  option_type,
  size,
  size_number,
  display_label,
  description,
  applicable_to,
  min_generation,
  max_generation,
  price,
  display_order,
  is_active,
  created_at,
  updated_at
)
VALUES
  (
    'ram',                          -- option_type
    '16GB',                         -- size
    16,                             -- size_number
    '16GB DDR5',                    -- display_label
    'Upgrade to 16GB DDR5 RAM (for 12th-15th Gen laptops)', -- description
    'ddr5',                         -- applicable_to
    12,                             -- min_generation
    15,                             -- max_generation
    15000,                          -- price (Rs 15,000)
    100,                            -- display_order (high number so it appears at end)
    true,                           -- is_active
    NOW(),                          -- created_at
    NOW()                           -- updated_at
  )
ON CONFLICT (option_type, size, applicable_to)
DO UPDATE SET
  display_label = EXCLUDED.display_label,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  min_generation = EXCLUDED.min_generation,
  max_generation = EXCLUDED.max_generation,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- Verify the insert
SELECT
  id,
  option_type,
  size,
  display_label,
  applicable_to,
  min_generation,
  max_generation,
  price,
  is_active
FROM laptop_upgrade_options
WHERE applicable_to = 'ddr5'
ORDER BY display_order;
