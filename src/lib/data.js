// Dummy data for mohit computers

export const categories = [
  {
    id: 'laptop',
    name: 'Laptop',
    image: '/images/laptop.jpg',
    description: 'High-quality laptops',
    brands: ['Dell', 'HP', 'Lenovo', 'Acer', 'ASUS', 'Apple', 'MSI', 'Toshiba', 'Sony', 'Samsung']
  },
  {
    id: 'chromebook',
    name: 'Chromebook',
    image: '/images/chromebook.jpg',
    description: 'Fast and secure Chromebooks',
    brands: ['Dell', 'HP', 'Lenovo', 'Acer', 'Asus', 'Samsung']
  },
  {
    id: 'accessories',
    name: 'Accessories',
    image: '/images/accessories.jpg',
    description: 'Laptop accessories and peripherals',
    brands: ['Logitech', 'HP', 'Dell', 'Generic', 'Microsoft', 'Razer']
  },
  {
    id: 'ram',
    name: 'RAM',
    image: '/images/ram.jpg',
    description: 'Memory upgrades for your laptop',
    brands: ['Kingston', 'Corsair', 'Crucial', 'Samsung', 'G.Skill', 'Transcend']
  },
  {
    id: 'ssd',
    name: 'SSD',
    image: '/images/ssd.jpg',
    description: 'Fast storage solutions',
    brands: ['Samsung', 'Kingston', 'WD', 'Crucial', 'SanDisk', 'Intel']
  }
];

// Laptop specific data
export const laptopBrands = [
  'Dell', 'HP', 'Lenovo', 'Acer', 'ASUS', 'Apple', 'MSI', 'Toshiba', 'Sony', 'Samsung'
];

export const resolutionOptions = [
  'HD (1366x768)',
  'Full HD (1920x1080)',
  'QHD (2560x1440)',
  '4K UHD (3840x2160)',
  'Retina Display',
  'Other'
];

export const touchOptions = [
  'Touch',
  'Non-touch',
  'X360 (Convertible)'
];

export const conditionOptions = [
  'New',
  'Excellent',
  'Very Good',
  'Good',
  'Fair'
];

export const products = [
  // Products will be added through admin panel
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
    name: "Taha Farooqui",
    role: "Local Guide · 99 reviews",
    content: "Had the experience of buying two laptops back in 2020 (during COVID, they made home delivery) and in 2021. Their products are in really good condition, plus if any defect comes up even after the checking warranty period, they make sure to help.",
    rating: 5,
    image: "/images/testimonial-1.jpg"
  },
  {
    id: 2,
    name: "Ahsan Ali",
    role: "Customer",
    content: "I recently had the pleasure of purchasing a laptop from Mohit Computers, and I must say, I am thoroughly impressed with both the product and the service I received. From start to finish, the experience was seamless and exceeded my expectations.",
    rating: 5,
    image: "/images/testimonial-2.jpg"
  },
  {
    id: 3,
    name: "Uzair Memon",
    role: "Customer",
    content: "I've bought over seven laptops, and each time, the experience has been superb. Their service and approach are top-notch. highly recommend them. 10/10",
    rating: 5,
    image: "/images/testimonial-3.jpg"
  },
  {
    id: 4,
    name: "Azfar Ulislam",
    role: "Customer · 3 reviews",
    content: "100 % recommendation i already bought 4 laptops from here. The owner is a very nice person; he deals with every client very calmly and then suggests the best laptop according to the client's budget and requirements.",
    rating: 5,
    image: "/images/testimonial-4.jpg"
  },
  {
    id: 5,
    name: "Hasssnain Khaaan",
    role: "Customer · 2 reviews",
    content: "I got my laptop from a store called Mohit Computers. They had a great selection, and the staff was super helpful in guiding me through the different options. Best rates and great service.",
    rating: 5,
    image: "/images/testimonial-5.jpg"
  },
  {
    id: 6,
    name: "Rajiv Kumar Chandwani",
    role: "Customer · 4 reviews",
    content: "Bought my laptop from them. They have the best prices with very quality and reliable products. They have exceptional customer support.",
    rating: 5,
    image: "/images/testimonial-6.jpg"
  }
];

export const filterOptions = {
  brands: [
    'HP', 'Dell', 'Lenovo', 'Acer',
  ],
  processors: [
    'Intel Core i3', 'Intel Core i5', 'Intel Core i7', 'Intel Core i9', 'Intel Pentium', 'Intel Celeron', 'Intel Xeon', 'Intel Core M5', 'AMD Ryzen 3', 'AMD Ryzen 5', 'AMD Ryzen 7', 'AMD Pro APU'
  ],
  ram: ['4GB', '8GB', '16GB', '32GB', '32GB DDR5'],
  storage: ['128GB SSD', '240GB SSD', '256GB SSD', '512GB SSD', '1TB SSD'],
  display: ['11.3″', '12″', '12.5″', '13.3″', '14″', '15.6″', '17″', '17.3″'],
  generation: [
    '4th Gen', '5th Gen', '6th Gen', '7th Gen', '8th Gen', '9th Gen',
    '10th Gen', '11th Gen', '12th Gen', 
  ],
  graphics: [
    'Intel HD Graphics 4400',
    'Intel HD Graphics (4th Gen)',
    'Intel HD Graphics (5th Gen)',
    'Intel HD Graphics 510',
    'Intel HD Graphics 515',
    'Intel HD Graphics 520',
    'Intel HD Graphics 530',
    'Intel HD Graphics P530',
    'Intel HD Graphics 620',
    'Intel HD Graphics 630',
    'Intel UHD Graphics 620',
    'Intel UHD Graphics 630',
    'Intel UHD Graphics',
    'Intel Iris Xe Graphics',
    'Intel UHD/Iris Xe Graphics',
    'AMD Radeon Vega 8',
    'AMD Radeon Vega',
    'AMD Radeon Integrated Graphics',
    'Intel HD Graphics',
    'NVIDIA GeForce MX',
    'NVIDIA GeForce GTX',
    'NVIDIA GeForce RTX',
    'NVIDIA Quadro',
    'AMD Radeon',
    'AMD Radeon Pro'
  ],
  touchType: ['Touch', 'Non-touch', 'X360 (Convertible)'],
  specialFeatures: ['Workstation', 'Rugged / Tough', 'Featured', 'Clearance'],
  resolution: [
    'HD (1366x768)',
    'Full HD (1920x1080)',
    'QHD (2560x1440)',
    '4K UHD (3840x2160)',
    'Retina Display'
  ],
  operatingSystem: [
    'Windows 10',
    'Windows 11',
    'Windows 10 Pro',
    'Windows 11 Pro',
    'macOS',
    'Chrome OS',
    'Linux',
    'DOS'
  ],
  priceRanges: [
    { label: 'Under Rs:20,000', min: 0, max: 20000 },
    { label: 'Rs:20,000 - Rs:40,000', min: 20000, max: 40000 },
    { label: 'Rs:40,000 - Rs:60,000', min: 40000, max: 60000 },
    { label: 'Rs:60,000 - Rs:80,000', min: 60000, max: 80000 },
    { label: 'Above Rs:80,000', min: 80000, max: Infinity }
  ],
  // RAM-specific filters
  ramBrands: [
    'Kingston', 'Samsung', 'Crucial', 'Hynix', 'Adata', 'Corsair', 'G.Skill', 'Transcend'
  ],
  ramType: [
    'DDR3', 'DDR3L', 'DDR4', 'DDR5'
  ],
  ramFormFactor: [
    'Laptop (SO-DIMM)', 'Desktop (DIMM)'
  ],
  ramCapacity: [
    '2GB', '4GB', '8GB', '16GB', '32GB'
  ],
  ramSpeed: [
    '1333 MHz', '1600 MHz', '2133 MHz', '2400 MHz', '2666 MHz', '3200 MHz', '4800 MHz'
  ],
  ramCondition: [
    'New', 'Used', 'Refurbished'
  ],
  ramWarranty: [
    '15 days', '3 Months', '6 Months', '1 Year', '2 Year'
  ],
  ramPriceRanges: [
    { label: 'Under PKR 3,000', min: 0, max: 3000 },
    { label: 'PKR 3,000 - 5,000', min: 3000, max: 5000 },
    { label: 'Above PKR 5,000', min: 5000, max: Infinity }
  ],
  // Chromebook-specific filters
  chromebookBrands: [
    'Dell', 'HP', 'Lenovo', 'Acer', 'Asus', 'Samsung'
  ],
  chromebookProcessors: [
    'Intel Celeron N3350',
    'Intel Celeron N4000',
    'Intel Celeron N4020',
    'Intel Celeron N4120',
    'Intel Pentium N5030',
    'Intel Pentium N6000',
    'Intel Core i3 (8th Gen)',
    'Intel Core i3 (10th Gen)',
    'Intel Core i5 (8th Gen)',
    'Intel Core i5 (10th Gen)',
    'Intel Core i7'
  ],
  chromebookRam: [
    '2GB', '4GB', '8GB', '16GB'
  ],
  chromebookStorageType: [
    'eMMC', 'SSD'
  ],
  chromebookStorageCapacity: [
    '16GB', '32GB', '64GB', '128GB', '256GB', '512GB'
  ],
  chromebookDisplaySize: [
    '11.6"', '12.5"', '13.3"', '14"', '15.6"'
  ],
  chromebookDisplayType: [
    'HD', 'Full HD (FHD)'
  ],
  chromebookTouchscreen: [
    'Non-Touch', 'Touchscreen', 'Touchscreen x360'
  ],
  chromebookOS: [
    'Windows', 'Chrome OS'
  ],
  chromebookAUE: [
    '2025', '2026', '2027', '2028', '2029', '2030', '2031', '2032', '2033', '2034'
  ],
  chromebookPriceRanges: [
    { label: 'Under Rs:30,000', min: 0, max: 30000 },
    { label: 'Rs:30,000 - Rs:50,000', min: 30000, max: 50000 },
    { label: 'Rs:50,000 - Rs:70,000', min: 50000, max: 70000 },
    { label: 'Above Rs:70,000', min: 70000, max: Infinity }
  ]
};