
import React, { useState, useEffect, useMemo } from 'react';
import { Provider, User, ServiceCategory } from './types';
import { firebaseService } from './services/firebaseService';
import Layout from './components/Layout';
import ProviderCard from './components/ProviderCard';
import { CATEGORY_ICONS, KENYAN_CITIES } from './constants';
import { optimizeBio, generateSearchKeywords } from './services/geminiService';

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
    const handleHashChange = () => setRoute(window.location.hash || '#/');
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
        alert(`Detected your location as ${city}!`);
      });
    }
  };

  const HomeView = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="bg-blue-600 px-6 py-12 md:py-20 text-white sm:rounded-b-[3rem] shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundSize: '30px 30px'}}></div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight leading-tight">
            Kenya's Home for <br className="hidden md:block"/> Trusted Professionals.
          </h2>
          <p className="text-blue-100 text-base md:text-lg mb-10 opacity-90 mx-auto max-w-2xl">
            Skip the middleman. Find verified fundis, cleaners, and tutors. Connect instantly via WhatsApp.
          </p>
          
          <div className="relative group max-w-2xl mx-auto">
            <input 
              type="text" 
              placeholder="What do you need help with?" 
              className="w-full py-5 md:py-6 px-8 pr-16 rounded-full text-gray-900 shadow-2xl focus:outline-none focus:ring-8 ring-blue-400/30 transition-all text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-2xl bg-blue-600 hover:bg-blue-700 p-3 rounded-full text-white shadow-lg transition-transform hover:scale-105">
              🔍
            </button>
          </div>

          {aiSuggestions.length > 0 && (
            <div className="mt-6 flex flex-wrap justify-center gap-3 animate-in fade-in zoom-in-95 duration-300">
              {aiSuggestions.map(s => (
                <button 
                  key={s} 
                  onClick={() => setSearchTerm(s)}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="px-5 md:px-10">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black text-gray-900 tracking-tight">Main Categories</h3>
          <a href="#/explore" className="text-sm font-bold text-blue-600 hover:underline">View All</a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 md:gap-6">
          {Object.entries(ServiceCategory).slice(0, 8).map(([key, value]) => (
            <button 
              key={key} 
              onClick={() => { setSelectedCategory(value); window.location.hash = '#/explore'; }}
              className="flex flex-col items-center gap-3 group p-4 rounded-3xl hover:bg-blue-50 transition-all border border-transparent hover:border-blue-100"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white shadow-lg text-3xl md:text-4xl flex items-center justify-center rounded-3xl group-hover:scale-110 transition-transform">
                {CATEGORY_ICONS[value]}
              </div>
              <span className="text-xs font-black text-gray-600 text-center uppercase tracking-tighter">
                {value.split('/')[0]}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="px-5 md:px-10 pb-16">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h3 className="text-xl font-black text-gray-900 tracking-tight">Featured Pros</h3>
            <p className="text-sm text-gray-500">Highest rated specialists in your area</p>
          </div>
          <button onClick={detectLocation} className="bg-white border px-4 py-2 rounded-full text-xs font-black text-blue-600 flex items-center gap-2 hover:bg-blue-50 transition-colors shadow-sm">
            📍 Detect Location
          </button>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-3xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProviders.filter(p => p.isFeatured).slice(0, 6).map(p => (
               <div key={p.id} onClick={() => window.location.hash = `#/provider/${p.id}`} className="cursor-pointer transition-transform hover:-translate-y-1">
                 <ProviderCard provider={p} />
               </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );

  const ProviderDetailView = ({ id }: { id: string }) => {
    const provider = providers.find(p => p.id === id);
    if (!provider) return <div className="p-20 text-center animate-pulse text-gray-400">Loading Profile...</div>;

    const whatsappUrl = `https://wa.me/${provider.whatsappNumber}?text=Hi%20${encodeURIComponent(provider.name)},%20I%20found%20your%20profile%20on%20JuaKazi.%20I%20need%20help%20with%20${encodeURIComponent(provider.serviceCategory)}.`;

    return (
      <div className="animate-in fade-in zoom-in-95 duration-500 max-w-6xl mx-auto pb-20">
        <div className="flex flex-col md:flex-row gap-8 p-6 md:p-12">
          {/* Left Column: Image Gallery */}
          <div className="w-full md:w-1/2 space-y-4">
            <div className="relative aspect-video md:aspect-square overflow-hidden rounded-[2.5rem] shadow-2xl">
              <img src={provider.images[0]} className="w-full h-full object-cover" />
              <button 
                onClick={() => window.history.back()}
                className="absolute top-6 left-6 w-12 h-12 bg-black/40 backdrop-blur-xl rounded-full flex items-center justify-center text-white text-xl hover:bg-black/60 transition-colors"
              >
                ←
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="aspect-square bg-gray-100 rounded-2xl overflow-hidden border">
                  <img src={provider.images[0]} className="w-full h-full object-cover opacity-50" />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="w-full md:w-1/2 flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-xs font-black text-blue-600 bg-blue-100 px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block">
                  {CATEGORY_ICONS[provider.serviceCategory]} {provider.serviceCategory}
                </span>
                <h2 className="text-4xl font-black text-gray-900 mb-2 leading-tight">{provider.name}</h2>
                <div className="flex items-center gap-2 text-gray-500 font-bold">
                  <span>📍 {provider.location}</span>
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  <span className="text-green-600 text-sm">Verified Professional</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                <div className="text-[10px] text-gray-400 font-black uppercase mb-1 tracking-widest">Rate Range</div>
                <div className="text-xl font-black text-gray-800">{provider.priceRange || 'Competitive'}</div>
              </div>
              <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                <div className="text-[10px] text-gray-400 font-black uppercase mb-1 tracking-widest">Experience</div>
                <div className="text-xl font-black text-gray-800">5+ Years</div>
              </div>
            </div>

            <div className="space-y-4 flex-1">
              <h3 className="text-xl font-black text-gray-900 tracking-tight">Professional Bio</h3>
              <p className="text-gray-600 text-lg leading-relaxed bg-blue-50/30 p-8 rounded-3xl border border-blue-100/50 italic">
                "{provider.description}"
              </p>
            </div>

            <div className="mt-12 flex flex-col sm:flex-row gap-4">
              <a 
                href={whatsappUrl}
                target="_blank"
                className="flex-[2] bg-green-500 hover:bg-green-600 text-white font-black py-6 rounded-3xl flex items-center justify-center gap-4 shadow-2xl transition-all transform hover:scale-[1.03] active:scale-95 text-xl"
              >
                <span className="text-3xl">💬</span>
                <span>HIRE ON WHATSAPP</span>
              </a>
              <button className="flex-1 bg-gray-900 text-white font-bold rounded-3xl py-6 hover:bg-gray-800 transition-colors">
                Save Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ExploreView = () => (
    <div className="p-6 md:p-12 space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Find Professionals</h2>
          <p className="text-gray-500">Filter by category or location to find your perfect match.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white border-2 border-gray-100 px-4 py-3 rounded-2xl font-bold text-sm focus:ring-2 ring-blue-500 outline-none"
          >
            <option value="All">All Categories</option>
            {Object.values(ServiceCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <select 
            value={selectedLocation} 
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="bg-white border-2 border-gray-100 px-4 py-3 rounded-2xl font-bold text-sm focus:ring-2 ring-blue-500 outline-none"
          >
            <option value="All">All Kenya</option>
            {KENYAN_CITIES.map(city => <option key={city} value={city}>{city}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProviders.length > 0 ? (
          filteredProviders.map(p => (
            <div key={p.id} onClick={() => window.location.hash = `#/provider/${p.id}`} className="cursor-pointer transition-all hover:scale-[1.02]">
              <ProviderCard provider={p} />
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <div className="text-6xl mb-6">🏝️</div>
            <p className="text-xl text-gray-500 font-bold">No pros found here yet.</p>
            <button onClick={() => { setSelectedCategory('All'); setSelectedLocation('All'); }} className="mt-4 text-blue-600 font-black hover:underline">Reset all filters</button>
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
      case '#/dashboard': return <DashboardPlaceholder user={user} setUser={setUser} providers={providers} />;
      case '#/admin': return <AdminPlaceholder user={user} providers={providers} />;
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

const DashboardPlaceholder = ({ user, setUser, providers }: any) => (
  <div className="p-12 text-center text-gray-400 italic bg-gray-50 rounded-3xl m-6">
    <div className="text-5xl mb-4">🚀</div>
    <h3 className="text-xl font-black text-gray-700 not-italic mb-2">Grow Your Business</h3>
    <p className="max-w-md mx-auto">Registration is currently in Beta. Sign in as admin@juakazi.com to access the panel.</p>
  </div>
);

const AdminPlaceholder = ({ user, providers }: any) => (
  <div className="p-12 text-center text-gray-400 italic bg-gray-50 rounded-3xl m-6">
    <div className="text-5xl mb-4">🛡️</div>
    <h3 className="text-xl font-black text-gray-700 not-italic mb-2">Restricted Access</h3>
    <p>Only verified Jua Kazi admins can manage listings.</p>
  </div>
);

export default App;
