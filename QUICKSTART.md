# Quick Start Guide

## First Time Setup

1. **Run the initialization script:**
   ```bash
   ./init.sh
   ```

   This will:
   - Check Node.js version (18+ required)
   - Install backend dependencies
   - Install frontend dependencies
   - Copy .env.example files to .env
   - Initialize the SQLite database with sample data

2. **Start the backend server:**
   ```bash
   cd backend
   npm run dev
   ```

   Backend will run on: http://localhost:3001

3. **In a new terminal, start the frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

   Frontend will run on: http://localhost:5173

4. **Open your browser:**
   Navigate to http://localhost:5173 to see the application!

## Login Credentials

After running `init.sh`, you can log in with:

- **Admin Account**
  - Email: admin@solutiiautomatizare.ro
  - Password: admin123

- **Test Client Account**
  - Email: client@test.ro
  - Password: client123

## What's Working Now

✅ **Homepage** - Complete with hero, services, stats, and footer
✅ **Backend API** - Server running with health check endpoint
✅ **Database** - Full schema with sample data
✅ **Navigation** - Basic navigation structure in place

## What Needs to be Built

See `feature_list.json` for the complete list of 200 features to implement.

Priority features to work on next:
- Authentication (login, register, password reset)
- Services page
- Packages page
- Portfolio page
- Blog page
- Contact form functionality
- Quote request form
- Client portal
- Admin panel

## Project Structure

```
solutii-automatizare/
├── backend/              # Express API server
│   ├── routes/          # API route handlers (to be created)
│   ├── middleware/      # Express middleware (to be created)
│   ├── models/          # Database models (to be created)
│   ├── utils/           # Utility functions
│   ├── server.js        # Main server file ✅
│   ├── init-db.js       # Database initialization ✅
│   └── package.json     # Backend dependencies ✅
├── frontend/            # React frontend application
│   ├── src/
│   │   ├── components/  # Reusable UI components (to be created)
│   │   ├── pages/       # Page components
│   │   │   └── HomePage.jsx ✅
│   │   ├── contexts/    # React contexts (to be created)
│   │   ├── hooks/       # Custom React hooks (to be created)
│   │   ├── utils/       # Utility functions (to be created)
│   │   ├── App.jsx      # Main app component ✅
│   │   └── main.jsx     # Entry point ✅
│   ├── index.html       # HTML template ✅
│   ├── vite.config.js   # Vite configuration ✅
│   └── package.json     # Frontend dependencies ✅
├── feature_list.json    # 200 test cases to implement ✅
├── init.sh              # Setup script ✅
├── README.md            # Full documentation ✅
└── SESSION_NOTES.md     # Development progress tracking ✅
```

## Development Workflow

1. Pick a feature from `feature_list.json`
2. Implement the feature
3. Test thoroughly
4. Mark the feature as `"passes": true`
5. Commit your changes
6. Move to next feature

**Important Rules:**
- ✅ Work on ONE feature at a time
- ✅ Test before marking as passing
- ✅ Commit frequently
- ❌ NEVER remove features from feature_list.json
- ❌ NEVER edit feature descriptions or test steps
- ✅ ONLY change "passes" from false to true

## Testing

Currently no automated tests are set up. Testing is manual:
- Start both servers
- Navigate to the feature in the browser
- Follow the test steps in feature_list.json
- Verify expected behavior

## Need Help?

- Check `README.md` for detailed documentation
- Check `SESSION_NOTES.md` for development history
- Check `app_spec.txt` for complete project requirements
- Check backend logs for API errors
- Check browser console for frontend errors

## API Endpoints (Currently Available)

- `GET http://localhost:3001/health` - Health check
- `GET http://localhost:3001/api` - API info

More endpoints will be added as development progresses.
