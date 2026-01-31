
import React, { useState, useEffect, useMemo } from 'react';
import { Provider, User, ServiceCategory } from './types';
import { firebaseService } from './services/firebaseService';
import Layout from './components/Layout';
import ProviderCard from './components/ProviderCard';
import { CATEGORY_ICONS, KENYAN_CITIES } from './constants';
import { generateSearchKeywords } from './services/geminiService';

const App: React.FC = () => {
  const [route, setRoute] = useState(window.location.hash || '#/');
  const [providers, setProviders] = useState<Provider[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash || '#/');
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handleHashChange);
    
    const fetchData = async () => {
      setLoading(true);
      const data = await firebaseService.getProviders();
      setProviders(data);
      setLoading(false);
    };
    fetchData();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchTerm.length > 2) {
        const suggestions = await generateSearchKeywords(searchTerm);
        setAiSuggestions(suggestions);
      } else {
        setAiSuggestions([]);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredProviders = useMemo(() => {
    return providers.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            p.serviceCategory.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || p.serviceCategory === selectedCategory;
      const matchesLocation = selectedLocation === 'All' || p.location === selectedLocation;
      return p.isApproved && matchesSearch && matchesCategory && matchesLocation;
    });
  }, [providers, searchTerm, selectedCategory, selectedLocation]);

  const detectLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const city = position.coords.latitude < -2 ? 'Mombasa' : 'Nairobi';
        setSelectedLocation(city);
      });
    }
  };

  const HomeView = () => (
    <div className="space-y-12 md:space-y-24 py-8 md:py-16">
      {/* Hero Section */}
      <section className="px-4 md:px-8 text-center max-w-5xl mx-auto">
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
          Find trusted Pros <br className="hidden md:block"/> for your next project.
        </h2>
        <p className="text-lg md:text-xl text-slate-500 font-medium mb-12 max-w-2xl mx-auto">
          Skip the hassle. Browse verified Kenyan professionals and connect directly on WhatsApp.
        </p>
        
        <div className="relative max-w-2xl mx-auto">
          <div className="relative flex items-center bg-white rounded-2xl md:rounded-full p-2 shadow-2xl shadow-blue-500/10 border border-slate-100 ring-1 ring-slate-200">
            <input 
              type="text" 
              placeholder="What do you need done today?" 
              className="flex-1 py-4 md:py-5 px-6 rounded-full text-slate-900 outline-none text-base md:text-lg font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl md:rounded-full shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95">
              <span className="text-xl">🔍</span>
            </button>
          </div>
          
          {aiSuggestions.length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {aiSuggestions.map(s => (
                <button 
                  key={s} 
                  onClick={() => setSearchTerm(s)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-1.5 rounded-full text-xs font-bold transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="px-6 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Browse by Category</h3>
            <p className="text-slate-400 text-sm font-medium">Over 20+ professional services available</p>
          </div>
          <a href="#/explore" className="text-sm font-black text-blue-600 bg-blue-50 px-6 py-3 rounded-full hover:bg-blue-100 transition-all">
            Explore All Categories
          </a>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 md:gap-6">
          {Object.entries(ServiceCategory).slice(0, 8).map(([key, value]) => (
            <button 
              key={key} 
              onClick={() => { setSelectedCategory(value); window.location.hash = '#/explore'; }}
              className="flex flex-col items-center gap-4 p-6 rounded-[2rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 hover:-translate-y-1 transition-all group"
            >
              <div className="text-3xl md:text-4xl group-hover:scale-110 transition-transform">{CATEGORY_ICONS[value]}</div>
              <span className="text-[11px] font-black text-slate-400 group-hover:text-blue-600 text-center uppercase tracking-widest leading-none">
                {value.split('/')[0]}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Pros Section */}
      <section className="px-6 md:px-8 pb-20">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Verified Professionals</h3>
            <p className="text-slate-400 text-sm font-medium">Top-rated based on client feedback</p>
          </div>
          <button 
            onClick={detectLocation} 
            className="flex items-center gap-2 text-xs font-black text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-widest"
          >
            📍 Near Me
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {loading ? (
             Array(4).fill(0).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-slate-100 animate-pulse rounded-[2.5rem]"></div>
             ))
          ) : (
            filteredProviders.filter(p => p.isFeatured).slice(0, 8).map(p => (
              <div key={p.id} onClick={() => window.location.hash = `#/provider/${p.id}`} className="cursor-pointer">
                <ProviderCard provider={p} />
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );

  const ProviderDetailView = ({ id }: { id: string }) => {
    const provider = providers.find(p => p.id === id);
    if (!provider) return <div className="p-20 text-center text-slate-400 font-bold animate-pulse">Loading Profile...</div>;

    const whatsappUrl = `https://wa.me/${provider.whatsappNumber}?text=Hi%20${encodeURIComponent(provider.name)},%20I%20found%20your%20profile%20on%20JuaKazi.%20I%20need%20help%20with%20${encodeURIComponent(provider.serviceCategory)}.`;

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Gallery - Sticky on Desktop */}
          <div className="w-full lg:w-1/2 lg:sticky lg:top-24 space-y-6">
            <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl ring-1 ring-slate-200">
              <img src={provider.images[0]} className="w-full h-full object-cover" alt={provider.name} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="aspect-square bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 opacity-40 grayscale">
                  <img src={provider.images[0]} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="w-full lg:w-1/2">
            <div className="mb-8">
              <button 
                onClick={() => window.history.back()}
                className="mb-8 text-sm font-black text-slate-400 hover:text-blue-600 flex items-center gap-2 transition-all group"
              >
                <span className="group-hover:-translate-x-1 transition-transform">←</span> BACK TO EXPLORE
              </button>
              
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-xs font-black uppercase tracking-widest mb-6">
                {CATEGORY_ICONS[provider.serviceCategory]} {provider.serviceCategory}
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-4 leading-tight">
                {provider.name}
              </h2>
              <div className="flex flex-wrap gap-4 text-slate-400 font-bold text-sm">
                <span className="flex items-center gap-1">📍 {provider.location}</span>
                <span className="flex items-center gap-1 text-green-600">✓ Verified Pro</span>
                <span className="flex items-center gap-1">⭐ 4.9 (24 Reviews)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pricing Range</div>
                <div className="text-xl font-black text-slate-800">{provider.priceRange || 'Competitive'}</div>
              </div>
              <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Availability</div>
                <div className="text-xl font-black text-green-600">Taking Jobs</div>
              </div>
            </div>

            <div className="space-y-6 mb-12">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Professional Bio</h3>
              <p className="text-lg text-slate-600 leading-relaxed font-medium bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm italic">
                "{provider.description}"
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href={whatsappUrl}
                target="_blank"
                className="flex-[2] bg-green-500 hover:bg-green-600 text-white font-black py-6 rounded-[2rem] flex items-center justify-center gap-4 shadow-xl shadow-green-500/20 transition-all hover:scale-[1.02] active:scale-95 text-xl"
              >
                <span className="text-2xl">💬</span>
                HIRE ON WHATSAPP
              </a>
              <button className="flex-1 bg-slate-900 hover:bg-black text-white font-black py-6 rounded-[2rem] transition-colors">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ExploreView = () => (
    <div className="px-6 md:px-8 py-12">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-3">Explore Professionals</h2>
          <p className="text-slate-500 font-medium">Verified experts ready to help you across Kenya.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white border-2 border-slate-100 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest focus:ring-4 ring-blue-500/10 outline-none cursor-pointer"
          >
            <option value="All">All Categories</option>
            {Object.values(ServiceCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <select 
            value={selectedLocation} 
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="bg-white border-2 border-slate-100 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest focus:ring-4 ring-blue-500/10 outline-none cursor-pointer"
          >
            <option value="All">All Kenya</option>
            {KENYAN_CITIES.map(city => <option key={city} value={city}>{city}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {filteredProviders.length > 0 ? (
          filteredProviders.map(p => (
            <div key={p.id} onClick={() => window.location.hash = `#/provider/${p.id}`} className="cursor-pointer transition-transform hover:-translate-y-2">
              <ProviderCard provider={p} />
            </div>
          ))
        ) : (
          <div className="col-span-full py-32 text-center">
            <div className="text-6xl mb-6">🔍</div>
            <p className="text-xl text-slate-400 font-black">No professionals match your search.</p>
            <button 
              onClick={() => { setSelectedCategory('All'); setSelectedLocation('All'); setSearchTerm(''); }}
              className="mt-6 text-blue-600 font-black border-b-2 border-blue-600 pb-1"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    if (route.startsWith('#/provider/')) {
      const id = route.split('/').pop() || '';
      return <ProviderDetailView id={id} />;
    }

    switch (route) {
      case '#/explore': return <ExploreView />;
      case '#/dashboard': return <PlaceholderView title="Partner Portal" emoji="🤝" />;
      case '#/admin': return <PlaceholderView title="Admin Restricted" emoji="🛡️" />;
      default: return <HomeView />;
    }
  };

  const getActiveTab = () => {
    if (route.startsWith('#/explore')) return 'explore';
    if (route.startsWith('#/dashboard')) return 'dashboard';
    if (route.startsWith('#/admin')) return 'admin';
    return 'home';
  };

  return (
    <Layout activeTab={getActiveTab()}>
      {renderContent()}
    </Layout>
  );
};

const PlaceholderView = ({ title, emoji }: { title: string, emoji: string }) => (
  <div className="p-12 md:p-32 text-center">
    <div className="text-7xl mb-6">{emoji}</div>
    <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-4">{title}</h3>
    <p className="text-slate-400 max-w-md mx-auto font-medium">We are currently verifying new professional applications. Sign in as admin@juakazi.com to test internal features.</p>
  </div>
);

export default App;
