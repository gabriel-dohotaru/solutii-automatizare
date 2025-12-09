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
 * GET /api/packages
 * Get all active pricing packages ordered by order_index
 */
router.get('/', (req, res) => {
  try {
    const packages = db.prepare(`
      SELECT
        id,
        name,
        slug,
        description,
        price_from,
        currency,
        features,
        is_popular,
        order_index
      FROM packages
      WHERE is_active = 1
      ORDER BY order_index ASC, id ASC
    `).all();

    // Parse JSON fields
    const packagesWithParsedData = packages.map(pkg => ({
      ...pkg,
      features: pkg.features ? JSON.parse(pkg.features) : []
    }));

    res.json({
      success: true,
      packages: packagesWithParsedData
    });
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({
      success: false,
      message: 'Eroare la încărcarea pachetelor'
    });
  }
});

/**
 * GET /api/packages/:slug
 * Get single package by slug
 */
router.get('/:slug', (req, res) => {
  try {
    const { slug } = req.params;

    const pkg = db.prepare(`
      SELECT
        id,
        name,
        slug,
        description,
        price_from,
        currency,
        features,
        is_popular
      FROM packages
      WHERE slug = ? AND is_active = 1
    `).get(slug);

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: 'Pachetul nu a fost găsit'
      });
    }

    // Parse JSON fields
    const packageWithParsedData = {
      ...pkg,
      features: pkg.features ? JSON.parse(pkg.features) : []
    };

    res.json({
      success: true,
      package: packageWithParsedData
    });
  } catch (error) {
    console.error('Error fetching package:', error);
    res.status(500).json({
      success: false,
      message: 'Eroare la încărcarea pachetului'
    });
  }
});

export default router;
