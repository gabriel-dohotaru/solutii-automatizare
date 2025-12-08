import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages will be created progressively
import HomePage from './pages/HomePage';
// import ServicesPage from './pages/ServicesPage';
// import PackagesPage from './pages/PackagesPage';
// import PortfolioPage from './pages/PortfolioPage';
// import BlogPage from './pages/BlogPage';
// import ContactPage from './pages/ContactPage';
// import QuoteRequestPage from './pages/QuoteRequestPage';
// import AboutPage from './pages/AboutPage';
// import LoginPage from './pages/LoginPage';
// import RegisterPage from './pages/RegisterPage';
// import ClientDashboard from './pages/client/Dashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* Additional routes will be added as pages are created */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

// 404 Page Component
function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <p className="text-xl text-slate-600 mb-8">Pagina nu a fost găsită</p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Înapoi la Pagina Principală
        </a>
      </div>
    </div>
  );
}

export default App;
