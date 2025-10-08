# Mohit Computers - E-commerce & Blog Platform

A modern e-commerce platform built with Next.js, Supabase, and Tailwind CSS, featuring a complete blog management system and online store functionality.

## 🚀 Features

### **E-commerce Store**
- Product catalog with categories
- Shopping cart functionality
- Product comparison system
- Wishlist management
- User authentication
- Responsive design

### **Blog Management System**
- Rich text editor with markdown support
- Image upload with Supabase storage
- SEO optimization
- Categories and tags
- Admin dashboard
- Draft/Published status

### **Admin Panel**
- Complete blog management
- Image gallery management
- User-friendly interface
- Real-time preview
- File upload with drag & drop

## 🛠️ Tech Stack

- **Framework:** Next.js 15.5.4
- **Database:** Supabase (PostgreSQL)
- **Storage:** Supabase Storage
- **Authentication:** Supabase Auth
- **Styling:** Tailwind CSS
- **UI Components:** Lucide React Icons
- **Markdown:** React Markdown with GFM support
- **Editor:** MDEditor for rich text editing

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ALIRAZA4278/mohit-computers.git
   cd mohit-computers
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. **Set up Supabase database:**
   - Go to your Supabase project dashboard
   - Run the SQL commands from `supabase-schema.sql` in the SQL Editor
   - Create storage buckets: `images`, `blogs`, `products` (all public)

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗂️ Project Structure

```
src/
├── app/
│   ├── admin/          # Admin dashboard
│   ├── blog/           # Blog pages
│   ├── api/            # API routes
│   └── ...
├── components/
│   ├── admin/          # Admin components
│   ├── BlogCard.js     # Blog display component
│   ├── ImageUploader.js # File upload component
│   └── ...
├── context/
│   ├── AuthContext.js  # Authentication context
│   ├── CartContext.js  # Shopping cart context
│   └── ...
└── lib/
    ├── supabase-db.js  # Database operations
    └── supabase.js     # Supabase client
```

## 🔧 Configuration

### **Supabase Setup**
1. Create a new Supabase project
2. Copy your project URL and anon key to `.env.local`
3. Run the database schema from `supabase-schema.sql`
4. Create storage buckets for images

### **Storage Buckets**
Create these public buckets in Supabase Storage:
- `images` - General images
- `blogs` - Blog post images  
- `products` - Product images

## 📝 Usage

### **Admin Panel**
- Access: `/admin`
- Create and manage blog posts
- Upload images with drag & drop
- Preview content before publishing
- Manage gallery images

### **Blog System**
- View blogs: `/blog`
- Individual posts: `/blog/[slug]`
- Categories and tags support
- SEO optimized pages

### **E-commerce**
- Product catalog: `/products`
- Shopping cart: `/cart`
- Product comparison: `/compare`
- User wishlist: `/wishlist`

## 🚀 Deployment

### **Vercel (Recommended)**
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### **Other Platforms**
- Build: `npm run build`
- Start: `npm start`
- Ensure environment variables are configured

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🛟 Support

For support and questions:
- Create an issue on GitHub
- Contact: ALIRAZA4278@github.com

---

**Built with ❤️ for Mohit Computers**



