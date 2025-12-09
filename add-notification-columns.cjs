const Database = require('./backend/node_modules/better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'backend', 'database.db');
const db = new Database(dbPath);

console.log('Adding notification preference columns to users table...\n');

try {
  // Add notification columns
  db.prepare(`
    ALTER TABLE users ADD COLUMN notify_project_updates INTEGER DEFAULT 1
  `).run();
  console.log('✓ Added notify_project_updates column');

  db.prepare(`
    ALTER TABLE users ADD COLUMN notify_ticket_replies INTEGER DEFAULT 1
  `).run();
  console.log('✓ Added notify_ticket_replies column');

  db.prepare(`
    ALTER TABLE users ADD COLUMN notify_invoices INTEGER DEFAULT 1
  `).run();
  console.log('✓ Added notify_invoices column');

  db.prepare(`
    ALTER TABLE users ADD COLUMN notify_marketing INTEGER DEFAULT 0
  `).run();
  console.log('✓ Added notify_marketing column');

  console.log('\n✅ All notification columns added successfully!');

  // Verify the columns were added
  const tableInfo = db.prepare('PRAGMA table_info(users)').all();
  console.log('\nCurrent users table columns:');
  tableInfo.forEach(col => {
    if (col.name.startsWith('notify_')) {
      console.log(`  - ${col.name}: ${col.type} (default: ${col.dflt_value})`);
    }
  });

} catch (error) {
  if (error.message.includes('duplicate column name')) {
    console.log('⚠️  Columns already exist. Skipping...');
  } else {
    console.error('❌ Error:', error.message);
    throw error;
  }
} finally {
  db.close();
}
