import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, Building, Phone, ArrowLeft, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';

function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    company: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // null | 'success' | 'error'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email este obligatoriu';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Parola este obligatorie';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Parola trebuie să aibă minim 6 caractere';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmarea parolei este obligatorie';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Parolele nu se potrivesc';
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Prenumele este obligatoriu';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Numele este obligatoriu';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          company: formData.company
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus('success');

        // Store token in localStorage
        localStorage.setItem('authToken', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));

        // Reset form
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
          firstName: '',
          lastName: '',
          phone: '',
          company: ''
        });

        // Redirect to dashboard after a delay
        setTimeout(() => {
          window.location.href = '/client';
        }, 2000);

      } else {
        setSubmitStatus('error');
        setErrors({
          submit: data.message || 'Eroare la creare cont'
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setSubmitStatus('error');
      setErrors({
        submit: 'Eroare de conexiune. Încearcă din nou.'
      });
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
              Ai deja cont? Autentifică-te
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
              <User className="h-6 w-6 text-white" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-slate-800">
              Creează Cont Nou
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Înscrie-te pentru a accesa portalul clienți
            </p>
          </div>

          {/* Success Message */}
          {submitStatus === 'success' && (
            <div className="p-4 bg-secondary/10 border border-secondary/20 rounded-lg flex items-start">
              <CheckCircle className="w-5 h-5 text-secondary mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-secondary mb-1">Cont creat cu succes!</h4>
                <p className="text-sm text-slate-600">
                  Vei fi redirecționat către dashboard...
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {submitStatus === 'error' && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-red-600 mb-1">Eroare la înregistrare</h4>
                <p className="text-sm text-slate-600">
                  {errors.submit || 'A apărut o problemă. Încearcă din nou.'}
                </p>
              </div>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-2">
                  Prenume *
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.firstName ? 'border-red-300' : 'border-slate-300'
                  }`}
                  placeholder="Ion"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-2">
                  Nume *
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.lastName ? 'border-red-300' : 'border-slate-300'
                  }`}
                  placeholder="Popescu"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>

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
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.email ? 'border-red-300' : 'border-slate-300'
                  }`}
                  placeholder="ion@companie.ro"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                Telefon
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="+40 123 456 789"
                />
              </div>
            </div>

            {/* Company */}
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-slate-700 mb-2">
                Companie
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="company"
                  name="company"
                  type="text"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Nume Companie SRL"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Parolă *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.password ? 'border-red-300' : 'border-slate-300'
                  }`}
                  placeholder="Minim 6 caractere"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-slate-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-slate-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
                Confirmă Parola *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.confirmPassword ? 'border-red-300' : 'border-slate-300'
                  }`}
                  placeholder="Repetă parola"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-slate-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-slate-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms and Privacy */}
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm text-slate-600">
                Prin crearea contului, ești de acord cu{' '}
                <a href="/termeni" className="text-primary hover:text-primary-dark font-medium">
                  Termenii și Condițiile
                </a>{' '}
                și cu{' '}
                <a href="/confidentialitate" className="text-primary hover:text-primary-dark font-medium">
                  Politica de Confidențialitate
                </a>
                .
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || submitStatus === 'success'}
              className="w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Se creează contul...
                </>
              ) : (
                'Creează Cont'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-slate-600">
              Ai deja cont?{' '}
              <Link to="/login" className="text-primary hover:text-primary-dark font-medium">
                Autentifică-te
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;