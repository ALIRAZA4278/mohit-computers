# SEO-Only Products Feature Guide

## Overview
The SEO-Only feature allows you to have products that are:
- ✅ **Visible to search engines** (Google, Bing, etc.) for SEO purposes
- ✅ **Accessible via direct product URL** for sharing
- ❌ **Hidden from all catalog listings** (homepage, category pages, product listing, search)
- ❌ **Not visible when users browse normally**

This is useful for:
1. **Discontinued products** that still rank well in search engines
2. **Special landing pages** for specific marketing campaigns
3. **Products you want to test** without showing to all visitors
4. **SEO optimization** - keep high-ranking pages live without cluttering your catalog

---

## Setup Instructions

### Step 1: Run Database Migration

Visit the following URL to add the `seo_only` column to your products table:

```
http://localhost:3000/api/setup/add-seo-only-field
```

Or for production:
```
https://yourdomain.com/api/setup/add-seo-only-field
```

**Manual SQL (if automatic migration fails):**
```sql
ALTER TABLE products
ADD COLUMN IF NOT EXISTS seo_only BOOLEAN DEFAULT false;

COMMENT ON COLUMN products.seo_only IS 'If true, product is only visible via direct URL and to search engines (not in catalog listings)';
```

---

## How to Use

### Method 1: Admin Panel

1. Go to **Admin Panel** → **Product Management**
2. Edit any product or create a new one
3. Scroll to the **Product Flags** section
4. Check the **"SEO Only (Hidden from Catalog)"** checkbox
5. Save the product

When enabled, you'll see an info message:
> **SEO Only Mode:** This product will be hidden from all catalog listings but will still be accessible via direct URL and visible to search engines.

### Method 2: Excel/CSV Bulk Upload

Download the updated template:
- Simple Template: `http://localhost:3000/api/admin/products/csv-template?type=simple`
- Full Template: `http://localhost:3000/api/admin/products/csv-template?type=full`

**Column Name:** `SEO Only`
**Valid Values:** `true`, `false`, `yes`, `no`, `1`, `0`

**Example:**
```csv
Category,Model,Brand,Selling Price,Original Price,Processor,Generation,Ram,HDD,Display Size,Condition,Warranty,SEO Only,Image URL 1
"laptop","HP EliteBook 850 G6","HP","42000","48000","Intel Core i7-8565U","8th Gen","16GB DDR4","512GB SSD","15.6 inch","Excellent","6 months","true","https://example.com/image.jpg"
```

---

## Where SEO-Only Products Are Hidden

SEO-only products are **automatically filtered out** from:

1. **Homepage** (`/`)
   - Featured Products carousel
   - New Arrivals section
   - Workstation Products section
   - Accessories section

2. **Products Page** (`/products`)
   - All category listings
   - Brand filtering
   - Search results

3. **Clearance Page** (`/clearance`)
   - Discounted products listing

4. **Workstation Page** (`/workstation`)
   - Workstation-specific listings

5. **Any other product listing pages**

---

## Where SEO-Only Products Are STILL Visible

1. **Direct Product URL**
   - `/products/[product-slug]` - Full product page works normally
   - Users can still purchase the product

2. **Search Engine Crawlers**
   - Google, Bing can still index and show in search results
   - Sitemap includes SEO-only products (recommended for SEO)

3. **Admin Panel**
   - Visible in product management
   - Can be edited/managed normally

---

## Technical Implementation

### Database Schema
```sql
Column: seo_only
Type: BOOLEAN
Default: false
```

### Filtering Logic
```javascript
// Client-side filtering (applied automatically)
const catalogProducts = products.filter(product => !product.seo_only);
```

### Files Modified

1. **Database Migration:**
   - `src/app/api/setup/add-seo-only-field/route.js`

2. **CSV/Excel Templates:**
   - `src/app/api/admin/products/csv-template/route.js`
   - Added "SEO Only" column

3. **Bulk Import Handler:**
   - `src/app/api/admin/products/bulk-import/route.js`
   - Handles `seo_only` field parsing

4. **Product Listing Pages:**
   - `src/app/page.js` (Homepage)
   - `src/app/products/page.js`
   - `src/app/clearance/page.js`
   - `src/app/workstation/page.js`

5. **Admin Panel:**
   - `src/components/admin/ProductEditor.js`
   - Added SEO Only checkbox toggle

6. **Stock Status Sorting:**
   - All listing pages now show in-stock products first, out-of-stock last

---

## Testing the Feature

### Test Scenario 1: Normal Browsing
1. Mark a product as "SEO Only"
2. Visit homepage - product should NOT appear
3. Visit category pages - product should NOT appear
4. Search for the product - should NOT appear in results

### Test Scenario 2: Direct URL Access
1. Copy the direct product URL: `/products/[product-slug]`
2. Visit the URL directly
3. Product page should load normally ✅
4. Add to cart should work ✅

### Test Scenario 3: Google Search
1. Ensure product has good SEO (title, description, images)
2. Let Google crawl your site (may take days/weeks)
3. Product should appear in Google search results
4. Clicking from Google → direct URL → works ✅

---

## Best Practices

### ✅ Good Use Cases:
- Products that rank well in Google but are discontinued
- Special promotional landing pages
- Products for specific marketing campaigns
- A/B testing products before full catalog launch

### ❌ Avoid:
- Hiding low-stock products (use stock status instead)
- Hiding products from specific users (needs authentication logic)
- SEO manipulation (search engines may penalize)

---

## FAQs

**Q: Will Google still index SEO-only products?**
A: Yes! The product page is fully accessible via direct URL, so search engines can crawl and index it.

**Q: Can customers buy SEO-only products?**
A: Yes, if they have the direct URL. The product page works normally.

**Q: What's the difference between "SEO Only" and "Is Active = false"?**
A:
- `Is Active = false` → Product completely hidden, not accessible at all
- `SEO Only = true` → Hidden from catalog, but accessible via direct URL

**Q: How do I bulk convert products to SEO-only?**
A: Use the Excel export feature, add a "SEO Only" column with `true` values, then bulk import.

**Q: Will this affect my sitemap?**
A: The sitemap should include SEO-only products for Google to find them. Update your sitemap generator if needed.

---

## Support

If you encounter any issues:
1. Check browser console for errors
2. Verify database migration ran successfully
3. Check product has correct `seo_only` value in database
4. Clear browser cache and test again

For advanced customization, see the source code in the files listed above.
