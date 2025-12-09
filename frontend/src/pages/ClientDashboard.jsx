import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  FolderOpen,
  HeadphonesIcon,
  FileText,
  Settings,
  LogOut,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  Download
} from 'lucide-react';

function ClientDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeProjects: 0,
    completedProjects: 0,
    openTickets: 0,
    pendingInvoices: 0
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [recentUpdates, setRecentUpdates] = useState([]);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!userData || !token) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      // Load client data (mock data for now)
      loadClientData(parsedUser);
    } catch (error) {
      console.error('Error parsing user data:', error);
      window.location.href = '/login';
    } finally {
      setLoading(false);
    }
  }, []);

  const loadClientData = async (user) => {
    try {
      const token = localStorage.getItem('token');

      // Fetch dashboard data from API
      const response = await fetch('/api/client/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStats(data.data.stats);
          setRecentProjects(data.data.recentProjects);
          setRecentUpdates(data.data.recentUpdates);
        }
      } else {
        console.error('Failed to fetch dashboard data');
        // Fallback to mock data if API fails
        setStats({
          activeProjects: 0,
          completedProjects: 0,
          openTickets: 0,
          pendingInvoices: 0
        });
        setRecentProjects([]);
        setRecentUpdates([]);
      }
    } catch (error) {
      console.error('Error loading client data:', error);
      // Fallback to mock data if API fails
      setStats({
        activeProjects: 0,
        completedProjects: 0,
        openTickets: 0,
        pendingInvoices: 0
      });
      setRecentProjects([]);
      setRecentUpdates([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      in_progress: { label: 'În Desfășurare', color: 'bg-blue-100 text-blue-800' },
      completed: { label: 'Finalizat', color: 'bg-green-100 text-green-800' },
      review: { label: 'În Revizuire', color: 'bg-yellow-100 text-yellow-800' },
      pending: { label: 'În Așteptare', color: 'bg-gray-100 text-gray-800' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-primary mr-8">
                Soluții Automatizare
              </Link>
              <div className="hidden md:flex space-x-8">
                <Link
                  to="/client"
                  className="text-primary font-medium border-b-2 border-primary pb-1"
                >
                  Dashboard
                </Link>
                <Link
                  to="/client/proiecte"
                  className="text-slate-600 hover:text-primary font-medium"
                >
                  Proiecte
                </Link>
                <Link
                  to="/client/suport"
                  className="text-slate-600 hover:text-primary font-medium"
                >
                  Suport
                </Link>
                <Link
                  to="/client/facturi"
                  className="text-slate-600 hover:text-primary font-medium"
                >
                  Facturi
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-500 hover:text-slate-700"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Bun venit, {user.first_name}! 👋
          </h1>
          <p className="text-slate-600">
            Aici poți urmări proiectele active, solicita suport și gestiona contul tău.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FolderOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Proiecte Active</p>
                <p className="text-2xl font-bold text-slate-900">{stats.activeProjects}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Proiecte Finalizate</p>
                <p className="text-2xl font-bold text-slate-900">{stats.completedProjects}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <HeadphonesIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Tichete Deschise</p>
                <p className="text-2xl font-bold text-slate-900">{stats.openTickets}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <FileText className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Facturi în Așteptare</p>
                <p className="text-2xl font-bold text-slate-900">{stats.pendingInvoices}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Acțiuni Rapide</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/solicita-oferta"
              className="flex items-center p-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <Plus className="w-5 h-5 text-primary mr-3" />
              <div>
                <p className="font-medium text-slate-900">Solicită Ofertă</p>
                <p className="text-sm text-slate-500">Pornește un nou proiect</p>
              </div>
            </Link>

            <Link
              to="/client/suport"
              className="flex items-center p-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <HeadphonesIcon className="w-5 h-5 text-primary mr-3" />
              <div>
                <p className="font-medium text-slate-900">Suport Tehnic</p>
                <p className="text-sm text-slate-500">Deschide un tichet</p>
              </div>
            </Link>

            <Link
              to="/client/setari"
              className="flex items-center p-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <Settings className="w-5 h-5 text-primary mr-3" />
              <div>
                <p className="font-medium text-slate-900">Setări Cont</p>
                <p className="text-sm text-slate-500">Gestionează profilul</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Projects and Updates */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Projects */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Proiecte Recente</h2>
              <Link
                to="/client/proiecte"
                className="text-primary hover:text-primary-dark text-sm font-medium flex items-center"
              >
                Vezi toate
                <Eye className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="space-y-4">
              {recentProjects.map(project => (
                <div key={project.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-slate-900">{project.name}</h3>
                    {getStatusBadge(project.status)}
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-slate-600 mb-1">
                      <span>Progres</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Termen: {new Date(project.deadline).toLocaleDateString('ro-RO')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Updates */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Actualizări Recente</h2>
              <Link
                to="/client/proiecte"
                className="text-primary hover:text-primary-dark text-sm font-medium flex items-center"
              >
                Vezi toate
                <Eye className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="space-y-4">
              {recentUpdates.map(update => (
                <div key={update.id} className="p-4 border rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${
                      update.type === 'milestone' ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      {update.type === 'milestone' ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-900 mb-1">{update.title}</h3>
                      <p className="text-sm text-slate-600 mb-2">{update.message}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(update.date).toLocaleDateString('ro-RO', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientDashboard;