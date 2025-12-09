import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  FolderOpen,
  HeadphonesIcon,
  FileText,
  Settings as SettingsIcon,
  LogOut,
  Save,
  AlertCircle,
  CheckCircle,
  Lock,
  Bell
} from 'lucide-react';

function SettingsPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // Password change state
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Notification preferences state
  const [savingNotifications, setSavingNotifications] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [notificationPrefs, setNotificationPrefs] = useState({
    notifyProjectUpdates: true,
    notifyTicketReplies: true,
    notifyInvoices: true,
    notifyMarketing: false
  });

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    company: ''
  });

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

      // Populate form with current user data
      setFormData({
        firstName: parsedUser.first_name || '',
        lastName: parsedUser.last_name || '',
        phone: parsedUser.phone || '',
        company: parsedUser.company || ''
      });

      // Populate notification preferences
      if (parsedUser.notifications) {
        setNotificationPrefs({
          notifyProjectUpdates: parsedUser.notifications.notifyProjectUpdates !== false,
          notifyTicketReplies: parsedUser.notifications.notifyTicketReplies !== false,
          notifyInvoices: parsedUser.notifications.notifyInvoices !== false,
          notifyMarketing: parsedUser.notifications.notifyMarketing === true
        });
      }

      setLoading(false);
    } catch (error) {
      console.error('Error parsing user data:', error);
      window.location.href = '/login';
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('token');

      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Update user data in localStorage
        const updatedUser = {
          ...user,
          first_name: data.data.user.first_name,
          last_name: data.data.user.last_name,
          phone: data.data.user.phone,
          company: data.data.user.company
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);

        setMessage({
          type: 'success',
          text: data.message || 'Profil actualizat cu succes!'
        });
      } else {
        setMessage({
          type: 'error',
          text: data.message || 'Eroare la actualizarea profilului'
        });
      }
    } catch (error) {
      console.error('Update profile error:', error);
      setMessage({
        type: 'error',
        text: 'Eroare de conexiune. Vă rugăm încercați din nou.'
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setChangingPassword(true);
    setPasswordMessage(null);

    try {
      const token = localStorage.getItem('token');

      const response = await fetch('/api/auth/password', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(passwordData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setPasswordMessage({
          type: 'success',
          text: data.message || 'Parolă schimbată cu succes!'
        });
        // Clear password fields
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setPasswordMessage({
          type: 'error',
          text: data.message || 'Eroare la schimbarea parolei'
        });
      }
    } catch (error) {
      console.error('Change password error:', error);
      setPasswordMessage({
        type: 'error',
        text: 'Eroare de conexiune. Vă rugăm încercați din nou.'
      });
    } finally {
      setChangingPassword(false);
    }
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationToggle = (key) => {
    setNotificationPrefs(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSaveNotifications = async (e) => {
    e.preventDefault();
    setSavingNotifications(true);
    setNotificationMessage(null);

    try {
      const token = localStorage.getItem('token');

      const response = await fetch('/api/auth/notifications', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(notificationPrefs)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Update user data in localStorage with new notification preferences
        const updatedUser = {
          ...user,
          notifications: data.data.notifications
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);

        setNotificationMessage({
          type: 'success',
          text: data.message || 'Preferințe notificări actualizate cu succes!'
        });
      } else {
        setNotificationMessage({
          type: 'error',
          text: data.message || 'Eroare la actualizarea preferințelor'
        });
      }
    } catch (error) {
      console.error('Update notifications error:', error);
      setNotificationMessage({
        type: 'error',
        text: 'Eroare de conexiune. Vă rugăm încercați din nou.'
      });
    } finally {
      setSavingNotifications(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
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
                  className="text-slate-600 hover:text-primary font-medium"
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
                <Link
                  to="/client/setari"
                  className="text-primary font-medium border-b-2 border-primary pb-1"
                >
                  Setări
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center">
            <SettingsIcon className="w-8 h-8 mr-3" />
            Setări Cont
          </h1>
          <p className="text-slate-600">
            Actualizează informațiile tale personale
          </p>
        </div>

        {/* Settings Form */}
        <div className="bg-white rounded-lg shadow-sm border p-6 md:p-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">
            Informații Profil
          </h2>

          {/* Success/Error Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg flex items-start ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
              )}
              <p className={`text-sm ${
                message.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {message.text}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-2">
                Prenume *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ion"
              />
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-2">
                Nume *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Popescu"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                Telefon
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="+40 700 000 000"
              />
            </div>

            {/* Company */}
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-slate-700 mb-2">
                Companie
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Numele companiei"
              />
            </div>

            {/* Email (read-only) */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={user.email}
                disabled
                className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed"
              />
              <p className="text-xs text-slate-500 mt-1">
                Email-ul nu poate fi modificat
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-4 border-t">
              <Link
                to="/client"
                className="text-slate-600 hover:text-slate-900 font-medium"
              >
                Anulează
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5 mr-2" />
                {saving ? 'Se salvează...' : 'Salvează Modificările'}
              </button>
            </div>
          </form>
        </div>

        {/* Password Change Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6 md:p-8 mt-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
            <Lock className="w-5 h-5 mr-2" />
            Schimbă Parola
          </h2>

          {/* Password Success/Error Message */}
          {passwordMessage && (
            <div className={`mb-6 p-4 rounded-lg flex items-start ${
              passwordMessage.type === 'success'
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}>
              {passwordMessage.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
              )}
              <p className={`text-sm ${
                passwordMessage.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {passwordMessage.text}
              </p>
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-6">
            {/* Current Password */}
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-slate-700 mb-2">
                Parola Curentă *
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordInputChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Introdu parola curentă"
              />
            </div>

            {/* New Password */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 mb-2">
                Parolă Nouă *
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordInputChange}
                required
                minLength="6"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Minim 6 caractere"
              />
              <p className="text-xs text-slate-500 mt-1">
                Parola trebuie să conțină minim 6 caractere
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
                Confirmă Parola Nouă *
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordInputChange}
                required
                minLength="6"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Re-introdu parola nouă"
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end pt-4 border-t">
              <button
                type="submit"
                disabled={changingPassword}
                className="flex items-center px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
              >
                <Lock className="w-5 h-5 mr-2" />
                {changingPassword ? 'Se schimbă...' : 'Schimbă Parola'}
              </button>
            </div>
          </form>
        </div>

        {/* Notification Preferences Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6 md:p-8 mt-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Preferințe Notificări
          </h2>

          {/* Notification Success/Error Message */}
          {notificationMessage && (
            <div className={`mb-6 p-4 rounded-lg flex items-start ${
              notificationMessage.type === 'success'
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}>
              {notificationMessage.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
              )}
              <p className={`text-sm ${
                notificationMessage.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {notificationMessage.text}
              </p>
            </div>
          )}

          <form onSubmit={handleSaveNotifications} className="space-y-6">
            <p className="text-sm text-slate-600 mb-4">
              Alege ce tipuri de notificări dorești să primești prin email
            </p>

            {/* Project Updates Toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <label htmlFor="notifyProjectUpdates" className="text-sm font-medium text-slate-900 cursor-pointer">
                  Actualizări Proiecte
                </label>
                <p className="text-xs text-slate-500 mt-1">
                  Primește notificări când există progres la proiectele tale
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleNotificationToggle('notifyProjectUpdates')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notificationPrefs.notifyProjectUpdates ? 'bg-primary' : 'bg-slate-300'
                }`}
                id="notifyProjectUpdates"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notificationPrefs.notifyProjectUpdates ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Ticket Replies Toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <label htmlFor="notifyTicketReplies" className="text-sm font-medium text-slate-900 cursor-pointer">
                  Răspunsuri Tichete Suport
                </label>
                <p className="text-xs text-slate-500 mt-1">
                  Primește notificări când primești răspuns la tichetele tale
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleNotificationToggle('notifyTicketReplies')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notificationPrefs.notifyTicketReplies ? 'bg-primary' : 'bg-slate-300'
                }`}
                id="notifyTicketReplies"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notificationPrefs.notifyTicketReplies ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Invoices Toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <label htmlFor="notifyInvoices" className="text-sm font-medium text-slate-900 cursor-pointer">
                  Facturi
                </label>
                <p className="text-xs text-slate-500 mt-1">
                  Primește notificări când ai facturi noi sau scadente
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleNotificationToggle('notifyInvoices')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notificationPrefs.notifyInvoices ? 'bg-primary' : 'bg-slate-300'
                }`}
                id="notifyInvoices"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notificationPrefs.notifyInvoices ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Marketing Toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <label htmlFor="notifyMarketing" className="text-sm font-medium text-slate-900 cursor-pointer">
                  Noutăți și Oferte
                </label>
                <p className="text-xs text-slate-500 mt-1">
                  Primește newsletter cu noutăți, articole și oferte speciale
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleNotificationToggle('notifyMarketing')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notificationPrefs.notifyMarketing ? 'bg-primary' : 'bg-slate-300'
                }`}
                id="notifyMarketing"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notificationPrefs.notifyMarketing ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end pt-4 border-t">
              <button
                type="submit"
                disabled={savingNotifications}
                className="flex items-center px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5 mr-2" />
                {savingNotifications ? 'Se salvează...' : 'Salvează Preferințe'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
