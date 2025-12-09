const Database = require('./backend/node_modules/better-sqlite3');
const bcrypt = require('./backend/node_modules/bcrypt');

const db = new Database('./backend/database.db');

// Check if user exists
const user = db.prepare('SELECT * FROM users WHERE email = ?').get('client@test.ro');

if (user) {
  console.log('User found:');
  console.log('Email:', user.email);
  console.log('Has password_hash:', !!user.password_hash);
  console.log('Hash length:', user.password_hash?.length || 0);

  // Test password
  const testPassword = 'client123';
  const isValid = bcrypt.compareSync(testPassword, user.password_hash);
  console.log('Password "client123" is valid:', isValid);

  if (!isValid) {
    console.log('\n⚠️  PASSWORD MISMATCH - need to reset!');
    const newHash = bcrypt.hashSync(testPassword, 12);
    db.prepare('UPDATE users SET password_hash = ? WHERE email = ?').run(newHash, 'client@test.ro');
    console.log('✅ Password reset to "client123"');
  }
} else {
  console.log('❌ User not found!');
}

db.close();
