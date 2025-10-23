# Clearance Sale Banner Images

The clearance page references these banner images:
- `/banners/clearance-desktop.jpg` - Desktop banner (1820x800px recommended)
- `/banners/clearance-mobile.jpg` - Mobile banner (768x500px recommended)

## To add the banners:

1. Create clearance sale banners with:
   - Eye-catching "CLEARANCE SALE" text
   - Discount percentages (e.g., "Up to 70% OFF")
   - "Limited Stock" or "While Supplies Last" messaging
   - Brand colors matching the site design

2. Save them as:
   - `public/banners/clearance-desktop.jpg`
   - `public/banners/clearance-mobile.jpg`

## Temporary Fallback:
If banners don't exist, the Banner component will show a broken image icon. You can:
- Use existing hero banners as placeholders
- Update the clearance page to use existing banners
- Create new banners with your preferred design

## Alternative:
You can update the clearance page to use existing banners:
```javascript
<Banner
  desktopImage="/banners/hero banner 1.jpg"
  mobileImage="/banners/hero mobile banner 1.jpg"
  alt="Clearance Sale - Mohit Computers"
  priority
/>
```