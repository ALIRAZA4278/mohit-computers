# User Address Fields Setup Guide

## Overview
User address fields have been added to the database and integrated into the application.

## Database Migration

### Run this SQL in Supabase SQL Editor:
```sql
-- File: add-address-to-users.sql

ALTER TABLE users
ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS address_line1 VARCHAR(255),
ADD COLUMN IF NOT EXISTS address_line2 VARCHAR(255),
ADD COLUMN IF NOT EXISTS city VARCHAR(100),
ADD COLUMN IF NOT EXISTS state VARCHAR(100),
ADD COLUMN IF NOT EXISTS postal_code VARCHAR(20),
ADD COLUMN IF NOT EXISTS country VARCHAR(100) DEFAULT 'Pakistan';

-- Create index for phone number lookups
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
```

## Fields Added

### User Table Columns:
1. **phone** (VARCHAR 20) - User's phone number
2. **address_line1** (VARCHAR 255) - Primary address line (street, house number, etc.)
3. **address_line2** (VARCHAR 255) - Secondary address line (apartment, suite, etc.) - Optional
4. **city** (VARCHAR 100) - City name
5. **state** (VARCHAR 100) - State/Province name
6. **postal_code** (VARCHAR 20) - Postal/ZIP code
7. **country** (VARCHAR 100) - Country name (default: Pakistan)

## Files Updated

### 1. Database Schema
- **File**: `add-address-to-users.sql`
- Added address columns to users table
- Added phone number index

### 2. Registration API
- **File**: `src/app/api/auth/register/route.js`
- Now accepts address fields during registration:
  - `phone`
  - `address_line1` (or `address` for backward compatibility)
  - `address_line2`
  - `city`
  - `state`
  - `postal_code`
  - `country`

### 3. Account Page
- **File**: `src/app/account/page.js`
- Updated profile tab to display address fields
- Organized into three sections:
  - **Personal Details**: Name, Email, Phone
  - **Address Details**: Full address fields
  - **Account Information**: User ID, Created date

### 4. Registration Page
- **File**: `src/app/register/page.js`
- Already has address field with geolocation
- API now supports detailed address fields

## Display in Account Page

The account page now shows address information in a structured format:

```
Personal Details
├── First Name
├── Last Name
├── Email Address
└── Phone Number

Address Details
├── Address Line 1
├── Address Line 2 (Optional)
├── City
├── State/Province
├── Postal Code
└── Country

Account Information
├── User ID
└── Account Created
```

## Example Registration Request

```javascript
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "+92 300 1234567",
  "address_line1": "House #123, Street 5",
  "address_line2": "Block A, Sector 1",
  "city": "Karachi",
  "state": "Sindh",
  "postal_code": "75500",
  "country": "Pakistan"
}
```

## Backward Compatibility

The API maintains backward compatibility:
- Old `address` field maps to `address_line1`
- All address fields are optional (NULL allowed)
- Default country is "Pakistan"

## Steps to Deploy

1. ✅ Run the SQL migration in Supabase
2. ✅ API is already updated
3. ✅ Account page is already updated
4. ✅ Registration API supports new fields

## Testing

### Test Address Display:
1. Run the SQL migration first
2. Log in to your account
3. Go to Profile tab in account page
4. You should see address fields (currently showing "Not provided")

### Test Address Registration:
1. Register a new user with address details
2. Check if data saves correctly in database
3. Verify display in account page

## Future Enhancements

Possible improvements:
- Add edit functionality for profile
- Add address validation
- Integrate Google Maps API for address autocomplete
- Multiple addresses per user
- Shipping vs billing address

## Database Query to Check

```sql
-- Check if columns exist
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'users'
  AND column_name IN ('phone', 'address_line1', 'address_line2', 'city', 'state', 'postal_code', 'country');

-- View user data with address
SELECT id, name, email, phone, address_line1, city, state, country
FROM users
LIMIT 5;
```

All set! Your user address management system is ready. 🎉
