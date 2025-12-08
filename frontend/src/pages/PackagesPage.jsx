import React, { useState } from 'react';
import { Check, ArrowRight, Zap, Award, Crown } from 'lucide-react';

function PackagesPage() {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const packages = [
    {
      id: 'starter',
      name: 'Starter',
      icon: Zap,
      price: '500',
      priceNote: 'De la',
      currency: '€',
      description: 'Perfect pentru proiecte simple și module de bază',
      features: [
        '1 modul custom sau integrare',
        '2 revizii incluse',
        'Suport tehnic 30 zile',
        'Documentație completă',
        'Livrare în 1-2 săptămâni',
        'Garanție funcționalitate'
      ],
      notIncluded: [
        'Suport prioritar',
        'Modificări nelimitate',
        'Mentenanță lunară'
      ],
      popular: false,
      color: 'indigo'
    },
    {
      id: 'professional',
      name: 'Professional',
      icon: Award,
      price: '1,500',
      priceNote: 'De la',
      currency: '€',
      description: 'Ideal pentru proiecte medii și integrări complexe',
      features: [
        'Până la 5 module/integrări',
        'Revizii nelimitate',
        'Suport tehnic 90 zile',
        'Prioritate ridicată',
        'Livrare în 2-4 săptămâni',
        'Testing complet inclus',
        'Documentație detaliată',
        'Training pentru echipă'
      ],
      notIncluded: [
        'SLA garantat',
        'Echipă dedicată'
      ],
      popular: true,
      color: 'emerald'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      icon: Crown,
      price: 'Custom',
      priceNote: '',
      currency: '',
      description: 'Pentru proiecte complexe și parteneriate pe termen lung',
      features: [
        'Proiecte custom complete',
        'Echipă dedicată',
        'SLA garantat 99.9%',
        'Suport prioritar 24/7',
        'Arhitectură personalizată',
        'Code review inclus',
        'Mentenanță pe termen lung',
        'Consultanță strategică',
        'Scalare și optimizări',
        'Integrări nelimitate'
      ],
      notIncluded: [],
      popular: false,
      color: 'amber'
    }
  ];

  const addOns = [
    {
      name: 'Mentenanță Lunară',
      description: 'Actualizări, bugfixuri și îmbunătățiri continue',
      price: '150-500€/lună',
      features: ['Actualizări regulate', 'Bugfixuri prioritare', 'Optimizări performanță', 'Rapoarte lunare']
    },
    {
      name: 'Support Premium',
      description: 'Răspuns rapid și suport dedicat',
      price: '200€/lună',
      features: ['Răspuns în maxim 2 ore', 'Suport telefonic', 'Acces direct la dezvoltatori', 'Channel Slack dedicat']
    },
    {
      name: 'Training & Documentație',
      description: 'Instruire pentru echipa ta',
      price: '300-800€',
      features: ['Video tutoriale', 'Documentație customizată', 'Sesiuni live training', 'Suport post-training']
    }
  ];

  const getColorClasses = (color, type = 'bg') => {
    const colors = {
      indigo: {
        bg: 'bg-indigo-600',
        bgLight: 'bg-indigo-50',
        text: 'text-indigo-600',
        border: 'border-indigo-200',
        hover: 'hover:bg-indigo-700'
      },
      emerald: {
        bg: 'bg-emerald-600',
        bgLight: 'bg-emerald-50',
        text: 'text-emerald-600',
        border: 'border-emerald-200',
        hover: 'hover:bg-emerald-700'
      },
      amber: {
        bg: 'bg-amber-600',
        bgLight: 'bg-amber-50',
        text: 'text-amber-600',
        border: 'border-amber-200',
        hover: 'hover:bg-amber-700'
      }
    };
    return colors[color]?.[type] || colors.indigo[type];
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
              <a href="/pachete" className="text-primary font-semibold">Pachete</a>
              <a href="/portofoliu" className="text-slate-600 hover:text-primary transition-colors">Portofoliu</a>
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
            Pachete & Prețuri Transparente
          </h1>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
            Soluții pentru orice buget. Alege pachetul potrivit pentru proiectul tău
            sau solicită o ofertă personalizată.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 -mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg) => {
              const Icon = pkg.icon;
              return (
                <div
                  key={pkg.id}
                  className={`bg-white rounded-2xl shadow-lg ${
                    pkg.popular ? 'ring-4 ring-secondary transform scale-105' : ''
                  } transition-all hover:shadow-2xl relative`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-secondary text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                        Cel Mai Popular
                      </span>
                    </div>
                  )}

                  <div className="p-8">
                    {/* Icon & Name */}
                    <div className={`w-14 h-14 ${getColorClasses(pkg.color, 'bgLight')} rounded-xl flex items-center justify-center mb-4`}>
                      <Icon className={`w-7 h-7 ${getColorClasses(pkg.color, 'text')}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">{pkg.name}</h3>
                    <p className="text-slate-600 mb-6">{pkg.description}</p>

                    {/* Price */}
                    <div className="mb-8">
                      <div className="flex items-baseline">
                        {pkg.priceNote && (
                          <span className="text-slate-600 text-sm mr-2">{pkg.priceNote}</span>
                        )}
                        <span className="text-4xl font-bold text-slate-800">{pkg.price}</span>
                        {pkg.currency && (
                          <span className="text-2xl text-slate-600 ml-1">{pkg.currency}</span>
                        )}
                      </div>
                      {pkg.id !== 'enterprise' && (
                        <p className="text-sm text-slate-500 mt-2">Preț pe proiect</p>
                      )}
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-8">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <Check className="w-5 h-5 text-secondary mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-700">{feature}</span>
                        </li>
                      ))}
                      {pkg.notIncluded.map((feature, idx) => (
                        <li key={`not-${idx}`} className="flex items-start opacity-40">
                          <Check className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-500 line-through">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <a
                      href="/solicita-oferta"
                      className={`block w-full ${getColorClasses(pkg.color, 'bg')} ${getColorClasses(pkg.color, 'hover')} text-white text-center px-6 py-3 rounded-lg font-semibold transition-colors`}
                    >
                      {pkg.id === 'enterprise' ? 'Solicită Ofertă' : 'Începe Proiectul'}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Custom Project CTA */}
          <div className="mt-12 bg-gradient-to-r from-primary to-indigo-700 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">
              Proiectul tău nu se încadrează în aceste pachete?
            </h3>
            <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
              Fiecare proiect este unic. Contactează-ne pentru o ofertă personalizată
              adaptată nevoilor tale specifice.
            </p>
            <a
              href="/solicita-oferta"
              className="inline-flex items-center bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
            >
              Solicită Ofertă Personalizată
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
          </div>
        </div>
      </section>

      {/* Add-ons Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Servicii Adiționale
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Extinde-ți pachetul cu servicii premium pentru rezultate optime
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {addOns.map((addon, idx) => (
              <div key={idx} className="bg-slate-50 rounded-xl p-6 hover:shadow-lg transition-shadow border border-slate-200">
                <h3 className="text-xl font-bold text-slate-800 mb-2">{addon.name}</h3>
                <p className="text-slate-600 mb-4">{addon.description}</p>
                <p className="text-2xl font-bold text-primary mb-4">{addon.price}</p>
                <ul className="space-y-2">
                  {addon.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start text-sm text-slate-700">
                      <Check className="w-4 h-4 text-secondary mr-2 flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">
            Întrebări Frecvente despre Prețuri
          </h2>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-semibold text-slate-800 mb-2">
                Ce include prețul?
              </h3>
              <p className="text-slate-600">
                Prețul include dezvoltarea completă, testing, documentație și suportul specificat
                în fiecare pachet. Nu există costuri ascunse.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-semibold text-slate-800 mb-2">
                Cum se face plata?
              </h3>
              <p className="text-slate-600">
                De obicei, 50% avans la începerea proiectului și 50% la livrare. Pentru proiecte
                mari, putem împărți în milestone-uri.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-semibold text-slate-800 mb-2">
                Oferiți garanție?
              </h3>
              <p className="text-slate-600">
                Da, toate proiectele beneficiază de garanție pentru funcționalitatea livrată.
                Perioada de garanție variază în funcție de pachet.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-semibold text-slate-800 mb-2">
                Pot schimba pachetul după ce încep?
              </h3>
              <p className="text-slate-600">
                Da, pachetele sunt flexibile. Dacă cerințele se schimbă, putem ajusta oferta.
                Te vom informa întotdeauna despre eventualele costuri suplimentare.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-semibold text-slate-800 mb-2">
                Acceptați plata în rate?
              </h3>
              <p className="text-slate-600">
                Pentru proiecte Enterprise, putem discuta opțiuni de plată în rate sau
                abonament lunar. Contactează-ne pentru detalii.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-semibold text-slate-800 mb-2">
                Ce valută acceptați?
              </h3>
              <p className="text-slate-600">
                Acceptăm plăți în EUR, RON și USD. Prețurile afișate sunt în EUR,
                dar putem emite facturi în orice valută.
              </p>
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

export default PackagesPage;
