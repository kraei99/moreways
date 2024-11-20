import { getMarketingStats } from '../routes/properties';

async function testMarketingStats() {
  try {
    console.log('🔍 Testing marketing statistics...\n');
    
    const stats = await getMarketingStats('02116');
    
    console.log('📊 Market Overview:');
    console.log('-------------------');
    console.log(`Total Properties: ${stats.overview.totalProperties}`);
    console.log(`Average Price: $${stats.overview.avgPrice.toLocaleString()}`);
    console.log(`Average Price/SqFt: $${stats.overview.avgPricePerSqFt.toLocaleString()}`);
    console.log(`Total Sales: ${stats.overview.totalSales}`);
    
    console.log('\n📋 Property Types:');
    console.log('-------------------');
    stats.propertyTypes.forEach(type => {
      console.log(`${type.type}: ${type.count} properties, Avg Price: $${type.avgPrice.toLocaleString()}`);
    });
    
    console.log('\n🏠 Building Styles:');
    console.log('-------------------');
    stats.buildingStyles.forEach(style => {
      console.log(`${style.style}: ${style.count} properties, Avg Price: $${style.avgPrice.toLocaleString()}`);
    });
    
    console.log('\n✅ Marketing statistics test completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Marketing statistics test failed:', error);
    process.exit(1);
  }
}

testMarketingStats();
