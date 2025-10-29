# Database Migration: Products Table - Missing Columns

## Error Messages
If you see any of these errors:
```
Could not find the 'custom_upgrade_pricing' column of 'products' in the schema cache
Could not find the 'show_ram_options' column of 'products' in the schema cache
Could not find the 'show_ssd_options' column of 'products' in the schema cache
Could not find the 'show_laptop_customizer' column of 'products' in the schema cache
Could not find the 'is_workstation' column of 'products' in the schema cache
```

## Solution
You need to add several new columns to your products table in Supabase.

## Steps to Fix

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to https://supabase.com/dashboard
2. Select your project
3. Click on **SQL Editor** in the left sidebar
4. Click **New query**
5. Copy and paste this SQL:

```sql
-- Comprehensive Database Migration: Add All Missing Columns to Products Table

-- 1. Add show_ram_options column (for controlling RAM customizer visibility)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS show_ram_options BOOLEAN DEFAULT true;

-- 2. Add show_ssd_options column (for controlling SSD customizer visibility)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS show_ssd_options BOOLEAN DEFAULT true;

-- 3. Add show_laptop_customizer column (for controlling entire laptop customizer)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS show_laptop_customizer BOOLEAN DEFAULT true;

-- 4. Add show_ram_customizer column (for RAM products customizer)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS show_ram_customizer BOOLEAN DEFAULT true;

-- 5. Add custom_upgrade_pricing column (for per-product pricing overrides)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS custom_upgrade_pricing JSONB DEFAULT '{}'::jsonb;

-- 6. Add is_workstation column (for workstation products)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_workstation BOOLEAN DEFAULT false;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_show_ram_options ON products(show_ram_options);
CREATE INDEX IF NOT EXISTS idx_products_show_ssd_options ON products(show_ssd_options);
CREATE INDEX IF NOT EXISTS idx_products_is_workstation ON products(is_workstation);
CREATE INDEX IF NOT EXISTS idx_products_custom_upgrade_pricing ON products USING gin(custom_upgrade_pricing);
```

6. Click **Run** (or press Ctrl+Enter)
7. Wait for success message
8. Try saving your product again

### Option 2: Using Migration API

1. Open your browser and go to:
   ```
   http://localhost:3001/api/migrate-custom-pricing
   ```

2. Follow the instructions shown on the page

3. After running the SQL, verify by visiting:
   ```
   POST http://localhost:3001/api/migrate-custom-pricing
   ```

### Option 3: Using SQL File

1. The SQL file is already created at: `add-custom-upgrade-pricing-column.sql`
2. Open Supabase Dashboard → SQL Editor
3. Copy contents from the file
4. Paste and run

## What This Column Does

The `custom_upgrade_pricing` column allows you to set **custom prices for upgrade options on individual products**.

### Example:
- Product A: 16GB RAM upgrade = Rs 12,000
- Product B: 16GB RAM upgrade = Rs 10,000

Without this column, all products would use the same global price from the database.

### Data Format:
```json
{
  "ram-123": 3500,
  "ssd-456": 8000
}
```

Where:
- `ram-123` = RAM option ID from laptop_upgrade_options table
- `ssd-456` = SSD option ID from laptop_upgrade_options table
- Values are the custom prices in Rupees

## Verification

After running the migration, you should be able to:
1. ✅ Save products without errors
2. ✅ See price input fields in ProductEditor for RAM/SSD options
3. ✅ Set custom prices for individual products
4. ✅ See amber-colored cards for options with custom pricing

## Troubleshooting

### Still getting errors?
1. Make sure you're logged into the correct Supabase project
2. Check that you have the correct database permissions
3. Try refreshing the Supabase schema cache
4. Contact support if issue persists

### Cannot run SQL in Supabase?
- Make sure you have Owner or Admin role in the project
- Check if you're in the correct organization
- Verify you selected the right project

## Need Help?
Check the migration status at: `/api/migrate-custom-pricing`
