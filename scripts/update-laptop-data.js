// Script to fetch all laptops and update their descriptions and images
// Run this with: node scripts/update-laptop-data.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Function to generate description based on laptop specs
function generateDescription(laptop) {
  const brand = laptop.brand || 'Laptop';
  const processor = laptop.processor || 'processor';
  const ram = laptop.ram || 'RAM';
  const storage = laptop.hdd || laptop.storage || 'storage';
  const display = laptop.display_size || laptop.display || 'display';
  const condition = laptop.category_id === 'used-laptop' ? 'used' : 'brand new';

  return `Experience powerful performance with this ${condition} ${brand} laptop featuring ${processor} processor, ${ram} of RAM, and ${storage} of storage. The ${display} display provides crystal-clear visuals for work and entertainment. Perfect for students, professionals, and everyday computing needs. This reliable machine offers excellent value for money and comes with warranty support. Ideal for multitasking, browsing, office work, and light gaming. Contact Mohit Computers for the best deals in Pakistan!`;
}

// Function to generate image URL based on brand
function getImageURL(laptop) {
  const brand = (laptop.brand || '').toLowerCase();

  // Default placeholder images by brand
  const brandImages = {
    'dell': 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800',
    'hp': 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800',
    'lenovo': 'https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=800',
    'asus': 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800',
    'acer': 'https://images.unsplash.com/photo-1594762645655-15c8c1ebc1d6?w=800',
    'apple': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
    'macbook': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
    'microsoft': 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800',
    'toshiba': 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800',
    'samsung': 'https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=800'
  };

  // Check if brand matches
  for (const [key, url] of Object.entries(brandImages)) {
    if (brand.includes(key)) {
      return url;
    }
  }

  // Default laptop image
  return 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800';
}

async function updateAllLaptops() {
  try {
    console.log('🔍 Fetching all laptop products...');

    // Fetch all laptops
    const { data: laptops, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .or('category_id.eq.laptop,category_id.eq.used-laptop,category_id.eq.chromebook');

    if (fetchError) {
      console.error('❌ Error fetching laptops:', fetchError);
      return;
    }

    console.log(`✅ Found ${laptops.length} laptops`);
    console.log('\n📝 Generating descriptions and image URLs...\n');

    let updatedCount = 0;
    const updates = [];

    for (const laptop of laptops) {
      const needsUpdate = !laptop.description || !laptop.featured_image;

      if (needsUpdate) {
        const description = generateDescription(laptop);
        const imageURL = getImageURL(laptop);

        updates.push({
          id: laptop.id,
          name: laptop.name,
          brand: laptop.brand,
          description: description,
          featured_image: imageURL
        });

        console.log(`📦 ${laptop.name}`);
        console.log(`   Brand: ${laptop.brand || 'N/A'}`);
        console.log(`   Description: ${description.substring(0, 80)}...`);
        console.log(`   Image URL: ${imageURL}`);
        console.log('');
      }
    }

    if (updates.length === 0) {
      console.log('✅ All laptops already have descriptions and images!');
      return;
    }

    console.log(`\n🔄 Updating ${updates.length} laptops in database...\n`);

    // Update each laptop
    for (const update of updates) {
      const { error: updateError } = await supabase
        .from('products')
        .update({
          description: update.description,
          featured_image: update.featured_image
        })
        .eq('id', update.id);

      if (updateError) {
        console.error(`❌ Failed to update ${update.name}:`, updateError);
      } else {
        updatedCount++;
        console.log(`✅ Updated: ${update.name}`);
      }
    }

    console.log(`\n✅ Successfully updated ${updatedCount} out of ${updates.length} laptops!`);

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the script
updateAllLaptops();
