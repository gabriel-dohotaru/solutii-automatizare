const Database = require('better-sqlite3');
const db = new Database('./database.db');

try {
  const users = db.prepare('SELECT id, email, first_name, last_name, role FROM users').all();

  console.log('\n=== Users in Database ===');
  console.log(`Total users: ${users.length}\n`);

  users.forEach(user => {
    console.log(`ID: ${user.id}`);
    console.log(`Email: ${user.email}`);
    console.log(`Name: ${user.first_name} ${user.last_name}`);
    console.log(`Role: ${user.role}`);
    console.log('---');
  });

} catch (error) {
  console.error('Error:', error.message);
} finally {
  db.close();
}
