import React, { useState } from 'react';
import { ExternalLink, Code, Zap, ShoppingCart, Globe } from 'lucide-react';

function PortfolioPage() {
  const [activeFilter, setActiveFilter] = useState('all');

  const categories = [
    { id: 'all', name: 'Toate Proiectele', icon: Globe },
    { id: 'prestashop', name: 'PrestaShop', icon: ShoppingCart },
    { id: 'woocommerce', name: 'WooCommerce', icon: ShoppingCart },
    { id: 'automation', name: 'Automatizări', icon: Zap },
    { id: 'webapp', name: 'Aplicații Web', icon: Code },
    { id: 'bugfix', name: 'Bug Fixing', icon: Code }
  ];

  const projects = [
    {
      id: 1,
      title: 'Modul Plăți Custom PrestaShop',
      category: 'prestashop',
      client: 'E-commerce Fashion SRL',
      description: 'Dezvoltare modul custom pentru integrare cu procesator de plăți local, cu suport pentru rate și cashback.',
      technologies: ['PrestaShop', 'PHP', 'JavaScript', 'MySQL'],
      challenge: 'Clientul avea nevoie de integrare cu un procesator de plăți românesc care nu avea modul oficial PrestaShop.',
      solution: 'Am dezvoltat un modul custom care se integrează perfect cu API-ul procesatorului, cu suport pentru rate, cashback și verificare în timp real.',
      results: 'Creștere de 35% a conversiilor. Reducerea abandonului de coș cu 22%.',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
      testimonial: 'Modul funcționează perfect! Clienții noștri apreciază opțiunile de plată flexibile.',
      testimonialAuthor: 'Maria Ionescu, Manager E-commerce'
    },
    {
      id: 2,
      title: 'Automatizare Sincronizare Stocuri',
      category: 'automation',
      client: 'Distribuitor IT',
      description: 'Script automat pentru sincronizare stocuri între 5 depozite și 3 platforme de vânzare (PrestaShop, eMag, OLX).',
      technologies: ['Python', 'API REST', 'Cron', 'MySQL', 'Redis'],
      challenge: 'Gestionarea manuală a stocurilor pe multiple platforme durata 6 ore/zi și genera erori frecvente.',
      solution: 'Sistem automat de sincronizare care rulează la fiecare 15 minute, cu notificări pentru produse cu stoc scăzut și rapoarte detaliate.',
      results: 'Economie de 30 ore/săptămână. Eliminarea completă a supravânzărilor.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
      testimonial: 'S-a întors investiția în mai puțin de 2 luni. Acum totul rulează singur!',
      testimonialAuthor: 'Andrei Pop, Director General'
    },
    {
      id: 3,
      title: 'Plugin WooCommerce Comenzi Recurente',
      category: 'woocommerce',
      client: 'Servicii Abonament',
      description: 'Plugin custom pentru gestionarea abonamentelor și plăților recurente, cu portal client integrat.',
      technologies: ['WordPress', 'WooCommerce', 'PHP', 'Stripe API'],
      challenge: 'Client avea nevoie de sistem complex de abonamente cu multiple plan-uri și perioade de facturare.',
      solution: 'Plugin custom cu dashboard pentru gestionarea abonamentelor, notificări automate, upgrade/downgrade de plan și portal self-service.',
      results: 'Automatizare 100% a procesului de facturare recurentă. Retenție clienți +40%.',
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800',
      testimonial: 'Exact ce aveam nevoie! Plugin-ul gestionează perfect toate abonamentele.',
      testimonialAuthor: 'Elena Vasile, Product Manager'
    },
    {
      id: 4,
      title: 'Dashboard Monitoring Vânzări',
      category: 'webapp',
      client: 'Rețea Magazine Retail',
      description: 'Aplicație web pentru monitorizare în timp real a vânzărilor din 15 magazine, cu analiză și raportare.',
      technologies: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Chart.js'],
      challenge: 'Management-ul nu avea vizibilitate asupra performanței magazinelor în timp real.',
      solution: 'Dashboard interactiv cu grafice în timp real, comparații între magazine, alerte automate și export rapoarte.',
      results: 'Decizii de business 3x mai rapide. Identificare probleme în timp real.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
      testimonial: 'Dashboard-ul ne oferă control total. Vedem instant ce se întâmplă în fiecare magazin.',
      testimonialAuthor: 'Radu Mihai, Director Retail'
    },
    {
      id: 5,
      title: 'Fix Performanță WooCommerce',
      category: 'bugfix',
      client: 'Shop Online Auto Parts',
      description: 'Optimizare completă website WooCommerce cu 50,000+ produse care încărca extrem de lent.',
      technologies: ['WooCommerce', 'PHP', 'MySQL', 'Redis', 'CDN'],
      challenge: 'Website-ul încărca în 12+ secunde, rata de bounce era 78%.',
      solution: 'Optimizare bază de date, implementare caching Redis, lazy loading imagini, optimizare queries și configurare CDN.',
      results: 'Timp de încărcare redus la 1.8s. Bounce rate scăzut la 32%. Conversii +55%.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
      testimonial: 'Website-ul zboară acum! Nu ne venea să credem că se poate optimiza atât de mult.',
      testimonialAuthor: 'George Popa, Owner'
    },
    {
      id: 6,
      title: 'Integrare Multi-Curierat PrestaShop',
      category: 'prestashop',
      client: 'Fashion Boutique Online',
      description: 'Modul unificat pentru integrare cu 5 firme de curierat (Fan Courier, DPD, GLS, Cargus, Sameday).',
      technologies: ['PrestaShop', 'PHP', 'API REST', 'JavaScript'],
      challenge: 'Gestionarea manuală a AWB-urilor pentru 5 curieri diferit durata foarte mult.',
      solution: 'Modul care permite generare automată AWB, tracking în timp real, alegere curier optim și notificări SMS către clienți.',
      results: 'Economie 4 ore/zi în procesare comenzi. Satisfacție clienți +30%.',
      image: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=800',
      testimonial: 'Generăm AWB-uri instant pentru orice curier. O muncă fantastică!',
      testimonialAuthor: 'Diana Stan, Operations Manager'
    }
  ];

  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter(p => p.category === activeFilter);

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
              <a href="/portofoliu" className="text-primary font-semibold">Portofoliu</a>
              <a href="/blog" className="text-slate-600 hover:text-primary transition-colors">Blog</a>
              <a href="/contact" className="text-slate-600 hover:text-primary transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Portofoliul Nostru
          </h1>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
            Peste 100 de proiecte finalizate cu succes pentru clienți din România și Europa.
            Iată câteva dintre cele mai reprezentative realizări.
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="bg-white border-b border-slate-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveFilter(cat.id)}
                  className={`flex items-center px-5 py-2.5 rounded-lg font-medium transition-all ${
                    activeFilter === cat.id
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {cat.name}
                </button>
              );
            })}
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-slate-600">
              Afișare {filteredProjects.length} {filteredProjects.length === 1 ? 'proiect' : 'proiecte'}
            </p>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
              >
                {/* Project Image */}
                <div className="relative h-48 bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-primary">
                      {categories.find(c => c.id === project.category)?.name}
                    </span>
                  </div>
                </div>

                {/* Project Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">
                    {project.title}
                  </h3>
                  <p className="text-sm text-slate-500 mb-4">Client: {project.client}</p>
                  <p className="text-slate-600 mb-4">{project.description}</p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Details Sections */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-1">Provocarea</h4>
                      <p className="text-sm text-slate-600">{project.challenge}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-1">Soluția</h4>
                      <p className="text-sm text-slate-600">{project.solution}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-secondary mb-1">Rezultate</h4>
                      <p className="text-sm font-medium text-slate-800">{project.results}</p>
                    </div>
                  </div>

                  {/* Testimonial */}
                  {project.testimonial && (
                    <div className="bg-primary/5 border-l-4 border-primary p-4 rounded">
                      <p className="text-sm italic text-slate-700 mb-2">"{project.testimonial}"</p>
                      <p className="text-xs font-medium text-slate-600">— {project.testimonialAuthor}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-16">
              <div className="text-slate-400 mb-4">
                <Code className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">
                Nu există proiecte în această categorie
              </h3>
              <p className="text-slate-600 mb-6">
                Încearcă să selectezi o altă categorie sau vizualizează toate proiectele.
              </p>
              <button
                onClick={() => setActiveFilter('all')}
                className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
              >
                Vezi Toate Proiectele
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-indigo-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Proiectul Tău Poate Fi Următorul Success Story
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Contactează-ne astăzi și transformă ideea ta în realitate
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/solicita-oferta"
              className="inline-flex items-center justify-center bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
            >
              Solicită Ofertă
              <ExternalLink className="w-5 h-5 ml-2" />
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Contactează-ne
            </a>
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

export default PortfolioPage;
