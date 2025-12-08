import React, { useState } from 'react';
import { Search, Calendar, User, ArrowRight, Tag } from 'lucide-react';

function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Toate Articolele' },
    { id: 'tutorials', name: 'Tutoriale' },
    { id: 'news', name: 'Noutăți' },
    { id: 'case-studies', name: 'Case Studies' },
    { id: 'tips', name: 'Tips & Tricks' }
  ];

  const articles = [
    {
      id: 1,
      title: 'Cum să Optimizezi un Shop PrestaShop pentru Performanță Maximă',
      slug: 'optimizare-prestashop-performanta',
      excerpt: 'Ghid complet cu 15 tehnici dovedite pentru a reduce timpul de încărcare al magazinului tău PrestaShop cu până la 80%.',
      category: 'tutorials',
      author: 'Alex Popescu',
      date: '2024-03-15',
      readingTime: 8,
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
      tags: ['PrestaShop', 'Performance', 'Optimization']
    },
    {
      id: 2,
      title: 'PrestaShop 8.1: Noutăți și Funcționalități Importante',
      slug: 'prestashop-8-1-noutati',
      excerpt: 'Descoperă ce aduce nou versiunea 8.1 de PrestaShop și cum poți beneficia de noile funcționalități în magazinul tău.',
      category: 'news',
      author: 'Maria Ionescu',
      date: '2024-03-10',
      readingTime: 5,
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800',
      tags: ['PrestaShop', 'Updates', 'E-commerce']
    },
    {
      id: 3,
      title: 'Case Study: Creștere de 150% a Vânzărilor prin Automatizare',
      slug: 'case-study-automatizare-vanzari',
      excerpt: 'Cum am ajutat un client din retail să-și tripleze vânzările online prin automatizarea proceselor și integrări inteligente.',
      category: 'case-studies',
      author: 'Andrei Mihai',
      date: '2024-03-05',
      readingTime: 12,
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
      tags: ['Case Study', 'Automation', 'E-commerce'],
      featured: true
    },
    {
      id: 4,
      title: '10 Greșeli Comune în Dezvoltarea Modulelor WooCommerce',
      slug: 'greseli-module-woocommerce',
      excerpt: 'Evită aceste capcane frecvente când dezvolți sau personalizezi module pentru WooCommerce.',
      category: 'tips',
      author: 'Elena Vasile',
      date: '2024-03-01',
      readingTime: 6,
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800',
      tags: ['WooCommerce', 'Development', 'Best Practices']
    },
    {
      id: 5,
      title: 'Ghid Complet: API Integrations pentru E-commerce',
      slug: 'ghid-api-integrations',
      excerpt: 'Tot ce trebuie să știi despre integrările API pentru magazine online: de la bazele teoretice la implementări practice.',
      category: 'tutorials',
      author: 'Alex Popescu',
      date: '2024-02-25',
      readingTime: 15,
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
      tags: ['API', 'Integrations', 'Tutorial']
    },
    {
      id: 6,
      title: '5 Tendințe în Automatizarea E-commerce pentru 2024',
      slug: 'tendinte-automatizare-2024',
      excerpt: 'Descoperă cele mai importante tendințe în automatizarea proceselor e-commerce care vor domina anul 2024.',
      category: 'news',
      author: 'Maria Ionescu',
      date: '2024-02-20',
      readingTime: 7,
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
      tags: ['Trends', 'Automation', '2024']
    }
  ];

  const filteredArticles = articles.filter(article => {
    const matchesCategory = activeCategory === 'all' || article.category === activeCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredArticle = articles.find(a => a.featured);
  const regularArticles = filteredArticles.filter(a => !a.featured);

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
              <a href="/blog" className="text-primary font-semibold">Blog</a>
              <a href="/contact" className="text-slate-600 hover:text-primary transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Search */}
      <section className="bg-gradient-to-br from-primary to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Blog & Resurse
            </h1>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
              Tutoriale, ghiduri și insights din lumea e-commerce și automatizării software
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Caută articole..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-lg text-slate-800 focus:ring-2 focus:ring-white/50 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="bg-white border-b border-slate-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2 rounded-lg font-medium transition-all ${
                  activeCategory === cat.id
                    ? 'bg-primary text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Featured Article */}
          {featuredArticle && activeCategory === 'all' && !searchQuery && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Articol Recomandat</h2>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <img
                      src={featuredArticle.image}
                      alt={featuredArticle.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="md:w-1/2 p-8">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                        {categories.find(c => c.id === featuredArticle.category)?.name}
                      </span>
                      <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">
                        Featured
                      </span>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-800 mb-4">
                      {featuredArticle.title}
                    </h3>
                    <p className="text-slate-600 mb-6">{featuredArticle.excerpt}</p>
                    <div className="flex items-center text-sm text-slate-500 mb-6">
                      <User className="w-4 h-4 mr-1" />
                      <span className="mr-4">{featuredArticle.author}</span>
                      <Calendar className="w-4 h-4 mr-1" />
                      <span className="mr-4">{new Date(featuredArticle.date).toLocaleDateString('ro-RO')}</span>
                      <span>{featuredArticle.readingTime} min lectură</span>
                    </div>
                    <a
                      href={`/blog/${featuredArticle.slug}`}
                      className="inline-flex items-center text-primary hover:text-primary-dark font-semibold"
                    >
                      Citește Articolul
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Articles Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularArticles.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-primary">
                      {categories.find(c => c.id === article.category)?.name}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-slate-600 mb-4 line-clamp-3">{article.excerpt}</p>

                  <div className="flex items-center text-sm text-slate-500 mb-4">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span className="mr-3">{new Date(article.date).toLocaleDateString('ro-RO')}</span>
                    <span>{article.readingTime} min</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {article.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <a
                    href={`/blog/${article.slug}`}
                    className="text-primary hover:text-primary-dark font-semibold text-sm flex items-center"
                  >
                    Citește mai mult
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredArticles.length === 0 && (
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">
                Nu am găsit articole
              </h3>
              <p className="text-slate-600 mb-6">
                Încearcă să modifici filtrul sau termenul de căutare.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
              >
                Resetează Filtrele
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-gradient-to-r from-primary to-indigo-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Abonează-te la Newsletter
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Primește cele mai noi articole și tutoriale direct în inbox
          </p>
          <div className="max-w-md mx-auto">
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Email-ul tău"
                className="flex-1 px-4 py-3 rounded-lg text-slate-800 focus:ring-2 focus:ring-white/50 focus:outline-none"
              />
              <button className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-slate-50 transition-colors">
                Abonează-te
              </button>
            </div>
            <p className="text-sm text-indigo-200 mt-3">
              Fără spam. Doar conținut de calitate, o dată pe săptămână.
            </p>
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

export default BlogPage;
