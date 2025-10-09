# Wishlist Feature Setup Guide

## Overview
The wishlist feature has been implemented with the following capabilities:
- ✅ Store wishlist data in Supabase database (for logged-in users)
- ✅ Store wishlist in localStorage (for non-logged-in users)
- ✅ Sync localStorage wishlist to database when user logs in
- ✅ Remove items from wishlist (syncs with database)
- ✅ Display full product details in user account page

## Database Setup

### Step 1: Run the SQL Schema
You need to create the wishlist table in your Supabase database:

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **SQL Editor** from the left sidebar
4. Click **New Query**
5. Copy and paste the contents of `wishlist-schema.sql` file
6. Click **Run** or press `Ctrl+Enter`

The SQL file creates:
- A `wishlist` table to store user wishlist items
- Indexes for faster lookups
- Foreign key relationship with the `users` table

### Alternative: Use existing users.wishlist column
If you prefer to keep using the existing `wishlist` column in the `users` table (which is already set up), you don't need to run the SQL file. The current implementation already uses this approach.

## How It Works

### For Non-Logged-In Users:
1. When a user adds products to wishlist, they are stored in **localStorage**
2. Data persists across browser sessions
3. When user logs in, localStorage wishlist is automatically synced to database

### For Logged-In Users:
1. Wishlist items are stored in the database under `users.wishlist` column
2. Only **product IDs** are stored in database (not full product data)
3. When displaying wishlist, full product details are fetched from the products table
4. Changes are synced in real-time to the database

### Key Features:
- ✅ **Add to Wishlist**: Click heart icon on product cards
- ✅ **Remove from Wishlist**: Click heart icon again or use remove button in account page
- ✅ **View Wishlist**: Go to `/wishlist` or account page → Wishlist tab
- ✅ **Auto-sync**: localStorage wishlist syncs to database on login
- ✅ **Full Product Display**: Shows complete product info with images, prices, stock status

## File Changes Made

### 1. Database Schema
- **File**: `wishlist-schema.sql` (optional - for separate wishlist table)
- Current implementation uses existing `users.wishlist` column

### 2. API Routes
- **File**: `src/app/api/user/wishlist/route.js` (already existed)
- Endpoints:
  - `GET /api/user/wishlist` - Fetch user's wishlist
  - `POST /api/user/wishlist` - Add product to wishlist
  - `DELETE /api/user/wishlist` - Remove product from wishlist

### 3. Wishlist Context
- **File**: `src/context/WishlistContext.js`
- Added database sync functionality
- Added localStorage support for non-logged-in users
- Auto-sync on login

### 4. Account Page
- **File**: `src/app/account/page.js`
- Updated to display full product details instead of just IDs
- Added product images, prices, and stock status
- Added remove button for each wishlist item

### 5. Product Card
- **File**: `src/components/ProductCard.js` (no changes needed)
- Already has wishlist functionality

## Testing

### Test for Non-Logged-In Users:
1. Visit the products page without logging in
2. Click heart icon on any product
3. Go to `/wishlist` - you should see the product
4. Refresh the page - wishlist should persist (localStorage)
5. Log in - wishlist should sync to database automatically

### Test for Logged-In Users:
1. Log in to your account
2. Go to products page and add items to wishlist
3. Check your account page → Wishlist tab
4. You should see full product cards with images and details
5. Try removing items - they should be removed from database
6. Log out and log back in - wishlist should persist

## API Testing

You can test the API endpoints using the following:

```bash
# Get wishlist (requires auth token)
curl -X GET http://localhost:3000/api/user/wishlist \
  -H "Authorization: Bearer YOUR_TOKEN"

# Add to wishlist
curl -X POST http://localhost:3000/api/user/wishlist \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productId": "PRODUCT_ID"}'

# Remove from wishlist
curl -X DELETE http://localhost:3000/api/user/wishlist \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productId": "PRODUCT_ID"}'
```

## Troubleshooting

### Wishlist not syncing?
- Check if JWT token is valid in localStorage
- Check browser console for errors
- Verify Supabase connection in `.env` file

### Products not showing in account page?
- Make sure products exist in the database
- Check if product IDs in wishlist match actual product IDs
- Verify `/api/products` endpoint is working

### localStorage not persisting?
- Check if browser allows localStorage
- Try clearing cache and cookies
- Check browser console for localStorage errors

## Next Steps

1. ✅ Run the SQL file (optional) or keep using existing setup
2. ✅ Test the wishlist functionality
3. ✅ Verify database sync is working
4. ✅ Check both logged-in and non-logged-in flows

All set! Your wishlist feature is ready to use. 🎉
