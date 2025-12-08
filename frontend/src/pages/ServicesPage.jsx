import React, { useState } from 'react';
import { Code2, ShoppingCart, Zap, Wrench, ArrowRight, Check } from 'lucide-react';

function ServicesPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "Cât durează dezvoltarea unui modul custom?",
      answer: "Durata variază în funcție de complexitate, de la 1-2 săptămâni pentru module simple până la 1-2 luni pentru integrări complexe. După analiza cerințelor, vă oferim un timeline precis."
    },
    {
      question: "Oferiți suport după livrarea proiectului?",
      answer: "Da, oferim suport tehnic gratuit pentru 30 de zile după livrare. De asemenea, puteți opta pentru contracte de mentenanță lunară sau anuală cu SLA garantat."
    },
    {
      question: "Lucrați și cu platforme personalizate (non-standard)?",
      answer: "Absolut! Pe lângă platformele populare (PrestaShop, WooCommerce, etc.), avem experiență cu soluții custom și integrări cu orice API sau sistem."
    },
    {
      question: "Care este procesul de colaborare?",
      answer: "Începem cu o consultație gratuită, apoi facem analiza tehnică, oferim ofertă detaliată, și după acceptare începem dezvoltarea cu checkpoint-uri regulate și acces la portal client pentru tracking."
    },
    {
      question: "Oferiți garanție pentru munca realizată?",
      answer: "Da, toate proiectele beneficiază de garanție de 6 luni pentru eventuale bug-uri sau probleme tehnice apărute din cauza codului livrat de noi."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Code2 className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-slate-900">
                Soluții Automatizare
              </span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="/" className="text-slate-700 hover:text-primary transition-colors">
                Acasă
              </a>
              <a href="/servicii" className="text-primary font-medium transition-colors">
                Servicii
              </a>
              <a href="/pachete" className="text-slate-700 hover:text-primary transition-colors">
                Pachete
              </a>
              <a href="/portofoliu" className="text-slate-700 hover:text-primary transition-colors">
                Portofoliu
              </a>
              <a href="/blog" className="text-slate-700 hover:text-primary transition-colors">
                Blog
              </a>
              <a href="/contact" className="text-slate-700 hover:text-primary transition-colors">
                Contact
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="/login"
                className="text-slate-700 hover:text-primary transition-colors"
              >
                Login
              </a>
              <a
                href="/solicita-oferta"
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Solicită Ofertă
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-primary-dark to-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Serviciile Noastre
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto">
            Soluții profesionale de automatizare și dezvoltare software pentru afacerea ta
          </p>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Service 1: Module E-commerce */}
          <div id="ecommerce" className="mb-20">
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
                <ShoppingCart className="h-8 w-8 text-primary" />
              </div>
              <div className="ml-6">
                <h2 className="text-4xl font-bold text-slate-900">Module E-commerce</h2>
                <p className="text-xl text-slate-600 mt-2">Dezvoltare module custom pentru platforme populare</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-slate-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
                  <Check className="h-5 w-5 text-primary mr-2" />
                  Module PrestaShop
                </h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• Personalizare funcționalități existente</li>
                  <li>• Dezvoltare funcționalități noi</li>
                  <li>• Integrări cu sisteme terțe</li>
                  <li>• Optimizare performanță</li>
                </ul>
              </div>
              <div className="bg-slate-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
                  <Check className="h-5 w-5 text-primary mr-2" />
                  Module WooCommerce
                </h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• Plugin-uri custom WordPress</li>
                  <li>• Integrări plăți și curierat</li>
                  <li>• Extensii funcționalități magazin</li>
                  <li>• Automatizări comenzi</li>
                </ul>
              </div>
              <div className="bg-slate-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
                  <Check className="h-5 w-5 text-primary mr-2" />
                  Module Magento
                </h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• Extensii Magento 2.x</li>
                  <li>• Integrări ERP și CRM</li>
                  <li>• Customizare checkout</li>
                  <li>• Module B2B avansate</li>
                </ul>
              </div>
              <div className="bg-slate-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
                  <Check className="h-5 w-5 text-primary mr-2" />
                  Module OpenCart & Altele
                </h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• Extensii OpenCart</li>
                  <li>• Integrări marketplace-uri</li>
                  <li>• Sincronizare stocuri</li>
                  <li>• Gateway-uri plată custom</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Service 2: Automatizări Software */}
          <div id="automation" className="mb-20">
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 bg-secondary/10 rounded-xl flex items-center justify-center">
                <Zap className="h-8 w-8 text-secondary" />
              </div>
              <div className="ml-6">
                <h2 className="text-4xl font-bold text-slate-900">Automatizări Software</h2>
                <p className="text-xl text-slate-600 mt-2">Eficientizează procesele cu automatizări inteligente</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-slate-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
                  <Check className="h-5 w-5 text-secondary mr-2" />
                  API Integrations
                </h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• Conectare sisteme diferite</li>
                  <li>• Sincronizare date în timp real</li>
                  <li>• Dezvoltare API REST/GraphQL</li>
                  <li>• Documentație tehnică completă</li>
                </ul>
              </div>
              <div className="bg-slate-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
                  <Check className="h-5 w-5 text-secondary mr-2" />
                  Data Sync & Migration
                </h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• Migrare date între platforme</li>
                  <li>• Sincronizare automată produse</li>
                  <li>• Import/export automatizat</li>
                  <li>• Backup și recovery</li>
                </ul>
              </div>
              <div className="bg-slate-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
                  <Check className="h-5 w-5 text-secondary mr-2" />
                  Process Automation Scripts
                </h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• Automatizare task-uri repetitive</li>
                  <li>• Script-uri Python/Node.js</li>
                  <li>• Procesare batch fișiere</li>
                  <li>• Raportare automată</li>
                </ul>
              </div>
              <div className="bg-slate-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
                  <Check className="h-5 w-5 text-secondary mr-2" />
                  Web Scraping & Monitoring
                </h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• Extragere date website-uri</li>
                  <li>• Monitorizare prețuri concurență</li>
                  <li>• Alerting și notificări</li>
                  <li>• Cron jobs și scheduling</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Service 3: Bug Fixing & Mentenanță */}
          <div id="bugfix" className="mb-20">
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center">
                <Wrench className="h-8 w-8 text-accent" />
              </div>
              <div className="ml-6">
                <h2 className="text-4xl font-bold text-slate-900">Bug Fixing & Mentenanță</h2>
                <p className="text-xl text-slate-600 mt-2">Suport tehnic și întreținere continuă</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-slate-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
                  <Check className="h-5 w-5 text-accent mr-2" />
                  Debugging Profesionist
                </h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• Identificare și rezolvare bug-uri</li>
                  <li>• Analiza cod existent</li>
                  <li>• Debugging frontend și backend</li>
                  <li>• Code review și recomandări</li>
                </ul>
              </div>
              <div className="bg-slate-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
                  <Check className="h-5 w-5 text-accent mr-2" />
                  Performance Optimization
                </h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• Îmbunătățire viteză încărcare</li>
                  <li>• Optimizare database queries</li>
                  <li>• Caching avansat</li>
                  <li>• CDN setup și configurare</li>
                </ul>
              </div>
              <div className="bg-slate-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
                  <Check className="h-5 w-5 text-accent mr-2" />
                  Security & Updates
                </h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• Audit securitate aplicații</li>
                  <li>• Patch-uri și actualizări</li>
                  <li>• Protecție împotriva atacurilor</li>
                  <li>• SSL și HTTPS configuration</li>
                </ul>
              </div>
              <div className="bg-slate-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
                  <Check className="h-5 w-5 text-accent mr-2" />
                  SLA Support Contracts
                </h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• Contracte mentenanță lunară</li>
                  <li>• Timp de răspuns garantat</li>
                  <li>• Monitoring 24/7</li>
                  <li>• Suport prioritar dedicat</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Service 4: Dezvoltare Web Custom */}
          <div id="webdev" className="mb-20">
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
                <Code2 className="h-8 w-8 text-primary" />
              </div>
              <div className="ml-6">
                <h2 className="text-4xl font-bold text-slate-900">Dezvoltare Web Custom</h2>
                <p className="text-xl text-slate-600 mt-2">Aplicații web moderne și scalabile</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-slate-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
                  <Check className="h-5 w-5 text-primary mr-2" />
                  Website-uri Prezentare
                </h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• Design modern și responsive</li>
                  <li>• Optimizare SEO</li>
                  <li>• Viteză de încărcare rapidă</li>
                  <li>• Administrare ușoară conținut</li>
                </ul>
              </div>
              <div className="bg-slate-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
                  <Check className="h-5 w-5 text-primary mr-2" />
                  Aplicații Web
                </h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• Web apps React/Vue/Angular</li>
                  <li>• Progressive Web Apps (PWA)</li>
                  <li>• Single Page Applications</li>
                  <li>• Arhitectură scalabilă</li>
                </ul>
              </div>
              <div className="bg-slate-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
                  <Check className="h-5 w-5 text-primary mr-2" />
                  Dashboard-uri Admin
                </h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• Panouri administrare custom</li>
                  <li>• Analytics și raportare</li>
                  <li>• Managementul utilizatorilor</li>
                  <li>• Integrare cu sisteme existente</li>
                </ul>
              </div>
              <div className="bg-slate-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
                  <Check className="h-5 w-5 text-primary mr-2" />
                  SaaS Development
                </h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• Platforme multi-tenant</li>
                  <li>• Subscription și billing</li>
                  <li>• API pentru integrări</li>
                  <li>• Scaling și infrastructure</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Cum Lucrăm
            </h2>
            <p className="text-xl text-slate-600">
              Proces transparent și eficient, de la idee la implementare
            </p>
          </div>
          <div className="grid md:grid-cols-5 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Consultație</h3>
              <p className="text-slate-600 text-sm">Discutăm cerințele și obiectivele proiectului</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Analiză</h3>
              <p className="text-slate-600 text-sm">Evaluare tehnică și estimare costuri</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Dezvoltare</h3>
              <p className="text-slate-600 text-sm">Implementare cu checkpoint-uri regulate</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Testing</h3>
              <p className="text-slate-600 text-sm">QA complet și fixing bug-uri</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                5
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Livrare</h3>
              <p className="text-slate-600 text-sm">Deploy și suport post-lansare</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Întrebări Frecvente
            </h2>
            <p className="text-xl text-slate-600">
              Răspunsuri la cele mai comune întrebări
            </p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  className="w-full px-6 py-4 text-left bg-white hover:bg-slate-50 transition-colors flex justify-between items-center"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-semibold text-slate-900">{faq.question}</span>
                  <ArrowRight
                    className={`h-5 w-5 text-primary transition-transform ${
                      openFaq === index ? 'rotate-90' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
                    <p className="text-slate-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Pregătit să Începem?
          </h2>
          <p className="text-xl mb-8 text-slate-100">
            Solicită o ofertă gratuită și descoperă cum te putem ajuta
          </p>
          <a
            href="/solicita-oferta"
            className="inline-block px-8 py-4 bg-white text-primary rounded-lg font-semibold hover:bg-slate-100 transition-colors"
          >
            Solicită Ofertă Gratuită
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Code2 className="h-8 w-8 text-primary" />
                <span className="ml-2 text-xl font-bold">Soluții Automatizare</span>
              </div>
              <p className="text-slate-400">
                Automatizăm succesul afacerii tale din 2015
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Servicii</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="/servicii#ecommerce" className="hover:text-white transition-colors">Module E-commerce</a></li>
                <li><a href="/servicii#automation" className="hover:text-white transition-colors">Automatizări Software</a></li>
                <li><a href="/servicii#bugfix" className="hover:text-white transition-colors">Bug Fixing</a></li>
                <li><a href="/servicii#webdev" className="hover:text-white transition-colors">Dezvoltare Web</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Companie</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="/despre-noi" className="hover:text-white transition-colors">Despre Noi</a></li>
                <li><a href="/portofoliu" className="hover:text-white transition-colors">Portofoliu</a></li>
                <li><a href="/blog" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-slate-400">
                <li>contact@solutiiautomatizare.ro</li>
                <li>România</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; 2024 Soluții Automatizare. Toate drepturile rezervate.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ServicesPage;
