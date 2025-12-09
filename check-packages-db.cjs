const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'backend', 'database.db');
console.log('Database path:', dbPath);

const db = new Database(dbPath);

const packages = db.prepare('SELECT * FROM packages').all();

console.log('\n=== All Packages in Database ===');
console.log('Total packages:', packages.length);
console.log('\nPackages:');
packages.forEach(pkg => {
  console.log(`\nID: ${pkg.id}`);
  console.log(`Name: ${pkg.name}`);
  console.log(`Slug: ${pkg.slug}`);
  console.log(`Description: ${pkg.description?.substring(0, 50)}...`);
  console.log(`Price from: ${pkg.price_from} ${pkg.currency}`);
  console.log(`Features: ${pkg.features}`);
  console.log(`Is popular: ${pkg.is_popular}`);
  console.log(`Order index: ${pkg.order_index}`);
  console.log(`Is active: ${pkg.is_active}`);
});

db.close();
