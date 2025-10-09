# Authentication Setup Guide (Hinglish)

## Kya Implement Kiya Gaya Hai?

### 1. User Registration (Account Banana)
- User apna email aur password daalke account create karta hai
- Password ko hash karke database mein save kiya jata hai (security ke liye)
- User ko welcome email milega jisme uska password hoga
- User ka data Supabase database mein store hota hai

### 2. Login System
- Email aur password se login kar sakte ho
- JWT token milega jo session manage karega
- User ka data localStorage mein save hoga

### 3. Database
Users table mein ye fields hain:
- `id`: Har user ki unique ID
- `email`: User ka email
- `password`: Encrypted password
- `name`: User ka naam
- `wishlist`: Products jo user ne wishlist mein add kiye
- `orders`: User ke saare orders
- `created_at`: Account kab bana
- `updated_at`: Last update

### 4. Cart Management
- Cart ka data localStorage mein save hota hai
- Browser band karne ke baad bhi cart items rahengi
- Login ki zarurat nahi cart ke liye

### 5. Wishlist aur Orders
- Har user apni wishlist mein products add kar sakta hai
- Orders ka history milega
- Har user ka data alag alag stored hai

## Setup Kaise Kare?

### 1. Database Setup

Supabase mein SQL run karo:

```bash
# users-schema.sql file ko Supabase SQL Editor mein run karo
```

### 2. Email Configuration

`.env` file mein ye add karo:

```env
# Gmail ke liye
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tumhara-email@gmail.com
EMAIL_PASSWORD=app-password-yaha-daalo
EMAIL_FROM_NAME=Tumhara Store Ka Naam

# JWT Secret (koi bhi random secure string)
JWT_SECRET=koi-secure-random-string-yaha-daalo
```

### 3. Gmail Setup (Email Bhejne Ke Liye)

Gmail se email bhejne ke liye:

1. Google Account mein 2-Factor Authentication enable karo
2. App Password banao:
   - Yaha jao: https://myaccount.google.com/apppasswords
   - "Mail" select karo
   - Password copy karo
3. Ye password `.env` file mein `EMAIL_PASSWORD` mein daalo

### 4. JWT Secret Generate Karo

Secure random string banao:

```bash
# Node.js se
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Kaise Kaam Karta Hai?

### Registration (Naya Account)
1. User `/register` page par jata hai
2. Email, password, name fill karta hai
3. Password automatically email par chala jata hai
4. User ka account database mein create ho jata hai
5. User ko login page par redirect kar diya jata hai
6. User email check karke password dekhta hai

### Login
1. User `/login` page par jata hai
2. Email aur password enter karta hai
3. System verify karta hai
4. User login ho jata hai
5. Home page par redirect ho jata hai

### Cart (Shopping Cart)
```javascript
// Cart mein product add karo
addToCart(product);

// Product remove karo
removeFromCart(productId);

// Quantity change karo
updateQuantity(productId, newQuantity);

// Puri cart clear karo
clearCart();
```

### Wishlist
```javascript
// Wishlist mein add karo
POST /api/user/wishlist
Body: { productId: "123" }

// Wishlist se remove karo
DELETE /api/user/wishlist
Body: { productId: "123" }

// Wishlist dekhao
GET /api/user/wishlist
```

### Orders
```javascript
// Naya order banao
POST /api/user/orders
Body: {
  items: [...],
  total: 5000,
  shippingAddress: "...",
  paymentMethod: "..."
}

// Saare orders dekhao
GET /api/user/orders
```

## Important Files

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── register/route.js    (Registration API)
│   │   │   └── login/route.js       (Login API)
│   │   └── user/
│   │       ├── wishlist/route.js    (Wishlist API)
│   │       └── orders/route.js      (Orders API)
│   ├── register/page.js              (Registration Form)
│   └── login/page.js                 (Login Form)
├── context/
│   └── CartContext.js                (Cart Management)
└── lib/
    ├── nodemailer.js                 (Email Sending)
    └── auth.js                       (Authentication Helper)

Database:
└── users-schema.sql                  (Database Schema)
```

## Testing Kaise Kare?

### 1. Development Server Chalao
```bash
npm run dev
```

### 2. Account Banao
- Browser mein `http://localhost:3000/register` kholo
- Form fill karo
- Submit karo
- Email check karo password ke liye

### 3. Login Karo
- `http://localhost:3000/login` kholo
- Email aur password daalo (jo email mein aaya)
- Login karo

### 4. Cart Test Karo
- Koi product add karo cart mein
- Browser band karo aur dubara kholo
- Cart items wahi rahengi

## Common Problems aur Solutions

### Email Nahi Aa Raha
- EMAIL_USER aur EMAIL_PASSWORD check karo
- Gmail App Password correctly generate kiya hai ya nahi check karo
- Internet connection check karo

### Login Nahi Ho Raha
- Email aur password sahi hai ya nahi check karo
- Database mein user create hua hai ya nahi check karo
- Browser console mein errors check karo

### Database Error Aa Raha Hai
- Supabase mein users table create kiya hai ya nahi check karo
- `.env` file mein SUPABASE credentials sahi hain ya nahi check karo
- Supabase logs mein errors dekhao

## Security Features

1. **Password Encryption**: Passwords encrypted hokar save hote hain
2. **JWT Tokens**: Secure tokens se authentication hoti hai
3. **HTTP-only Cookies**: XSS attacks se protection
4. **User Data Isolation**: Har user ka data alag stored hai

## Flow Chart

```
Registration Flow:
User -> Form Fill -> API Call -> Database Save -> Email Send -> Login Page

Login Flow:
User -> Email/Password -> API Verify -> Token Generate -> Home Page

Cart Flow:
User -> Add to Cart -> Save to localStorage -> Retrieve on Page Load

Wishlist Flow:
User -> Login Required -> Add/Remove Product -> Save to Database -> Show in UI
```

## Next Steps (Aage Kya Kar Sakte Ho)

1. Email verification (Email confirm karne ke baad hi account active ho)
2. Forgot password functionality
3. Google/Facebook login
4. User profile page (Photo, name edit kar sake)
5. Password change option
6. Order tracking
7. Admin panel

## Notes

- **Cart**: Login ki zarurat nahi, localStorage mein store hota hai
- **Wishlist**: Login required, database mein store hota hai
- **Orders**: Login required, database mein store hota hai
- **Password**: Email mein plain text mein milega, database mein encrypted save hoga

## Help

Agar koi problem ho to:
1. Console mein errors check karo
2. Network tab mein API responses check karo
3. Supabase logs check karo
4. Environment variables sahi set hain ya nahi check karo

## Important Commands

```bash
# Dependencies install karo
npm install

# Development server chalao
npm run dev

# Production build banao
npm run build

# Production server chalao
npm start
```

Koi bhi doubt ho to documentation padhlo ya browser console mein errors dekhlo!
