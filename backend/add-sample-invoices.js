import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'database.db'));

// Check existing invoices
const existingInvoices = db.prepare('SELECT COUNT(*) as count FROM invoices').get();
console.log('Existing invoices:', existingInvoices.count);

// Get user and project data for sample invoices
const users = db.prepare("SELECT id, first_name, last_name FROM users WHERE role = 'client' LIMIT 2").all();
const projects = db.prepare('SELECT id, name, client_id FROM projects LIMIT 5').all();

console.log('Users:', users);
console.log('Projects:', projects);

if (existingInvoices.count === 0 && users.length > 0 && projects.length > 0) {
  // Add sample invoices
  const sampleInvoices = [
    {
      invoice_number: 'INV-2024-001',
      client_id: users[0].id,
      project_id: projects[0].id,
      amount: 1500.00,
      currency: 'EUR',
      status: 'paid',
      due_date: '2024-12-15',
      paid_date: '2024-12-10',
      created_at: new Date().toISOString()
    },
    {
      invoice_number: 'INV-2024-002',
      client_id: users[0].id,
      project_id: projects[1].id,
      amount: 2500.00,
      currency: 'EUR',
      status: 'sent',
      due_date: '2024-12-20',
      paid_date: null,
      created_at: new Date().toISOString()
    },
    {
      invoice_number: 'INV-2024-003',
      client_id: users[0].id,
      project_id: projects[2].id,
      amount: 800.00,
      currency: 'EUR',
      status: 'draft',
      due_date: '2024-12-25',
      paid_date: null,
      created_at: new Date().toISOString()
    }
  ];

  const insertInvoice = db.prepare(`
    INSERT INTO invoices (project_id, client_id, invoice_number, amount, currency, status, due_date, paid_date, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  sampleInvoices.forEach(invoice => {
    const result = insertInvoice.run(
      invoice.project_id,
      invoice.client_id,
      invoice.invoice_number,
      invoice.amount,
      invoice.currency,
      invoice.status,
      invoice.due_date,
      invoice.paid_date,
      invoice.created_at
    );
    console.log('Inserted invoice:', invoice.invoice_number, 'ID:', result.lastInsertRowid);
  });

  console.log('Sample invoices created successfully');
}

// Check final invoice count
const finalCount = db.prepare('SELECT COUNT(*) as count FROM invoices').get();
console.log('Total invoices now:', finalCount.count);

// Display all invoices
const allInvoices = db.prepare(`
  SELECT i.*, p.name as project_name, u.first_name, u.last_name
  FROM invoices i
  LEFT JOIN projects p ON i.project_id = p.id
  LEFT JOIN users u ON i.client_id = u.id
`).all();

console.log('All invoices:');
allInvoices.forEach(invoice => {
  console.log(`- ${invoice.invoice_number}: ${invoice.amount} ${invoice.currency} (${invoice.status}) - ${invoice.project_name}`);
});

db.close();