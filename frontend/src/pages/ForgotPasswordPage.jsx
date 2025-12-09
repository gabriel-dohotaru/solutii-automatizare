import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitStatus, setSubmitStatus] = useState(null); // null | 'success' | 'error'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setErrorMessage('Email este obligatoriu');
      setSubmitStatus('error');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrorMessage('Email invalid');
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus('success');
      } else {
        setSubmitStatus('error');
        setErrorMessage(data.message || 'A apărut o eroare. Încearcă din nou.');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setSubmitStatus('error');
      setErrorMessage('Eroare de conexiune. Încearcă din nou.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-2xl font-bold text-primary">
              Soluții Automatizare
            </Link>
            <Link
              to="/login"
              className="text-primary hover:text-primary-dark font-medium flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Înapoi la autentificare
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-primary rounded-full flex items-center justify-center">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-slate-800">
              Resetare Parolă
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Introdu adresa de email pentru a primi instrucțiuni de resetare
            </p>
          </div>

          {/* Success Message */}
          {submitStatus === 'success' && (
            <div className="p-4 bg-secondary/10 border border-secondary/20 rounded-lg">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-secondary mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-secondary mb-1">Email trimis!</h4>
                  <p className="text-sm text-slate-600">
                    Dacă email-ul există în sistem, veți primi instrucțiuni pentru resetarea parolei.
                    Verificați folderul de spam dacă nu găsiți emailul.
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <Link
                  to="/login"
                  className="text-sm text-primary hover:text-primary-dark font-medium"
                >
                  ← Înapoi la autentificare
                </Link>
              </div>
            </div>
          )}

          {/* Error Message */}
          {submitStatus === 'error' && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-red-600 mb-1">Eroare</h4>
                <p className="text-sm text-slate-600">
                  {errorMessage}
                </p>
              </div>
            </div>
          )}

          {/* Form */}
          {submitStatus !== 'success' && (
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="ion@companie.ro"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Se trimite...
                  </>
                ) : (
                  'Trimite link de resetare'
                )}
              </button>
            </form>
          )}

          {/* Back to Login */}
          {submitStatus !== 'success' && (
            <div className="text-center">
              <Link
                to="/login"
                className="text-sm text-primary hover:text-primary-dark font-medium"
              >
                ← Înapoi la autentificare
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
