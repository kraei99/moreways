import { pool } from '../config/database';

async function checkTableColumns() {
  try {
    console.log('🔍 Checking table columns...\n');
    
    const query = `
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'property_data'
      ORDER BY ordinal_position;
    `;
    
    const result = await pool.query(query);
    
    console.log('📋 Columns in property_data table:');
    result.rows.forEach(row => {
      console.log(`- ${row.column_name} (${row.data_type})`);
    });
    
    console.log('\n✅ Table structure check completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Table structure check failed:', error);
    process.exit(1);
  }
}

checkTableColumns();
