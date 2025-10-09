# Profile Edit Feature Setup Guide

## Overview
User profile edit functionality has been implemented with address management.

## Features Added ✅

### 1. **Profile Edit Mode**
- Edit button in Profile tab
- Save and Cancel buttons when editing
- Real-time validation
- Success/Error messages

### 2. **Current Address Field**
- New textarea field for complete current residential address
- Easy to read and update
- Separate from structured address fields

### 3. **Editable Fields**
Users can now update:
- ✅ Full Name
- ✅ Phone Number
- ✅ Current Address (new field)
- ✅ Address Line 1
- ✅ Address Line 2
- ✅ City
- ✅ State/Province
- ✅ Postal Code
- ✅ Country

### 4. **Non-Editable Fields**
- ❌ Email (cannot be changed for security)
- ❌ User ID
- ❌ Account Created Date

## Files Created/Modified

### 1. Profile Update API
**File**: `src/app/api/user/profile/update/route.js`

Endpoint: `PUT /api/user/profile/update`

Request body:
```json
{
  "name": "John Doe",
  "phone": "+92 300 1234567",
  "current_address": "House #123, Street 5, Block A, Sector 1, Karachi",
  "address_line1": "House #123, Street 5",
  "address_line2": "Block A, Sector 1",
  "city": "Karachi",
  "state": "Sindh",
  "postal_code": "75500",
  "country": "Pakistan"
}
```

Response:
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": { /* updated user object */ }
}
```

### 2. Account Page
**File**: `src/app/account/page.js`

New features:
- Edit/Save/Cancel buttons
- Toggle between view and edit modes
- Form state management
- Success/Error message display
- Auto-update localStorage on save

### 3. Database Migration
**File**: `add-address-to-users.sql`

Added `current_address` field:
```sql
ADD COLUMN IF NOT EXISTS current_address TEXT
```

## Database Setup

Run this in Supabase SQL Editor:

```sql
-- Add current_address field (if not already added)
ALTER TABLE users
ADD COLUMN IF NOT EXISTS current_address TEXT;

-- Add comment
COMMENT ON COLUMN users.current_address IS 'User complete current residential address';
```

## How It Works

### View Mode (Default)
1. All fields are read-only with gray background
2. "Edit Profile" button visible at top right
3. Email shown with note "Email cannot be changed"

### Edit Mode
1. Click "Edit Profile" button
2. Editable fields turn white and become active
3. "Save Changes" and "Cancel" buttons appear
4. User can modify fields
5. Click "Save Changes" to update
6. Success message appears
7. Automatically switches back to view mode

### Behind the Scenes
1. When "Edit Profile" clicked:
   - Form data copied to edit state
   - UI switches to edit mode

2. When user types:
   - Edit form state updates
   - Original user data unchanged

3. When "Save Changes" clicked:
   - API call to `/api/user/profile/update`
   - Database updated
   - User state updated
   - localStorage updated
   - Success message shown
   - Switch back to view mode

4. When "Cancel" clicked:
   - Edit form state cleared
   - Switch back to view mode
   - No changes saved

## UI Flow

```
┌─────────────────────────────────────┐
│   Profile Information   [Edit]      │
├─────────────────────────────────────┤
│                                     │
│  Personal Details                   │
│  ├─ Full Name (editable)           │
│  ├─ Email (read-only)              │
│  └─ Phone (editable)               │
│                                     │
│  Address Details                    │
│  ├─ Current Address (new, editable)│
│  ├─ Address Line 1 (editable)      │
│  ├─ Address Line 2 (editable)      │
│  ├─ City (editable)                │
│  ├─ State (editable)               │
│  ├─ Postal Code (editable)         │
│  └─ Country (editable)             │
│                                     │
│  Account Information                │
│  ├─ User ID (read-only)            │
│  └─ Account Created (read-only)    │
│                                     │
└─────────────────────────────────────┘
```

## Testing Steps

### 1. View Profile
1. Login to your account
2. Go to Profile tab
3. See all your information in read-only mode

### 2. Edit Profile
1. Click "Edit Profile" button (top right)
2. Fields become editable (white background)
3. Update any field
4. Click "Save Changes"
5. See success message
6. Data is saved

### 3. Cancel Edit
1. Click "Edit Profile"
2. Make some changes
3. Click "Cancel"
4. Changes are discarded
5. Back to view mode

### 4. Update Current Address
1. Click "Edit Profile"
2. Find "Current Address" textarea
3. Enter complete address
4. Save
5. Address is stored in database

## API Authorization

All requests require JWT token:
```javascript
headers: {
  'Authorization': 'Bearer YOUR_JWT_TOKEN'
}
```

Token is automatically retrieved from localStorage.

## Error Handling

The API handles:
- ❌ Unauthorized requests (no token)
- ❌ Invalid token
- ❌ Database errors
- ✅ All errors shown to user with message

## Security Features

1. **Email Protection**: Email cannot be changed
2. **Authentication Required**: Must be logged in
3. **User-Specific**: Can only update own profile
4. **Token Validation**: JWT verified on each request

## Future Enhancements

Possible improvements:
- Password change functionality
- Profile picture upload
- Email verification for email change
- Phone number verification
- Address autocomplete
- Multiple addresses
- Billing vs Shipping address

## Deployment Checklist

1. ✅ Run SQL migration (`add-address-to-users.sql`)
2. ✅ Update API endpoint is created
3. ✅ Account page has edit functionality
4. ✅ Test edit and save
5. ✅ Test cancel
6. ✅ Verify data persists

All set! Your profile edit feature is ready to use. 🎉

## Example Usage

```javascript
// Update profile
const updateProfile = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/user/profile/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      name: 'Updated Name',
      phone: '+92 300 1234567',
      current_address: 'My complete address here',
      city: 'Karachi'
    })
  });

  const data = await response.json();
  console.log(data.message); // "Profile updated successfully"
};
```
