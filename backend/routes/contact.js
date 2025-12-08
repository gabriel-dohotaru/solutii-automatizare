import express from 'express';
import db from '../utils/db.js';

const router = express.Router();

// POST /api/contact - Submit contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, serviceType, budgetRange, message } = req.body;

    // Validation
    if (!name || !email || !serviceType || !budgetRange || !message) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['name', 'email', 'serviceType', 'budgetRange', 'message']
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Insert contact submission
    const result = db.prepare(`
      INSERT INTO contact_submissions (
        name, email, phone, service_type, budget_range, message, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, 'new', datetime('now'), datetime('now'))
    `).run(name, email, phone || null, serviceType, budgetRange, message);

    // Get the inserted record
    const submission = db.prepare('SELECT * FROM contact_submissions WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully',
      submissionId: result.lastInsertRowid,
      data: {
        id: submission.id,
        name: submission.name,
        email: submission.email,
        serviceType: submission.service_type,
        createdAt: submission.created_at
      }
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Failed to submit contact form' });
  }
});

// GET /api/contact - Get all contact submissions (admin only - to be protected later)
router.get('/', async (req, res) => {
  try {
    const submissions = db.prepare(`
      SELECT * FROM contact_submissions
      ORDER BY created_at DESC
    `).all();

    res.json({
      success: true,
      count: submissions.length,
      data: submissions
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ error: 'Failed to fetch contact submissions' });
  }
});

// GET /api/contact/:id - Get single contact submission
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const submission = db.prepare('SELECT * FROM contact_submissions WHERE id = ?').get(id);

    if (!submission) {
      return res.status(404).json({ error: 'Contact submission not found' });
    }

    res.json({
      success: true,
      data: submission
    });
  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({ error: 'Failed to fetch contact submission' });
  }
});

// PUT /api/contact/:id/status - Update contact status (admin only - to be protected later)
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const validStatuses = ['new', 'contacted', 'converted', 'closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Invalid status',
        validStatuses
      });
    }

    // Update status
    const result = db.prepare(`
      UPDATE contact_submissions
      SET status = ?, notes = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(status, notes || null, id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Contact submission not found' });
    }

    // Get updated record
    const submission = db.prepare('SELECT * FROM contact_submissions WHERE id = ?').get(id);

    res.json({
      success: true,
      message: 'Status updated successfully',
      data: submission
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

export default router;
