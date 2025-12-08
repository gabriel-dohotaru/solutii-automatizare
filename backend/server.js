import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Static files for uploads
app.use('/uploads', express.static(join(__dirname, 'uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes will be added here
app.get('/api', (req, res) => {
  res.json({
    message: 'Soluții Automatizare API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api',
      services: '/api/services',
      packages: '/api/packages',
      portfolio: '/api/portfolio',
      blog: '/api/blog',
      contact: '/api/contact',
      auth: '/api/auth'
    }
  });
});

// Import routes (these will be created progressively)
// import authRoutes from './routes/auth.js';
// import servicesRoutes from './routes/services.js';
// import packagesRoutes from './routes/packages.js';
// import portfolioRoutes from './routes/portfolio.js';
// import blogRoutes from './routes/blog.js';
// import contactRoutes from './routes/contact.js';
// import clientRoutes from './routes/client.js';
// import adminRoutes from './routes/admin.js';

// Use routes
// app.use('/api/auth', authRoutes);
// app.use('/api/services', servicesRoutes);
// app.use('/api/packages', packagesRoutes);
// app.use('/api/portfolio', portfolioRoutes);
// app.use('/api/blog', blogRoutes);
// app.use('/api/contact', contactRoutes);
// app.use('/api/client', clientRoutes);
// app.use('/api/admin', adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);

  // Don't expose error details in production
  const error = process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : err.message;

  res.status(err.status || 500).json({
    error,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// Start server
app.listen(PORT, () => {
  console.log('');
  console.log('================================================');
  console.log(`🚀 Soluții Automatizare Backend API`);
  console.log('================================================');
  console.log(`   Port: ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   API URL: http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log('================================================');
  console.log('');
});

export default app;
