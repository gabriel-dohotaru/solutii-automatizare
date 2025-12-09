import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
// Updated: Forgot password and reset password endpoints added

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const db = new Database(path.join(__dirname, '..', 'database.db'));

// JWT Secret (should be in environment variables in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Register route
router.post('/register', [
  body('email').isEmail().withMessage('Email invalid'),
  body('password').isLength({ min: 6 }).withMessage('Parola trebuie să aibă minim 6 caractere'),
  body('firstName').notEmpty().withMessage('Prenumele este obligatoriu'),
  body('lastName').notEmpty().withMessage('Numele este obligatoriu')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Date invalide',
        errors: errors.array()
      });
    }

    const { email, password, firstName, lastName, phone, company } = req.body;

    // Check if user already exists
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Acest email este deja utilizat'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user into database
    const result = db.prepare(`
      INSERT INTO users (email, password_hash, first_name, last_name, phone, company_name, role, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, 'client', datetime('now'), datetime('now'))
    `).run(email, hashedPassword, firstName, lastName, phone || null, company || null);

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: result.lastInsertRowid,
        email,
        role: 'client'
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Cont creat cu succes',
      data: {
        user: {
          id: result.lastInsertRowid,
          email,
          firstName,
          lastName,
          phone,
          company: company, // Keep as 'company' for API consistency
          role: 'client'
        },
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Eroare la creare cont'
    });
  }
});

// Login route
router.post('/login', [
  body('email').isEmail().withMessage('Email invalid'),
  body('password').notEmpty().withMessage('Parola este obligatorie')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Date invalide',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user in database
    const user = db.prepare(`
      SELECT id, email, password_hash, first_name, last_name, phone, company_name, role
      FROM users
      WHERE email = ?
    `).get(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email sau parolă incorectă'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Email sau parolă incorectă'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password from response and map company_name to company
    const { password_hash, company_name, ...userWithoutPassword } = user;
    const userResponse = {
      ...userWithoutPassword,
      company: company_name // Map company_name to company for API consistency
    };

    res.json({
      success: true,
      message: 'Autentificare reușită',
      data: {
        user: userResponse,
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Eroare la autentificare'
    });
  }
});

// Get current user (protected route)
router.get('/me', authenticateToken, (req, res) => {
  try {
    const user = db.prepare(`
      SELECT id, email, first_name, last_name, phone, company_name, role, email_verified,
             notify_project_updates, notify_ticket_replies, notify_invoices, notify_marketing,
             created_at, updated_at
      FROM users
      WHERE id = ?
    `).get(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilizator negăsit'
      });
    }

    // Map company_name to company and notification fields for API consistency
    const {
      company_name,
      notify_project_updates,
      notify_ticket_replies,
      notify_invoices,
      notify_marketing,
      ...userWithoutCompanyName
    } = user;

    const userResponse = {
      ...userWithoutCompanyName,
      company: company_name,
      notifications: {
        notifyProjectUpdates: !!notify_project_updates,
        notifyTicketReplies: !!notify_ticket_replies,
        notifyInvoices: !!notify_invoices,
        notifyMarketing: !!notify_marketing
      }
    };

    res.json({
      success: true,
      data: { user: userResponse }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Eroare la obținerea datelor'
    });
  }
});

// Update profile (protected route)
router.put('/profile', [
  authenticateToken,
  body('firstName').optional().notEmpty().withMessage('Prenumele nu poate fi gol'),
  body('lastName').optional().notEmpty().withMessage('Numele nu poate fi gol'),
  body('phone').optional().isMobilePhone('ro-RO').withMessage('Număr de telefon invalid'),
  body('company').optional()
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Date invalide',
        errors: errors.array()
      });
    }

    const { firstName, lastName, phone, company } = req.body;
    const userId = req.user.userId;

    // Build dynamic update query
    const updateFields = [];
    const updateValues = [];

    if (firstName !== undefined) {
      updateFields.push('first_name = ?');
      updateValues.push(firstName);
    }
    if (lastName !== undefined) {
      updateFields.push('last_name = ?');
      updateValues.push(lastName);
    }
    if (phone !== undefined) {
      updateFields.push('phone = ?');
      updateValues.push(phone || null);
    }
    if (company !== undefined) {
      updateFields.push('company_name = ?');
      updateValues.push(company || null);
    }

    // Always update the updated_at timestamp
    updateFields.push('updated_at = datetime(\'now\')');

    if (updateFields.length === 1) {
      // Only updated_at would be updated, no actual changes
      return res.status(400).json({
        success: false,
        message: 'Nicio modificare detectată'
      });
    }

    // Add userId to values array
    updateValues.push(userId);

    // Execute update
    const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
    const result = db.prepare(query).run(...updateValues);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'Utilizator negăsit'
      });
    }

    // Fetch updated user data
    const updatedUser = db.prepare(`
      SELECT id, email, first_name, last_name, phone, company_name, role, email_verified, created_at, updated_at
      FROM users
      WHERE id = ?
    `).get(userId);

    // Map company_name to company for API consistency
    const { company_name, ...userWithoutCompanyName } = updatedUser;
    const userResponse = {
      ...userWithoutCompanyName,
      company: company_name
    };

    res.json({
      success: true,
      message: 'Profil actualizat cu succes',
      data: { user: userResponse }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Eroare la actualizarea profilului'
    });
  }
});

// Change password (protected route)
router.put('/password', [
  authenticateToken,
  body('currentPassword').notEmpty().withMessage('Parola curentă este obligatorie'),
  body('newPassword').isLength({ min: 6 }).withMessage('Parola nouă trebuie să aibă minim 6 caractere'),
  body('confirmPassword').notEmpty().withMessage('Confirmarea parolei este obligatorie')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Date invalide',
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user.userId;

    // Check if new passwords match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Parolele noi nu corespund'
      });
    }

    // Get user's current password hash
    const user = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilizator negăsit'
      });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Parola curentă este incorectă'
      });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password in database
    const result = db.prepare(`
      UPDATE users
      SET password_hash = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(hashedPassword, userId);

    if (result.changes === 0) {
      return res.status(500).json({
        success: false,
        message: 'Eroare la actualizarea parolei'
      });
    }

    res.json({
      success: true,
      message: 'Parolă schimbată cu succes'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Eroare la schimbarea parolei'
    });
  }
});

// Update notification preferences (protected route)
router.put('/notifications', [
  authenticateToken,
  body('notifyProjectUpdates').optional().isBoolean().withMessage('Valoare invalidă pentru notificări proiecte'),
  body('notifyTicketReplies').optional().isBoolean().withMessage('Valoare invalidă pentru notificări tichete'),
  body('notifyInvoices').optional().isBoolean().withMessage('Valoare invalidă pentru notificări facturi'),
  body('notifyMarketing').optional().isBoolean().withMessage('Valoare invalidă pentru notificări marketing')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Date invalide',
        errors: errors.array()
      });
    }

    const { notifyProjectUpdates, notifyTicketReplies, notifyInvoices, notifyMarketing } = req.body;
    const userId = req.user.userId;

    // Build dynamic update query
    const updateFields = [];
    const updateValues = [];

    if (notifyProjectUpdates !== undefined) {
      updateFields.push('notify_project_updates = ?');
      updateValues.push(notifyProjectUpdates ? 1 : 0);
    }
    if (notifyTicketReplies !== undefined) {
      updateFields.push('notify_ticket_replies = ?');
      updateValues.push(notifyTicketReplies ? 1 : 0);
    }
    if (notifyInvoices !== undefined) {
      updateFields.push('notify_invoices = ?');
      updateValues.push(notifyInvoices ? 1 : 0);
    }
    if (notifyMarketing !== undefined) {
      updateFields.push('notify_marketing = ?');
      updateValues.push(notifyMarketing ? 1 : 0);
    }

    // Always update the updated_at timestamp
    updateFields.push('updated_at = datetime(\'now\')');

    if (updateFields.length === 1) {
      // Only updated_at would be updated, no actual changes
      return res.status(400).json({
        success: false,
        message: 'Nicio modificare detectată'
      });
    }

    // Add userId to values array
    updateValues.push(userId);

    // Execute update
    const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
    const result = db.prepare(query).run(...updateValues);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'Utilizator negăsit'
      });
    }

    // Fetch updated notification preferences
    const updatedPrefs = db.prepare(`
      SELECT notify_project_updates, notify_ticket_replies, notify_invoices, notify_marketing
      FROM users
      WHERE id = ?
    `).get(userId);

    res.json({
      success: true,
      message: 'Preferințe notificări actualizate cu succes',
      data: {
        notifications: {
          notifyProjectUpdates: !!updatedPrefs.notify_project_updates,
          notifyTicketReplies: !!updatedPrefs.notify_ticket_replies,
          notifyInvoices: !!updatedPrefs.notify_invoices,
          notifyMarketing: !!updatedPrefs.notify_marketing
        }
      }
    });

  } catch (error) {
    console.error('Update notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Eroare la actualizarea preferințelor'
    });
  }
});

// Forgot password (request reset token)
router.post('/forgot-password', [
  body('email').isEmail().withMessage('Email invalid')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Email invalid',
        errors: errors.array()
      });
    }

    const { email } = req.body;

    // Find user
    const user = db.prepare('SELECT id, email FROM users WHERE email = ?').get(email);

    // Always return success message for security (don't reveal if email exists)
    // But only send email if user exists
    if (user) {
      // Generate reset token (32 random bytes as hex string)
      const resetToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now

      // Store token in database (create table if not exists)
      db.prepare(`
        CREATE TABLE IF NOT EXISTS password_reset_tokens (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          token TEXT NOT NULL UNIQUE,
          expires_at DATETIME NOT NULL,
          used INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `).run();

      // Delete any existing tokens for this user
      db.prepare('DELETE FROM password_reset_tokens WHERE user_id = ?').run(user.id);

      // Insert new token
      db.prepare(`
        INSERT INTO password_reset_tokens (user_id, token, expires_at)
        VALUES (?, ?, ?)
      `).run(user.id, resetToken, expiresAt.toISOString());

      // In a real application, send email with reset link
      // For testing purposes, log the reset link
      const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;
      console.log('🔑 Password Reset Link:', resetLink);
      console.log('📧 Sending password reset email to:', email);
    }

    // Always return success message
    res.json({
      success: true,
      message: 'Dacă email-ul există în sistem, veți primi instrucțiuni pentru resetarea parolei'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Eroare la procesarea cererii'
    });
  }
});

// Reset password with token
router.post('/reset-password', [
  body('token').notEmpty().withMessage('Token lipsă'),
  body('newPassword').isLength({ min: 6 }).withMessage('Parola trebuie să aibă minim 6 caractere'),
  body('confirmPassword').notEmpty().withMessage('Confirmarea parolei este obligatorie')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Date invalide',
        errors: errors.array()
      });
    }

    const { token, newPassword, confirmPassword } = req.body;

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Parolele nu corespund'
      });
    }

    // Find token in database
    const resetToken = db.prepare(`
      SELECT id, user_id, expires_at, used
      FROM password_reset_tokens
      WHERE token = ?
    `).get(token);

    if (!resetToken) {
      return res.status(400).json({
        success: false,
        message: 'Token invalid sau expirat'
      });
    }

    // Check if token has been used
    if (resetToken.used === 1) {
      return res.status(400).json({
        success: false,
        message: 'Acest link a fost deja folosit'
      });
    }

    // Check if token has expired
    const now = new Date();
    const expiresAt = new Date(resetToken.expires_at);
    if (now > expiresAt) {
      return res.status(400).json({
        success: false,
        message: 'Acest link a expirat. Vă rugăm să solicitați unul nou'
      });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update user's password
    const result = db.prepare(`
      UPDATE users
      SET password_hash = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(hashedPassword, resetToken.user_id);

    if (result.changes === 0) {
      return res.status(500).json({
        success: false,
        message: 'Eroare la resetarea parolei'
      });
    }

    // Mark token as used
    db.prepare(`
      UPDATE password_reset_tokens
      SET used = 1
      WHERE id = ?
    `).run(resetToken.id);

    res.json({
      success: true,
      message: 'Parolă resetată cu succes. Vă puteți autentifica cu noua parolă'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Eroare la resetarea parolei'
    });
  }
});

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token lipsă'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Token invalid sau expirat'
      });
    }
    req.user = user;
    next();
  });
}

export { authenticateToken };
export default router;