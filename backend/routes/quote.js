import express from 'express';
import db from '../utils/db.js';

const router = express.Router();

// Submit quote request
router.post('/quote-request', async (req, res) => {
  try {
    const {
      projectType,
      platform,
      description,
      existingWebsite,
      specificRequirements,
      timeline,
      budgetRange,
      name,
      email,
      phone,
      company
    } = req.body;

    // Validation
    if (!projectType || !description || !timeline || !budgetRange || !name || !email) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['projectType', 'description', 'timeline', 'budgetRange', 'name', 'email']
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Combine details into description for database
    let fullDescription = description;
    if (existingWebsite) {
      fullDescription += `\n\nWebsite existent: ${existingWebsite}`;
    }
    if (specificRequirements) {
      fullDescription += `\n\nCerințe specifice: ${specificRequirements}`;
    }

    // Insert into database
    const stmt = db.prepare(`
      INSERT INTO quote_requests (
        name, email, phone, company,
        project_type, platform, description,
        timeline, budget_range,
        status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const now = new Date().toISOString();
    const result = stmt.run(
      name,
      email,
      phone || null,
      company || null,
      projectType,
      platform || null,
      fullDescription,
      timeline,
      budgetRange,
      'new',
      now,
      now
    );

    res.status(201).json({
      message: 'Quote request submitted successfully',
      id: result.lastInsertRowid
    });
  } catch (error) {
    console.error('Error submitting quote request:', error);
    res.status(500).json({ error: 'Failed to submit quote request' });
  }
});

// Get all quote requests (admin)
router.get('/quote-requests', (req, res) => {
  try {
    const quotes = db.prepare('SELECT * FROM quote_requests ORDER BY created_at DESC').all();
    res.json(quotes);
  } catch (error) {
    console.error('Error fetching quote requests:', error);
    res.status(500).json({ error: 'Failed to fetch quote requests' });
  }
});

// Get single quote request
router.get('/quote-requests/:id', (req, res) => {
  try {
    const { id } = req.params;
    const quote = db.prepare('SELECT * FROM quote_requests WHERE id = ?').get(id);

    if (!quote) {
      return res.status(404).json({ error: 'Quote request not found' });
    }

    res.json(quote);
  } catch (error) {
    console.error('Error fetching quote request:', error);
    res.status(500).json({ error: 'Failed to fetch quote request' });
  }
});

// Update quote request status (admin)
router.put('/quote-requests/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status, quotedPrice, notes } = req.body;

    const validStatuses = ['new', 'reviewing', 'quoted', 'accepted', 'rejected'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const updates = [];
    const params = [];

    if (status) {
      updates.push('status = ?');
      params.push(status);
    }
    if (quotedPrice !== undefined) {
      updates.push('quoted_price = ?');
      params.push(quotedPrice);
    }
    if (notes !== undefined) {
      updates.push('notes = ?');
      params.push(notes);
    }

    updates.push('updated_at = ?');
    params.push(new Date().toISOString());
    params.push(id);

    const stmt = db.prepare(`
      UPDATE quote_requests
      SET ${updates.join(', ')}
      WHERE id = ?
    `);

    const result = stmt.run(...params);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Quote request not found' });
    }

    res.json({ message: 'Quote request updated successfully' });
  } catch (error) {
    console.error('Error updating quote request:', error);
    res.status(500).json({ error: 'Failed to update quote request' });
  }
});

export default router;
