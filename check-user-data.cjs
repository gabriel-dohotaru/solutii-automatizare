const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'backend', 'database.db');
const db = new Database(dbPath);

const user = db.prepare('SELECT * FROM users WHERE email = ?').get('client@test.ro');
console.log('User object from database:');
console.log(JSON.stringify(user, null, 2));

const localStorageUser = {
  id: user.id,
  email: user.email,
  first_name: user.first_name,
  last_name: user.last_name,
  phone: user.phone,
  company_name: user.company_name,
  role: user.role
};

console.log('\nUser object as stored in localStorage:');
console.log(JSON.stringify(localStorageUser, null, 2));

db.close();
