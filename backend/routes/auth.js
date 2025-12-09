import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import Database from 'better-sqlite3';
import path from 'path';

const router = express.Router();
const db = new Database(path.join(process.cwd(), 'database.db'));

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
      SELECT id, email, first_name, last_name, phone, company_name, role, email_verified, created_at, updated_at
      FROM users
      WHERE id = ?
    `).get(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilizator negăsit'
      });
    }

    // Map company_name to company for API consistency
    const { company_name, ...userWithoutCompanyName } = user;
    const userResponse = {
      ...userWithoutCompanyName,
      company: company_name
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