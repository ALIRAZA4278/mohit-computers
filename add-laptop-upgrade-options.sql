-- Create laptop upgrade options table
-- This table stores configurable RAM and SSD upgrade options that admins can edit

CREATE TABLE IF NOT EXISTS laptop_upgrade_options (
  id SERIAL PRIMARY KEY,
  option_type VARCHAR(50) NOT NULL, -- 'ram' or 'ssd'
  
  -- Option details
  size VARCHAR(50) NOT NULL, -- e.g., '4GB', '256GB', '1TB'
  size_number INTEGER NOT NULL, -- Numeric value for comparison (4, 256, 1024)
  display_label VARCHAR(100) NOT NULL, -- Display name
  description TEXT,
  
  -- Generation/Type constraints
  applicable_to VARCHAR(50), -- 'ddr3' (3rd-5th gen), 'ddr4' (6th-11th gen), 'all'
  min_generation INTEGER, -- Minimum CPU generation
  max_generation INTEGER, -- Maximum CPU generation
  
  -- Pricing
  price INTEGER DEFAULT 0,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  updated_by VARCHAR(255),
  
  -- Ensure unique combinations
  CONSTRAINT unique_upgrade_option UNIQUE (option_type, size, applicable_to)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_upgrade_options_type ON laptop_upgrade_options(option_type);
CREATE INDEX IF NOT EXISTS idx_upgrade_options_active ON laptop_upgrade_options(is_active);
CREATE INDEX IF NOT EXISTS idx_upgrade_options_order ON laptop_upgrade_options(display_order);

-- Insert default RAM upgrade options

-- DDR3 RAM Options (3rd-5th Generation)
INSERT INTO laptop_upgrade_options (option_type, size, size_number, display_label, description, applicable_to, min_generation, max_generation, price, display_order)
VALUES 
  ('ram', '4GB', 4, '4GB DDR3', 'Upgrade to 4GB DDR3 RAM', 'ddr3', 3, 5, 1000, 1),
  ('ram', '8GB', 8, '8GB DDR3', 'Upgrade to 8GB DDR3 RAM', 'ddr3', 3, 5, 2500, 2)
ON CONFLICT (option_type, size, applicable_to) DO UPDATE 
SET display_label = EXCLUDED.display_label, 
    description = EXCLUDED.description,
    price = EXCLUDED.price;

-- DDR4 RAM Options (6th-11th Generation)
INSERT INTO laptop_upgrade_options (option_type, size, size_number, display_label, description, applicable_to, min_generation, max_generation, price, display_order)
VALUES 
  ('ram', '4GB', 4, '4GB DDR4', 'Upgrade to 4GB DDR4 RAM', 'ddr4', 6, 11, 3200, 3),
  ('ram', '8GB', 8, '8GB DDR4', 'Upgrade to 8GB DDR4 RAM', 'ddr4', 6, 11, 6000, 4),
  ('ram', '16GB', 16, '16GB DDR4', 'Upgrade to 16GB DDR4 RAM', 'ddr4', 6, 11, 11500, 5),
  ('ram', '32GB', 32, '32GB DDR4', 'Upgrade to 32GB DDR4 RAM', 'ddr4', 6, 11, 25000, 6)
ON CONFLICT (option_type, size, applicable_to) DO UPDATE 
SET display_label = EXCLUDED.display_label, 
    description = EXCLUDED.description,
    price = EXCLUDED.price;

-- SSD Upgrade Options (All Generations)
INSERT INTO laptop_upgrade_options (option_type, size, size_number, display_label, description, applicable_to, price, display_order)
VALUES 
  ('ssd', '128GB', 128, '128GB NVMe SSD', 'Replace with 128GB NVMe SSD', 'all', 2000, 7),
  ('ssd', '256GB', 256, '256GB NVMe SSD', 'Replace with 256GB NVMe SSD', 'all', 4000, 8),
  ('ssd', '512GB', 512, '512GB NVMe SSD', 'Replace with 512GB NVMe SSD', 'all', 7500, 9),
  ('ssd', '1TB', 1024, '1TB NVMe SSD', 'Replace with 1TB NVMe SSD', 'all', 15000, 10),
  ('ssd', '2TB', 2048, '2TB NVMe SSD', 'Replace with 2TB NVMe SSD', 'all', 30000, 11)
ON CONFLICT (option_type, size, applicable_to) DO UPDATE 
SET display_label = EXCLUDED.display_label, 
    description = EXCLUDED.description,
    price = EXCLUDED.price;

-- Comments
COMMENT ON TABLE laptop_upgrade_options IS 'Configurable laptop upgrade options (RAM and SSD) manageable by admin';
COMMENT ON COLUMN laptop_upgrade_options.option_type IS 'Type of upgrade: ram or ssd';
COMMENT ON COLUMN laptop_upgrade_options.size IS 'Human-readable size (e.g., 4GB, 256GB)';
COMMENT ON COLUMN laptop_upgrade_options.size_number IS 'Numeric value for comparison and filtering';
COMMENT ON COLUMN laptop_upgrade_options.applicable_to IS 'Which generation/type this applies to (ddr3, ddr4, all)';
COMMENT ON COLUMN laptop_upgrade_options.is_active IS 'Whether this option is currently available for selection';
COMMENT ON COLUMN laptop_upgrade_options.display_order IS 'Order in which options are displayed';

-- Success message
SELECT 'Successfully created laptop_upgrade_options table with default options' AS message;
