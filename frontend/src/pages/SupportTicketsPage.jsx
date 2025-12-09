import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  MessageSquare,
  Clock,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  ChevronDown,
  User,
  Calendar,
  Tag
} from 'lucide-react';

const SupportTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    subject: '',
    project_id: '',
    priority: 'medium',
    message: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Status configuration
  const statusConfig = {
    open: {
      label: 'Deschis',
      color: 'bg-blue-100 text-blue-800',
      icon: AlertCircle
    },
    in_progress: {
      label: 'În Lucru',
      color: 'bg-yellow-100 text-yellow-800',
      icon: Clock
    },
    waiting: {
      label: 'În Așteptare',
      color: 'bg-gray-100 text-gray-800',
      icon: Clock
    },
    resolved: {
      label: 'Rezolvat',
      color: 'bg-green-100 text-green-800',
      icon: CheckCircle
    },
    closed: {
      label: 'Închis',
      color: 'bg-gray-100 text-gray-800',
      icon: CheckCircle
    }
  };

  // Priority configuration
  const priorityConfig = {
    low: { label: 'Scăzută', color: 'bg-gray-100 text-gray-800' },
    medium: { label: 'Medie', color: 'bg-yellow-100 text-yellow-800' },
    high: { label: 'Ridicată', color: 'bg-orange-100 text-orange-800' },
    urgent: { label: 'Urgentă', color: 'bg-red-100 text-red-800' }
  };

  useEffect(() => {
    fetchTickets();
    fetchProjects();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/client/tickets', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setTickets(data.data);
      } else {
        setError(data.message || 'Eroare la încărcarea tichetelor');
      }
    } catch (err) {
      setError('Eroare de conexiune');
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/client/projects', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setProjects(data.data);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    setSuccessMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/client/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        setSuccessMessage('Tichetul de suport a fost creat cu succes!');
        setFormData({
          subject: '',
          project_id: '',
          priority: 'medium',
          message: ''
        });
        setShowCreateForm(false);
        fetchTickets(); // Refresh tickets list
      } else {
        setFormError(data.message || 'Eroare la crearea tichetului');
      }
    } catch (err) {
      setFormError('Eroare de conexiune');
    } finally {
      setFormLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ro-RO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4 text-slate-600">Se încarcă tichetele de suport...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Tichete Suport</h1>
              <p className="mt-2 text-slate-600">Gestionează tichetele tale de suport și comunică cu echipa noastră</p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Tichet Nou
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex space-x-8">
            <Link
              to="/client"
              className="text-slate-500 hover:text-primary transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/client/proiecte"
              className="text-slate-500 hover:text-primary transition-colors"
            >
              Proiecte
            </Link>
            <span className="text-primary font-medium">Suport</span>
            <Link
              to="/client/facturi"
              className="text-slate-500 hover:text-primary transition-colors"
            >
              Facturi
            </Link>
          </nav>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex">
              <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
              <span className="text-green-700">{successMessage}</span>
            </div>
          </div>
        )}

        {/* Create Ticket Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">Tichet de Suport Nou</h2>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Subiect *
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Ex: Problemă la funcționalitatea de plată"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Proiect asociat
                        </label>
                        <select
                          value={formData.project_id}
                          onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="">Fără proiect</option>
                          {projects.map(project => (
                            <option key={project.id} value={project.id}>
                              {project.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Prioritate
                        </label>
                        <select
                          value={formData.priority}
                          onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="low">Scăzută</option>
                          <option value="medium">Medie</option>
                          <option value="high">Ridicată</option>
                          <option value="urgent">Urgentă</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Descrierea problemei *
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        rows={6}
                        placeholder="Descrie în detaliu problema întâmpinată..."
                        required
                      />
                    </div>

                    {formError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex">
                          <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                          <span className="text-red-700">{formError}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end space-x-4 mt-8">
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="px-4 py-2 text-slate-600 hover:text-slate-800"
                    >
                      Anulează
                    </button>
                    <button
                      type="submit"
                      disabled={formLoading}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                    >
                      {formLoading ? 'Se creează...' : 'Creează Tichet'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Tickets List */}
        <div className="space-y-4">
          {tickets.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
              <MessageSquare className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">Nu ai tichete de suport</h3>
              <p className="text-slate-600 mb-6">
                Ai nevoie de ajutor? Creează un tichet nou și echipa noastră te va ajuta.
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Creează Primul Tichet
              </button>
            </div>
          ) : (
            tickets.map(ticket => {
              const StatusIcon = statusConfig[ticket.status]?.icon || AlertCircle;
              const priorityInfo = priorityConfig[ticket.priority] || priorityConfig.medium;

              return (
                <div
                  key={ticket.id}
                  className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-medium text-slate-900">
                            {ticket.subject}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityInfo.color}`}>
                            {priorityInfo.label}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-slate-600">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(ticket.created_at)}
                          </div>
                          {ticket.project_name && (
                            <div className="flex items-center">
                              <Tag className="h-4 w-4 mr-1" />
                              {ticket.project_name}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig[ticket.status]?.color}`}>
                          <StatusIcon className="h-4 w-4 mr-1" />
                          {statusConfig[ticket.status]?.label}
                        </span>
                        <ArrowRight className="h-5 w-5 text-slate-400" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportTicketsPage;