# Soluții Automatizare - Software Automation Services Platform

Professional website and client portal for a software automation services company specializing in e-commerce modules, software automation, bug fixing, and custom web development.

## 🚀 Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS (via CDN)
- **State Management**: React Context + hooks
- **Routing**: React Router v6
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Forms**: React Hook Form with validation
- **Port**: 5173

### Backend
- **Runtime**: Node.js 20+ with Express
- **Database**: SQLite with better-sqlite3
- **Authentication**: JWT tokens with refresh mechanism
- **Email**: Nodemailer for transactional emails
- **Port**: 3001

## 📋 Features

### Public Website
- **Homepage**: Hero with animated code background, services overview, stats counter, technologies, featured projects, testimonials
- **Services**: Detailed service categories (E-commerce modules, Automation, Bug fixing, Custom development)
- **Pricing Packages**: Starter, Professional, and Enterprise tiers
- **Portfolio**: Filterable project showcase with detailed case studies
- **Blog**: Articles with categories, search, code syntax highlighting
- **Contact**: Multi-field contact form with file attachments
- **Quote Request**: Multi-step form for detailed project quotes

### Client Portal
- **Dashboard**: Project overview and recent updates
- **Projects**: Timeline view with milestones, progress tracking, file downloads
- **Support**: Ticket system with message threads and attachments
- **Invoices**: View and download PDF invoices
- **Settings**: Profile management and notification preferences

### Admin Panel
- **Dashboard**: KPIs and analytics
- **Content Management**: Services, packages, portfolio, blog
- **Lead Management**: Contact submissions and quote requests
- **Project Management**: Create/update projects, milestones, updates
- **Support Management**: Ticket responses and status updates
- **Invoice Generation**: Create and manage client invoices

## 🛠️ Quick Start

### Prerequisites
- Node.js 20+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd solutii-automatizare
   ```

2. **Run the setup script**
   ```bash
   ./init.sh
   ```

   This script will:
   - Check Node.js version
   - Install all dependencies (frontend & backend)
   - Set up environment variables
   - Initialize the database
   - Provide instructions for running the servers

3. **Start the development servers**

   **Option 1: Using separate terminals**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

   **Option 2: Using concurrently (if configured)**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## 📁 Project Structure

```
solutii-automatizare/
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── contexts/     # React Context providers
│   │   ├── hooks/        # Custom React hooks
│   │   └── utils/        # Utility functions
│   └── package.json
├── backend/              # Express backend application
│   ├── routes/          # API route handlers
│   ├── middleware/      # Express middleware
│   ├── models/          # Database models
│   ├── utils/           # Utility functions
│   ├── database.db      # SQLite database
│   └── package.json
├── feature_list.json    # Complete testing checklist (200 features)
├── init.sh             # Environment setup script
├── README.md           # This file
└── .gitignore
```

## 🎨 Design System

### Colors
- **Primary**: #6366F1 (Indigo) - Tech and innovation
- **Secondary**: #10B981 (Emerald) - Success and growth
- **Accent**: #F59E0B (Amber) - Attention and CTAs
- **Background Light**: #F8FAFC
- **Background Dark**: #0F172A

### Typography
- **Headings**: Inter font, bold weights
- **Body**: Inter font, regular weight
- **Code**: JetBrains Mono for code snippets

## 🧪 Testing

The project includes a comprehensive feature list with 200+ test cases covering:
- Functional requirements
- UI/UX styling requirements
- Accessibility standards
- Performance benchmarks
- Security measures

See `feature_list.json` for the complete testing checklist.

## 📦 Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend
- `npm run dev` - Start development server with auto-reload
- `npm start` - Start production server
- `npm run init-db` - Initialize/reset database

## 🔒 Environment Variables

### Backend (.env)
```env
PORT=3001
DATABASE_PATH=./database.db
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-here
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-password
ADMIN_EMAIL=admin@solutiiautomatizare.ro
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001
```

## 🌐 API Endpoints

### Public Endpoints
- `GET /api/services` - List all services
- `GET /api/packages` - Get pricing packages
- `GET /api/portfolio` - List portfolio items
- `GET /api/blog` - List blog posts
- `POST /api/contact` - Submit contact form
- `POST /api/quote-request` - Submit quote request

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### Client Portal (Protected)
- `GET /api/client/dashboard` - Dashboard summary
- `GET /api/client/projects` - List user projects
- `GET /api/client/tickets` - List support tickets
- `GET /api/client/invoices` - List invoices

### Admin Panel (Protected)
- `GET /api/admin/dashboard` - Admin KPIs
- CRUD operations for services, packages, portfolio, blog
- Project and ticket management
- Invoice generation

## 🚀 Deployment

### Production Build
```bash
# Build frontend
cd frontend
npm run build

# The dist/ folder contains production-ready files
```

### Database
- Development: SQLite (database.db)
- Production: Consider migrating to PostgreSQL or MySQL for better performance

## 🤝 Contributing

This is a production project for Soluții Automatizare. Development is tracked through `feature_list.json` with the following rules:

1. **Never remove or edit features** from `feature_list.json`
2. Only mark features as `"passes": true` when fully tested
3. Work on one feature at a time
4. Test thoroughly before marking complete
5. Commit progress regularly

## 📝 Development Progress

Track development progress in `feature_list.json`:
- **Total Features**: 200
- **Functional Tests**: ~170
- **Style Tests**: ~30
- **Status**: All features start with `"passes": false`

## 📄 License

Proprietary - All rights reserved by Soluții Automatizare

## 📞 Contact

**Soluții Automatizare**
- Website: solutiiautomatizare.ro
- Email: contact@solutiiautomatizare.ro

---

**Built with ❤️ for Romanian businesses needing software automation solutions**
