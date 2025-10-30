# Product Upload Guide - Mohit Computers

## Excel/CSV Template Fields

### Minimum Required Fields (Basic Upload)
Sirf ye fields zaruri hain product upload karne ke liye:

```csv
Category,Model,Selling Price,Image URL 1
"laptop","HP EliteBook 840 G5","35000","https://example.com/image.jpg"
```

### Complete Template (All Fields)

#### 1. Basic Information
- **Category** - Product category (laptop, ram, workstation, etc.)
- **Model** - Product name/model number
- **Brand** - Brand name (optional, auto-detected from Model)
- **Description** - Detailed product description
- **Selling Price** - Current selling price (required)
- **Original Price** - Original/MRP price (for discount display)
- **SKU** - Unique product code

#### 2. Stock Management
- **Stock Quantity** - Number of items in stock (default: 999 for laptops, 0 for RAM)
- **In Stock** - true/false (default: true)
- **Is Active** - true/false - Show on website (default: true)
- **Is Featured** - true/false - Show in featured section

#### 3. Product Categories & Flags
- **Is Workstation** - true/false - Mark as workstation
- **Is Rugged Tough** - true/false - Mark as rugged laptop
- **Is Clearance** - true/false - Mark as clearance sale
- **Clearance Reason** - Reason for clearance
- **Is Discounted** - true/false - Show discount badge
- **Discount Percentage** - Discount percentage to display

#### 4. Laptop Specifications
- **Processor** - e.g., "Intel Core i5-8250U"
- **Generation** - e.g., "8th Gen"
- **Ram** - e.g., "8GB DDR4"
- **HDD** - Storage, e.g., "256GB SSD"
- **Display Size** - e.g., "14 inch"
- **Resolution (Options)** - e.g., "Full HD (1920x1080)"
- **Integrated Graphics** - e.g., "Intel UHD Graphics 620"
- **Discrete/Dedicated Graphics** - e.g., "NVIDIA GTX 1650"
- **Touch / Non touch / X360** - Touch type
- **Operating Features** - OS and features
- **Extra Features (Connectivity/Ports/Other)** - Additional features
- **Condition** - Good/Excellent/Very Good/Fair
- **Battery** - Battery life/capacity
- **Charger Included** - true/false
- **Warranty** - Warranty period

#### 5. RAM Product Specifications
- **RAM Type** - DDR3/DDR4/DDR5
- **RAM Capacity** - 4GB/8GB/16GB/32GB
- **RAM Speed** - 2400MHz/2666MHz/3200MHz
- **RAM Form Factor** - DIMM/SO-DIMM
- **RAM Condition** - New/Used/Refurbished
- **RAM Warranty** - Warranty period
- **Show RAM Customizer** - true/false

#### 6. Customization Controls
- **Show Laptop Customizer** - true/false (default: true)
- **Show RAM Options** - true/false (default: true)
- **Show SSD Options** - true/false (default: true)

#### 7. Product Images (5 images supported)
- **Image URL 1** - Main/featured image (required)
- **Image URL 2** - Additional image
- **Image URL 3** - Additional image
- **Image URL 4** - Additional image
- **Image URL 5** - Additional image

---

## Quick Start Templates

### Template 1: Basic Laptop Upload
```csv
Category,Model,Brand,Selling Price,Original Price,Processor,Generation,Ram,HDD,Display Size,Condition,Warranty,Image URL 1
"laptop","HP EliteBook 840 G5","HP","35000","40000","Intel Core i5-8250U","8th Gen","8GB DDR4","256GB SSD","14 inch","Excellent","6 months","https://example.com/image.jpg"
```

### Template 2: RAM Product Upload
```csv
Category,Model,Brand,Selling Price,RAM Type,RAM Capacity,RAM Speed,RAM Form Factor,RAM Condition,RAM Warranty,Image URL 1
"ram","Kingston 8GB DDR4","Kingston","2500","DDR4","8GB","2666MHz","DIMM","New","1 year","https://example.com/ram-image.jpg"
```

### Template 3: Workstation Upload
```csv
Category,Model,Brand,Selling Price,Original Price,Is Workstation,Processor,Generation,Ram,HDD,Discrete/Dedicated Graphics,Condition,Warranty,Image URL 1
"workstation","HP Z2 Tower G9","HP","95000","110000","true","Intel Xeon W-1370P","11th Gen","32GB ECC DDR4","1TB NVMe SSD","NVIDIA RTX A2000","Excellent","3 years","https://example.com/workstation.jpg"
```

---

## Field Value Guidelines

### Boolean Fields
Use any of these formats:
- `true` or `false`
- `yes` or `no`
- `1` or `0`

### Price Fields
- Use numbers only (no currency symbols)
- Decimals optional: `35000` or `35000.00`

### Category Values
- `laptop` - Regular laptops
- `workstation` - Workstation laptops
- `ram` - RAM modules
- `ssd` - SSD storage
- `accessories` - Accessories

### Condition Values
- `Excellent`
- `Very Good`
- `Good`
- `Fair`

---

## Common Issues & Solutions

### Issue 1: Products not uploading
**Solution:** Check that:
1. `Model` and `Selling Price` fields are filled
2. CSV file encoding is UTF-8
3. Commas inside text are properly quoted

### Issue 2: Images not showing
**Solution:**
1. Use direct image URLs (not shortened links)
2. Images should be publicly accessible
3. Supported formats: JPG, PNG, WebP

### Issue 3: Special characters showing incorrectly
**Solution:**
1. Save CSV file as UTF-8 encoding
2. Use Excel's "CSV UTF-8" format when saving

---

## Excel Template Download

Admin panel se "Download Template" button se latest template download kar sakte hain.

**Direct route:** `/api/admin/products/csv-template`

---

## Bulk Import Steps

1. **Download Template**
   - Admin Panel → Products → Bulk Import → Download Template

2. **Fill Data**
   - Open template in Excel
   - Fill product details
   - Minimum: Model, Selling Price, Image URL 1

3. **Save File**
   - Save as `.xlsx` (Excel) or `.csv` (CSV UTF-8)

4. **Upload**
   - Admin Panel → Products → Bulk Import
   - Select file
   - Click "Import Products"

5. **Verify**
   - Check success message
   - View imported products in product list

---

## Tips for Best Results

✅ **Do's:**
- Use consistent formatting
- Fill all important fields
- Use high-quality image URLs
- Test with 2-3 products first
- Keep backup of your Excel file

❌ **Don'ts:**
- Don't use special characters in Model names unnecessarily
- Don't leave Price field empty
- Don't use broken/expired image URLs
- Don't upload huge files at once (max 100 products recommended)

---

## Database Schema Compatibility

Current schema supports all these fields. You can use full template without any issues.

**Last Updated:** October 30, 2024
**Schema Version:** v2.0 (Complete with all fields)
