import { pool } from '../config/database';

async function checkTableStructure() {
  try {
    const client = await pool.connect();
    console.log('✅ Connected to database\n');

    // Check zip_code_data structure
    const zipCodeColumns = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'zip_code_data'
      ORDER BY ordinal_position;
    `);
    
    console.log('📋 zip_code_data columns:');
    zipCodeColumns.rows.forEach(col => {
      console.log(`- ${col.column_name} (${col.data_type})`);
    });

    // Check property_data structure
    const propertyColumns = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'property_data'
      ORDER BY ordinal_position;
    `);
    
    console.log('\n📋 property_data columns:');
    propertyColumns.rows.forEach(col => {
      console.log(`- ${col.column_name} (${col.data_type})`);
    });

    // Release the client
    client.release();
    await pool.end();
    
    console.log('\n✅ Table structure check completed');
  } catch (error) {
    console.error('❌ Table structure check failed:', error);
    process.exit(1);
  }
}

checkTableStructure();
