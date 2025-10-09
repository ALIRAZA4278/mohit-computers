-- Drop only orders table and its specific triggers/functions
DROP TRIGGER IF EXISTS trigger_update_orders_updated_at ON orders;
DROP TRIGGER IF EXISTS trigger_set_order_id ON orders;
DROP FUNCTION IF EXISTS set_order_id();
DROP FUNCTION IF EXISTS generate_order_id();
DROP TABLE IF EXISTS orders CASCADE;

-- Create orders table with all columns
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id VARCHAR(20) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  -- Customer Details
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,

  -- Shipping Address
  shipping_address TEXT NOT NULL,
  shipping_city VARCHAR(100) NOT NULL,
  shipping_postal_code VARCHAR(20),

  -- Order Details
  order_items JSONB NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50) DEFAULT 'COD',

  -- Order Status
  order_status VARCHAR(50) DEFAULT 'pending',
  payment_status VARCHAR(50) DEFAULT 'pending',

  -- Additional Info
  order_notes TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_orders_order_id ON orders(order_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Function to generate unique order ID
CREATE FUNCTION generate_order_id()
RETURNS VARCHAR(20) AS $$
DECLARE
  new_order_id VARCHAR(20);
  id_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate order ID in format: MC-YYYYMMDD-XXXX
    new_order_id := 'MC-' ||
                    TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' ||
                    LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');

    -- Check if ID already exists
    SELECT EXISTS(SELECT 1 FROM orders WHERE order_id = new_order_id) INTO id_exists;

    -- Exit loop if ID is unique
    EXIT WHEN NOT id_exists;
  END LOOP;

  RETURN new_order_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger function to auto-generate order_id
CREATE FUNCTION set_order_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_id IS NULL OR NEW.order_id = '' THEN
    NEW.order_id := generate_order_id();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for order_id
CREATE TRIGGER trigger_set_order_id
BEFORE INSERT ON orders
FOR EACH ROW
EXECUTE FUNCTION set_order_id();

-- Reuse existing update_updated_at_column() function for updated_at trigger
CREATE TRIGGER trigger_update_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE orders IS 'Customer orders with COD payment';
COMMENT ON COLUMN orders.order_status IS 'Order status: pending, confirmed, processing, shipped, delivered, cancelled';
COMMENT ON COLUMN orders.payment_status IS 'Payment status: pending, paid, failed, refunded';
