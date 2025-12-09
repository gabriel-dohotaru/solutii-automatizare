const Database = require('./backend/node_modules/better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'backend', 'database.db');
const db = new Database(dbPath);

console.log('Checking users in database...\n');

const users = db.prepare('SELECT id, email, first_name, last_name, role FROM users').all();

console.log(`Found ${users.length} users:`);
users.forEach(user => {
  console.log(`- ID: ${user.id}, Email: ${user.email}, Name: ${user.first_name} ${user.last_name}, Role: ${user.role}`);
});

// Check the specific user
const testUser = db.prepare('SELECT * FROM users WHERE email = ?').get('ion.popescu@example.com');

if (testUser) {
  console.log('\n✓ Test user found:');
  console.log(JSON.stringify(testUser, null, 2));
} else {
  console.log('\n❌ Test user NOT found: ion.popescu@example.com');
  console.log('This user needs to be created!');
}

db.close();
