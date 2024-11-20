import { pool } from '../config/database';

async function testConnection() {
  try {
    // Test basic connection
    const client = await pool.connect();
    console.log('Successfully connected to database', {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER
    });

    // Test the property_data table
    const propertyDataResult = await client.query('SELECT COUNT(*) FROM property_data');
    console.log('property_data table stats:', {
      totalRows: propertyDataResult.rows[0].count
    });

    // Release the client
    client.release();
    await pool.end();
    
    console.log('\n✅ Database connection test completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    process.exit(1);
  }
}

testConnection();
