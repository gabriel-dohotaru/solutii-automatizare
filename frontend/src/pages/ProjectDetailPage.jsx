import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  User,
  MessageSquare,
  FileText,
  Download,
  Plus,
  Edit,
  Save,
  X,
  Paperclip
} from 'lucide-react';

function ProjectDetailPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [files, setFiles] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('authToken');

    if (!userData || !token) {
      window.location.href = '/login';
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      loadProjectData(projectId, token);
    } catch (error) {
      console.error('Error parsing user data:', error);
      window.location.href = '/login';
    }
  }, [projectId]);

  const loadProjectData = async (projectId, token) => {
    try {
      // Load project details (backend returns all data in one call)
      const projectResponse = await fetch(`/api/client/projects/${projectId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (projectResponse.ok) {
        const response = await projectResponse.json();
        const projectData = response.data;

        setProject(projectData);
        setMilestones(projectData.milestones || []);
        setUpdates(projectData.updates || []);
        setFiles(projectData.files || []);
      } else {
        console.error('Failed to load project');
        navigate('/client/proiecte');
      }
    } catch (error) {
      console.error('Error loading project data:', error);
      navigate('/client/proiecte');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/client/projects/${projectId}/updates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: 'Client Update',
          content: newComment
        })
      });

      if (response.ok) {
        const newUpdate = await response.json();
        setUpdates(prev => [newUpdate, ...prev]);
        setNewComment('');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-secondary bg-secondary/10';
      case 'in_progress': return 'text-primary bg-primary/10';
      case 'pending': return 'text-accent bg-accent/10';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'in_progress': return <TrendingUp className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Proiectul nu a fost găsit</h1>
          <Link
            to="/client/proiecte"
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Înapoi la Proiecte
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                to="/client/proiecte"
                className="inline-flex items-center text-slate-600 hover:text-primary transition-colors mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Înapoi
              </Link>
              <h1 className="text-xl font-semibold text-slate-900">{project.name}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                {getStatusIcon(project.status)}
                <span className="ml-1">{project.status === 'in_progress' ? 'În Progres' : project.status === 'completed' ? 'Finalizat' : 'În Așteptare'}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Project Overview */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm font-medium text-slate-600 mb-2">Progres General</h3>
                <div className="flex items-center">
                  <div className="flex-1 mr-4">
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-lg font-semibold text-primary">{project.progress || 0}%</span>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-600 mb-2">Termen Limită</h3>
                <div className="flex items-center text-slate-900">
                  <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                  {project.deadline ? new Date(project.deadline).toLocaleDateString('ro-RO') : 'Nespecificat'}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-600 mb-2">Tip Proiect</h3>
                <div className="text-slate-900 capitalize">{project.service_type?.replace('_', ' ') || 'General'}</div>
              </div>
            </div>

            {project.description && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-sm font-medium text-slate-600 mb-2">Descriere</h3>
                <p className="text-slate-700">{project.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Timeline and Milestones */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-primary" />
              Timeline și Etape
            </h2>

            {milestones.length > 0 ? (
              <div className="space-y-4">
                {milestones.map((milestone, index) => (
                  <div key={milestone.id} className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-slate-900">{milestone.title}</h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(milestone.status)}`}>
                          {getStatusIcon(milestone.status)}
                          <span className="ml-1">
                            {milestone.status === 'completed' ? 'Finalizat' :
                             milestone.status === 'in_progress' ? 'În Progres' : 'În Așteptare'}
                          </span>
                        </span>
                      </div>
                      {milestone.description && (
                        <p className="text-slate-600 text-sm mb-2">{milestone.description}</p>
                      )}
                      {milestone.due_date && (
                        <div className="flex items-center text-xs text-slate-500">
                          <Calendar className="w-3 h-3 mr-1" />
                          Termen: {new Date(milestone.due_date).toLocaleDateString('ro-RO')}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p>Nu există etape definite pentru acest proiect</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Updates and Comments */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-primary" />
                  Actualizări și Comentarii
                </h2>

                {/* Add Comment Form */}
                <form onSubmit={handleAddComment} className="mb-6">
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Adaugă un comentariu..."
                      className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <button
                      type="submit"
                      disabled={submittingComment || !newComment.trim()}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submittingComment ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Plus className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </form>

                {/* Comments List */}
                {updates.length > 0 ? (
                  <div className="space-y-4">
                    {updates.map((update) => (
                      <div key={update.id} className="border-l-4 border-primary/20 pl-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary text-sm font-medium mr-3">
                              {update.user_id ? (update.first_name?.[0] || 'U') : 'A'}
                            </div>
                            <div>
                              <div className="font-medium text-slate-900">
                                {update.user_id ? `${update.first_name || 'Client'} ${update.last_name || ''}` : 'Admin'}
                              </div>
                              <div className="text-xs text-slate-500">
                                {new Date(update.created_at).toLocaleDateString('ro-RO', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                        {update.title && (
                          <h4 className="font-medium text-slate-900 mb-1">{update.title}</h4>
                        )}
                        <p className="text-slate-700">{update.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p>Nu există actualizări încă</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Files and Deliverables */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-primary" />
                  Fișiere și Livrabile
                </h2>

                {files.length > 0 ? (
                  <div className="space-y-3">
                    {files.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50">
                        <div className="flex items-center">
                          <Paperclip className="w-4 h-4 text-slate-400 mr-3" />
                          <div>
                            <div className="font-medium text-slate-900 text-sm">{file.original_name}</div>
                            <div className="text-xs text-slate-500">
                              {(file.file_size / 1024).toFixed(1)} KB
                              {file.description && ` • ${file.description}`}
                            </div>
                          </div>
                        </div>
                        {file.is_deliverable && (
                          <span className="px-2 py-1 bg-secondary/10 text-secondary text-xs font-medium rounded-full">
                            Livrabil
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p>Nu există fișiere încă</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetailPage;