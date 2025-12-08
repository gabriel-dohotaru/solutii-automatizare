import Database from 'better-sqlite3';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'database.db');
const db = new Database(dbPath);

console.log('🗄️  Initializing database...');

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Drop existing tables (in reverse order of dependencies)
const dropTables = [
  'sessions',
  'newsletter_subscribers',
  'invoices',
  'quote_requests',
  'contact_submissions',
  'ticket_messages',
  'support_tickets',
  'blog_posts',
  'portfolio_items',
  'project_files',
  'project_updates',
  'project_milestones',
  'projects',
  'packages',
  'services',
  'users'
];

console.log('Dropping existing tables...');
dropTables.forEach(table => {
  db.prepare(`DROP TABLE IF EXISTS ${table}`).run();
});

// Create tables
console.log('Creating tables...');

// Users table
db.prepare(`
  CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    company_name TEXT,
    phone TEXT,
    role TEXT DEFAULT 'client' CHECK(role IN ('client', 'admin')),
    email_verified INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// Services table
db.prepare(`
  CREATE TABLE services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    category TEXT CHECK(category IN ('ecommerce', 'automation', 'bugfix', 'webdev')),
    short_description TEXT,
    full_description TEXT,
    icon TEXT,
    features TEXT,
    is_featured INTEGER DEFAULT 0,
    order_index INTEGER,
    is_active INTEGER DEFAULT 1
  )
`).run();

// Packages table
db.prepare(`
  CREATE TABLE packages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    description TEXT,
    price_from REAL,
    currency TEXT DEFAULT 'EUR',
    features TEXT,
    is_popular INTEGER DEFAULT 0,
    order_index INTEGER,
    is_active INTEGER DEFAULT 1
  )
`).run();

// Projects table
db.prepare(`
  CREATE TABLE projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER REFERENCES users(id),
    name TEXT NOT NULL,
    description TEXT,
    service_type TEXT,
    status TEXT DEFAULT 'inquiry' CHECK(status IN ('inquiry', 'approved', 'in_progress', 'review', 'completed', 'cancelled')),
    progress INTEGER DEFAULT 0,
    estimated_hours INTEGER,
    price REAL,
    currency TEXT DEFAULT 'EUR',
    start_date DATE,
    deadline DATE,
    completed_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// Project milestones table
db.prepare(`
  CREATE TABLE project_milestones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT,
    description TEXT,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'in_progress', 'completed')),
    due_date DATE,
    completed_date DATE,
    order_index INTEGER
  )
`).run();

// Project updates table
db.prepare(`
  CREATE TABLE project_updates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id),
    title TEXT,
    content TEXT,
    is_internal INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// Project files table
db.prepare(`
  CREATE TABLE project_files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    uploaded_by INTEGER REFERENCES users(id),
    filename TEXT,
    original_name TEXT,
    file_type TEXT,
    file_size INTEGER,
    description TEXT,
    is_deliverable INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// Portfolio items table
db.prepare(`
  CREATE TABLE portfolio_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE,
    category TEXT,
    client_name TEXT,
    short_description TEXT,
    challenge TEXT,
    solution TEXT,
    results TEXT,
    technologies TEXT,
    images TEXT,
    testimonial TEXT,
    is_featured INTEGER DEFAULT 0,
    is_published INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// Blog posts table
db.prepare(`
  CREATE TABLE blog_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE,
    excerpt TEXT,
    content TEXT,
    featured_image TEXT,
    category TEXT CHECK(category IN ('tutorials', 'news', 'case-studies', 'tips')),
    author_id INTEGER REFERENCES users(id),
    status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'published')),
    reading_time INTEGER,
    views INTEGER DEFAULT 0,
    published_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// Support tickets table
db.prepare(`
  CREATE TABLE support_tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id),
    project_id INTEGER REFERENCES projects(id),
    subject TEXT,
    status TEXT DEFAULT 'open' CHECK(status IN ('open', 'in_progress', 'waiting', 'resolved', 'closed')),
    priority TEXT DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high', 'urgent')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    resolved_at DATETIME
  )
`).run();

// Ticket messages table
db.prepare(`
  CREATE TABLE ticket_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_id INTEGER REFERENCES support_tickets(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id),
    message TEXT,
    attachments TEXT,
    is_internal INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// Contact submissions table
db.prepare(`
  CREATE TABLE contact_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    phone TEXT,
    company TEXT,
    service_type TEXT,
    budget_range TEXT,
    message TEXT,
    attachment_path TEXT,
    status TEXT DEFAULT 'new' CHECK(status IN ('new', 'contacted', 'converted', 'closed')),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// Quote requests table
db.prepare(`
  CREATE TABLE quote_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    phone TEXT,
    company TEXT,
    project_type TEXT,
    platform TEXT,
    description TEXT,
    timeline TEXT,
    budget_range TEXT,
    attachments TEXT,
    status TEXT DEFAULT 'new' CHECK(status IN ('new', 'reviewing', 'quoted', 'accepted', 'rejected')),
    quoted_price REAL,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// Invoices table
db.prepare(`
  CREATE TABLE invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER REFERENCES projects(id),
    client_id INTEGER REFERENCES users(id),
    invoice_number TEXT UNIQUE,
    amount REAL,
    currency TEXT DEFAULT 'EUR',
    status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
    due_date DATE,
    paid_date DATE,
    pdf_path TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// Newsletter subscribers table
db.prepare(`
  CREATE TABLE newsletter_subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    is_active INTEGER DEFAULT 1,
    subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// Sessions table
db.prepare(`
  CREATE TABLE sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token TEXT UNIQUE,
    expires_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

console.log('✓ Tables created');

// Create indexes
console.log('Creating indexes...');
db.prepare('CREATE INDEX idx_users_email ON users(email)').run();
db.prepare('CREATE INDEX idx_projects_client ON projects(client_id)').run();
db.prepare('CREATE INDEX idx_projects_status ON projects(status)').run();
db.prepare('CREATE INDEX idx_blog_slug ON blog_posts(slug)').run();
db.prepare('CREATE INDEX idx_blog_status ON blog_posts(status)').run();
db.prepare('CREATE INDEX idx_tickets_user ON support_tickets(user_id)').run();
db.prepare('CREATE INDEX idx_sessions_token ON sessions(token)').run();
console.log('✓ Indexes created');

// Insert seed data
console.log('Inserting seed data...');

// Create admin user (password: admin123)
const adminPassword = await bcrypt.hash('admin123', 10);
db.prepare(`
  INSERT INTO users (email, password_hash, first_name, last_name, role, email_verified)
  VALUES (?, ?, ?, ?, ?, ?)
`).run('admin@solutiiautomatizare.ro', adminPassword, 'Admin', 'User', 'admin', 1);

// Create test client user (password: client123)
const clientPassword = await bcrypt.hash('client123', 10);
db.prepare(`
  INSERT INTO users (email, password_hash, first_name, last_name, company_name, phone, role, email_verified)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`).run('client@test.ro', clientPassword, 'Ion', 'Popescu', 'Test Company SRL', '+40721234567', 'client', 1);

console.log('✓ Admin user created (admin@solutiiautomatizare.ro / admin123)');
console.log('✓ Test client created (client@test.ro / client123)');

// Insert sample services
const services = [
  {
    name: 'Module PrestaShop',
    slug: 'module-prestashop',
    category: 'ecommerce',
    short_description: 'Module personalizate pentru PrestaShop',
    full_description: 'Dezvoltăm module custom PrestaShop pentru orice funcționalitate: integrări plăți, curierat, ERP, marketplaces și multe altele.',
    icon: 'ShoppingCart',
    features: JSON.stringify(['Module personalizate', 'Integrări API', 'Optimizare performanță', 'Suport 24/7']),
    is_featured: 1,
    order_index: 1
  },
  {
    name: 'Module WooCommerce',
    slug: 'module-woocommerce',
    category: 'ecommerce',
    short_description: 'Plugin-uri WordPress/WooCommerce',
    full_description: 'Creăm plugin-uri WooCommerce pentru extinderea funcționalităților magazinului tău online.',
    icon: 'Package',
    features: JSON.stringify(['Plugin-uri custom', 'Integrări plăți', 'Sisteme curierat', 'Sincronizare stocuri']),
    is_featured: 1,
    order_index: 2
  },
  {
    name: 'Automatizări Software',
    slug: 'automatizari-software',
    category: 'automation',
    short_description: 'Automatizări și integrări API',
    full_description: 'Automatizăm procesele repetitive, sincronizăm date între sisteme și cream integrări API.',
    icon: 'Zap',
    features: JSON.stringify(['Integrări API', 'Sincronizare date', 'Web scraping', 'Task-uri programate']),
    is_featured: 1,
    order_index: 3
  },
  {
    name: 'Bug Fixing & Mentenanță',
    slug: 'bug-fixing',
    category: 'bugfix',
    short_description: 'Rezolvare bug-uri și optimizări',
    full_description: 'Identificăm și rezolvăm bug-uri, optimizăm performanța și oferim mentenanță continuă.',
    icon: 'Wrench',
    features: JSON.stringify(['Debug aplicații', 'Optimizare performanță', 'Security fixes', 'Suport SLA']),
    is_featured: 1,
    order_index: 4
  }
];

const insertService = db.prepare(`
  INSERT INTO services (name, slug, category, short_description, full_description, icon, features, is_featured, order_index, is_active)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
`);

services.forEach(service => {
  insertService.run(
    service.name,
    service.slug,
    service.category,
    service.short_description,
    service.full_description,
    service.icon,
    service.features,
    service.is_featured,
    service.order_index
  );
});

console.log('✓ Sample services created');

// Insert pricing packages
const packages = [
  {
    name: 'Starter',
    slug: 'starter',
    description: 'Perfect pentru proiecte simple',
    price_from: 500,
    features: JSON.stringify([
      '1 modul custom',
      '2 revizii incluse',
      'Suport 30 zile',
      'Documentație tehnică',
      'Training de utilizare'
    ]),
    is_popular: 0,
    order_index: 1
  },
  {
    name: 'Professional',
    slug: 'professional',
    description: 'Cel mai popular pentru proiecte medii',
    price_from: 1500,
    features: JSON.stringify([
      'Până la 5 module/integrări',
      'Revizii nelimitate',
      'Suport 90 zile',
      'Prioritate ridicată',
      'Training avansat',
      'Optimizare performanță'
    ]),
    is_popular: 1,
    order_index: 2
  },
  {
    name: 'Enterprise',
    slug: 'enterprise',
    description: 'Soluții complete pentru business',
    price_from: null,
    features: JSON.stringify([
      'Proiecte custom complete',
      'Echipă dedicată',
      'SLA garantat',
      'Suport prioritar 24/7',
      'Consultanță strategică',
      'Mentenanță pe termen lung'
    ]),
    is_popular: 0,
    order_index: 3
  }
];

const insertPackage = db.prepare(`
  INSERT INTO packages (name, slug, description, price_from, currency, features, is_popular, order_index, is_active)
  VALUES (?, ?, ?, ?, 'EUR', ?, ?, ?, 1)
`);

packages.forEach(pkg => {
  insertPackage.run(
    pkg.name,
    pkg.slug,
    pkg.description,
    pkg.price_from,
    pkg.features,
    pkg.is_popular,
    pkg.order_index
  );
});

console.log('✓ Pricing packages created');

// Sample portfolio item
db.prepare(`
  INSERT INTO portfolio_items (
    title, slug, category, client_name, short_description,
    challenge, solution, results, technologies, images, is_featured, is_published
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  'Modul Sincronizare Stocuri PrestaShop',
  'modul-sincronizare-stocuri-prestashop',
  'Module PrestaShop',
  'eCommerce Solutions SRL',
  'Sincronizare automată stocuri între PrestaShop și sistem ERP',
  'Clientul avea probleme cu sincronizarea manuală a stocurilor între magazinul online și sistemul ERP, ducând la comenzi pentru produse epuizate.',
  'Am dezvoltat un modul PrestaShop care sincronizează automat stocurile la fiecare 5 minute prin API, cu notificări în timp real pentru stocuri critice.',
  'Reducere cu 95% a comenzilor pentru produse epuizate, economisire de 10 ore/săptămână pentru echipă, și creștere cu 15% a satisfacției clienților.',
  JSON.stringify(['PrestaShop 8.x', 'PHP 8.1', 'REST API', 'MySQL', 'Cron Jobs']),
  JSON.stringify([]),
  1,
  1
);

// Sample blog post
db.prepare(`
  INSERT INTO blog_posts (
    title, slug, excerpt, content, category, author_id, status,
    reading_time, views, published_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  'Cum să Optimizezi Performanța Magazinului PrestaShop',
  'cum-sa-optimizezi-performanta-magazinului-prestashop',
  'Ghid complet pentru îmbunătățirea vitezei de încărcare a magazinului PrestaShop',
  `# Introducere

Performanța este esențială pentru succesul unui magazin online. În acest ghid, vom explora tehnicile cele mai eficiente de optimizare PrestaShop.

## 1. Optimizarea Cache-ului

\`\`\`php
// Activează cache-ul în config/defines.inc.php
define('_PS_CACHE_ENABLED_', '1');
\`\`\`

## 2. Optimizarea Bazei de Date

Curățarea regulată a tabelelor și optimizarea indexurilor pot îmbunătăți semnificativ performanța.

## 3. CDN pentru Resurse Statice

Utilizarea unui CDN pentru imagini și fișiere CSS/JS reduce timpul de încărcare.`,
  'tutorials',
  1,
  'published',
  8,
  142,
  datetime('now')
);

console.log('✓ Sample portfolio and blog content created');

db.close();

console.log('\n✅ Database initialization complete!');
console.log('\n📊 Summary:');
console.log('   - Users table: 2 users (1 admin, 1 client)');
console.log('   - Services: 4 services');
console.log('   - Packages: 3 pricing tiers');
console.log('   - Portfolio: 1 sample item');
console.log('   - Blog: 1 sample post');
console.log('\n🔐 Login credentials:');
console.log('   Admin: admin@solutiiautomatizare.ro / admin123');
console.log('   Client: client@test.ro / client123');
console.log('');
