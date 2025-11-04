# Database Migration Guide - Chromebook Customizer

## Overview
This guide helps you add the required database columns for Chromebook product customization and other customizer features.

## Error You're Seeing
```
Error saving product: Could not find the 'aue_year' column of 'products' in the schema cache
```

## Solution: Run Database Migration

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"

### Step 2: Run the Migration Script
Copy and paste the contents of **`complete-customizer-migration.sql`** into the SQL editor and click "Run".

This will add the following columns to your `products` table:
- `aue_year` - Auto Update Expiration year for Chromebooks
- `show_chromebook_customizer` - Toggle chromebook customizer
- `show_laptop_customizer` - Toggle laptop customizer
- `show_ram_options` - Toggle RAM upgrade options
- `show_ssd_options` - Toggle SSD upgrade options
- `custom_upgrade_pricing` - Custom pricing per product (JSONB)
- `is_workstation` - Workstation laptop flag
- `is_rugged_tough` - Rugged laptop flag

### Step 3: Verify
After running the migration, you should see:
```
✅ All customizer fields added successfully!
```

And a table showing all the newly added columns.

### Step 4: Test
1. Go to Admin Panel → Products
2. Edit or create a Chromebook product
3. Fill in the Chromebook specifications including AUE Year
4. Enable the "Show Chromebook Customizer" option
5. Save the product

## Alternative: Run Only Chromebook Fields
If you only need Chromebook-specific fields, run **`add-chromebook-fields.sql`** instead. This adds:
- `aue_year`
- `show_chromebook_customizer`

## After Migration

### Add Chromebook Upgrade Options
1. Go to Admin Panel → Laptop Upgrade Options
2. Add RAM options for Chromebooks (4GB, 8GB, 16GB)
3. Add SSD options for Chromebooks (64GB, 128GB, 256GB, 512GB)
4. Set `applicable_to` field appropriately:
   - For RAM: Use "DDR3", "DDR4", or "DDR5" based on compatibility
   - For SSD: Can be set to "all" or "chromebook"

### Add Test Chromebook Product
Run the **`test-chromebook.sql`** script to add a test Chromebook product with all fields populated.

## Troubleshooting

### "Column already exists" error
This is normal - the migration uses `ADD COLUMN IF NOT EXISTS`, so it won't duplicate columns.

### Changes not reflecting
1. Refresh your browser
2. Clear browser cache
3. Restart your Next.js dev server

### Still seeing errors
Check the Supabase logs for more details on what might be failing.

## Files in this Directory

- **`complete-customizer-migration.sql`** - Full migration (recommended)
- **`add-chromebook-fields.sql`** - Chromebook-only migration
- **`test-chromebook.sql`** - Test data for Chromebook product
- **`README.md`** - This file

## Support
If you encounter any issues, check:
1. Supabase project permissions
2. Database connection status
3. SQL syntax errors in the Supabase logs
