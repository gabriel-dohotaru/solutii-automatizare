import express from 'express';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import fs from 'fs';
import PDFDocument from 'pdfkit';
import { authenticateToken } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const db = new Database(path.join(__dirname, '..', 'database.db'));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'uploads', 'tickets');
    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp-random-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max file size
  },
  fileFilter: (req, file, cb) => {
    // Allow common file types
    const allowedExtensions = /\.(jpeg|jpg|png|gif|pdf|doc|docx|txt|zip)$/i;
    const allowedMimeTypes = /^(image\/(jpeg|png|gif)|application\/(pdf|msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document|zip)|text\/plain)$/;

    const extname = allowedExtensions.test(file.originalname.toLowerCase());
    const mimetype = allowedMimeTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Tip de fișier neacceptat. Doar imagini, PDF, DOC și ZIP sunt permise.'));
    }
  }
});

// Get dashboard summary stats for the authenticated client
router.get('/dashboard', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;

    // Get project stats
    const activeProjects = db.prepare(`
      SELECT COUNT(*) as count FROM projects
      WHERE client_id = ? AND status IN ('in_progress', 'approved')
    `).get(userId).count;

    const completedProjects = db.prepare(`
      SELECT COUNT(*) as count FROM projects
      WHERE client_id = ? AND status = 'completed'
    `).get(userId).count;

    // Get support tickets stats
    const openTickets = db.prepare(`
      SELECT COUNT(*) as count FROM support_tickets
      WHERE user_id = ? AND status IN ('open', 'in_progress')
    `).get(userId).count;

    // Get pending invoices count
    const pendingInvoices = db.prepare(`
      SELECT COUNT(*) as count FROM invoices
      WHERE client_id = ? AND status IN ('draft', 'sent')
    `).get(userId).count;

    // Get recent projects (limit 3)
    const recentProjects = db.prepare(`
      SELECT id, name, status, progress, deadline, created_at
      FROM projects
      WHERE client_id = ?
      ORDER BY created_at DESC
      LIMIT 3
    `).all(userId);

    // Get recent updates (limit 5)
    const recentUpdates = db.prepare(`
      SELECT
        pu.id,
        pu.title,
        pu.content as message,
        pu.created_at as date,
        p.name as project_name,
        'progress' as type
      FROM project_updates pu
      JOIN projects p ON pu.project_id = p.id
      WHERE p.client_id = ? AND pu.is_internal = 0
      ORDER BY pu.created_at DESC
      LIMIT 5
    `).all(userId);

    res.json({
      success: true,
      data: {
        stats: {
          activeProjects,
          completedProjects,
          openTickets,
          pendingInvoices
        },
        recentProjects,
        recentUpdates
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({
      success: false,
      message: 'Eroare la încărcarea datelor pentru dashboard'
    });
  }
});

// Get all projects for the authenticated client
router.get('/projects', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;

    const projects = db.prepare(`
      SELECT
        p.*,
        u.first_name,
        u.last_name,
        u.email as client_email
      FROM projects p
      JOIN users u ON p.client_id = u.id
      WHERE p.client_id = ?
      ORDER BY p.created_at DESC
    `).all(userId);

    res.json({
      success: true,
      data: projects,
      count: projects.length
    });
  } catch (error) {
    console.error('Error fetching client projects:', error);
    res.status(500).json({
      success: false,
      message: 'Eroare la încărcarea proiectelor'
    });
  }
});

// Get a specific project by ID (only if it belongs to the client)
router.get('/projects/:id', authenticateToken, (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.user.userId;

    const project = db.prepare(`
      SELECT
        p.*,
        u.first_name,
        u.last_name,
        u.email as client_email
      FROM projects p
      JOIN users u ON p.client_id = u.id
      WHERE p.id = ? AND p.client_id = ?
    `).get(projectId, userId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Proiectul nu a fost găsit'
      });
    }

    // Get project milestones
    const milestones = db.prepare(`
      SELECT * FROM project_milestones
      WHERE project_id = ?
      ORDER BY order_index ASC
    `).all(projectId);

    // Get project updates
    const updates = db.prepare(`
      SELECT
        pu.*,
        u.first_name,
        u.last_name,
        u.role
      FROM project_updates pu
      JOIN users u ON pu.user_id = u.id
      WHERE pu.project_id = ?
      ORDER BY pu.created_at DESC
    `).all(projectId);

    // Get project files
    const files = db.prepare(`
      SELECT
        pf.*,
        u.first_name,
        u.last_name
      FROM project_files pf
      JOIN users u ON pf.uploaded_by = u.id
      WHERE pf.project_id = ?
      ORDER BY pf.created_at DESC
    `).all(projectId);

    res.json({
      success: true,
      data: {
        ...project,
        milestones,
        updates,
        files
      }
    });
  } catch (error) {
    console.error('Error fetching project details:', error);
    res.status(500).json({
      success: false,
      message: 'Eroare la încărcarea detaliilor proiectului'
    });
  }
});

// Get project milestones
router.get('/projects/:id/milestones', authenticateToken, (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.user.userId;

    // Verify project belongs to client
    const project = db.prepare('SELECT id FROM projects WHERE id = ? AND client_id = ?')
      .get(projectId, userId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Proiectul nu a fost găsit'
      });
    }

    const milestones = db.prepare(`
      SELECT * FROM project_milestones
      WHERE project_id = ?
      ORDER BY order_index ASC
    `).all(projectId);

    res.json({
      success: true,
      data: milestones,
      count: milestones.length
    });
  } catch (error) {
    console.error('Error fetching project milestones:', error);
    res.status(500).json({
      success: false,
      message: 'Eroare la încărcarea milestone-urilor'
    });
  }
});

// Get project updates
router.get('/projects/:id/updates', authenticateToken, (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.user.userId;

    // Verify project belongs to client
    const project = db.prepare('SELECT id FROM projects WHERE id = ? AND client_id = ?')
      .get(projectId, userId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Proiectul nu a fost găsit'
      });
    }

    const updates = db.prepare(`
      SELECT
        pu.*,
        u.first_name,
        u.last_name,
        u.role
      FROM project_updates pu
      JOIN users u ON pu.user_id = u.id
      WHERE pu.project_id = ? AND pu.is_internal = 0
      ORDER BY pu.created_at DESC
    `).all(projectId);

    res.json({
      success: true,
      data: updates,
      count: updates.length
    });
  } catch (error) {
    console.error('Error fetching project updates:', error);
    res.status(500).json({
      success: false,
      message: 'Eroare la încărcarea actualizărilor'
    });
  }
});

// Get project files
router.get('/projects/:id/files', authenticateToken, (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.user.userId;

    // Verify project belongs to client
    const project = db.prepare('SELECT id FROM projects WHERE id = ? AND client_id = ?')
      .get(projectId, userId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Proiectul nu a fost găsit'
      });
    }

    const files = db.prepare(`
      SELECT
        pf.*,
        u.first_name,
        u.last_name
      FROM project_files pf
      JOIN users u ON pf.uploaded_by = u.id
      WHERE pf.project_id = ?
      ORDER BY pf.created_at DESC
    `).all(projectId);

    res.json({
      success: true,
      data: files,
      count: files.length
    });
  } catch (error) {
    console.error('Error fetching project files:', error);
    res.status(500).json({
      success: false,
      message: 'Eroare la încărcarea fișierelor'
    });
  }
});

// Add a project update (client can add comments/updates)
router.post('/projects/:id/updates', authenticateToken, (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.user.userId;
    const { title, content } = req.body;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Titlul și conținutul sunt obligatorii'
      });
    }

    // Verify project belongs to client
    const project = db.prepare('SELECT id FROM projects WHERE id = ? AND client_id = ?')
      .get(projectId, userId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Proiectul nu a fost găsit'
      });
    }

    // Insert the project update
    const result = db.prepare(`
      INSERT INTO project_updates (project_id, user_id, title, content, is_internal, created_at)
      VALUES (?, ?, ?, ?, 0, datetime('now'))
    `).run(projectId, userId, title, content);

    // Get the created update with user info
    const createdUpdate = db.prepare(`
      SELECT
        pu.*,
        u.first_name,
        u.last_name,
        u.role
      FROM project_updates pu
      JOIN users u ON pu.user_id = u.id
      WHERE pu.id = ?
    `).get(result.lastInsertRowid);

    res.status(201).json({
      success: true,
      message: 'Actualizare adăugată cu succes',
      data: createdUpdate
    });
  } catch (error) {
    console.error('Error adding project update:', error);
    res.status(500).json({
      success: false,
      message: 'Eroare la adăugarea actualizării'
    });
  }
});

// Support Tickets endpoints

// Get all support tickets for the authenticated client
router.get('/tickets', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;

    const tickets = db.prepare(`
      SELECT
        st.*,
        p.name as project_name,
        p.id as project_id
      FROM support_tickets st
      LEFT JOIN projects p ON st.project_id = p.id
      WHERE st.user_id = ?
      ORDER BY st.created_at DESC
    `).all(userId);

    res.json({
      success: true,
      data: tickets,
      count: tickets.length
    });
  } catch (error) {
    console.error('Error fetching support tickets:', error);
    res.status(500).json({
      success: false,
      message: 'Eroare la încărcarea tichetelor de suport'
    });
  }
});

// Create a new support ticket
router.post('/tickets', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;
    const { subject, project_id, message, priority = 'medium' } = req.body;

    // Validate required fields
    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Subiectul și mesajul sunt obligatorii'
      });
    }

    // Validate priority
    const validPriorities = ['low', 'medium', 'high', 'urgent'];
    if (!validPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: 'Prioritatea nu este validă'
      });
    }

    // If project_id is provided, verify it belongs to the client
    if (project_id) {
      const project = db.prepare('SELECT id FROM projects WHERE id = ? AND client_id = ?')
        .get(project_id, userId);

      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Proiectul selectat nu a fost găsit'
        });
      }
    }

    // Create the support ticket
    const result = db.prepare(`
      INSERT INTO support_tickets (user_id, project_id, subject, status, priority, created_at, updated_at)
      VALUES (?, ?, ?, 'open', ?, datetime('now'), datetime('now'))
    `).run(userId, project_id || null, subject, priority);

    const ticketId = result.lastInsertRowid;

    // Create the initial message
    db.prepare(`
      INSERT INTO ticket_messages (ticket_id, user_id, message, is_internal, created_at)
      VALUES (?, ?, ?, 0, datetime('now'))
    `).run(ticketId, userId, message);

    // Get the created ticket with project info
    const createdTicket = db.prepare(`
      SELECT
        st.*,
        p.name as project_name,
        p.id as project_id
      FROM support_tickets st
      LEFT JOIN projects p ON st.project_id = p.id
      WHERE st.id = ?
    `).get(ticketId);

    res.status(201).json({
      success: true,
      message: 'Tichet de suport creat cu succes',
      data: createdTicket
    });
  } catch (error) {
    console.error('Error creating support ticket:', error);
    res.status(500).json({
      success: false,
      message: 'Eroare la crearea tichetului de suport'
    });
  }
});

// Get a specific support ticket with messages
router.get('/tickets/:id', authenticateToken, (req, res) => {
  try {
    const ticketId = req.params.id;
    const userId = req.user.userId;

    // Get the ticket (only if it belongs to the client)
    const ticket = db.prepare(`
      SELECT
        st.*,
        p.name as project_name,
        p.id as project_id
      FROM support_tickets st
      LEFT JOIN projects p ON st.project_id = p.id
      WHERE st.id = ? AND st.user_id = ?
    `).get(ticketId, userId);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Tichetul de suport nu a fost găsit'
      });
    }

    // Get ticket messages
    const messages = db.prepare(`
      SELECT
        tm.*,
        u.first_name,
        u.last_name,
        u.role
      FROM ticket_messages tm
      JOIN users u ON tm.user_id = u.id
      WHERE tm.ticket_id = ?
      ORDER BY tm.created_at ASC
    `).all(ticketId);

    res.json({
      success: true,
      data: {
        ...ticket,
        messages
      }
    });
  } catch (error) {
    console.error('Error fetching support ticket details:', error);
    res.status(500).json({
      success: false,
      message: 'Eroare la încărcarea detaliilor tichetului'
    });
  }
});

// Add a message to a support ticket (with optional file attachments)
router.post('/tickets/:id/messages', authenticateToken, upload.array('files', 5), (req, res) => {
  try {
    const ticketId = req.params.id;
    const userId = req.user.userId;
    const { message } = req.body;
    const files = req.files || [];

    // Debug logging
    console.log('=== Ticket Message POST Debug ===');
    console.log('req.body:', req.body);
    console.log('message:', message);
    console.log('files:', files.length);
    console.log('================================');

    // Validate required fields
    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Mesajul nu poate fi gol'
      });
    }

    // Verify ticket belongs to client
    const ticket = db.prepare('SELECT id FROM support_tickets WHERE id = ? AND user_id = ?')
      .get(ticketId, userId);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Tichetul de suport nu a fost găsit'
      });
    }

    // Prepare attachments data if files were uploaded
    let attachments = null;
    if (files.length > 0) {
      attachments = JSON.stringify(files.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: path.join('uploads', 'tickets', file.filename)
      })));
    }

    // Insert the message with attachments
    const result = db.prepare(`
      INSERT INTO ticket_messages (ticket_id, user_id, message, attachments, is_internal, created_at)
      VALUES (?, ?, ?, ?, 0, datetime('now'))
    `).run(ticketId, userId, message, attachments);

    // Update ticket's updated_at timestamp
    db.prepare("UPDATE support_tickets SET updated_at = datetime('now') WHERE id = ?")
      .run(ticketId);

    // Get the created message with user info
    const createdMessage = db.prepare(`
      SELECT
        tm.*,
        u.first_name,
        u.last_name,
        u.role
      FROM ticket_messages tm
      JOIN users u ON tm.user_id = u.id
      WHERE tm.id = ?
    `).get(result.lastInsertRowid);

    res.status(201).json({
      success: true,
      message: files.length > 0
        ? `Mesaj adăugat cu succes cu ${files.length} fișier(e) atașat(e)`
        : 'Mesaj adăugat cu succes',
      data: createdMessage
    });
  } catch (error) {
    console.error('Error adding message to support ticket:', error);
    // Clean up uploaded files if there was an error
    if (req.files) {
      req.files.forEach(file => {
        fs.unlinkSync(file.path);
      });
    }
    res.status(500).json({
      success: false,
      message: 'Eroare la adăugarea mesajului'
    });
  }
});

// Download/serve ticket attachment file
router.get('/tickets/attachments/:filename', authenticateToken, (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '..', 'uploads', 'tickets', filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Fișierul nu a fost găsit'
      });
    }

    // Send file
    res.sendFile(filePath);
  } catch (error) {
    console.error('Error serving attachment:', error);
    res.status(500).json({
      success: false,
      message: 'Eroare la descărcarea fișierului'
    });
  }
});

// Get all invoices for the authenticated client
router.get('/invoices', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;

    const invoices = db.prepare(`
      SELECT
        i.*,
        p.name as project_name,
        p.id as project_id
      FROM invoices i
      LEFT JOIN projects p ON i.project_id = p.id
      WHERE i.client_id = ?
      ORDER BY i.created_at DESC
    `).all(userId);

    res.json({
      success: true,
      data: invoices,
      count: invoices.length
    });
  } catch (error) {
    console.error('Error fetching client invoices:', error);
    res.status(500).json({
      success: false,
      message: 'Eroare la încărcarea facturilor'
    });
  }
});

// Get a specific invoice by ID (only if it belongs to the client)
router.get('/invoices/:id', authenticateToken, (req, res) => {
  try {
    const invoiceId = req.params.id;
    const userId = req.user.userId;

    const invoice = db.prepare(`
      SELECT
        i.*,
        p.name as project_name,
        p.id as project_id
      FROM invoices i
      LEFT JOIN projects p ON i.project_id = p.id
      WHERE i.id = ? AND i.client_id = ?
    `).get(invoiceId, userId);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Factura nu a fost găsită'
      });
    }

    res.json({
      success: true,
      data: invoice
    });
  } catch (error) {
    console.error('Error fetching invoice details:', error);
    res.status(500).json({
      success: false,
      message: 'Eroare la încărcarea detaliilor facturii'
    });
  }
});

// Download invoice as PDF
router.get('/invoices/:id/download', authenticateToken, (req, res) => {
  try {
    const invoiceId = req.params.id;
    const userId = req.user.userId;

    // Get invoice details with client info
    const invoice = db.prepare(`
      SELECT
        i.*,
        p.name as project_name,
        p.description as project_description,
        u.first_name,
        u.last_name,
        u.email as client_email,
        u.company_name,
        u.phone as client_phone
      FROM invoices i
      LEFT JOIN projects p ON i.project_id = p.id
      LEFT JOIN users u ON i.client_id = u.id
      WHERE i.id = ? AND i.client_id = ?
    `).get(invoiceId, userId);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Factura nu a fost găsită'
      });
    }

    // Create a new PDF document
    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Factura_${invoice.invoice_number}.pdf"`);

    // Pipe the PDF to the response
    doc.pipe(res);

    // Add content to PDF
    // Header - Company Info
    doc.fontSize(24)
       .fillColor('#4F46E5')
       .text('Soluții Automatizare', 50, 50);

    doc.fontSize(10)
       .fillColor('#64748B')
       .text('www.solutiiautomatizare.ro', 50, 80)
       .text('contact@solutiiautomatizare.ro', 50, 95)
       .text('București, România', 50, 110);

    // Invoice Title
    doc.fontSize(28)
       .fillColor('#1E293B')
       .text('FACTURĂ', 400, 50);

    doc.fontSize(12)
       .fillColor('#64748B')
       .text(`Număr: ${invoice.invoice_number}`, 400, 85)
       .text(`Data: ${new Date(invoice.created_at).toLocaleDateString('ro-RO')}`, 400, 100)
       .text(`Scadent: ${invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('ro-RO') : 'N/A'}`, 400, 115);

    // Draw line separator
    doc.moveTo(50, 140).lineTo(545, 140).stroke();

    // Client Information
    doc.fontSize(12)
       .fillColor('#1E293B')
       .text('Facturat către:', 50, 160);

    doc.fontSize(11)
       .fillColor('#64748B')
       .text(`${invoice.first_name} ${invoice.last_name}`, 50, 180);

    if (invoice.company_name) {
      doc.text(invoice.company_name, 50, 195);
    }

    doc.text(invoice.client_email, 50, invoice.company_name ? 210 : 195);

    if (invoice.client_phone) {
      doc.text(invoice.client_phone, 50, invoice.company_name ? 225 : 210);
    }

    // Invoice Details
    const startY = 280;
    doc.fontSize(12)
       .fillColor('#1E293B')
       .text('Detalii Factură', 50, startY);

    // Table header
    const tableTop = startY + 30;
    doc.fontSize(10)
       .fillColor('#FFFFFF')
       .rect(50, tableTop, 495, 25)
       .fill('#4F46E5');

    doc.fillColor('#FFFFFF')
       .text('Descriere', 60, tableTop + 8)
       .text('Proiect', 300, tableTop + 8)
       .text('Sumă', 470, tableTop + 8);

    // Table content
    const contentY = tableTop + 35;
    doc.fontSize(10)
       .fillColor('#1E293B')
       .text(invoice.project_name || 'Servicii de dezvoltare software', 60, contentY)
       .text(invoice.project_name || '-', 300, contentY);

    doc.fontSize(11)
       .fillColor('#1E293B')
       .text(`${invoice.amount.toFixed(2)} ${invoice.currency}`, 450, contentY);

    // Draw table border
    doc.rect(50, tableTop + 25, 495, 40).stroke();

    // Totals section
    const totalsY = contentY + 80;
    doc.moveTo(350, totalsY - 10).lineTo(545, totalsY - 10).stroke();

    doc.fontSize(11)
       .fillColor('#64748B')
       .text('Subtotal:', 350, totalsY)
       .text(`${invoice.amount.toFixed(2)} ${invoice.currency}`, 450, totalsY);

    doc.fontSize(11)
       .fillColor('#64748B')
       .text('TVA (19%):', 350, totalsY + 20)
       .text(`${(invoice.amount * 0.19).toFixed(2)} ${invoice.currency}`, 450, totalsY + 20);

    doc.moveTo(350, totalsY + 45).lineTo(545, totalsY + 45).stroke();

    doc.fontSize(14)
       .fillColor('#1E293B')
       .text('Total:', 350, totalsY + 55)
       .text(`${(invoice.amount * 1.19).toFixed(2)} ${invoice.currency}`, 450, totalsY + 55);

    // Status badge
    const statusY = totalsY + 100;
    const statusColors = {
      paid: { bg: '#10B981', text: 'PLĂTITĂ' },
      sent: { bg: '#3B82F6', text: 'TRIMISĂ' },
      draft: { bg: '#6B7280', text: 'CIORNĂ' },
      overdue: { bg: '#EF4444', text: 'RESTANTĂ' },
      cancelled: { bg: '#9CA3AF', text: 'ANULATĂ' }
    };

    const statusInfo = statusColors[invoice.status] || statusColors.draft;

    doc.fontSize(10)
       .fillColor(statusInfo.bg)
       .text(`Status: ${statusInfo.text}`, 350, statusY);

    // Payment info if paid
    if (invoice.status === 'paid' && invoice.paid_date) {
      doc.fontSize(9)
         .fillColor('#64748B')
         .text(`Plătită la: ${new Date(invoice.paid_date).toLocaleDateString('ro-RO')}`, 350, statusY + 20);
    }

    // Footer notes
    doc.fontSize(9)
       .fillColor('#64748B')
       .text('Notă: Această factură este un document generat electronic.', 50, 700)
       .text('Pentru întrebări, contactați-ne la contact@solutiiautomatizare.ro', 50, 715);

    // Footer
    doc.fontSize(8)
       .fillColor('#9CA3AF')
       .text('© 2024 Soluții Automatizare. Toate drepturile rezervate.', 50, 760, {
         align: 'center',
         width: 495
       });

    // Finalize the PDF
    doc.end();

  } catch (error) {
    console.error('Error generating invoice PDF:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Eroare la generarea PDF-ului facturii'
      });
    }
  }
});

export default router;