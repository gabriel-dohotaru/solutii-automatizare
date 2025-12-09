import db from './utils/db.js';

const submissions = db.prepare('SELECT * FROM contact_submissions ORDER BY created_at DESC LIMIT 1').all();
console.log(JSON.stringify(submissions, null, 2));
