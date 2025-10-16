# Laptop Upgrade Pricing Reference

## RAM Upgrade Pricing (Based on Processor Generation)

### DDR3/DDR3L RAM (3rd, 4th, 5th Generation)

| Processor Generation | RAM Option | Price (Rs) |
|---------------------|------------|-----------|
| 3rd Gen            | 4GB DDR3   | 1,000     |
| 3rd Gen            | 8GB DDR3   | 2,500     |
| 4th Gen            | 4GB DDR3   | 1,000     |
| 4th Gen            | 8GB DDR3   | 2,500     |
| 5th Gen            | 4GB DDR3   | 1,000     |
| 5th Gen            | 8GB DDR3   | 2,500     |

### DDR4 RAM (6th to 11th Generation)

| Processor Generation | RAM Option | Price (Rs) |
|---------------------|------------|-----------|
| 6th Gen            | 4GB DDR4   | 3,200     |
| 6th Gen            | 8GB DDR4   | 6,000     |
| 6th Gen            | 16GB DDR4  | 11,500    |
| 7th Gen            | 4GB DDR4   | 3,200     |
| 7th Gen            | 8GB DDR4   | 6,000     |
| 7th Gen            | 16GB DDR4  | 11,500    |
| 8th Gen            | 4GB DDR4   | 3,200     |
| 8th Gen            | 8GB DDR4   | 6,000     |
| 8th Gen            | 16GB DDR4  | 11,500    |
| 9th Gen            | 4GB DDR4   | 3,200     |
| 9th Gen            | 8GB DDR4   | 6,000     |
| 9th Gen            | 16GB DDR4  | 11,500    |
| 10th Gen           | 4GB DDR4   | 3,200     |
| 10th Gen           | 8GB DDR4   | 6,000     |
| 10th Gen           | 16GB DDR4  | 11,500    |
| 11th Gen           | 4GB DDR4   | 3,200     |
| 11th Gen           | 8GB DDR4   | 6,000     |
| 11th Gen           | 16GB DDR4  | 11,500    |

---

## SSD Upgrade Pricing (Based on Current Storage)

### From 125GB / 128GB SSD

| Current Storage | Upgrade To | Price (Rs) |
|----------------|------------|-----------|
| 125GB SSD      | 256GB SSD  | 3,000     |
| 125GB SSD      | 512GB SSD  | 8,000     |
| 125GB SSD      | 1TB SSD    | 18,500    |
| 128GB SSD      | 256GB SSD  | 3,000     |
| 128GB SSD      | 512GB SSD  | 8,000     |
| 128GB SSD      | 1TB SSD    | 18,500    |

### From 256GB SSD

| Current Storage | Upgrade To | Price (Rs) |
|----------------|------------|-----------|
| 256GB SSD      | 512GB SSD  | 8,000     |
| 256GB SSD      | 1TB SSD    | 15,500    |

### From 512GB SSD

| Current Storage | Upgrade To | Price (Rs) |
|----------------|------------|-----------|
| 512GB SSD      | 1TB SSD    | 10,500    |

---

## How It Works

### Admin Panel:
1. Admin creates a laptop product
2. Enters **Processor Generation** (e.g., "8th Gen")
3. Enters **Current Storage** (e.g., "256GB SSD")
4. System **automatically** shows available upgrade options with prices

### Customer View:
1. Customer views product detail page
2. Sees available RAM upgrades based on processor generation
3. Sees available SSD upgrades based on current storage
4. Can select upgrades and see total price update in real-time

---

## Examples

### Example 1: 4th Gen Laptop with 125GB SSD

**Product Specs:**
- Processor: Intel Core i5 4th Gen
- Current Storage: 125GB SSD
- Current RAM: 4GB

**Available Upgrades:**
- RAM: 4GB DDR3 (Rs 1,000) | 8GB DDR3 (Rs 2,500)
- SSD: 256GB (Rs 3,000) | 512GB (Rs 8,000) | 1TB (Rs 18,500)

**Customer selects:**
- 8GB DDR3 RAM → Rs 2,500
- 512GB SSD → Rs 8,000
- **Total Upgrade Cost: Rs 10,500**

---

### Example 2: 8th Gen Laptop with 256GB SSD

**Product Specs:**
- Processor: Intel Core i7 8th Gen
- Current Storage: 256GB SSD
- Current RAM: 8GB

**Available Upgrades:**
- RAM: 4GB DDR4 (Rs 3,200) | 8GB DDR4 (Rs 6,000) | 16GB DDR4 (Rs 11,500)
- SSD: 512GB (Rs 8,000) | 1TB (Rs 15,500)

**Customer selects:**
- 16GB DDR4 RAM → Rs 11,500
- 1TB SSD → Rs 15,500
- **Total Upgrade Cost: Rs 27,000**

---

### Example 3: 10th Gen Laptop with 512GB SSD

**Product Specs:**
- Processor: Intel Core i5 10th Gen
- Current Storage: 512GB SSD
- Current RAM: 8GB

**Available Upgrades:**
- RAM: 4GB DDR4 (Rs 3,200) | 8GB DDR4 (Rs 6,000) | 16GB DDR4 (Rs 11,500)
- SSD: 1TB (Rs 10,500)

**Customer selects:**
- 16GB DDR4 RAM → Rs 11,500
- 1TB SSD → Rs 10,500
- **Total Upgrade Cost: Rs 22,000**

---

## Implementation Files

| File | Purpose |
|------|---------|
| `src/lib/upgradeOptions.js` | Contains all pricing rules and helper functions |
| `src/components/admin/ProductEditor.js` | Admin interface showing automatic upgrade options |
| `src/app/products/[id]/page.js` | Customer-facing product detail page (needs update) |

---

## Notes

- **125GB and 128GB are treated the same** - Both show identical upgrade paths and prices
- **Generation must match exactly**: "3rd Gen", "4th Gen", etc.
- **Storage format**: "125GB SSD", "256GB SSD", "512GB SSD", "1TB SSD"
- **12th Gen and above**: Default to DDR4 pricing (can be updated later for DDR5)
- **Custom upgrades**: Admin can still add manual options for special configurations

---

## Testing Checklist

- [ ] Create laptop with 3rd Gen → Verify DDR3 options show (1000, 2500)
- [ ] Create laptop with 8th Gen → Verify DDR4 options show (3200, 6000, 11500)
- [ ] Set storage to 125GB → Verify upgrades to 256GB, 512GB, 1TB
- [ ] Set storage to 128GB → Verify same upgrades as 125GB
- [ ] Set storage to 256GB → Verify upgrades to 512GB, 1TB only
- [ ] Set storage to 512GB → Verify upgrade to 1TB only
- [ ] Set storage to 1TB → Verify NO upgrade options show
- [ ] Change generation → Verify RAM options update automatically
- [ ] Change storage → Verify SSD options update automatically
