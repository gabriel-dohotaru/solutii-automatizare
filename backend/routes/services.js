import express from 'express';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();
const db = new Database(path.join(__dirname, '../database.db'));

/**
 * GET /api/services
 * Get all active services ordered by order_index
 */
router.get('/', (req, res) => {
  try {
    const services = db.prepare(`
      SELECT
        id,
        name,
        slug,
        category,
        short_description,
        full_description,
        icon,
        features,
        is_featured,
        order_index
      FROM services
      WHERE is_active = 1
      ORDER BY order_index ASC, id ASC
    `).all();

    // Parse JSON fields
    const servicesWithParsedData = services.map(service => ({
      ...service,
      features: service.features ? JSON.parse(service.features) : []
    }));

    res.json({
      success: true,
      services: servicesWithParsedData
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({
      success: false,
      message: 'Eroare la încărcarea serviciilor'
    });
  }
});

/**
 * GET /api/services/:slug
 * Get single service by slug
 */
router.get('/:slug', (req, res) => {
  try {
    const { slug } = req.params;

    const service = db.prepare(`
      SELECT
        id,
        name,
        slug,
        category,
        short_description,
        full_description,
        icon,
        features,
        is_featured
      FROM services
      WHERE slug = ? AND is_active = 1
    `).get(slug);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Serviciul nu a fost găsit'
      });
    }

    // Parse JSON fields
    const serviceWithParsedData = {
      ...service,
      features: service.features ? JSON.parse(service.features) : []
    };

    res.json({
      success: true,
      service: serviceWithParsedData
    });
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({
      success: false,
      message: 'Eroare la încărcarea serviciului'
    });
  }
});

export default router;
