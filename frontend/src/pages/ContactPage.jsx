import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: '',
    budgetRange: '',
    message: ''
  });

  const [submitStatus, setSubmitStatus] = useState(null); // null | 'success' | 'error'
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/contact', {
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
          name: '',
          email: '',
          phone: '',
          serviceType: '',
          budgetRange: '',
          message: ''
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <a href="/" className="text-2xl font-bold text-primary">
                Soluții Automatizare
              </a>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="/" className="text-slate-600 hover:text-primary transition-colors">Acasă</a>
              <a href="/servicii" className="text-slate-600 hover:text-primary transition-colors">Servicii</a>
              <a href="/pachete" className="text-slate-600 hover:text-primary transition-colors">Pachete</a>
              <a href="/portofoliu" className="text-slate-600 hover:text-primary transition-colors">Portofoliu</a>
              <a href="/blog" className="text-slate-600 hover:text-primary transition-colors">Blog</a>
              <a href="/contact" className="text-primary font-semibold">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Hai să Discutăm Despre Proiectul Tău
          </h1>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
            Contactează-ne și vom găsi împreună cea mai bună soluție pentru afacerea ta.
            Oferim consultanță gratuită pentru orice tip de proiect.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Contact Cards */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Email</h3>
              <p className="text-slate-600 mb-4">Scrie-ne oricând</p>
              <a href="mailto:contact@solutiiautomatizare.ro" className="text-primary hover:text-primary-dark font-medium">
                contact@solutiiautomatizare.ro
              </a>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Telefon</h3>
              <p className="text-slate-600 mb-4">Luni - Vineri, 9:00 - 18:00</p>
              <a href="tel:+40123456789" className="text-primary hover:text-primary-dark font-medium">
                +40 123 456 789
              </a>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Locație</h3>
              <p className="text-slate-600 mb-4">București, România</p>
              <p className="text-primary font-medium">
                Lucrăm remote cu clienți<br />din toată țara
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-6">
                Trimite-ne un Mesaj
              </h2>
              <p className="text-slate-600 mb-8">
                Completează formularul și te vom contacta în maxim 24 de ore.
                Pentru proiecte mai complexe, recomandăm să folosești formularul de{' '}
                <a href="/solicita-oferta" className="text-primary hover:text-primary-dark font-medium">
                  solicitare ofertă
                </a>.
              </p>

              {/* Success Message */}
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-secondary/10 border border-secondary/20 rounded-lg flex items-start">
                  <CheckCircle className="w-5 h-5 text-secondary mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-secondary mb-1">Mesaj trimis cu succes!</h4>
                    <p className="text-sm text-slate-600">
                      Îți mulțumim pentru mesaj. Te vom contacta în curând.
                    </p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-red-600 mb-1">Eroare la trimitere</h4>
                    <p className="text-sm text-slate-600">
                      A apărut o problemă. Te rugăm să încerci din nou sau să ne contactezi direct la email.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
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

                <div>
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

                <div>
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
                  <label htmlFor="serviceType" className="block text-sm font-medium text-slate-700 mb-2">
                    Tip serviciu *
                  </label>
                  <select
                    id="serviceType"
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Selectează un serviciu</option>
                    <option value="module">Module E-commerce</option>
                    <option value="automation">Automatizări Software</option>
                    <option value="bugfix">Bug Fixing & Mentenanță</option>
                    <option value="webdev">Dezvoltare Web Custom</option>
                    <option value="other">Altele</option>
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
                    <option value=">5000">Peste 5.000€</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                    Descriere proiect *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder="Descrie-ne pe scurt ce ai nevoie..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Se trimite...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Trimite Mesajul
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* FAQ Section */}
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-6">
                Întrebări Frecvente
              </h2>

              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="font-semibold text-slate-800 mb-2">
                    Cât durează să primiți un răspuns?
                  </h3>
                  <p className="text-slate-600">
                    De obicei răspundem în maxim 24 de ore, în zilele lucrătoare.
                    Pentru urgențe, ne poți contacta telefonic.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="font-semibold text-slate-800 mb-2">
                    Oferiți consultanță gratuită?
                  </h3>
                  <p className="text-slate-600">
                    Da! Prima consultație este întotdeauna gratuită. Analizăm cerințele
                    și oferim recomandări pentru soluția optimă.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="font-semibold text-slate-800 mb-2">
                    Care este procesul după ce contactez?
                  </h3>
                  <p className="text-slate-600">
                    1. Primești un răspuns inițial în 24h<br />
                    2. Programăm o discuție pentru detalii<br />
                    3. Îți oferim o ofertă personalizată<br />
                    4. După aprobare, începem lucrul
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="font-semibold text-slate-800 mb-2">
                    Lucrați cu clienți din afara României?
                  </h3>
                  <p className="text-slate-600">
                    Da, lucrăm remote cu clienți din toată lumea. Comunicăm în
                    română, engleză și rusă.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="font-semibold text-slate-800 mb-2">
                    Ce informații ar trebui să includ în mesaj?
                  </h3>
                  <p className="text-slate-600">
                    Cu cât mai multe detalii, cu atât mai bine: platforma folosită,
                    funcționalitățile dorite, termene, buget estimat. Dar nu-ți face griji
                    dacă nu știi exact - te ghidăm noi!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Soluții Automatizare</h3>
              <p className="text-slate-400">
                Automatizăm succesul afacerii tale prin soluții software personalizate.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Servicii</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="/servicii#ecommerce" className="hover:text-white transition-colors">Module E-commerce</a></li>
                <li><a href="/servicii#automation" className="hover:text-white transition-colors">Automatizări</a></li>
                <li><a href="/servicii#bugfix" className="hover:text-white transition-colors">Bug Fixing</a></li>
                <li><a href="/servicii#webdev" className="hover:text-white transition-colors">Dezvoltare Web</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Companie</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="/despre-noi" className="hover:text-white transition-colors">Despre Noi</a></li>
                <li><a href="/portofoliu" className="hover:text-white transition-colors">Portofoliu</a></li>
                <li><a href="/blog" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-slate-400">
                <li>contact@solutiiautomatizare.ro</li>
                <li>+40 123 456 789</li>
                <li>București, România</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 Soluții Automatizare. Toate drepturile rezervate.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ContactPage;
