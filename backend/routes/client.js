import express from 'express';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { authenticateToken } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const db = new Database(path.join(__dirname, '..', 'database.db'));

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

export default router;