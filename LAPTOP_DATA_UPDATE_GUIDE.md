# Laptop Data Update Guide

## Overview
Database se sare laptops ka data fetch karke unka description aur image URL add karne ke 2 methods hain:

## Method 1: SQL Script (Recommended - Fastest)

### Step 1: Supabase SQL Editor Open Karo
1. https://supabase.com/dashboard par jao
2. Apna project select karo
3. Left sidebar se **SQL Editor** click karo
4. **New Query** click karo

### Step 2: SQL Script Copy Paste Karo
File: `update-laptops-description.sql` ka content copy karo aur paste karo.

Ya directly yeh paste karo (sample):

```sql
-- Dell Laptops
UPDATE products
SET
  description = 'Experience powerful performance with this Dell laptop featuring ' || processor || ' processor, ' || ram || ' of RAM, and ' || COALESCE(hdd, storage, 'ample storage') || '...',
  featured_image = 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800'
WHERE (category_id = 'laptop' OR category_id = 'used-laptop')
  AND (description IS NULL OR featured_image IS NULL)
  AND LOWER(brand) LIKE '%dell%';
```

### Step 3: Run Query
- **RUN** button click karo ya `Ctrl+Enter`
- Success message aana chahiye

### Step 4: Verify
Query run karo:
```sql
SELECT
  COUNT(*) as total_laptops,
  COUNT(CASE WHEN description IS NOT NULL THEN 1 END) as with_description,
  COUNT(CASE WHEN featured_image IS NOT NULL THEN 1 END) as with_image
FROM products
WHERE category_id IN ('laptop', 'used-laptop', 'chromebook');
```

Result mein aapko dikhega:
- Total laptops
- Kitne laptops ka description hai
- Kitne laptops ka image URL hai

---

## Method 2: Node.js Script (Advanced)

### Step 1: Script File Check Karo
File: `scripts/update-laptop-data.js`

### Step 2: Dependencies Install Karo
```bash
npm install @supabase/supabase-js dotenv
```

### Step 3: .env File Check Karo
Make sure `.env` file mein yeh hai:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Step 4: Script Run Karo
```bash
node scripts/update-laptop-data.js
```

### Step 5: Output Check Karo
Script console mein show karega:
- Kitne laptops found hue
- Kaunse laptops update ho rahe hain
- Description aur image URL preview
- Success/failure status

---

## Description Template

Har brand ke liye alag description generate hota hai:

### Dell:
```
Experience powerful performance with this Dell laptop featuring [processor] processor,
[RAM] of RAM, and [storage]. The [display] provides crystal-clear visuals for work
and entertainment. Perfect for students, professionals, and everyday computing needs...
```

### HP:
```
Discover reliability and performance with this HP laptop powered by [processor]
processor, [RAM] RAM, and [storage]. The [display] delivers exceptional visuals...
```

### Lenovo:
```
Unleash productivity with this Lenovo laptop equipped with [processor] processor,
[RAM] memory, and [storage]. Renowned for durability and innovation...
```

### Asus:
```
Elevate your computing experience with this ASUS laptop featuring [processor]
processor, [RAM] of high-speed RAM, and [storage]. ASUS combines innovation...
```

### Acer:
```
Boost your productivity with this Acer laptop powered by [processor] processor,
[RAM] RAM, and [storage]. Acer laptops are known for affordability...
```

### Apple/MacBook:
```
Experience the pinnacle of innovation with this Apple MacBook featuring [processor]
chip, [RAM] unified memory, and [storage]. MacBooks are the choice of creative
professionals...
```

---

## Image URLs

Brand-specific Unsplash images:

| Brand | Image URL |
|-------|-----------|
| Dell | `https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800` |
| HP | `https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800` |
| Lenovo | `https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=800` |
| Asus | `https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800` |
| Acer | `https://images.unsplash.com/photo-1594762645655-15c8c1ebc1d6?w=800` |
| Apple/MacBook | `https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800` |
| Generic | `https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800` |

---

## How It Works

### SQL Method:
1. Database mein directly UPDATE query chalti hai
2. Har brand ke liye alag query
3. `processor`, `ram`, `storage`, `display` fields se dynamic description banta hai
4. COALESCE use hota hai null values handle karne ke liye
5. Image URL brand ke basis par set hota hai

### Node.js Method:
1. Supabase se sare laptops fetch hote hain
2. Har laptop ke liye description generate hota hai
3. Brand check karke image URL milta hai
4. Database mein update hota hai
5. Console mein progress show hota hai

---

## Features

✅ **Dynamic Descriptions**
- Laptop specs se automatically generate hote hain
- Processor, RAM, Storage, Display include hote hain
- Brand-specific messaging

✅ **Brand-Specific Images**
- High-quality Unsplash images
- Professional laptop photos
- Brand ke according select hote hain

✅ **Smart Updates**
- Sirf wahi laptops update hote hain jinke description/image nahi hai
- Existing data preserve rahta hai
- Safe aur efficient

✅ **Multiple Brands**
- Dell, HP, Lenovo, Asus, Acer supported
- Apple/MacBook special handling
- Generic fallback for others

---

## Example Results

### Before:
```
Name: Dell Inspiron 15
Description: NULL
Featured_image: NULL
```

### After:
```
Name: Dell Inspiron 15
Description: Experience powerful performance with this Dell laptop featuring
             Intel Core i5 processor, 8GB of RAM, and 256GB SSD. The 15.6"
             Full HD display provides crystal-clear visuals...
Featured_image: https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800
```

---

## Verification Query

Update ke baad yeh query run karo:

```sql
-- Check updated laptops
SELECT
  name,
  brand,
  CASE
    WHEN description IS NOT NULL THEN '✅ Has Description'
    ELSE '❌ No Description'
  END as desc_status,
  CASE
    WHEN featured_image IS NOT NULL THEN '✅ Has Image'
    ELSE '❌ No Image'
  END as image_status
FROM products
WHERE category_id IN ('laptop', 'used-laptop', 'chromebook')
ORDER BY brand, name
LIMIT 20;
```

---

## Troubleshooting

### Issue: SQL Error
**Solution**:
- Check column names match (processor, ram, hdd, storage, display_size, display)
- Make sure products table exists
- Verify Supabase connection

### Issue: No Updates Happening
**Possible Causes**:
1. Laptops already have descriptions
2. Category_id doesn't match ('laptop', 'used-laptop', 'chromebook')
3. Brand name doesn't match patterns

**Solution**:
```sql
-- Check which laptops need updates
SELECT id, name, brand, category_id, description, featured_image
FROM products
WHERE category_id IN ('laptop', 'used-laptop', 'chromebook')
  AND (description IS NULL OR featured_image IS NULL)
LIMIT 10;
```

### Issue: Images Not Loading
**Solution**:
- Unsplash URLs are free and work
- Check internet connection
- URLs mein `?w=800` width parameter hai

---

## Best Practices

1. ✅ **Backup First**
   ```sql
   -- Create backup
   CREATE TABLE products_backup AS SELECT * FROM products;
   ```

2. ✅ **Test on Small Batch**
   ```sql
   -- Update only 5 laptops first
   UPDATE products
   SET description = '...', featured_image = '...'
   WHERE id IN (SELECT id FROM products WHERE category_id = 'laptop' LIMIT 5);
   ```

3. ✅ **Verify Before Production**
   - Run SELECT queries first
   - Check data quality
   - Test image URLs

---

## Custom Images

Agar aapke paas real laptop images hain:

```sql
-- Update with your own images
UPDATE products
SET featured_image = 'https://your-cdn.com/images/laptop-dell-1.jpg'
WHERE id = 'specific-laptop-id';
```

Ya bulk update:
```sql
-- Update multiple laptops with custom images
UPDATE products
SET featured_image = CASE
  WHEN id = 'laptop-1' THEN 'https://your-cdn.com/dell-1.jpg'
  WHEN id = 'laptop-2' THEN 'https://your-cdn.com/hp-1.jpg'
  ELSE featured_image
END
WHERE id IN ('laptop-1', 'laptop-2');
```

---

## Summary

### Quick Steps:
1. ✅ Open Supabase SQL Editor
2. ✅ Copy-paste SQL script
3. ✅ Run query
4. ✅ Verify results
5. ✅ Done! 🎉

### Files:
- 📁 `update-laptops-description.sql` - SQL script
- 📁 `scripts/update-laptop-data.js` - Node.js script
- 📁 `LAPTOP_DATA_UPDATE_GUIDE.md` - This guide

Ab sare laptops ka description aur image automatically add ho jayega! 🚀
