const path = require('path');
const Database = require(path.join(__dirname, 'backend/node_modules/better-sqlite3'));
const db = new Database(path.join(__dirname, 'backend/database.db'));

const result = db.prepare(`
  SELECT name, email, phone, company, project_type, platform, timeline, budget_range, substr(description, 1, 60) as description_preview
  FROM quote_requests
  ORDER BY created_at DESC
  LIMIT 1
`).get();

console.log('Latest quote request:');
console.log(JSON.stringify(result, null, 2));
db.close();
