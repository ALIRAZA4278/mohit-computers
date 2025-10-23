// Script to replace 12 individual RAM products with 3 base products (4GB, 8GB, 16GB)
// The new products will use RAM customizer for brand and speed selection
// Run with: node scripts/replace-ram-products.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Base RAM products (3 products only)
const baseRAMProducts = [
  {
    name: '4GB DDR4 Laptop RAM',
    brand: 'Kingston',
    category_id: 'ram',
    price: 3500, // Base price for 2133 MHz Kingston
    description: 'High-quality 4GB DDR4 laptop RAM module. Choose your preferred brand and speed (2133-3200 MHz) using the customizer. Compatible with most laptops supporting DDR4 memory. Perfect for basic computing and multitasking.',
    featured_image: '/Ram/Ram/DDR4/4GB DDR4/1.jpg',
    images: ['/Ram/Ram/DDR4/4GB DDR4/1.jpg'],
    is_active: true,
    in_stock: true,
    ram_type: 'DDR4',
    ram_capacity: '4GB',
    ram_speed: '2133 MHz - 3200 MHz',
    ram_form_factor: 'Laptop (SO-DIMM)',
    ram_condition: 'Used',
    ram_warranty: '6 Months'
  },
  {
    name: '8GB DDR4 Laptop RAM',
    brand: 'Kingston',
    category_id: 'ram',
    price: 8000, // Base price for 2133 MHz Kingston
    description: 'High-performance 8GB DDR4 laptop RAM module. Customize with your choice of brand and speed (2133-3200 MHz). Ideal for multitasking, office work, and general computing. Provides smooth performance for everyday tasks.',
    featured_image: '/Ram/Ram/DDR3/8GB DDR3.png',
    images: ['/Ram/Ram/DDR3/8GB DDR3.png'],
    is_active: true,
    in_stock: true,
    ram_type: 'DDR4',
    ram_capacity: '8GB',
    ram_speed: '2133 MHz - 3200 MHz',
    ram_form_factor: 'Laptop (SO-DIMM)',
    ram_condition: 'Used',
    ram_warranty: '6 Months'
  },
  {
    name: '16GB DDR4 Laptop RAM',
    brand: 'Kingston',
    category_id: 'ram',
    price: 16000, // Base price for 2133 MHz Kingston
    description: 'Professional-grade 16GB DDR4 laptop RAM module. Select your preferred brand and speed (2133-3200 MHz) from our customizer. Excellent for heavy multitasking, content creation, and professional applications. Provides ample memory for demanding workloads.',
    featured_image: '/Ram/Ram/DDR3L/8GB PC3L DDR3L/1.jpg',
    images: ['/Ram/Ram/DDR3L/8GB PC3L DDR3L/1.jpg'],
    is_active: true,
    in_stock: true,
    ram_type: 'DDR4',
    ram_capacity: '16GB',
    ram_speed: '2133 MHz - 3200 MHz',
    ram_form_factor: 'Laptop (SO-DIMM)',
    ram_condition: 'Used',
    ram_warranty: '6 Months'
  }
];

async function replaceRAMProducts() {
  console.log('🔄 Starting RAM products replacement...\n');

  // Step 1: Get all existing DDR4 RAM products
  console.log('📋 Step 1: Fetching existing DDR4 RAM products...');
  const { data: existingProducts, error: fetchError } = await supabase
    .from('products')
    .select('id, name, ram_type, ram_capacity')
    .eq('category_id', 'ram')
    .eq('ram_type', 'DDR4')
    .order('name');

  if (fetchError) {
    console.error('❌ Error fetching products:', fetchError.message);
    process.exit(1);
  }

  console.log(`   Found ${existingProducts.length} existing DDR4 RAM products:`);
  existingProducts.forEach(p => console.log(`   - ${p.name}`));

  // Step 2: Delete existing DDR4 RAM products
  console.log('\n🗑️  Step 2: Deleting existing DDR4 RAM products...');
  let deletedCount = 0;

  for (const product of existingProducts) {
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', product.id);

    if (deleteError) {
      console.error(`   ❌ Failed to delete: ${product.name}`);
      console.error(`      Error: ${deleteError.message}`);
    } else {
      console.log(`   ✅ Deleted: ${product.name}`);
      deletedCount++;
    }
  }

  console.log(`\n   Deleted ${deletedCount} out of ${existingProducts.length} products`);

  // Step 3: Create 3 base RAM products
  console.log('\n📦 Step 3: Creating 3 base RAM products with customizer support...\n');
  let createdCount = 0;

  for (const product of baseRAMProducts) {
    console.log(`   Creating: ${product.name}...`);

    const { data, error: createError } = await supabase
      .from('products')
      .insert([product])
      .select();

    if (createError) {
      console.error(`   ❌ Error: ${createError.message}`);
    } else {
      console.log(`   ✅ Success! Product ID: ${data[0].id}`);
      console.log(`      Base Price: Rs ${product.price.toLocaleString()}`);
      console.log(`      Capacity: ${product.ram_capacity}`);
      createdCount++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 Summary:');
  console.log(`   🗑️  Deleted: ${deletedCount} individual products`);
  console.log(`   ✅ Created: ${createdCount} base products`);
  console.log('='.repeat(60));

  if (createdCount === 3) {
    console.log('\n🎉 RAM products successfully replaced!');
    console.log('\n📋 New system:');
    console.log('   • 4GB DDR4 - Rs 3,500 (base)');
    console.log('   • 8GB DDR4 - Rs 8,000 (base)');
    console.log('   • 16GB DDR4 - Rs 16,000 (base)');
    console.log('\n✨ Users can now:');
    console.log('   • Select from 8 brands (Kingston, Samsung, Crucial, etc.)');
    console.log('   • Choose speeds (2133/2400/2666/3200 MHz)');
    console.log('   • Prices adjust automatically based on selections');
  }
}

// Run the script
replaceRAMProducts()
  .then(() => {
    console.log('\n✅ Script completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });
