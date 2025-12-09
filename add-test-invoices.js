/**
 * Add test invoices for testing PDF download feature
 */

import Database from './backend/node_modules/better-sqlite3/lib/index.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'backend', 'database.db'));

try {
  // Get client user ID
  const client = db.prepare("SELECT id FROM users WHERE email = 'client@test.ro'").get();

  if (!client) {
    console.log('❌ Client user not found');
    process.exit(1);
  }

  console.log(`✓ Found client user with ID: ${client.id}`);

  // Get a project for this client
  const project = db.prepare("SELECT id, name FROM projects WHERE client_id = ?").get(client.id);

  if (!project) {
    console.log('⚠️  No projects found for client. Creating a project first...');

    // Create a test project
    const projectResult = db.prepare(`
      INSERT INTO projects (client_id, name, description, service_type, status, progress, price, currency, deadline, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).run(
      client.id,
      'Test Project for Invoices',
      'A test project for invoice generation',
      'automation',
      'in_progress',
      50,
      2500.00,
      'EUR',
      '2025-03-31',
    );

    console.log(`✓ Created test project with ID: ${projectResult.lastInsertRowid}`);
  }

  // Get project again
  const targetProject = db.prepare("SELECT id, name FROM projects WHERE client_id = ? LIMIT 1").get(client.id);

  // Check existing invoices
  const existingInvoices = db.prepare("SELECT COUNT(*) as count FROM invoices WHERE client_id = ?").get(client.id);
  console.log(`✓ Client currently has ${existingInvoices.count} invoice(s)`);

  // Add test invoices if needed
  if (existingInvoices.count === 0) {
    console.log('\n✓ Creating test invoices...');

    // Invoice 1 - Sent
    const inv1 = db.prepare(`
      INSERT INTO invoices (project_id, client_id, invoice_number, amount, currency, status, due_date, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `).run(
      targetProject.id,
      client.id,
      'INV-2024-001',
      1500.00,
      'EUR',
      'sent',
      '2024-12-31'
    );
    console.log(`  ✅ Created invoice INV-2024-001 (Sent)`);

    // Invoice 2 - Paid
    const inv2 = db.prepare(`
      INSERT INTO invoices (project_id, client_id, invoice_number, amount, currency, status, due_date, paid_date, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `).run(
      targetProject.id,
      client.id,
      'INV-2024-002',
      2500.00,
      'EUR',
      'paid',
      '2024-11-30',
      '2024-11-25'
    );
    console.log(`  ✅ Created invoice INV-2024-002 (Paid)`);

    // Invoice 3 - Draft
    const inv3 = db.prepare(`
      INSERT INTO invoices (project_id, client_id, invoice_number, amount, currency, status, due_date, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `).run(
      targetProject.id,
      client.id,
      'INV-2024-003',
      750.00,
      'EUR',
      'draft',
      '2025-01-15'
    );
    console.log(`  ✅ Created invoice INV-2024-003 (Draft)`);

    console.log('\n✅ Successfully created 3 test invoices!');
  } else {
    console.log('✓ Invoices already exist, skipping creation');
  }

  // Verify invoices
  const invoices = db.prepare(`
    SELECT i.*, p.name as project_name
    FROM invoices i
    LEFT JOIN projects p ON i.project_id = p.id
    WHERE i.client_id = ?
  `).all(client.id);

  console.log(`\n✓ Client now has ${invoices.length} invoice(s):`);
  invoices.forEach(inv => {
    console.log(`  - ${inv.invoice_number}: ${inv.amount} ${inv.currency} (${inv.status})`);
  });

} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
} finally {
  db.close();
}
