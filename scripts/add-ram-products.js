// Script to add DDR4 RAM products to Mohit Computers Database
// Run with: node scripts/add-ram-products.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Define all RAM products
const ramProducts = [
  // ====================================
  // 4GB DDR4 RAM Products
  // ====================================
  {
    name: '4GB DDR4 2133 MHz Laptop RAM',
    brand: 'Kingston',
    category_id: 'ram',
    price: 3500,
    description: 'High-quality 4GB DDR4 2133 MHz laptop RAM module. Perfect for upgrading your laptop\'s memory for better multitasking and performance. Compatible with most laptops supporting DDR4 memory.',
    featured_image: '/Ram/Ram/DDR4/4GB DDR4/1.jpg',
    images: ['/Ram/Ram/DDR4/4GB DDR4/1.jpg'],
    is_active: true,
    in_stock: true,
    ram_type: 'DDR4',
    ram_capacity: '4GB',
    ram_speed: '2133 MHz',
    ram_form_factor: 'Laptop (SO-DIMM)',
    ram_condition: 'Used',
    ram_warranty: '6 Months'
  },
  {
    name: '4GB DDR4 2400 MHz Laptop RAM',
    brand: 'Kingston',
    category_id: 'ram',
    price: 3550,
    description: 'Reliable 4GB DDR4 2400 MHz laptop RAM module. Faster speed for improved system responsiveness. Compatible with laptops supporting DDR4-2400 memory.',
    featured_image: '/Ram/Ram/DDR4/4GB DDR4/1.jpg',
    images: ['/Ram/Ram/DDR4/4GB DDR4/1.jpg'],
    is_active: true,
    in_stock: true,
    ram_type: 'DDR4',
    ram_capacity: '4GB',
    ram_speed: '2400 MHz',
    ram_form_factor: 'Laptop (SO-DIMM)',
    ram_condition: 'Used',
    ram_warranty: '6 Months'
  },
  {
    name: '4GB DDR4 2666 MHz Laptop RAM',
    brand: 'Samsung',
    category_id: 'ram',
    price: 3600,
    description: 'Quality 4GB DDR4 2666 MHz laptop RAM module. Enhanced performance for modern laptops. Perfect for everyday computing and light multitasking.',
    featured_image: '/Ram/Ram/DDR4/4GB DDR4/1.jpg',
    images: ['/Ram/Ram/DDR4/4GB DDR4/1.jpg'],
    is_active: true,
    in_stock: true,
    ram_type: 'DDR4',
    ram_capacity: '4GB',
    ram_speed: '2666 MHz',
    ram_form_factor: 'Laptop (SO-DIMM)',
    ram_condition: 'Used',
    ram_warranty: '6 Months'
  },
  {
    name: '4GB DDR4 3200 MHz Laptop RAM',
    brand: 'Crucial',
    category_id: 'ram',
    price: 3800,
    description: 'Premium 4GB DDR4 3200 MHz laptop RAM module. High-speed memory for faster data access and better overall system performance. Compatible with latest generation laptops.',
    featured_image: '/Ram/Ram/DDR4/4GB DDR4/1.jpg',
    images: ['/Ram/Ram/DDR4/4GB DDR4/1.jpg'],
    is_active: true,
    in_stock: true,
    ram_type: 'DDR4',
    ram_capacity: '4GB',
    ram_speed: '3200 MHz',
    ram_form_factor: 'Laptop (SO-DIMM)',
    ram_condition: 'Used',
    ram_warranty: '6 Months'
  },

  // ====================================
  // 8GB DDR4 RAM Products
  // ====================================
  {
    name: '8GB DDR4 2133 MHz Laptop RAM',
    brand: 'Kingston',
    category_id: 'ram',
    price: 8000,
    description: 'High-performance 8GB DDR4 2133 MHz laptop RAM module. Ideal for multitasking, office work, and general computing. Provides smooth performance for everyday tasks.',
    featured_image: '/Ram/Ram/DDR4/8GB DDR4/1.jpg',
    images: ['/Ram/Ram/DDR4/8GB DDR4/1.jpg'],
    is_active: true,
    in_stock: true,
    ram_type: 'DDR4',
    ram_capacity: '8GB',
    ram_speed: '2133 MHz',
    ram_form_factor: 'Laptop (SO-DIMM)',
    ram_condition: 'Used',
    ram_warranty: '6 Months'
  },
  {
    name: '8GB DDR4 2400 MHz Laptop RAM',
    brand: 'Samsung',
    category_id: 'ram',
    price: 8200,
    description: 'Quality 8GB DDR4 2400 MHz laptop RAM module. Enhanced speed for better responsiveness. Perfect for students and professionals running multiple applications.',
    featured_image: '/Ram/Ram/DDR4/8GB DDR4/1.jpg',
    images: ['/Ram/Ram/DDR4/8GB DDR4/1.jpg'],
    is_active: true,
    in_stock: true,
    ram_type: 'DDR4',
    ram_capacity: '8GB',
    ram_speed: '2400 MHz',
    ram_form_factor: 'Laptop (SO-DIMM)',
    ram_condition: 'Used',
    ram_warranty: '6 Months'
  },
  {
    name: '8GB DDR4 2666 MHz Laptop RAM',
    brand: 'Crucial',
    category_id: 'ram',
    price: 8400,
    description: 'Reliable 8GB DDR4 2666 MHz laptop RAM module. Great for modern applications and light gaming. Boosts your laptop\'s performance significantly.',
    featured_image: '/Ram/Ram/DDR4/8GB DDR4/1.jpg',
    images: ['/Ram/Ram/DDR4/8GB DDR4/1.jpg'],
    is_active: true,
    in_stock: true,
    ram_type: 'DDR4',
    ram_capacity: '8GB',
    ram_speed: '2666 MHz',
    ram_form_factor: 'Laptop (SO-DIMM)',
    ram_condition: 'Used',
    ram_warranty: '6 Months'
  },
  {
    name: '8GB DDR4 3200 MHz Laptop RAM',
    brand: 'Hynix',
    category_id: 'ram',
    price: 8600,
    description: 'Premium 8GB DDR4 3200 MHz laptop RAM module. High-speed memory for demanding applications and gaming. Compatible with latest generation Intel and AMD laptops.',
    featured_image: '/Ram/Ram/DDR4/8GB DDR4/1.jpg',
    images: ['/Ram/Ram/DDR4/8GB DDR4/1.jpg'],
    is_active: true,
    in_stock: true,
    ram_type: 'DDR4',
    ram_capacity: '8GB',
    ram_speed: '3200 MHz',
    ram_form_factor: 'Laptop (SO-DIMM)',
    ram_condition: 'Used',
    ram_warranty: '6 Months'
  },

  // ====================================
  // 16GB DDR4 RAM Products
  // ====================================
  {
    name: '16GB DDR4 2133 MHz Laptop RAM',
    brand: 'Kingston',
    category_id: 'ram',
    price: 16000,
    description: 'Professional-grade 16GB DDR4 2133 MHz laptop RAM module. Excellent for heavy multitasking, content creation, and professional applications. Provides ample memory for demanding workloads.',
    featured_image: '/Ram/Ram/DDR4/16GB DDR4/1.jpg',
    images: ['/Ram/Ram/DDR4/16GB DDR4/1.jpg'],
    is_active: true,
    in_stock: true,
    ram_type: 'DDR4',
    ram_capacity: '16GB',
    ram_speed: '2133 MHz',
    ram_form_factor: 'Laptop (SO-DIMM)',
    ram_condition: 'Used',
    ram_warranty: '6 Months'
  },
  {
    name: '16GB DDR4 2400 MHz Laptop RAM',
    brand: 'Samsung',
    category_id: 'ram',
    price: 16300,
    description: 'High-capacity 16GB DDR4 2400 MHz laptop RAM module. Perfect for developers, designers, and content creators. Run multiple demanding applications simultaneously without slowdown.',
    featured_image: '/Ram/Ram/DDR4/16GB DDR4/1.jpg',
    images: ['/Ram/Ram/DDR4/16GB DDR4/1.jpg'],
    is_active: true,
    in_stock: true,
    ram_type: 'DDR4',
    ram_capacity: '16GB',
    ram_speed: '2400 MHz',
    ram_form_factor: 'Laptop (SO-DIMM)',
    ram_condition: 'Used',
    ram_warranty: '6 Months'
  },
  {
    name: '16GB DDR4 2666 MHz Laptop RAM',
    brand: 'Crucial',
    category_id: 'ram',
    price: 16600,
    description: 'Premium 16GB DDR4 2666 MHz laptop RAM module. Ideal for gaming, video editing, and 3D modeling. Enhanced speed for professional workflows and content creation.',
    featured_image: '/Ram/Ram/DDR4/16GB DDR4/1.jpg',
    images: ['/Ram/Ram/DDR4/16GB DDR4/1.jpg'],
    is_active: true,
    in_stock: true,
    ram_type: 'DDR4',
    ram_capacity: '16GB',
    ram_speed: '2666 MHz',
    ram_form_factor: 'Laptop (SO-DIMM)',
    ram_condition: 'Used',
    ram_warranty: '6 Months'
  },
  {
    name: '16GB DDR4 3200 MHz Laptop RAM',
    brand: 'Hynix',
    category_id: 'ram',
    price: 16900,
    description: 'Top-tier 16GB DDR4 3200 MHz laptop RAM module. Maximum performance for gaming laptops and workstations. High-speed memory for the most demanding applications and tasks.',
    featured_image: '/Ram/Ram/DDR4/16GB DDR4/1.jpg',
    images: ['/Ram/Ram/DDR4/16GB DDR4/1.jpg'],
    is_active: true,
    in_stock: true,
    ram_type: 'DDR4',
    ram_capacity: '16GB',
    ram_speed: '3200 MHz',
    ram_form_factor: 'Laptop (SO-DIMM)',
    ram_condition: 'Used',
    ram_warranty: '6 Months'
  }
];

async function addRAMProducts() {
  console.log('🚀 Starting to add RAM products to database...\n');

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < ramProducts.length; i++) {
    const product = ramProducts[i];
    console.log(`[${i + 1}/${ramProducts.length}] Adding: ${product.name}...`);

    try {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select();

      if (error) {
        console.error(`   ❌ Error: ${error.message}`);
        errorCount++;
      } else {
        console.log(`   ✅ Success! Product ID: ${data[0].id}`);
        successCount++;
      }
    } catch (err) {
      console.error(`   ❌ Exception: ${err.message}`);
      errorCount++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 Summary:');
  console.log(`   ✅ Successfully added: ${successCount} products`);
  console.log(`   ❌ Failed: ${errorCount} products`);
  console.log('='.repeat(50));

  if (successCount === ramProducts.length) {
    console.log('\n🎉 All RAM products have been successfully added to the database!');
    console.log('\nProducts added:');
    console.log('  • 4GB DDR4: 4 variants (2133/2400/2666/3200 MHz)');
    console.log('  • 8GB DDR4: 4 variants (2133/2400/2666/3200 MHz)');
    console.log('  • 16GB DDR4: 4 variants (2133/2400/2666/3200 MHz)');
  }
}

// Run the script
addRAMProducts()
  .then(() => {
    console.log('\n✅ Script completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });
