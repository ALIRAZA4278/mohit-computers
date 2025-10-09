# Admin Users Management Setup Guide

## Overview
Admin dashboard mein users management feature complete ho gaya hai. Ab admin sare users ko dekh, search kar, aur delete kar sakta hai.

## Features ✅

### 1. **Users List View**
- All registered users ki complete list
- Beautiful table layout with user details
- Pagination (20 users per page)
- Real-time stats

### 2. **Search Functionality**
- Search by name, email, or phone
- Instant search results
- Clear search bar

### 3. **User Details Modal**
- Click "View" (eye icon) to see full details
- Shows all user information:
  - Personal Details (name, email, phone)
  - Complete Address
  - Registration date
  - Last updated date
  - User ID

### 4. **Delete User**
- Click trash icon to delete
- Confirmation modal for safety
- Permanent deletion from database

### 5. **Stats Dashboard**
- Total Users count
- Current page / Total pages
- Users showing on current page

### 6. **Pagination**
- Previous/Next buttons
- Page numbers
- Smooth navigation

## Files Created/Modified

### 1. Admin Users API
**File**: `src/app/api/admin/users/route.js`

Features:
- GET: Fetch all users with pagination and search
- DELETE: Delete a user
- Admin authentication required
- Password protection

Endpoints:
```javascript
GET  /api/admin/users?page=1&limit=20&search=john
DELETE /api/admin/users (body: { userId: 'uuid' })
```

### 2. Users Management Component
**File**: `src/components/admin/UsersManagement.js`

Features:
- Complete users table
- Search bar
- Stats cards
- User details modal
- Delete confirmation
- Pagination controls
- Refresh button

### 3. Admin Page Updated
**File**: `src/app/admin/page.js`

Added UsersManagement component to "users" section.

### 4. Admin Sidebar
**File**: `src/components/admin/AdminSidebar.js`

Already had "Users" option - just connected it.

## How to Access

### Step 1: Login to Admin Panel
1. Go to `/admin`
2. Enter credentials:
   - Email: `mohit316bwebsite@gmail.com`
   - Password: `Rabahsocial`
3. Click Login

### Step 2: Navigate to Users
1. Click "Users" in the sidebar (icon: 👥)
2. Users Management page will open

## Features Breakdown

### Users Table Columns:
| Column | Description |
|--------|-------------|
| **User** | Avatar, Name, Email |
| **Contact** | Phone number |
| **Location** | City, State, Country |
| **Registered** | Account creation date |
| **Actions** | View & Delete buttons |

### Search Examples:
- Search by name: "Ali Raza"
- Search by email: "user@example.com"
- Search by phone: "+92 300"

### Stats Cards:
```
┌─────────────────────┐
│ Total Users         │
│     45              │
└─────────────────────┘

┌─────────────────────┐
│ Current Page        │
│     1 / 3           │
└─────────────────────┘

┌─────────────────────┐
│ Showing             │
│     20 users        │
└─────────────────────┘
```

## API Details

### Get All Users
```javascript
// Request
GET /api/admin/users?page=1&limit=20&search=john
Headers: {
  'Authorization': 'Basic YWRtaW5AbW9oaXRjb21wdXRlcnMuY29tOkFkbWluQDEyMzQ1Ng=='
}

// Response
{
  "success": true,
  "users": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "phone": "+92 300 1234567",
      "current_address": "Full address...",
      "address_line1": "Street 5",
      "city": "Karachi",
      "state": "Sindh",
      "country": "Pakistan",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-02T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

### Delete User
```javascript
// Request
DELETE /api/admin/users
Headers: {
  'Authorization': 'Basic YWRtaW5AbW9oaXRjb21wdXRlcnMuY29tOkFkbWluQDEyMzQ1Ng==',
  'Content-Type': 'application/json'
}
Body: {
  "userId": "user-uuid-here"
}

// Response
{
  "success": true,
  "message": "User deleted successfully"
}
```

## Security Features

1. **Admin Authentication**
   - Basic Auth with credentials
   - Base64 encoded password
   - Only admin can access

2. **Delete Confirmation**
   - Modal confirmation before delete
   - Prevents accidental deletion

3. **Password Protection**
   - Hardcoded credentials in API
   - No password visible in frontend

## Admin Credentials

```javascript
Email: admin@mohitcomputers.com
Password: Admin@123456

// Base64 encoded for API
Authorization: Basic YWRtaW5AbW9oaXRjb21wdXRlcnMuY29tOkFkbWluQDEyMzQ1Ng==
```

## UI Screenshots Description

### Main Users Page:
```
╔══════════════════════════════════════════════════════════╗
║  👥 Users Management                        [Refresh]    ║
║  Manage all registered users                             ║
╠══════════════════════════════════════════════════════════╣
║  [Total: 45]  [Page: 1/3]  [Showing: 20]               ║
╠══════════════════════════════════════════════════════════╣
║  🔍 Search by name, email, or phone...                   ║
╠══════════════════════════════════════════════════════════╣
║  User       | Contact      | Location  | Registered     ║
║  -------------------------------------------------------- ║
║  JD         | +92 300...   | Karachi   | Jan 1, 2024   ║
║  John Doe   |              |           | [👁️] [🗑️]      ║
║  user@...   |              |           |                ║
╚══════════════════════════════════════════════════════════╝
          [← Previous]  [Next →]
```

### User Details Modal:
```
╔══════════════════════════════════════╗
║  User Details                    [✕] ║
╠══════════════════════════════════════╣
║  Name: John Doe                      ║
║  Email: user@example.com             ║
║  Phone: +92 300 1234567              ║
║  User ID: uuid...                    ║
║                                      ║
║  Current Address:                    ║
║  House #123, Street 5...             ║
║                                      ║
║  City: Karachi                       ║
║  State: Sindh                        ║
║  Country: Pakistan                   ║
║                                      ║
║  Created: Jan 1, 2024, 10:00 AM     ║
║  Updated: Jan 2, 2024, 2:30 PM      ║
╠══════════════════════════════════════╣
║                          [Close]     ║
╚══════════════════════════════════════╝
```

## Testing Steps

### 1. Test Users List
1. Login to admin panel
2. Click "Users" in sidebar
3. Should see all users listed
4. Check pagination works

### 2. Test Search
1. Type in search bar
2. Try searching by name
3. Try searching by email
4. Try searching by phone
5. Clear search to see all users

### 3. Test View Details
1. Click eye icon on any user
2. Modal should open
3. Check all fields are displayed
4. Click "Close" to close modal

### 4. Test Delete
1. Click trash icon
2. Confirmation modal should appear
3. Click "Cancel" - nothing happens
4. Click trash icon again
5. Click "Delete" - user removed
6. List refreshes automatically

### 5. Test Refresh
1. Click "Refresh" button
2. Data should reload
3. Stats should update

## Future Enhancements

Possible additions:
- Edit user details
- Export users to CSV/Excel
- User status (active/inactive)
- Filter by registration date
- Bulk delete
- User roles management
- Send email to users
- View user orders
- View user wishlist

## Troubleshooting

### Issue: "Unauthorized" Error
**Solution**: Check admin credentials in API call

### Issue: Users not loading
**Solution**:
1. Check database connection
2. Run address migration SQL
3. Check console for errors

### Issue: Search not working
**Solution**: Make sure search term is at least 1 character

### Issue: Delete not working
**Solution**:
1. Check user ID is correct
2. Check admin authentication
3. User might not exist

## Important Notes

1. ✅ **Database Migration Required**
   - Address columns must exist in users table
   - Run `add-address-to-users.sql` first

2. ✅ **Admin Access Only**
   - Only admin can access this page
   - Regular users cannot see other users

3. ✅ **Delete is Permanent**
   - No undo option
   - Confirmation required
   - Use with caution

4. ✅ **Pagination**
   - 20 users per page
   - Can be changed in API (limit parameter)

All set! Your admin users management is ready. 🎉

## Quick Access
- Admin Panel: `/admin`
- Users Section: Click "Users" in sidebar after login
