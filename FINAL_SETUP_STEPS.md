# Final Setup Steps - Authentication System

## ✅ Completed Steps:

1. ✅ Installed dependencies (nodemailer, bcryptjs, jsonwebtoken)
2. ✅ Created API endpoints for registration and login
3. ✅ Updated frontend forms (register and login pages)
4. ✅ Configured email settings in .env
5. ✅ Generated JWT secret
6. ✅ Created database schema file
7. ✅ Cart already working with localStorage
8. ✅ Created wishlist and orders API endpoints

## 📋 Remaining Steps (You Need to Do):

### Step 1: Create Users Table in Supabase

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `kbttumwtijiphvjplolj`
3. Click on "SQL Editor" in the left sidebar
4. Click "New Query"
5. Copy the entire content from `users-schema.sql` file
6. Paste it in the SQL editor
7. Click "Run" or press Ctrl+Enter

**SQL to run:**
```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  wishlist JSONB DEFAULT '[]'::jsonb,
  orders JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### Step 2: Verify Table Creation

After running the SQL, verify in Supabase:
1. Go to "Table Editor" in left sidebar
2. You should see a new table called "users"
3. Check that it has these columns:
   - id (uuid)
   - email (varchar)
   - password (varchar)
   - name (varchar)
   - wishlist (jsonb)
   - orders (jsonb)
   - created_at (timestamptz)
   - updated_at (timestamptz)

### Step 3: Test the System

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Test Registration:**
   - Open browser: http://localhost:3000/register
   - Fill the form with:
     - First Name: Test
     - Last Name: User
     - Email: test@example.com
     - Password: password123
     - Confirm Password: password123
   - Check "I agree to terms"
   - Click "Create Account"
   - Check your email (mohit316bwebsite@gmail.com inbox) for the welcome email

3. **Test Login:**
   - Go to: http://localhost:3000/login
   - Enter the email and password
   - Click "Sign in"
   - You should be redirected to home page

4. **Check localStorage:**
   - Open browser console (F12)
   - Go to "Application" tab → "Local Storage"
   - You should see:
     - `user` - User data
     - `token` - JWT token
     - `cart` - Cart items

## 🔧 Environment Variables (Already Set):

```env
✅ NEXT_PUBLIC_SUPABASE_URL=https://kbttumwtijiphvjplolj.supabase.co
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY=(set)
✅ SUPABASE_SERVICE_ROLE_KEY=(set)
✅ EMAIL_HOST=smtp.gmail.com
✅ EMAIL_PORT=587
✅ EMAIL_USER=mohit316bwebsite@gmail.com
✅ EMAIL_PASSWORD=italsqobnrgvtbcy
✅ EMAIL_FROM_NAME=Mohit Computers
✅ JWT_SECRET=93ffe71d6e567651bd127c95f041a78301374ff35cf777b336e761fc8dcb3643
```

## 📁 Files Created:

### Backend (API):
- ✅ `src/app/api/auth/register/route.js` - Registration endpoint
- ✅ `src/app/api/auth/login/route.js` - Login endpoint
- ✅ `src/app/api/user/wishlist/route.js` - Wishlist management
- ✅ `src/app/api/user/orders/route.js` - Orders management

### Frontend:
- ✅ `src/app/register/page.js` - Registration form (updated)
- ✅ `src/app/login/page.js` - Login form (updated)

### Libraries:
- ✅ `src/lib/nodemailer.js` - Email sending functionality
- ✅ `src/lib/auth.js` - JWT authentication helper

### Database:
- ✅ `users-schema.sql` - Database schema

### Documentation:
- ✅ `AUTHENTICATION_SETUP.md` - English guide
- ✅ `SETUP_GUIDE_HINDI.md` - Hinglish guide
- ✅ `FINAL_SETUP_STEPS.md` - This file

## 🎯 How It Works:

### Registration Flow:
```
User fills form → API receives data → Hash password → Save to database →
Send email with password → Redirect to login
```

### Login Flow:
```
User enters credentials → API verifies password → Generate JWT token →
Save token as cookie → Save user data to localStorage → Redirect to home
```

### Cart Flow:
```
Add to cart → Save to localStorage → Retrieve on page load
(No login required)
```

### Wishlist/Orders Flow:
```
User must be logged in → Send request with JWT token →
API verifies token → Update database → Return updated data
```

## 🔐 Security Features:

1. **Password Hashing**: bcryptjs with 10 rounds
2. **JWT Tokens**: 7-day expiry
3. **HTTP-only Cookies**: Prevents XSS
4. **Token Verification**: All protected routes check JWT
5. **Email Validation**: Unique email constraint
6. **Database Isolation**: Service role key server-side only

## 📞 API Endpoints:

### Public (No Auth Required):
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login

### Protected (JWT Required):
- `GET /api/user/wishlist` - Get wishlist
- `POST /api/user/wishlist` - Add to wishlist
- `DELETE /api/user/wishlist` - Remove from wishlist
- `GET /api/user/orders` - Get orders
- `POST /api/user/orders` - Create order

## 🐛 Common Issues & Solutions:

### Email not sending?
- Check Gmail credentials in .env
- Verify app password is correct
- Check internet connection
- Check spam folder

### Can't login?
- Verify user exists in Supabase
- Check password is correct
- Clear browser cache
- Check browser console for errors

### Database errors?
- Run users-schema.sql in Supabase
- Check SUPABASE_SERVICE_ROLE_KEY
- Verify table exists in Supabase

### JWT errors?
- Check JWT_SECRET is set
- Verify token format
- Check token hasn't expired

## 🚀 You're Ready!

Once you complete **Step 1** (Create users table in Supabase), everything is ready to use!

The complete authentication system with:
- ✅ User registration with email
- ✅ Login system
- ✅ Cart (localStorage)
- ✅ Wishlist (database)
- ✅ Orders (database)
- ✅ Email notifications

Is now fully implemented and configured!

## 📝 Next Features to Add (Optional):

1. Email verification
2. Forgot password
3. Change password
4. User profile page
5. Order tracking
6. Admin dashboard
7. OAuth (Google/Facebook login)
8. Two-factor authentication

---

**Need Help?** Check the documentation files:
- `AUTHENTICATION_SETUP.md` - Detailed English guide
- `SETUP_GUIDE_HINDI.md` - Hinglish guide with examples
