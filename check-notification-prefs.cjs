const Database = require('./backend/node_modules/better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'backend', 'database.db');
const db = new Database(dbPath);

console.log('Checking notification preferences in database...\n');

const user = db.prepare(`
  SELECT email, first_name, last_name,
         notify_project_updates, notify_ticket_replies, notify_invoices, notify_marketing
  FROM users
  WHERE email = 'client@test.ro'
`).get();

if (user) {
  console.log('User:', user.first_name, user.last_name, `(${user.email})`);
  console.log('\nNotification Preferences:');
  console.log('  Project Updates:', user.notify_project_updates ? 'ON' : 'OFF');
  console.log('  Ticket Replies:', user.notify_ticket_replies ? 'ON' : 'OFF');
  console.log('  Invoices:', user.notify_invoices ? 'ON' : 'OFF');
  console.log('  Marketing:', user.notify_marketing ? 'ON' : 'OFF');
  console.log('\n✅ Notification preferences verified in database');
} else {
  console.log('❌ User not found');
}

db.close();
