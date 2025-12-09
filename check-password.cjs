const Database = require('./backend/node_modules/better-sqlite3');
const bcrypt = require('./backend/node_modules/bcrypt');
const path = require('path');

const dbPath = path.join(__dirname, 'backend', 'database.db');
const db = new Database(dbPath);

console.log('Checking password for client@test.ro...\n');

const user = db.prepare('SELECT * FROM users WHERE email = ?').get('client@test.ro');

if (user) {
  console.log('User found:', user.email);
  console.log('Password hash:', user.password_hash);

  // Test common passwords
  const testPasswords = ['password123', 'test123', 'client123', '123456'];

  console.log('\nTesting common passwords:');
  for (const pwd of testPasswords) {
    const matches = bcrypt.compareSync(pwd, user.password_hash);
    console.log(`- "${pwd}": ${matches ? '✓ MATCH' : '✗ no match'}`);
    if (matches) {
      console.log(`\n✅ Correct password is: "${pwd}"`);
      break;
    }
  }
} else {
  console.log('❌ User not found');
}

db.close();
