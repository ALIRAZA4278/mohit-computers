-- Create upgrade pricing configuration table
-- This table stores all RAM and SSD upgrade prices that can be edited by admin

CREATE TABLE IF NOT EXISTS upgrade_pricing (
  id SERIAL PRIMARY KEY,
  
  -- RAM Upgrade Prices (DDR3/DDR3L - 3rd to 5th Generation)
  ram_ddr3_4gb INTEGER DEFAULT 1000,
  ram_ddr3_8gb INTEGER DEFAULT 2500,
  
  -- RAM Upgrade Prices (DDR4 - 6th to 11th Generation)
  ram_ddr4_4gb INTEGER DEFAULT 3200,
  ram_ddr4_8gb INTEGER DEFAULT 6000,
  ram_ddr4_16gb INTEGER DEFAULT 11500,
  ram_ddr4_32gb INTEGER DEFAULT 25000,
  
  -- RAM Speed Upgrade Prices (MHz frequency upgrades)
  ram_speed_2400 INTEGER DEFAULT 300,
  ram_speed_2666 INTEGER DEFAULT 600,
  ram_speed_3200 INTEGER DEFAULT 900,
  
  -- SSD Upgrade Prices (from 128GB)
  ssd_128_to_256 INTEGER DEFAULT 3000,
  ssd_128_to_512 INTEGER DEFAULT 8000,
  ssd_128_to_1tb INTEGER DEFAULT 18500,
  
  -- SSD Upgrade Prices (from 256GB)
  ssd_256_to_512 INTEGER DEFAULT 5500,
  ssd_256_to_1tb INTEGER DEFAULT 15500,
  
  -- SSD Upgrade Prices (from 512GB)
  ssd_512_to_1tb INTEGER DEFAULT 10000,
  
  -- Metadata
  updated_at TIMESTAMP DEFAULT NOW(),
  updated_by VARCHAR(255),
  
  -- Ensure only one row exists
  CONSTRAINT single_row CHECK (id = 1)
);

-- Insert default pricing row (only if not exists)
INSERT INTO upgrade_pricing (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- Create index
CREATE INDEX IF NOT EXISTS idx_upgrade_pricing_updated ON upgrade_pricing(updated_at);

-- Comments
COMMENT ON TABLE upgrade_pricing IS 'Global upgrade pricing configuration for RAM and SSD upgrades';
COMMENT ON COLUMN upgrade_pricing.ram_ddr3_4gb IS 'Price for 4GB DDR3/DDR3L RAM upgrade (3rd-5th gen)';
COMMENT ON COLUMN upgrade_pricing.ram_ddr3_8gb IS 'Price for 8GB DDR3/DDR3L RAM upgrade (3rd-5th gen)';
COMMENT ON COLUMN upgrade_pricing.ram_ddr4_4gb IS 'Price for 4GB DDR4 RAM upgrade (6th-11th gen)';
COMMENT ON COLUMN upgrade_pricing.ram_ddr4_8gb IS 'Price for 8GB DDR4 RAM upgrade (6th-11th gen)';
COMMENT ON COLUMN upgrade_pricing.ram_ddr4_16gb IS 'Price for 16GB DDR4 RAM upgrade (6th-11th gen)';
COMMENT ON COLUMN upgrade_pricing.ram_ddr4_32gb IS 'Price for 32GB DDR4 RAM upgrade (6th-11th gen)';
COMMENT ON COLUMN upgrade_pricing.ram_speed_2400 IS 'Additional price for 2400 MHz RAM speed upgrade';
COMMENT ON COLUMN upgrade_pricing.ram_speed_2666 IS 'Additional price for 2666 MHz RAM speed upgrade';
COMMENT ON COLUMN upgrade_pricing.ram_speed_3200 IS 'Additional price for 3200 MHz RAM speed upgrade';
COMMENT ON COLUMN upgrade_pricing.ssd_128_to_256 IS 'Price to upgrade from 128GB to 256GB SSD';
COMMENT ON COLUMN upgrade_pricing.ssd_128_to_512 IS 'Price to upgrade from 128GB to 512GB SSD';
COMMENT ON COLUMN upgrade_pricing.ssd_128_to_1tb IS 'Price to upgrade from 128GB to 1TB SSD';
COMMENT ON COLUMN upgrade_pricing.ssd_256_to_512 IS 'Price to upgrade from 256GB to 512GB SSD';
COMMENT ON COLUMN upgrade_pricing.ssd_256_to_1tb IS 'Price to upgrade from 256GB to 1TB SSD';
COMMENT ON COLUMN upgrade_pricing.ssd_512_to_1tb IS 'Price to upgrade from 512GB to 1TB SSD';

-- Success message
SELECT 'Successfully created upgrade_pricing table with default values' AS message;
