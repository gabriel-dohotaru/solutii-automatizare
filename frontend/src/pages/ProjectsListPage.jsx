import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  FolderOpen,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  PlayCircle,
  Eye,
  TrendingUp,
  User,
  Filter,
  Search
} from 'lucide-react';

function ProjectsListPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

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
      loadProjects(parsedUser);
    } catch (error) {
      console.error('Error parsing user data:', error);
      window.location.href = '/login';
    } finally {
      setLoading(false);
    }
  }, []);

  const loadProjects = async (user) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/client/projects', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setProjects(data.data);
      } else {
        console.error('Failed to load projects:', data.message);
        // Fallback to empty array if API fails
        setProjects([]);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      // Fallback to empty array if network fails
      setProjects([]);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      inquiry: { color: 'bg-gray-100 text-gray-800', icon: AlertCircle, label: 'În Analiză' },
      approved: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle, label: 'Aprobat' },
      in_progress: { color: 'bg-yellow-100 text-yellow-800', icon: PlayCircle, label: 'În Desfășurare' },
      review: { color: 'bg-purple-100 text-purple-800', icon: TrendingUp, label: 'În Revizuire' },
      completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Finalizat' },
      cancelled: { color: 'bg-red-100 text-red-800', icon: AlertCircle, label: 'Anulat' }
    };

    const config = statusConfig[status] || statusConfig.inquiry;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const getServiceTypeLabel = (type) => {
    const labels = {
      ecommerce: 'E-commerce',
      automation: 'Automatizări',
      bugfix: 'Bug Fixing',
      webdev: 'Dezvoltare Web'
    };
    return labels[type] || 'Altul';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ro-RO');
  };

  const calculateDaysRemaining = (deadline) => {
    if (!deadline) return '-';
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return `${Math.abs(diffDays)} zile întârziere`;
    if (diffDays === 0) return 'Astăzi';
    if (diffDays === 1) return 'Mâine';
    return `${diffDays} zile`;
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleProjectClick = (projectId) => {
    // Navigate to project details page
    navigate(`/client/proiecte/${projectId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-slate-600">Se încarcă proiectele...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                to="/client"
                className="inline-flex items-center text-slate-600 hover:text-primary mr-4"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Înapoi la Dashboard
              </Link>
              <h1 className="text-xl font-semibold text-slate-900">Proiectele Mele</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600">
                {projects.length} proiecte totale
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Caută proiecte..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">Toate Statusurile</option>
                <option value="inquiry">În Analiză</option>
                <option value="approved">Aprobat</option>
                <option value="in_progress">În Desfășurare</option>
                <option value="review">În Revizuire</option>
                <option value="completed">Finalizat</option>
                <option value="cancelled">Anulat</option>
              </select>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <FolderOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">Nu s-au găsit proiecte</h3>
            <p className="text-slate-600">
              {searchTerm || statusFilter !== 'all'
                ? 'Încearcă să ajustezi filtrele de căutare.'
                : 'Nu ai niciun proiect înca. Contactează-ne pentru a începe un proiect nou!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleProjectClick(project.id)}
              >
                <div className="p-6">
                  {/* Project Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        {project.name}
                      </h3>
                      <p className="text-slate-600 text-sm line-clamp-2">
                        {project.description}
                      </p>
                    </div>
                    {getStatusBadge(project.status)}
                  </div>

                  {/* Project Meta */}
                  <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
                    <div className="flex items-center">
                      <span className="font-medium">Tip:</span>
                      <span className="ml-1">{getServiceTypeLabel(project.service_type)}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">Preț:</span>
                      <span className="ml-1">
                        {project.price} {project.currency}
                      </span>
                    </div>
                  </div>

                  {/* Progress */}
                  {project.status !== 'inquiry' && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="font-medium text-slate-700">Progres</span>
                        <span className="text-slate-600">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Project Details */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center text-slate-600">
                      <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                      <span className="truncate">
                        {project.start_date ? formatDate(project.start_date) : 'Nu a început'}
                      </span>
                    </div>
                    <div className="flex items-center text-slate-600">
                      <Clock className="w-4 h-4 mr-2 text-slate-400" />
                      <span className="truncate">
                        {calculateDaysRemaining(project.deadline)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <span className="text-xs text-slate-500">
                      Creat: {formatDate(project.created_at)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProjectClick(project.id);
                      }}
                      className="inline-flex items-center text-primary hover:text-primary-dark text-sm font-medium"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Vezi Detalii
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectsListPage;