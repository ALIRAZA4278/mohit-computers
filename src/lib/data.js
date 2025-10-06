// Dummy data for mohit computers

export const categories = [
  {
    id: 'used-laptop',
    name: 'Used Laptop',
    image: '/images/used-laptop.jpg',
    description: 'High-quality refurbished laptops',
    brands: ['HP', 'Dell', 'Lenovo', 'Acer']
  },
  {
    id: 'chromebook',
    name: 'Chromebook',
    image: '/images/chromebook.jpg',
    description: 'Fast and secure Chrome OS laptops',
    brands: ['Google', 'HP', 'Lenovo', 'ASUS']
  },
  {
    id: 'accessories',
    name: 'Accessories',
    image: '/images/accessories.jpg',
    description: 'Laptop accessories and peripherals',
    brands: ['Logitech', 'HP', 'Dell', 'Generic']
  },
  {
    id: 'ram',
    name: 'RAM',
    image: '/images/ram.jpg',
    description: 'Memory upgrades for your laptop',
    brands: ['Kingston', 'Corsair', 'Crucial', 'Samsung']
  },
  {
    id: 'ssd',
    name: 'SSD',
    image: '/images/ssd.jpg',
    description: 'Fast storage solutions',
    brands: ['Samsung', 'Kingston', 'WD', 'Crucial']
  }
];

export const products = [
  // Used Laptops
  {
    id: 1,
    name: 'HP EliteBook 840 G5',
    category: 'used-laptop',
    brand: 'HP',
    price: 35000,
    originalPrice: 85000,
    image: '/images/hp-elitebook.jpg',
    processor: 'Intel Core i5-8250U',
    storage: '256GB SSD',
    ram: '8GB DDR4',
    display: '14" Full HD',
    generation: '8th Gen',
    condition: 'Excellent',
    warranty: '6 months',
    inStock: true,
    featured: true,
    description: 'Professional grade laptop in excellent condition. Perfect for business and productivity work.',
    specifications: {
      processor: 'Intel Core i5-8250U (1.6GHz up to 3.4GHz)',
      ram: '8GB DDR4',
      storage: '256GB SSD',
      display: '14" Full HD (1920x1080) IPS',
      graphics: 'Intel UHD Graphics 620',
      os: 'Windows 11 Pro',
      battery: 'Up to 8 hours',
      weight: '1.48 kg'
    }
  },
  {
    id: 2,
    name: 'Dell Latitude 7390',
    category: 'used-laptop',
    brand: 'Dell',
    price: 38000,
    originalPrice: 90000,
    image: '/images/dell-latitude.jpg',
    processor: 'Intel Core i7-8650U',
    storage: '512GB SSD',
    ram: '16GB DDR4',
    display: '13.3" Full HD',
    generation: '8th Gen',
    condition: 'Very Good',
    warranty: '6 months',
    inStock: true,
    featured: true,
    description: 'Ultra-portable business laptop with premium build quality and excellent performance.',
    specifications: {
      processor: 'Intel Core i7-8650U (1.9GHz up to 4.2GHz)',
      ram: '16GB DDR4',
      storage: '512GB NVMe SSD',
      display: '13.3" Full HD (1920x1080) IPS',
      graphics: 'Intel UHD Graphics 620',
      os: 'Windows 11 Pro',
      battery: 'Up to 10 hours',
      weight: '1.22 kg'
    }
  },
  {
    id: 3,
    name: 'Lenovo ThinkPad T480',
    category: 'used-laptop',
    brand: 'Lenovo',
    price: 32000,
    originalPrice: 78000,
    image: '/images/lenovo-thinkpad.jpg',
    processor: 'Intel Core i5-8350U',
    storage: '256GB SSD',
    ram: '8GB DDR4',
    display: '14" Full HD',
    generation: '8th Gen',
    condition: 'Good',
    warranty: '3 months',
    inStock: true,
    featured: false,
    description: 'Reliable ThinkPad with legendary keyboard and robust build quality.',
    specifications: {
      processor: 'Intel Core i5-8350U (1.7GHz up to 3.6GHz)',
      ram: '8GB DDR4',
      storage: '256GB SSD',
      display: '14" Full HD (1920x1080) IPS',
      graphics: 'Intel UHD Graphics 620',
      os: 'Windows 11 Pro',
      battery: 'Up to 9 hours',
      weight: '1.58 kg'
    }
  },
  {
    id: 4,
    name: 'Acer Aspire 5 A515-54G',
    category: 'used-laptop',
    brand: 'Acer',
    price: 28000,
    originalPrice: 65000,
    image: '/images/acer-aspire.jpg',
    processor: 'Intel Core i5-10210U',
    storage: '1TB HDD + 128GB SSD',
    ram: '8GB DDR4',
    display: '15.6" Full HD',
    generation: '10th Gen',
    condition: 'Good',
    warranty: '3 months',
    inStock: true,
    featured: false,
    description: 'Versatile laptop with dedicated graphics, perfect for students and casual gaming.',
    specifications: {
      processor: 'Intel Core i5-10210U (1.6GHz up to 4.2GHz)',
      ram: '8GB DDR4',
      storage: '1TB HDD + 128GB SSD',
      display: '15.6" Full HD (1920x1080)',
      graphics: 'NVIDIA GeForce MX250 2GB',
      os: 'Windows 11 Home',
      battery: 'Up to 7 hours',
      weight: '1.8 kg'
    }
  },

  // Chromebooks
  {
    id: 5,
    name: 'HP Chromebook 14',
    category: 'chromebook',
    brand: 'HP',
    price: 22000,
    originalPrice: 35000,
    image: '/images/hp-chromebook.jpg',
    processor: 'Intel Celeron N4020',
    storage: '64GB eMMC',
    ram: '4GB LPDDR4',
    display: '14" HD',
    generation: 'Latest',
    condition: 'New',
    warranty: '1 year',
    inStock: true,
    featured: true,
    description: 'Fast, secure, and simple Chromebook for everyday computing.',
    specifications: {
      processor: 'Intel Celeron N4020 (1.1GHz up to 2.8GHz)',
      ram: '4GB LPDDR4',
      storage: '64GB eMMC',
      display: '14" HD (1366x768)',
      graphics: 'Intel UHD Graphics 600',
      os: 'Chrome OS',
      battery: 'Up to 13.5 hours',
      weight: '1.47 kg'
    }
  },
  {
    id: 6,
    name: 'Lenovo Chromebook C330',
    category: 'chromebook',
    brand: 'Lenovo',
    price: 25000,
    originalPrice: 40000,
    image: '/images/lenovo-chromebook.jpg',
    processor: 'MediaTek MT8173C',
    storage: '64GB eMMC',
    ram: '4GB LPDDR3',
    display: '11.6" HD Touch',
    generation: 'Latest',
    condition: 'New',
    warranty: '1 year',
    inStock: true,
    featured: false,
    description: '2-in-1 convertible Chromebook with touchscreen.',
    specifications: {
      processor: 'MediaTek MT8173C (2.1GHz)',
      ram: '4GB LPDDR3',
      storage: '64GB eMMC',
      display: '11.6" HD (1366x768) Touch',
      graphics: 'PowerVR GX6250',
      os: 'Chrome OS',
      battery: 'Up to 10 hours',
      weight: '1.2 kg'
    }
  },

  // RAM
  {
    id: 7,
    name: 'Kingston ValueRAM 8GB DDR4',
    category: 'ram',
    brand: 'Kingston',
    price: 2500,
    originalPrice: 3500,
    image: '/images/kingston-ram.jpg',
    processor: 'N/A',
    storage: 'N/A',
    ram: '8GB DDR4-2666',
    display: 'N/A',
    generation: 'DDR4',
    condition: 'New',
    warranty: 'Lifetime',
    inStock: true,
    featured: true,
    description: 'Reliable DDR4 memory for laptop upgrades.',
    specifications: {
      capacity: '8GB',
      type: 'DDR4',
      speed: '2666MHz',
      pins: '260-pin SO-DIMM',
      voltage: '1.2V',
      compatibility: 'Most modern laptops'
    }
  },
  {
    id: 8,
    name: 'Crucial 16GB DDR4',
    category: 'ram',
    brand: 'Crucial',
    price: 4500,
    originalPrice: 6000,
    image: '/images/crucial-ram.jpg',
    processor: 'N/A',
    storage: 'N/A',
    ram: '16GB DDR4-3200',
    display: 'N/A',
    generation: 'DDR4',
    condition: 'New',
    warranty: 'Lifetime',
    inStock: true,
    featured: false,
    description: 'High-performance DDR4 memory for demanding applications.',
    specifications: {
      capacity: '16GB',
      type: 'DDR4',
      speed: '3200MHz',
      pins: '260-pin SO-DIMM',
      voltage: '1.2V',
      compatibility: 'Most modern laptops'
    }
  },

  // SSD
  {
    id: 9,
    name: 'Samsung 970 EVO Plus 500GB',
    category: 'ssd',
    brand: 'Samsung',
    price: 5500,
    originalPrice: 7500,
    image: '/images/samsung-ssd.jpg',
    processor: 'N/A',
    storage: '500GB NVMe SSD',
    ram: 'N/A',
    display: 'N/A',
    generation: 'NVMe PCIe 3.0',
    condition: 'New',
    warranty: '5 years',
    inStock: true,
    featured: true,
    description: 'High-performance NVMe SSD for faster boot times and application loading.',
    specifications: {
      capacity: '500GB',
      interface: 'NVMe PCIe 3.0 x4',
      formFactor: 'M.2 2280',
      readSpeed: 'Up to 3,500 MB/s',
      writeSpeed: 'Up to 3,300 MB/s',
      warranty: '5 years'
    }
  },
  {
    id: 10,
    name: 'Kingston NV2 1TB',
    category: 'ssd',
    brand: 'Kingston',
    price: 7000,
    originalPrice: 9500,
    image: '/images/kingston-ssd.jpg',
    processor: 'N/A',
    storage: '1TB NVMe SSD',
    ram: 'N/A',
    display: 'N/A',
    generation: 'NVMe PCIe 4.0',
    condition: 'New',
    warranty: '3 years',
    inStock: true,
    featured: false,
    description: 'Affordable NVMe SSD with excellent performance.',
    specifications: {
      capacity: '1TB',
      interface: 'NVMe PCIe 4.0 x4',
      formFactor: 'M.2 2280',
      readSpeed: 'Up to 3,500 MB/s',
      writeSpeed: 'Up to 2,100 MB/s',
      warranty: '3 years'
    }
  },

  // Accessories
  {
    id: 11,
    name: 'Logitech MX Master 3',
    category: 'accessories',
    brand: 'Logitech',
    price: 6500,
    originalPrice: 8500,
    image: '/images/logitech-mouse.jpg',
    processor: 'N/A',
    storage: 'N/A',
    ram: 'N/A',
    display: 'N/A',
    generation: 'Wireless',
    condition: 'New',
    warranty: '1 year',
    inStock: true,
    featured: true,
    description: 'Advanced wireless mouse for professionals.',
    specifications: {
      connectivity: 'Bluetooth & USB Receiver',
      dpi: 'Up to 4000 DPI',
      battery: 'Up to 70 days',
      buttons: '7 buttons',
      scrolling: 'MagSpeed scroll wheel',
      compatibility: 'Windows, Mac, Linux'
    }
  },
  {
    id: 12,
    name: 'HP Laptop Charger 65W',
    category: 'accessories',
    brand: 'HP',
    price: 1500,
    originalPrice: 2500,
    image: '/images/hp-charger.jpg',
    processor: 'N/A',
    storage: 'N/A',
    ram: 'N/A',
    display: 'N/A',
    generation: 'Universal',
    condition: 'New',
    warranty: '6 months',
    inStock: true,
    featured: false,
    description: 'Original HP laptop charger compatible with most HP laptops.',
    specifications: {
      power: '65W',
      input: '100-240V AC',
      output: '19.5V DC',
      connector: '4.5mm x 3.0mm',
      cableLength: '1.8m',
      compatibility: 'Most HP laptops'
    }
  }
];

export const blogPosts = [
  {
    id: 1,
    title: "How to Choose the Right Used Laptop in 2024",
    category: "Tech Guides",
    excerpt: "A comprehensive guide to buying used laptops, including what to check and red flags to avoid when making your purchase.",
    image: "/next.png",
    author: "Tech Expert",
    date: "2024-01-15",
    readTime: "8 min read",
    tags: ["Laptops", "Buying Guide", "Tech Tips"]
  },
  {
    id: 2,
    title: "SSD vs HDD: Which Storage is Right for You?",
    category: "Tech Guides", 
    excerpt: "Understanding the differences between SSD and HDD storage solutions and how to make the best choice for your needs.",
    image: "/next.png",
    author: "Hardware Specialist",
    date: "2024-01-10", 
    readTime: "6 min read",
    tags: ["Storage", "Hardware", "Performance"]
  },
  {
    id: 3,
    title: "Top 5 Chromebooks for Students in 2024",
    category: "Reviews",
    excerpt: "Our carefully selected picks for the best Chromebooks that offer exceptional value and performance for students.",
    image: "/next.png",
    author: "Education Tech",
    date: "2024-01-05",
    readTime: "10 min read",
    tags: ["Chromebooks", "Students", "Reviews"]
  },
  {
    id: 4,
    title: "RAM Upgrade Guide: Boost Your Laptop Performance",
    category: "Tech Guides",
    excerpt: "Learn how to upgrade your laptop's RAM to improve performance and multitasking capabilities.",
    image: "/next.png",
    author: "Hardware Pro",
    date: "2024-02-01",
    readTime: "7 min read",
    tags: ["RAM", "Upgrade", "Performance"]
  },
  {
    id: 5,
    title: "Best Laptop Deals This Month",
    category: "News",
    excerpt: "Don't miss out on these incredible laptop deals available this month. Limited time offers on premium models.",
    image: "/next.png",
    author: "Deal Hunter",
    date: "2024-02-15",
    readTime: "5 min read",
    tags: ["Deals", "Discounts", "Shopping"]
  },
  {
    id: 6,
    title: "Laptop Battery Care: Extend Your Battery Life",
    category: "Tech Guides",
    excerpt: "Essential tips and tricks to maximize your laptop battery life and maintain optimal performance over time.",
    image: "/next.png",
    author: "Battery Expert",
    date: "2024-02-20",
    readTime: "9 min read",
    tags: ["Battery", "Maintenance", "Tips"]
  }
];

export const testimonials = [
  {
    id: 1,
    name: "Rahul Sharma",
    role: "Software Developer",
    content: "Great quality laptops at amazing prices. The HP EliteBook I bought is working perfectly for my development work.",
    rating: 5,
    image: "/images/testimonial-1.jpg"
  },
  {
    id: 2,
    name: "Priya Patel",
    role: "Student",
    content: "Excellent customer service and fast delivery. The Chromebook is perfect for my college work.",
    rating: 5,
    image: "/images/testimonial-2.jpg"
  },
  {
    id: 3,
    name: "Amit Kumar",
    role: "Business Owner",
    content: "Bought 10 laptops for my office. All are in excellent condition and the bulk discount was great!",
    rating: 5,
    image: "/images/testimonial-3.jpg"
  }
];

export const filterOptions = {
  brands: [
    'HP', 'Dell', 'Lenovo', 'Acer', 'ASUS', 'Samsung', 'Kingston', 'Crucial', 'Corsair', 'Logitech'
  ],
  processoRs:[
    'Intel Core i3', 'Intel Core i5', 'Intel Core i7', 'Intel Celeron', 'AMD Ryzen 3', 'AMD Ryzen 5', 'AMD Ryzen 7'
  ],
  ram: ['4GB', '8GB', '16GB', '32GB'],
  storage: ['128GB SSD', '256GB SSD', '512GB SSD', '1TB SSD', '1TB HDD', '2TB HDD'],
  display: ['11.6"', '13.3"', '14"', '15.6"', '17.3"'],
  generation: ['8th Gen', '9th Gen', '10th Gen', '11th Gen', '12th Gen', 'Latest'],
  condition: ['Excellent', 'Very Good', 'Good', 'Fair', 'New'],
  priceRanges: [
    { label: 'Under Rs:20,000', min: 0, max: 20000 },
    { label: 'Rs:20,000 - Rs:40,000', min: 20000, max: 40000 },
    { label: 'Rs:40,000 - Rs:60,000', min: 40000, max: 60000 },
    { label: 'Rs:60,000 - Rs:80,000', min: 60000, max: 80000 },
    { label: 'Above Rs:80,000', min: 80000, max: Infinity }
  ]
};