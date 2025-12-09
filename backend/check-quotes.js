import db from './utils/db.js';

const quotes = db.prepare('SELECT * FROM quote_requests ORDER BY created_at DESC LIMIT 1').all();
console.log(JSON.stringify(quotes, null, 2));
