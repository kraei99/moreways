import { searchProperties } from '../routes/properties';

async function testPropertySearch() {
  try {
    // Test searching properties in a ZIP code
    console.log('🔍 Testing property search...\n');
    
    const properties = await searchProperties('02116', {
      minPrice: 500000,
      maxPrice: 5000000
    });
    
    console.log(`✅ Found ${properties.length} properties\n`);
    
    if (properties.length > 0) {
      console.log('📍 Sample property:');
      console.log(JSON.stringify(properties[0], null, 2));
    }
    
    console.log('\n✅ Property search test completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Property search test failed:', error);
    process.exit(1);
  }
}

testPropertySearch();
