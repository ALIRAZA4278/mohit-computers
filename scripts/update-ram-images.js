// Script to update RAM product images with available images from public/Ram/Ram
// Run with: node scripts/update-ram-images.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Image mapping based on available images
const imageMapping = {
  '4GB': {
    image: '/Ram/Ram/DDR4/4GB DDR4/1.jpg',
    description: 'Using actual 4GB DDR4 image'
  },
  '8GB': {
    image: '/Ram/Ram/DDR3/8GB DDR3.png',
    description: 'Using 8GB DDR3 image temporarily for 8GB DDR4 products'
  },
  '16GB': {
    image: '/Ram/Ram/DDR3L/8GB PC3L DDR3L/1.jpg',
    description: 'Using 8GB DDR3L image temporarily for 16GB DDR4 products'
  }
};

async function updateRAMImages() {
  console.log('🖼️  Starting to update RAM product images...\n');

  let successCount = 0;
  let errorCount = 0;

  // Update for each capacity
  for (const [capacity, imageInfo] of Object.entries(imageMapping)) {
    console.log(`\n📦 Updating ${capacity} DDR4 products...`);
    console.log(`   Image: ${imageInfo.image}`);
    console.log(`   Note: ${imageInfo.description}\n`);

    try {
      // Get all products with this capacity
      const { data: products, error: fetchError } = await supabase
        .from('products')
        .select('id, name, ram_capacity')
        .eq('category_id', 'ram')
        .eq('ram_type', 'DDR4')
        .eq('ram_capacity', capacity)
        .order('name');

      if (fetchError) {
        console.error(`   ❌ Error fetching ${capacity} products:`, fetchError.message);
        errorCount += 4; // Assume 4 products per capacity
        continue;
      }

      console.log(`   Found ${products.length} products to update:`);

      // Update each product
      for (const product of products) {
        const { error: updateError } = await supabase
          .from('products')
          .update({
            featured_image: imageInfo.image,
            images: [imageInfo.image]
          })
          .eq('id', product.id);

        if (updateError) {
          console.error(`   ❌ Failed to update: ${product.name}`);
          console.error(`      Error: ${updateError.message}`);
          errorCount++;
        } else {
          console.log(`   ✅ Updated: ${product.name}`);
          successCount++;
        }
      }
    } catch (err) {
      console.error(`   ❌ Exception for ${capacity}:`, err.message);
      errorCount++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 Summary:');
  console.log(`   ✅ Successfully updated: ${successCount} products`);
  console.log(`   ❌ Failed: ${errorCount} products`);
  console.log('='.repeat(60));

  console.log('\n📋 Image assignments:');
  console.log('   • 4GB DDR4 → /Ram/Ram/DDR4/4GB DDR4/1.jpg');
  console.log('   • 8GB DDR4 → /Ram/Ram/DDR3/8GB DDR3.png (temporary)');
  console.log('   • 16GB DDR4 → /Ram/Ram/DDR3L/8GB PC3L DDR3L/1.jpg (temporary)');

  if (successCount > 0) {
    console.log('\n✨ Images have been updated! You can replace them later with proper DDR4 images.');
  }
}

// Run the script
updateRAMImages()
  .then(() => {
    console.log('\n✅ Script completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });
