# Authentication & User Management Setup Guide

## Overview
This application now has a complete authentication system with email-based registration, login, and user management features.

## Features Implemented

### 1. User Registration
- User creates account with email and password
- Password is hashed using bcryptjs before saving to database
- Welcome email is sent to user with their credentials
- User data stored in Supabase database

### 2. User Login
- Email and password authentication
- JWT token generation for session management
- Token stored as HTTP-only cookie
- User data saved to localStorage for frontend access

### 3. Database Schema
- Users table with the following fields:
  - `id` (UUID): Primary key
  - `email` (VARCHAR): Unique email address
  - `password` (VARCHAR): Hashed password
  - `name` (VARCHAR): User's full name
  - `wishlist` (JSONB): Array of product IDs in wishlist
  - `orders` (JSONB): Array of order objects
  - `created_at` (TIMESTAMP): Account creation date
  - `updated_at` (TIMESTAMP): Last update date

### 4. Cart Management
- Cart data stored in localStorage
- Persists across browser sessions
- No authentication required
- Managed by CartContext

### 5. User Features
- Wishlist management (add/remove products)
- Order history tracking
- User ID-based data isolation

## Setup Instructions

### 1. Database Setup

Run the SQL schema in your Supabase database:

```bash
# Execute the users-schema.sql file in Supabase SQL Editor
```

The file `users-schema.sql` contains:
- Users table creation
- Indexes for performance
- Automatic timestamp updates

### 2. Environment Variables

Update your `.env` file with the following:

```env
# Existing Supabase configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Email Configuration (for Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM_NAME=Your Store Name

# JWT Secret (generate a secure random string)
JWT_SECRET=your-jwt-secret-key-change-this-in-production
```

### 3. Gmail Setup for Email Sending

To use Gmail for sending emails:

1. Enable 2-Factor Authentication on your Google Account
2. Generate an App Password:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the generated password
3. Use this App Password in `EMAIL_PASSWORD` environment variable

**Note:** For production, consider using services like SendGrid, Mailgun, or AWS SES.

### 4. JWT Secret Generation

Generate a secure JWT secret:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use any secure random string generator
```

## API Endpoints

### Authentication

#### Register
- **POST** `/api/auth/register`
- Body: `{ email, password, name }`
- Response: `{ success, message, user }`

#### Login
- **POST** `/api/auth/login`
- Body: `{ email, password }`
- Response: `{ success, message, user, token }`

#### Logout
- **POST** `/api/auth/logout`
- Response: `{ success, message }`

### User Management

#### Get Wishlist
- **GET** `/api/user/wishlist`
- Headers: `Authorization: Bearer <token>`
- Response: `{ success, wishlist }`

#### Add to Wishlist
- **POST** `/api/user/wishlist`
- Headers: `Authorization: Bearer <token>`
- Body: `{ productId }`
- Response: `{ success, message, wishlist }`

#### Remove from Wishlist
- **DELETE** `/api/user/wishlist`
- Headers: `Authorization: Bearer <token>`
- Body: `{ productId }`
- Response: `{ success, message, wishlist }`

#### Get Orders
- **GET** `/api/user/orders`
- Headers: `Authorization: Bearer <token>`
- Response: `{ success, orders }`

#### Create Order
- **POST** `/api/user/orders`
- Headers: `Authorization: Bearer <token>`
- Body: `{ items, total, shippingAddress, paymentMethod }`
- Response: `{ success, message, order }`

## Frontend Usage

### Registration Flow
1. User fills registration form at `/register`
2. Form validates password match and length
3. API creates user and sends welcome email
4. User redirected to login page
5. User checks email for credentials

### Login Flow
1. User enters email and password at `/login`
2. API validates credentials
3. JWT token set in HTTP-only cookie
4. User data saved to localStorage
5. User redirected to home page

### Accessing User Data
```javascript
// Get current user
const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');

// Check if user is logged in
const isLoggedIn = !!user && !!token;
```

### Making Authenticated Requests
```javascript
const response = await fetch('/api/user/wishlist', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
  },
});
```

## Cart Management

Cart is managed via `CartContext` and uses localStorage:

```javascript
import { useCart } from '@/context/CartContext';

function MyComponent() {
  const { cartItems, addToCart, removeFromCart, updateQuantity, clearCart } = useCart();

  // Add product to cart
  addToCart(product);

  // Remove product from cart
  removeFromCart(productId);

  // Update quantity
  updateQuantity(productId, newQuantity);

  // Clear entire cart
  clearCart();
}
```

## Security Features

1. **Password Hashing**: Passwords hashed with bcryptjs (10 rounds)
2. **JWT Tokens**: Secure token-based authentication
3. **HTTP-only Cookies**: Prevents XSS attacks
4. **Token Verification**: All protected routes verify JWT
5. **Database Isolation**: Service role key used server-side only

## Testing the System

### 1. Test Registration
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

### 2. Test Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 3. Test Wishlist (with token)
```bash
curl -X GET http://localhost:3000/api/user/wishlist \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Troubleshooting

### Email Not Sending
- Check EMAIL_USER and EMAIL_PASSWORD are correct
- Verify App Password is generated (for Gmail)
- Check SMTP settings for your email provider

### JWT Errors
- Ensure JWT_SECRET is set in .env
- Check token is being sent in requests
- Verify token hasn't expired (7 day expiry)

### Database Errors
- Verify users table is created in Supabase
- Check SUPABASE_SERVICE_ROLE_KEY is correct
- Ensure user doesn't already exist (unique email)

## Next Steps

Consider implementing:
1. Email verification (verify email before activation)
2. Password reset functionality
3. OAuth (Google, Facebook login)
4. User profile management
5. Password change feature
6. Account deletion
7. Admin dashboard for user management
8. Rate limiting for API endpoints
9. Refresh token system
10. Two-factor authentication (2FA)

## File Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── register/route.js
│   │   │   ├── login/route.js
│   │   │   └── logout/route.js
│   │   └── user/
│   │       ├── wishlist/route.js
│   │       └── orders/route.js
│   ├── register/page.js
│   └── login/page.js
├── context/
│   └── CartContext.js
└── lib/
    ├── nodemailer.js
    └── auth.js

Database:
└── users-schema.sql
```

## Support

For issues or questions:
1. Check the Troubleshooting section
2. Review API endpoint documentation
3. Check Supabase logs for database errors
4. Verify all environment variables are set correctly
