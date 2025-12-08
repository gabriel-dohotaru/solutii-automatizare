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
