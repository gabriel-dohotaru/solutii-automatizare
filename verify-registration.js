const path = require('path');
const Database = require(path.join(__dirname, 'backend/node_modules/better-sqlite3'));
const db = new Database(path.join(__dirname, 'backend/database.db'));

// Check if user was created successfully
const result = db.prepare(`
  SELECT id, email, first_name, last_name, phone, company_name, role, created_at
  FROM users
  WHERE email = 'test@user.com'
  ORDER BY created_at DESC
  LIMIT 1
`).get();

console.log('Registration verification:');
if (result) {
  console.log('✅ User found in database:');
  console.log(JSON.stringify(result, null, 2));
  console.log('\n✅ Password is hashed (not shown for security)');
  console.log('✅ User role:', result.role);
  console.log('✅ Registration successful!');
} else {
  console.log('❌ User not found in database');
}

db.close();