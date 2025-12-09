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
  Tag,
  Send,
  ArrowLeft,
  Reply,
  Paperclip,
  X,
  FileText,
  Download
} from 'lucide-react';

const SupportTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketDetail, setTicketDetail] = useState(null);
  const [ticketMessages, setTicketMessages] = useState([]);
  const [showTicketDetail, setShowTicketDetail] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
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

  // Fetch ticket details with messages
  const fetchTicketDetail = async (ticketId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/client/tickets/${ticketId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setTicketDetail(data.ticket);
        setTicketMessages(data.messages || []);
        setShowTicketDetail(true);
      } else {
        setError(data.message || 'Eroare la încărcarea detaliilor tichetului');
      }
    } catch (err) {
      setError('Eroare de conexiune');
    }
  };

  // Handle ticket click
  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket);
    fetchTicketDetail(ticket.id);
  };

  // Handle back to tickets list
  const handleBackToTickets = () => {
    setShowTicketDetail(false);
    setSelectedTicket(null);
    setTicketDetail(null);
    setTicketMessages([]);
    setReplyMessage('');
  };

  // Handle reply submission
  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;

    setReplyLoading(true);
    try {
      const token = localStorage.getItem('token');

      // Create FormData to handle file uploads
      const formData = new FormData();
      formData.append('message', replyMessage.trim());

      // Append files if any
      selectedFiles.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch(`/api/client/tickets/${ticketDetail.id}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Note: Don't set Content-Type header for FormData, browser will set it automatically with boundary
        },
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        // Add the new message to the messages list
        setTicketMessages(prev => [...prev, data.data]);
        setReplyMessage('');
        setSelectedFiles([]);

        // Update ticket's updated_at timestamp
        setTicketDetail(prev => ({
          ...prev,
          updated_at: new Date().toISOString()
        }));
      } else {
        setError(data.message || 'Eroare la trimiterea răspunsului');
      }
    } catch (err) {
      setError('Eroare de conexiune');
    } finally {
      setReplyLoading(false);
    }
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    // Validate file size (10MB max per file)
    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        setError(`Fișierul "${file.name}" este prea mare. Dimensiunea maximă este 10MB.`);
        return false;
      }
      return true;
    });
    setSelectedFiles(prev => [...prev, ...validFiles].slice(0, 5)); // Max 5 files
  };

  // Handle file removal
  const handleFileRemove = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Format file size for display
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
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

  // Show ticket detail view
  if (showTicketDetail && ticketDetail) {
    return (
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back button */}
          <button
            onClick={handleBackToTickets}
            className="flex items-center text-slate-600 hover:text-primary mb-6 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Înapoi la tichete
          </button>

          {/* Ticket Header */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-2xl font-bold text-slate-900">{ticketDetail.subject}</h1>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${priorityConfig[ticketDetail.priority]?.color}`}>
                    {priorityConfig[ticketDetail.priority]?.label}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-slate-600">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(ticketDetail.created_at)}
                  </div>
                  {ticketDetail.project_name && (
                    <div className="flex items-center">
                      <Tag className="h-4 w-4 mr-1" />
                      {ticketDetail.project_name}
                    </div>
                  )}
                  <div className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    {ticketMessages.length} mesaje
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig[ticketDetail.status]?.color}`}>
                  {(() => {
                    const StatusIcon = statusConfig[ticketDetail.status]?.icon || AlertCircle;
                    return <StatusIcon className="h-4 w-4 mr-1" />;
                  })()}
                  {statusConfig[ticketDetail.status]?.label}
                </span>
              </div>
            </div>
          </div>

          {/* Messages Thread */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Conversație</h2>

            <div className="space-y-4">
              {ticketMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'admin' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-lg px-4 py-3 rounded-lg ${
                      message.role === 'admin'
                        ? 'bg-slate-100 text-slate-900'
                        : 'bg-primary text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium">
                        {message.role === 'admin'
                          ? 'Echipa de Suport'
                          : `${message.first_name} ${message.last_name}`
                        }
                      </span>
                      <span className={`text-xs ${message.role === 'admin' ? 'text-slate-500' : 'text-blue-100'}`}>
                        {formatDate(message.created_at)}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{message.message}</p>

                    {/* Display attachments if present */}
                    {message.attachments && JSON.parse(message.attachments).length > 0 && (
                      <div className="mt-2 space-y-1">
                        {JSON.parse(message.attachments).map((attachment, idx) => (
                          <a
                            key={idx}
                            href={`/api/client/tickets/attachments/${attachment.filename}`}
                            download={attachment.originalName}
                            className={`inline-flex items-center space-x-2 px-3 py-1 rounded text-xs ${
                              message.role === 'admin'
                                ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            } transition-colors`}
                          >
                            <Download className="h-3 w-3" />
                            <span>{attachment.originalName}</span>
                            <span className="opacity-75">
                              ({formatFileSize(attachment.size)})
                            </span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {ticketMessages.length === 0 && (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">Nu există mesaje încă</p>
                </div>
              )}
            </div>
          </div>

          {/* Reply Form */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Trimite un răspuns</h3>

            <form onSubmit={handleReplySubmit}>
              <div className="mb-4">
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Scrie răspunsul tău..."
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  rows={4}
                  required
                />
              </div>

              {/* File Attachments */}
              {selectedFiles.length > 0 && (
                <div className="mb-4">
                  <div className="text-sm font-medium text-slate-700 mb-2">
                    Fișiere atașate ({selectedFiles.length}/5):
                  </div>
                  <div className="space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-slate-400" />
                          <span className="text-sm text-slate-700">{file.name}</span>
                          <span className="text-xs text-slate-500">({formatFileSize(file.size)})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleFileRemove(index)}
                          className="text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <label
                    htmlFor="file-upload"
                    className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <Paperclip className="h-4 w-4 mr-2" />
                    Atașează fișier
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt,.zip"
                    disabled={selectedFiles.length >= 5}
                  />
                  <span className="text-xs text-slate-500">
                    Max 5 fișiere, 10MB/fișier
                  </span>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setReplyMessage('');
                      setSelectedFiles([]);
                    }}
                    className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                  >
                    Anulează
                  </button>
                  <button
                    type="submit"
                    disabled={!replyMessage.trim() || replyLoading}
                    className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {replyLoading ? (
                      <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    Trimite răspuns
                  </button>
                </div>
              </div>
            </form>
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
                  onClick={() => handleTicketClick(ticket)}
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