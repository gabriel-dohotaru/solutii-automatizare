import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages will be created progressively
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import PackagesPage from './pages/PackagesPage';
import PortfolioPage from './pages/PortfolioPage';
import BlogPage from './pages/BlogPage';
import QuoteRequestPage from './pages/QuoteRequestPage';
// import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ClientDashboard from './pages/ClientDashboard';
import ProjectsListPage from './pages/ProjectsListPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import SupportTicketsPage from './pages/SupportTicketsPage';
import InvoicesPage from './pages/InvoicesPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/servicii" element={<ServicesPage />} />
          <Route path="/pachete" element={<PackagesPage />} />
          <Route path="/portofoliu" element={<PortfolioPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/solicita-oferta" element={<QuoteRequestPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/client" element={<ClientDashboard />} />
          <Route path="/client/proiecte" element={<ProjectsListPage />} />
          <Route path="/client/proiecte/:projectId" element={<ProjectDetailPage />} />
          <Route path="/client/suport" element={<SupportTicketsPage />} />
          <Route path="/client/facturi" element={<InvoicesPage />} />
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
