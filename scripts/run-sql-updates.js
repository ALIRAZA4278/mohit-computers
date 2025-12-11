// Run SQL updates for RAM/SSD prices
const fetch = require('node-fetch');

async function runUpdates() {
  try {
    console.log('🔄 Updating RAM and SSD prices...\n');

    // Call the API endpoint
    const response = await fetch('http://localhost:3001/api/admin/update-upgrade-prices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (data.success) {
      console.log('✅ Success!');
      console.log(`📦 Updated ${data.options?.length || 0} upgrade options`);
      console.log('\nOptions updated:');

      // Group by type
      const ramOptions = data.options?.filter(o => o.option_type === 'ram') || [];
      const ssdOptions = data.options?.filter(o => o.option_type === 'ssd') || [];

      console.log('\n🔧 RAM Options:');
      ramOptions.forEach(opt => {
        console.log(`  - ${opt.display_label}: Rs ${opt.price} (${opt.applicable_to})`);
      });

      console.log('\n💾 SSD Options:');
      ssdOptions.forEach(opt => {
        console.log(`  - ${opt.display_label}: Rs ${opt.price}`);
      });

      console.log('\n✨ All done! RAM customizer prices are updated.');
    } else {
      console.log('❌ Error:', data.error);
      console.log('\n💡 Please run the SQL manually in Supabase SQL Editor:');
      console.log('   File: sql/update-ram-ssd-prices.sql');
    }
  } catch (error) {
    console.error('❌ Failed to update:', error.message);
    console.log('\n💡 Make sure:');
    console.log('   1. Dev server is running (npm run dev)');
    console.log('   2. Or run SQL manually in Supabase SQL Editor');
  }
}

runUpdates();
