import React from 'react';
import { Code2, Zap, ShoppingCart, Wrench } from 'lucide-react';

function HomePage() {
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
              <a href="/servicii" className="text-slate-700 hover:text-primary transition-colors">
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
      <section className="relative bg-gradient-to-br from-slate-900 via-primary-dark to-slate-900 text-white py-20 overflow-hidden">
        {/* Animated code background effect */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 font-mono text-xs leading-relaxed overflow-hidden">
            {`function automatizeaza() {
  const success = true;
  return success;
}

class SolutiiAutomatizare {
  constructor() {
    this.experienta = '9+ ani';
    this.proiecte = '200+';
    this.clienti = '150+';
  }
}`.split('\n').map((line, i) => (
              <div key={i} className="animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}>
                {line}
              </div>
            ))}
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Automatizăm Succesul Afacerii Tale
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-slate-300 max-w-3xl mx-auto">
            Module e-commerce, automatizări software și dezvoltare web custom pentru afaceri moderne
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/servicii"
              className="px-8 py-4 bg-white text-primary rounded-lg font-semibold hover:bg-slate-100 transition-colors"
            >
              Descoperă Serviciile
            </a>
            <a
              href="/solicita-oferta"
              className="px-8 py-4 bg-accent text-white rounded-lg font-semibold hover:bg-amber-500 transition-colors"
            >
              Solicită Ofertă Gratuită
            </a>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Serviciile Noastre
            </h2>
            <p className="text-xl text-slate-600">
              Soluții complete pentru afacerea ta digitală
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Service 1 */}
            <div className="p-6 border border-slate-200 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <ShoppingCart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Module E-commerce
              </h3>
              <p className="text-slate-600 mb-4">
                Module personalizate pentru PrestaShop, WooCommerce, Magento și OpenCart
              </p>
              <a href="/servicii#ecommerce" className="text-primary hover:text-primary-dark font-medium">
                Află mai mult →
              </a>
            </div>

            {/* Service 2 */}
            <div className="p-6 border border-slate-200 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Automatizări Software
              </h3>
              <p className="text-slate-600 mb-4">
                API integrations, sincronizare date, web scraping și task-uri programate
              </p>
              <a href="/servicii#automation" className="text-primary hover:text-primary-dark font-medium">
                Află mai mult →
              </a>
            </div>

            {/* Service 3 */}
            <div className="p-6 border border-slate-200 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Wrench className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Bug Fixing & Mentenanță
              </h3>
              <p className="text-slate-600 mb-4">
                Debugging, optimizare performanță și suport continuu
              </p>
              <a href="/servicii#bugfix" className="text-primary hover:text-primary-dark font-medium">
                Află mai mult →
              </a>
            </div>

            {/* Service 4 */}
            <div className="p-6 border border-slate-200 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Code2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Dezvoltare Web Custom
              </h3>
              <p className="text-slate-600 mb-4">
                Website-uri, aplicații web, dashboard-uri admin și SaaS
              </p>
              <a href="/servicii#webdev" className="text-primary hover:text-primary-dark font-medium">
                Află mai mult →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Tehnologii cu Care Lucrăm
            </h2>
            <p className="text-xl text-slate-600">
              Expertiza noastră acoperă cele mai populare platforme și tehnologii
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
            <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl font-bold text-primary mb-2">PS</div>
              <div className="text-sm text-slate-600">PrestaShop</div>
            </div>
            <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl font-bold text-purple-600 mb-2">WC</div>
              <div className="text-sm text-slate-600">WooCommerce</div>
            </div>
            <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl font-bold text-orange-500 mb-2">M</div>
              <div className="text-sm text-slate-600">Magento</div>
            </div>
            <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl font-bold text-blue-500 mb-2">OC</div>
              <div className="text-sm text-slate-600">OpenCart</div>
            </div>
            <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl font-bold text-cyan-500 mb-2">⚛</div>
              <div className="text-sm text-slate-600">React</div>
            </div>
            <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl font-bold text-green-600 mb-2">N</div>
              <div className="text-sm text-slate-600">Node.js</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-accent mb-2">200+</div>
              <div className="text-xl text-slate-300">Proiecte Finalizate</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-secondary mb-2">150+</div>
              <div className="text-xl text-slate-300">Clienți Mulțumiți</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-primary mb-2">9+</div>
              <div className="text-xl text-slate-300">Ani Experiență</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Carousel */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Proiecte Recente
            </h2>
            <p className="text-xl text-slate-600">
              Descoperă câteva dintre cele mai recente proiecte realizate
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-br from-primary to-primary-dark"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Modul PrestaShop Custom
                </h3>
                <p className="text-slate-600 mb-4">
                  Integrare avansată cu sistem ERP pentru sincronizare automată produse și stocuri
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">PrestaShop</span>
                  <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm">API</span>
                </div>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-br from-secondary to-emerald-600"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Automatizare Web Scraping
                </h3>
                <p className="text-slate-600 mb-4">
                  Script de monitorizare prețuri concurență cu notificări automate
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm">Python</span>
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">Automation</span>
                </div>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-br from-accent to-orange-600"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Dashboard Admin React
                </h3>
                <p className="text-slate-600 mb-4">
                  Platformă de management comenzi cu analytics în timp real
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">React</span>
                  <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm">Node.js</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-12">
            <a
              href="/portofoliu"
              className="inline-block px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              Vezi Toate Proiectele
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Ce Spun Clienții Noștri
            </h2>
            <p className="text-xl text-slate-600">
              Feedback real de la clienți mulțumiți
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-lg">
                  AM
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-slate-900">Andrei Marin</div>
                  <div className="text-sm text-slate-600">CEO, ShopRo</div>
                </div>
              </div>
              <p className="text-slate-600 italic">
                "Modulul PrestaShop dezvoltat de echipa lor a îmbunătățit semnificativ procesul nostru de vânzare. Profesionalism și promptitudine!"
              </p>
              <div className="mt-4 flex text-accent">
                <span>★★★★★</span>
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center text-secondary font-bold text-lg">
                  MP
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-slate-900">Maria Popescu</div>
                  <div className="text-sm text-slate-600">Manager, TechStore</div>
                </div>
              </div>
              <p className="text-slate-600 italic">
                "Automatizarea proceselor noastre a redus timpul de procesare cu 70%. Investiție excelentă!"
              </p>
              <div className="mt-4 flex text-accent">
                <span>★★★★★</span>
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center text-accent font-bold text-lg">
                  CI
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-slate-900">Cristian Ionescu</div>
                  <div className="text-sm text-slate-600">Director, OnlineMarket</div>
                </div>
              </div>
              <p className="text-slate-600 italic">
                "Echipă profesionistă, soluții creative și suport continuu. Recomand cu încredere!"
              </p>
              <div className="mt-4 flex text-accent">
                <span>★★★★★</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Pregătit să Automatizezi?
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
                <li><a href="/servicii" className="hover:text-white transition-colors">Module E-commerce</a></li>
                <li><a href="/servicii" className="hover:text-white transition-colors">Automatizări Software</a></li>
                <li><a href="/servicii" className="hover:text-white transition-colors">Bug Fixing</a></li>
                <li><a href="/servicii" className="hover:text-white transition-colors">Dezvoltare Web</a></li>
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
                <li className="pt-4">
                  <a href="/termeni" className="hover:text-white transition-colors">Termeni și Condiții</a>
                </li>
                <li>
                  <a href="/confidentialitate" className="hover:text-white transition-colors">Politica de Confidențialitate</a>
                </li>
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

export default HomePage;
