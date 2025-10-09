-- Add address fields to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS current_address TEXT,
ADD COLUMN IF NOT EXISTS address_line1 VARCHAR(255),
ADD COLUMN IF NOT EXISTS address_line2 VARCHAR(255),
ADD COLUMN IF NOT EXISTS city VARCHAR(100),
ADD COLUMN IF NOT EXISTS state VARCHAR(100),
ADD COLUMN IF NOT EXISTS postal_code VARCHAR(20),
ADD COLUMN IF NOT EXISTS country VARCHAR(100) DEFAULT 'Pakistan';

-- Create index for phone number lookups
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);

-- Add comments
COMMENT ON COLUMN users.phone IS 'User phone number';
COMMENT ON COLUMN users.current_address IS 'User complete current residential address';
COMMENT ON COLUMN users.address_line1 IS 'Primary address line';
COMMENT ON COLUMN users.address_line2 IS 'Secondary address line (optional)';
COMMENT ON COLUMN users.city IS 'City name';
COMMENT ON COLUMN users.state IS 'State/Province';
COMMENT ON COLUMN users.postal_code IS 'Postal/ZIP code';
COMMENT ON COLUMN users.country IS 'Country name';
