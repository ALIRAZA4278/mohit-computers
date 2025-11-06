# How to Add New Processor Models to Chromebook Dropdown

## Quick Guide

When a new Chromebook processor model is released in the market, you can easily add it to your admin panel dropdown by following these simple steps:

### Step 1: Open the Data File
Navigate to: `src/lib/data.js`

### Step 2: Find the Chromebook Processors Section
Scroll down to line ~300 where you'll see:
```javascript
chromebookProcessors: [
  // Intel Celeron (N-Series) - Entry Level
  'Intel Celeron N2840',
  'Intel Celeron N3050',
  ...
```

### Step 3: Add Your New Processor
Find the appropriate section for your processor type and add it:

#### Example: Adding a New Intel Celeron Model
```javascript
// Intel Celeron (N-Series) - Entry Level
'Intel Celeron N2840',
'Intel Celeron N3050',
'Intel Celeron N3060',
'Intel Celeron N6210',  // ← NEW MODEL ADDED HERE
```

#### Example: Adding a New Intel Core i5 Model
```javascript
// Intel Core i5 - 12th Gen
'Intel Core i5-1235U',  // ← NEW MODEL ADDED HERE
'Intel Core i5 (12th Gen)',
```

#### Example: Adding a New MediaTek Model
```javascript
// MediaTek - ARM-based Chromebooks
'MediaTek MT8173C',
'MediaTek MT8183',
'MediaTek MT8195',  // ← NEW MODEL ADDED HERE
```

### Step 4: Save the File
That's it! No restart needed. The new processor will immediately appear in:
- ✅ Admin Panel → Add/Edit Chromebook Product → Processor Dropdown
- ✅ Chromebook Filters on the website

## Available Processor Categories

The file is organized into sections for easy management:

1. **Intel Celeron (N-Series)** - Entry level Chromebook processors
2. **Intel Celeron (Other Series)** - U-Series and Y-Series
3. **Intel Pentium (N-Series)** - Mid-range processors
4. **Intel Pentium (Gold Series)** - Better Pentium models
5. **Intel Core m3** - Ultra low power processors
6. **Intel Core i3** - By generation (7th, 8th, 10th, 11th Gen)
7. **Intel Core i5** - By generation (7th, 8th, 10th, 11th Gen)
8. **Intel Core i7** - By generation (8th, 10th, 11th Gen)
9. **AMD Processors** - AMD Ryzen for Chromebooks
10. **MediaTek Processors** - ARM-based Chromebook chips
11. **Qualcomm Snapdragon** - ARM-based processors
12. **Generic Options** - Fallback options like "Intel Celeron", "Other"

## Naming Convention

Follow these formats for consistency:

- **Specific Model:** `Intel Celeron N4500` or `Intel Core i5-8265U`
- **Generic with Generation:** `Intel Core i5 (11th Gen)`
- **Generic without Generation:** `Intel Celeron` or `AMD Processor`

## Tips

- ✅ Keep processors in chronological/numerical order
- ✅ Add comments to separate different generations
- ✅ Use exact Intel/AMD naming (check manufacturer website)
- ✅ Test the dropdown in admin panel after adding

## File Location
```
📁 mohit-computers/
  └── 📁 src/
      └── 📁 lib/
          └── 📄 data.js (Line ~300)
```

## Need Help?

If you're unsure about a processor name or generation:
1. Check Intel ARK: https://ark.intel.com/
2. Check AMD Product Specs: https://www.amd.com/
3. Check MediaTek: https://www.mediatek.com/
4. Google: "Chromebook [processor model]"

---

**Last Updated:** 2025-01-06
**File Version:** v1.0
