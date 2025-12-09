const Database = require('./backend/node_modules/better-sqlite3');
const bcrypt = require('./backend/node_modules/bcrypt');
const path = require('path');

(async () => {
  console.log('Resetting test user password back to "client123"...\n');

  const db = new Database(path.join(__dirname, 'backend', 'database.db'));

  try {
    // Hash the original password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash('client123', saltRounds);

    // Update the user's password
    const result = db.prepare(`
      UPDATE users
      SET password_hash = ?, updated_at = datetime('now')
      WHERE email = ?
    `).run(hashedPassword, 'client@test.ro');

    if (result.changes > 0) {
      console.log('✅ Password reset successfully!');
      console.log('   Email: client@test.ro');
      console.log('   Password: client123');
    } else {
      console.log('❌ User not found');
    }
  } catch (error) {
    console.error('❌ Error resetting password:', error);
  } finally {
    db.close();
  }
})();
