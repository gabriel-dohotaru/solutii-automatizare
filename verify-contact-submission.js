const path = require('path');
const Database = require(path.join(__dirname, 'backend/node_modules/better-sqlite3'));
const db = new Database(path.join(__dirname, 'backend/database.db'));

const result = db.prepare(`
  SELECT name, email, phone, company, service_type, budget_range, substr(message, 1, 60) as message_preview, created_at
  FROM contact_submissions
  ORDER BY created_at DESC
  LIMIT 1
`).get();

console.log('Latest contact submission:');
console.log(JSON.stringify(result, null, 2));
db.close();