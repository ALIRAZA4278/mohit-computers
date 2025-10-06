// Seed file to initialize data for mohit computers

// This file contains the initial data structure for the mohit computers website
// In a real application, this data would be stored in a database like Firebase or MongoDB

export const initializeData = () => {
  console.log('Initializing mohit computers data...');
  
  // Check if data is already in localStorage
  const existingProducts = localStorage.getItem('computerzone_products');
  const existingCategories = localStorage.getItem('computerzone_categories');
  
  if (!existingProducts) {
    // Initialize products in localStorage for demo purposes
    localStorage.setItem('computerzone_products', JSON.stringify(products));
    console.log('Products initialized in localStorage');
  }
  
  if (!existingCategories) {
    // Initialize categories in localStorage
    localStorage.setItem('computerzone_categories', JSON.stringify(categories));
    console.log('Categories initialized in localStorage');
  }
  
  console.log('Data initialization complete!');
};

// Sample product data structure
const sampleProduct = {
  id: 1,
  name: "HP EliteBook 840 G5",
  category: "used-laptop",
  brand: "HP",
  price: 35000,
  originalPrice: 85000,
  image: "/images/hp-elitebook.jpg",
  processor: "Intel Core i5-8250U",
  storage: "256GB SSD",
  ram: "8GB DDR4",
  display: "14\" Full HD",
  generation: "8th Gen",
  condition: "Excellent",
  warranty: "6 months",
  inStock: true,
  featured: true,
  description: "Professional grade laptop in excellent condition.",
  specifications: {
    processor: "Intel Core i5-8250U (1.6GHz up to 3.4GHz)",
    ram: "8GB DDR4",
    storage: "256GB SSD",
    display: "14\" Full HD (1920x1080) IPS",
    graphics: "Intel UHD Graphics 620",
    os: "Windows 11 Pro",
    battery: "Up to 8 hours",
    weight: "1.48 kg"
  }
};

// Database schema for MongoDB/Firebase
export const databaseSchema = {
  collections: {
    products: {
      fields: [
        'id', 'name', 'category', 'brand', 'price', 'originalPrice',
        'image', 'processor', 'storage', 'ram', 'display', 'generation',
        'condition', 'warranty', 'inStock', 'featured', 'description',
        'specifications', 'createdAt', 'updatedAt'
      ],
      indexes: ['category', 'brand', 'price', 'inStock', 'featured']
    },
    
    ordeRs:{
      fields: [
        'id', 'customerId', 'customerName', 'customerEmail', 'customerPhone',
        'products', 'totalAmount', 'status', 'paymentMethod', 'shippingAddress',
        'orderDate', 'deliveryDate', 'notes'
      ],
      indexes: ['customerId', 'status', 'orderDate']
    },
    
    customeRs:{
      fields: [
        'id', 'name', 'email', 'phone', 'address', 'company',
        'customerType', 'registrationDate', 'totalOrders', 'totalSpent'
      ],
      indexes: ['email', 'customerType']
    },
    
    categories: {
      fields: [
        'id', 'name', 'description', 'image', 'brands', 'isActive'
      ]
    },
    
    blogPosts: {
      fields: [
        'id', 'title', 'category', 'excerpt', 'content', 'image',
        'author', 'date', 'readTime', 'tags', 'published'
      ],
      indexes: ['category', 'published', 'date']
    },
    
    inquiries: {
      fields: [
        'id', 'name', 'email', 'phone', 'subject', 'message',
        'type', 'status', 'createdAt', 'respondedAt'
      ],
      indexes: ['status', 'type', 'createdAt']
    }
  }
};

// API endpoints structure for future implementation
export const apiEndpoints = {
  products: {
    getAll: '/api/products',
    getById: '/api/products/:id',
    getByCategory: '/api/products/category/:category',
    search: '/api/products/search',
    create: '/api/products', // Admin only
    update: '/api/products/:id', // Admin only
    delete: '/api/products/:id' // Admin only
  },
  
  ordeRs:{
    create: '/api/orders',
    getByCustomer: '/api/orders/customer/:customerId',
    getById: '/api/orders/:id',
    updateStatus: '/api/orders/:id/status' // Admin only
  },
  
  customeRs:{
    register: '/api/customers/register',
    login: '/api/customers/login',
    profile: '/api/customers/profile',
    update: '/api/customers/profile'
  },
  
  contact: {
    submit: '/api/contact',
    quote: '/api/contact/quote'
  },
  
  blog: {
    getAll: '/api/blog',
    getById: '/api/blog/:id',
    getByCategory: '/api/blog/category/:category'
  }
};

// Environment variables template
export const envTemplate = `
# mohit computers Environment Variables

# Database Configuration
DATABASE_URL=mongodb://localhost:27017/computerzone
# or for Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# Email Configuration (for contact forms)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Payment Gateway (for future implementation)
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret

# Google Maps API (for store location)
GOOGLE_MAPS_API_KEY=your-google-maps-key

# JWT Secret (for authentication)
JWT_SECRET=your-jwt-secret-key

# Application Settings
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_COMPANY_NAME=mohit computers
NEXT_PUBLIC_COMPANY_EMAIL=info@computerzone.com
NEXT_PUBLIC_COMPANY_PHONE=+92 336 8900349
`;

// Deployment checklist
export const deploymentChecklist = [
  '✅  All pages created and working',
  '✅  Responsive design implemented',
  '✅  Context providers for cart, wishlist, compare',
  '✅  Product filtering and sorting',
  '✅  Contact forms',
  '⏳  Database integration (Firebase/MongoDB)',
  '⏳  Payment gateway integration',
  '⏳  Email service integration',
  '⏳  Image optimization and CDN',
  '⏳  SEO optimization',
  '⏳  Performance optimization',
  '⏳  Security implementation',
  '⏳  Admin panel',
  '⏳  User authentication',
  '⏳  Order management system'
];

console.log('mohit computers Seed File Loaded');
console.log('Deployment Checklist:', deploymentChecklist);