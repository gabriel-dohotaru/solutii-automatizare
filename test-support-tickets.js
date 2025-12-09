import sqlite3 from 'better-sqlite3';

const db = new Database('./database.db');

console.log('📊 Checking Support Tickets Database...');
console.log('=====================================');

// Check support tickets
const tickets = db.prepare('SELECT id, subject, status, user_id FROM support_tickets').all();
console.log(`Found ${tickets.length} support tickets:`);
tickets.forEach(ticket => {
  console.log(`  - ID: ${ticket.id}, Subject: "${ticket.subject}", Status: ${ticket.status}`);
});

// Check ticket messages
const messages = db.prepare('SELECT id, ticket_id, message, user_id FROM ticket_messages').all();
console.log(`\nFound ${messages.length} ticket messages:`);
messages.forEach(message => {
  console.log(`  - ID: ${message.id}, Ticket ID: ${message.id}, Message: "${message.message.substring(0, 50)}..."`);
});

// Check users (clients)
const users = db.prepare('SELECT id, email, role FROM users WHERE role = "client"').all();
console.log(`\nFound ${users.length} client users:`);
users.forEach(user => {
  console.log(`  - ID: ${user.id}, Email: "${user.email}"`);
});

db.close();
console.log('\n✅ Database check complete!');