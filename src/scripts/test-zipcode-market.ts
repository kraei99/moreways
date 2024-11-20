import { getZipCodeMarketData } from '../routes/properties';

async function testZipCodeMarketData() {
  try {
    console.log('🔍 Testing zip code market data...\n');
    
    const marketData = await getZipCodeMarketData('02116');
    
    if (marketData) {
      console.log('✅ Found market data for ZIP code 02116:\n');
      console.log(JSON.stringify(marketData, null, 2));
    } else {
      console.log('❌ No market data found for ZIP code 02116');
    }
    
    console.log('\n✅ Zip code market data test completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Zip code market data test failed:', error);
    process.exit(1);
  }
}

testZipCodeMarketData();
