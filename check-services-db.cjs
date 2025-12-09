const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'backend', 'database.db');
console.log('Database path:', dbPath);

const db = new Database(dbPath);

const services = db.prepare('SELECT * FROM services').all();

console.log('\n=== All Services in Database ===');
console.log('Total services:', services.length);
console.log('\nServices:');
services.forEach(service => {
  console.log(`\nID: ${service.id}`);
  console.log(`Name: ${service.name}`);
  console.log(`Slug: ${service.slug}`);
  console.log(`Category: ${service.category}`);
  console.log(`Short description: ${service.short_description?.substring(0, 50)}...`);
  console.log(`Full description: ${service.full_description?.substring(0, 50)}...`);
  console.log(`Features: ${service.features}`);
  console.log(`Is active: ${service.is_active}`);
});

db.close();
