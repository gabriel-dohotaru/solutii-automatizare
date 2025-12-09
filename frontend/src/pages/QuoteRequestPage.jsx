import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, CheckCircle, Send, AlertCircle } from 'lucide-react';

function QuoteRequestPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Project type
    projectType: '',
    platform: '',

    // Step 2: Technical details
    description: '',
    existingWebsite: '',
    specificRequirements: '',

    // Step 3: Timeline and budget
    timeline: '',
    budgetRange: '',

    // Step 4: Contact info
    name: '',
    email: '',
    phone: '',
    company: ''
  });

  const [submitStatus, setSubmitStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = 4;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateStep = () => {
    switch(currentStep) {
      case 1:
        return formData.projectType !== '';
      case 2:
        return formData.description !== '';
      case 3:
        return formData.timeline !== '' && formData.budgetRange !== '';
      case 4:
        return formData.name !== '' && formData.email !== '';
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep() && currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/quote-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitStatus('success');
        // Reset form
        setFormData({
          projectType: '',
          platform: '',
          description: '',
          existingWebsite: '',
          specificRequirements: '',
          timeline: '',
          budgetRange: '',
          name: '',
          email: '',
          phone: '',
          company: ''
        });
        setCurrentStep(1);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting quote request:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderProgressBar = () => {
    return (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step === currentStep
                  ? 'bg-primary text-white'
                  : step < currentStep
                    ? 'bg-secondary text-white'
                    : 'bg-slate-200 text-slate-600'
              }`}>
                {step < currentStep ? <CheckCircle className="w-6 h-6" /> : step}
              </div>
              {step < 4 && (
                <div className={`flex-1 h-1 mx-2 ${
                  step < currentStep ? 'bg-secondary' : 'bg-slate-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm">
          <span className={currentStep === 1 ? 'text-primary font-medium' : 'text-slate-600'}>Tip Proiect</span>
          <span className={currentStep === 2 ? 'text-primary font-medium' : 'text-slate-600'}>Detalii</span>
          <span className={currentStep === 3 ? 'text-primary font-medium' : 'text-slate-600'}>Buget & Termen</span>
          <span className={currentStep === 4 ? 'text-primary font-medium' : 'text-slate-600'}>Contact</span>
        </div>
      </div>
    );
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-slate-800 mb-4">Ce tip de proiect doriți?</h3>
        <div className="space-y-3">
          {[
            { value: 'ecommerce-module', label: 'Modul E-commerce', desc: 'PrestaShop, WooCommerce, Magento, OpenCart' },
            { value: 'automation', label: 'Automatizare Software', desc: 'Script-uri, integrări API, sincronizare date' },
            { value: 'bugfix', label: 'Bug Fixing & Mentenanță', desc: 'Rezolvare probleme, optimizări' },
            { value: 'web-dev', label: 'Dezvoltare Web Custom', desc: 'Website, aplicație web, dashboard' },
            { value: 'other', label: 'Altceva', desc: 'Descrie-ne ideea ta' }
          ].map((option) => (
            <label
              key={option.value}
              className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                formData.projectType === option.value
                  ? 'border-primary bg-primary/5'
                  : 'border-slate-200 hover:border-primary/50'
              }`}
            >
              <input
                type="radio"
                name="projectType"
                value={option.value}
                checked={formData.projectType === option.value}
                onChange={handleChange}
                className="mr-3"
              />
              <span className="font-semibold text-slate-800">{option.label}</span>
              <p className="text-sm text-slate-600 ml-6">{option.desc}</p>
            </label>
          ))}
        </div>
      </div>

      {formData.projectType === 'ecommerce-module' && (
        <div>
          <label htmlFor="platform" className="block text-sm font-medium text-slate-700 mb-2">
            Platformă E-commerce *
          </label>
          <select
            id="platform"
            name="platform"
            value={formData.platform}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Selectează platforma</option>
            <option value="prestashop">PrestaShop</option>
            <option value="woocommerce">WooCommerce</option>
            <option value="magento">Magento</option>
            <option value="opencart">OpenCart</option>
            <option value="other">Altă platformă</option>
          </select>
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-slate-800 mb-4">Detalii tehnice</h3>

        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
            Descriere detaliată a proiectului *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={6}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            placeholder="Descrie-ne cât mai detaliat ce ai nevoie: funcționalități dorite, integrări necesare, flow-ul aplicației, etc."
          />
        </div>

        <div className="mb-6">
          <label htmlFor="existingWebsite" className="block text-sm font-medium text-slate-700 mb-2">
            Website existent (dacă este cazul)
          </label>
          <input
            type="url"
            id="existingWebsite"
            name="existingWebsite"
            value={formData.existingWebsite}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="https://www.exemplu.ro"
          />
        </div>

        <div>
          <label htmlFor="specificRequirements" className="block text-sm font-medium text-slate-700 mb-2">
            Cerințe specifice
          </label>
          <textarea
            id="specificRequirements"
            name="specificRequirements"
            value={formData.specificRequirements}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            placeholder="Ex: compatibilitate cu anumite sisteme, design specific, cerințe de performanță, etc."
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-slate-800 mb-4">Timeline și buget</h3>

        <div className="mb-6">
          <label htmlFor="timeline" className="block text-sm font-medium text-slate-700 mb-2">
            Când aveți nevoie de proiect? *
          </label>
          <select
            id="timeline"
            name="timeline"
            value={formData.timeline}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Selectează termenul</option>
            <option value="urgent">Cât mai urgent (1-2 săptămâni)</option>
            <option value="1-month">În 1 lună</option>
            <option value="2-3-months">În 2-3 luni</option>
            <option value="flexible">Sunt flexibil cu termenul</option>
          </select>
        </div>

        <div>
          <label htmlFor="budgetRange" className="block text-sm font-medium text-slate-700 mb-2">
            Buget estimat *
          </label>
          <select
            id="budgetRange"
            name="budgetRange"
            value={formData.budgetRange}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Selectează bugetul</option>
            <option value="<500">Sub 500€</option>
            <option value="500-1500">500€ - 1.500€</option>
            <option value="1500-5000">1.500€ - 5.000€</option>
            <option value="5000-10000">5.000€ - 10.000€</option>
            <option value=">10000">Peste 10.000€</option>
          </select>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-slate-700">
            💡 <strong>Sfat:</strong> Un buget realist și un termen flexibil ne permit să oferim cea mai bună soluție pentru proiectul tău.
          </p>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-slate-800 mb-4">Informații de contact</h3>

        <div className="mb-6">
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
            Nume complet *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Ion Popescu"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="ion@companie.ro"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
            Telefon
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="+40 123 456 789"
          />
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-slate-700 mb-2">
            Companie
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Numele companiei (opțional)"
          />
        </div>

        {/* Summary */}
        <div className="mt-8 p-6 bg-slate-50 rounded-lg border border-slate-200">
          <h4 className="font-semibold text-slate-800 mb-4">Rezumat cerere ofertă</h4>
          <div className="space-y-2 text-sm">
            <p><strong>Tip proiect:</strong> {formData.projectType}</p>
            {formData.platform && <p><strong>Platformă:</strong> {formData.platform}</p>}
            <p><strong>Termen:</strong> {formData.timeline}</p>
            <p><strong>Buget:</strong> {formData.budgetRange}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-primary-dark text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Solicită o Ofertă Personalizată
          </h1>
          <p className="text-xl text-primary-light">
            Completează formularul și vei primi o ofertă detaliată în maxim 48 de ore
          </p>
        </div>
      </div>

      {/* Main Form */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Success Message */}
        {submitStatus === 'success' && (
          <div className="mb-8 p-6 bg-secondary/10 border border-secondary/20 rounded-lg flex items-start">
            <CheckCircle className="w-6 h-6 text-secondary mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-secondary mb-2">Cerere trimisă cu succes!</h4>
              <p className="text-slate-600">
                Mulțumim pentru cererea ta! Vom analiza detaliile și îți vom trimite o ofertă personalizată în maxim 48 de ore.
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {submitStatus === 'error' && (
          <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <AlertCircle className="w-6 h-6 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-red-600 mb-2">Eroare la trimitere</h4>
              <p className="text-slate-600">
                A apărut o problemă. Te rugăm să încerci din nou sau să ne contactezi direct.
              </p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md p-8">
          {/* Progress Bar */}
          {renderProgressBar()}

          {/* Form Steps */}
          <form onSubmit={handleSubmit}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                  currentStep === 1
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Înapoi
              </button>

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!validateStep()}
                  className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                    validateStep()
                      ? 'bg-primary text-white hover:bg-primary-dark'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Următorul pas
                  <ChevronRight className="w-5 h-5 ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!validateStep() || isSubmitting}
                  className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                    validateStep() && !isSubmitting
                      ? 'bg-secondary text-white hover:bg-secondary/90'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-5 h-5 mr-2" />
                  {isSubmitting ? 'Se trimite...' : 'Trimite Cererea'}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Info Section */}
        <div className="mt-8 text-center text-slate-600">
          <p className="text-sm">
            🔒 Informațiile tale sunt în siguranță. Nu vom partaja datele tale cu terțe părți.
          </p>
        </div>
      </div>
    </div>
  );
}

export default QuoteRequestPage;
