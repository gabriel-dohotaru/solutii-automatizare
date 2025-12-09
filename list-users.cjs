const Database = require('./backend/node_modules/better-sqlite3');

const db = new Database('./backend/database.db');

console.log('All users in database:');
const users = db.prepare('SELECT id, email, first_name, last_name, role FROM users').all();
console.table(users);

db.close();
