# Custom Upgrade Pricing Fix - Instructions

## Problem
Admin panel mein custom prices set karne ke baad bhi, product detail page pe upgrade options mein default prices hi show ho rahe the. Custom prices update nahi ho rahi thi.

## Root Cause
`LaptopCustomizer` component sirf `laptop_upgrade_options` table se global pricing fetch kar raha tha. Product-specific `custom_upgrade_pricing` field ko check nahi kar raha tha.

## Solution

### Changes Made

#### 1. **Database Migration** (REQUIRED)
File: `add-custom-pricing-column.sql`

Yeh column add karta hai products table mein:
- **Column Name**: `custom_upgrade_pricing`
- **Type**: JSONB
- **Purpose**: Store product-specific custom upgrade prices
- **Format**: `{"ram-16-ddr4": 12000, "ssd-512": 4000}`

**To Run:**
1. Supabase Dashboard → SQL Editor
2. Copy content from `add-custom-pricing-column.sql`
3. Run the script

#### 2. **LaptopCustomizer Component Update**
File: `src/components/LaptopCustomizer.js`

**Changes:**
- RAM options mapping (lines 76-95):
  - Now checks `product?.custom_upgrade_pricing` for custom prices
  - Falls back to default `opt.price` if no custom price exists
  - Generates correct option key: `ram-{sizeNumber}-{ddr3/ddr4}`

- SSD options mapping (lines 117-135):
  - Same custom pricing logic
  - Generates correct option key: `ssd-{sizeNumber}`

- Added debug logging to verify custom pricing is being loaded

**Key Logic:**
```javascript
// For RAM
const optionKey = `ram-${opt.size_number}-${ramType}`; // e.g., "ram-16-ddr4"
const customPrice = product?.custom_upgrade_pricing?.[optionKey];
const finalPrice = customPrice !== undefined ? customPrice : opt.price;

// For SSD
const optionKey = `ssd-${opt.size_number}`; // e.g., "ssd-512"
const customPrice = product?.custom_upgrade_pricing?.[optionKey];
const finalPrice = customPrice !== undefined ? customPrice : opt.price;
```

## How It Works Now

### Admin Panel (ProductEditor):
1. Admin opens product edit page
2. Fills in processor generation (e.g., "10th Gen")
3. Available RAM/SSD options automatically load from `laptop_upgrade_options` table
4. Admin can override prices by entering "Custom Price"
5. Custom prices are saved in `custom_upgrade_pricing` column as:
   ```json
   {
     "ram-16-ddr4": 20000,
     "ram-32-ddr4": 25000,
     "ssd-512": 4000000,
     "ssd-1024": 4000000000
   }
   ```

### Product Detail Page (LaptopCustomizer):
1. Fetches product data including `custom_upgrade_pricing` field
2. Loads global upgrade options from `laptop_upgrade_options` table
3. For each upgrade option:
   - Generates option key (e.g., `ram-16-ddr4`)
   - Checks if `custom_upgrade_pricing[key]` exists
   - If exists: uses custom price
   - If not: uses default price from `laptop_upgrade_options`
4. Displays upgrade options with correct pricing

## Testing Steps

### 1. Run Database Migration
```sql
-- In Supabase SQL Editor, run add-custom-pricing-column.sql
```

### 2. Set Custom Prices in Admin Panel
1. Navigate to admin panel: `http://localhost:3000/admin`
2. Login with credentials
3. Edit a laptop product
4. Set processor generation (e.g., "10th Gen")
5. In "Memory (RAM) Upgrade Options" section:
   - Enter custom price (e.g., 12000 for 16GB DDR4)
   - Note the displayed price updates to show "(Custom)"
6. Save the product

### 3. Verify on Product Detail Page
1. Navigate to the product detail page
2. Scroll to "Customize Your Laptop" section
3. Check upgrade options:
   - **Expected**: Custom price should be displayed (Rs 12,000)
   - **Previously**: Default price was displayed (Rs 11,500)
4. Open browser console (F12)
5. Look for debug log:
   ```
   Filtering RAM options: {
     hasCustomPricing: true,
     customPricingData: {"ram-16-ddr4": 12000, ...}
   }
   ```

### 4. Test Add to Cart
1. Select an upgrade option with custom pricing
2. Click "Add to Cart"
3. Verify cart shows correct total price with custom upgrade cost

## Price Key Format

The option keys must match exactly between admin panel and product page:

### RAM Options:
- **Format**: `ram-{size}-{type}`
- **Examples**:
  - `ram-4-ddr3` → 4GB DDR3 RAM
  - `ram-8-ddr3` → 8GB DDR3 RAM
  - `ram-16-ddr4` → 16GB DDR4 RAM
  - `ram-32-ddr4` → 32GB DDR4 RAM

### SSD Options:
- **Format**: `ssd-{size}`
- **Examples**:
  - `ssd-128` → 128GB SSD
  - `ssd-256` → 256GB SSD
  - `ssd-512` → 512GB SSD
  - `ssd-1024` → 1TB SSD

## Troubleshooting

### Issue 1: Custom prices still not showing
**Possible causes:**
1. Database column not created
   - **Solution**: Run `add-custom-pricing-column.sql` in Supabase
2. Product not saved after setting custom price
   - **Solution**: Click "Save Product" in admin panel
3. Browser cache
   - **Solution**: Hard refresh (Ctrl+Shift+R) or clear cache

**Debug steps:**
1. Open browser console (F12)
2. Look for log: "Filtering RAM options"
3. Check if `hasCustomPricing: true`
4. Verify `customPricingData` contains your prices

### Issue 2: Wrong prices showing
**Possible cause:** Option key mismatch

**Solution:**
1. Check console log for option keys being generated
2. Verify they match format:
   - RAM: `ram-{size}-{ddr3/ddr4}`
   - SSD: `ssd-{size}`
3. Check database: `custom_upgrade_pricing` column should have matching keys

### Issue 3: Some products show custom prices, others don't
**This is expected behavior:**
- Custom pricing is per-product
- Products without custom pricing use default prices from `laptop_upgrade_options`
- This allows mixing:
  - Products with standard pricing
  - Products with special/discounted pricing

## Additional Notes

### Default vs Custom Pricing
- **Default Pricing**: Stored in `laptop_upgrade_options` table (global)
- **Custom Pricing**: Stored in `products.custom_upgrade_pricing` column (per-product)
- Custom pricing always overrides default pricing when present

### Admin Panel Features
- "Reset to default" button removes custom price
- Custom prices are highlighted in amber/yellow color
- Default prices always shown for reference

### Future Enhancements
Consider adding:
1. Bulk custom pricing updates
2. Pricing history/audit log
3. Scheduled pricing (sale prices with date range)
4. Percentage-based discounts instead of fixed prices

## Files Modified
1. ✅ `src/components/LaptopCustomizer.js` - Added custom pricing logic
2. ✅ `add-custom-pricing-column.sql` - Database migration script
3. ✅ `CUSTOM_PRICING_FIX.md` - This documentation

## Files Already Existing (No Changes Needed)
- ✅ `src/components/admin/ProductEditor.js` - Already had custom pricing UI
- ✅ `src/app/api/laptop-upgrade-options/route.js` - Working correctly

---

**Status**: ✅ Fix Complete
**Next Step**: Run database migration and test
