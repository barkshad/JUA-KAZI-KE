
import React, { useState, useEffect, useMemo } from 'react';
import { Provider, User, ServiceCategory } from './types';
import { firebaseService } from './services/firebaseService';
import Layout from './components/Layout';
import ProviderCard from './components/ProviderCard';
import { CATEGORY_ICONS, KENYAN_CITIES } from './constants';

const App: React.FC = () => {
  const [route, setRoute] = useState(window.location.hash || '#/');
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [currentUser, setCurrentUser] = useState<User | null>(firebaseService.getCurrentUser());

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
      setCurrentUser(firebaseService.getCurrentUser());
      setLoading(false);
    };
    fetchData();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const filteredProviders = useMemo(() => {
    return providers.filter(p => {
      const nameMatch = p.user?.fullName.toLowerCase().includes(searchTerm.toLowerCase());
      const descMatch = p.description.toLowerCase().includes(searchTerm.toLowerCase());
      const catMatch = p.serviceCategory.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSearch = nameMatch || descMatch || catMatch;
      const matchesCategory = selectedCategory === 'All' || p.serviceCategory === selectedCategory;
      const matchesLocation = selectedLocation === 'All' || p.location === selectedLocation;
      return p.isApproved && matchesSearch && matchesCategory && matchesLocation;
    });
  }, [providers, searchTerm, selectedCategory, selectedLocation]);

  const AccountSettingsView = () => {
    const [formData, setFormData] = useState({
      fullName: currentUser?.fullName || '',
      phoneNumber: currentUser?.phoneNumber || '',
      email: currentUser?.email || ''
    });
    const [saving, setSaving] = useState(false);

    const handleUpdate = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!currentUser) return;
      setSaving(true);
      try {
        await firebaseService.updateUserAccount(currentUser.id, formData);
        setCurrentUser(firebaseService.getCurrentUser());
        alert("Account details updated. Your public contact buttons have been updated automatically.");
      } catch (err) {
        alert("Failed to update account.");
      } finally {
        setSaving(false);
      }
    };

    if (!currentUser) return <div className="p-20 text-center text-slate-400 font-bold">Please log in to manage your account.</div>;

    return (
      <div className="max-w-2xl mx-auto py-16 px-6">
        <h2 className="text-4xl font-black mb-2 tracking-tight">Account Settings</h2>
        <p className="text-slate-400 mb-10 font-medium">Your phone number is your primary contact method for clients.</p>
        
        <form onSubmit={handleUpdate} className="space-y-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Full Name</label>
            <input 
              required 
              className="w-full p-5 rounded-2xl bg-slate-50 border-none font-bold focus:ring-2 focus:ring-blue-600 transition-all" 
              value={formData.fullName} 
              onChange={e => setFormData({...formData, fullName: e.target.value})} 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Phone Number (WhatsApp & Call Source)</label>
            <input 
              required 
              className="w-full p-5 rounded-2xl bg-slate-50 border-none font-bold focus:ring-2 focus:ring-blue-600 transition-all" 
              value={formData.phoneNumber} 
              onChange={e => setFormData({...formData, phoneNumber: e.target.value})} 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Email Address</label>
            <input 
              required 
              type="email" 
              className="w-full p-5 rounded-2xl bg-slate-50 border-none font-bold opacity-50" 
              value={formData.email} 
              disabled
            />
          </div>
          <button 
            type="submit" 
            disabled={saving}
            className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:bg-slate-300"
          >
            {saving ? 'SAVING...' : 'SAVE ACCOUNT CHANGES'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={async () => {
              await firebaseService.logout();
              window.location.hash = '#/';
              window.location.reload();
            }}
            className="text-sm font-black text-red-500 hover:text-red-600 uppercase tracking-widest"
          >
            Logout From Jua Kazi
          </button>
        </div>
      </div>
    );
  };

  const HomeView = () => (
    <div className="space-y-12 md:space-y-24 py-8 md:py-16">
      {/* Hero */}
      <section className="px-4 md:px-8 text-center max-w-5xl mx-auto">
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
          Find trusted Pros <br className="hidden md:block"/> built on real identity.
        </h2>
        <p className="text-lg md:text-xl text-slate-500 font-medium mb-12 max-w-2xl mx-auto">
          Every pro on Jua Kazi has a verified account. No anonymous listings. Just quality service.
        </p>
        
        <div className="relative max-w-2xl mx-auto">
          <div className="relative flex items-center bg-white rounded-2xl md:rounded-full p-2 shadow-2xl shadow-blue-500/10 border border-slate-100 ring-1 ring-slate-200">
            <input 
              type="text" 
              placeholder="Who do you need to hire?" 
              className="flex-1 py-4 md:py-5 px-6 rounded-full text-slate-900 outline-none text-base md:text-lg font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl md:rounded-full shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95">
              <span className="text-xl">🔍</span>
            </button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-6 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Main Categories</h3>
            <p className="text-slate-400 text-sm font-medium">Browse verified identity-linked profiles</p>
          </div>
          {!currentUser && (
            <button 
              onClick={() => window.location.hash = '#/signup'} 
              className="text-sm font-black text-blue-600 bg-blue-50 px-6 py-3 rounded-full hover:bg-blue-100 transition-all"
            >
              List Your Business
            </button>
          )}
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

      {/* Featured Pros */}
      <section className="px-6 md:px-8 pb-20">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-8">Featured Professionals</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {loading ? (
             Array(4).fill(0).map((_, i) => <div key={i} className="aspect-[3/4] bg-slate-100 animate-pulse rounded-[2.5rem]"></div>)
          ) : (
            filteredProviders.slice(0, 8).map(p => (
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
    if (!provider || !provider.user) return <div className="p-20 text-center text-slate-400 font-bold">Profile not found.</div>;

    const whatsappUrl = `https://wa.me/${provider.user.phoneNumber}?text=Hi%20${encodeURIComponent(provider.user.fullName)},%20I%20found%20your%20profile%20on%20JuaKazi.%20I%20need%20help%20with%20${encodeURIComponent(provider.serviceCategory)}.`;
    const callUrl = `tel:${provider.user.phoneNumber}`;

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          <div className="w-full lg:w-1/2 lg:sticky lg:top-24 space-y-6">
            <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl ring-1 ring-slate-200">
              <img src={provider.images[0]} className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <div className="mb-8">
               <button onClick={() => window.history.back()} className="mb-8 text-sm font-black text-slate-400 hover:text-blue-600">← BACK</button>
               <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-xs font-black uppercase tracking-widest mb-6">
                {CATEGORY_ICONS[provider.serviceCategory]} {provider.serviceCategory}
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-4 leading-tight">
                {provider.user.fullName}
              </h2>
              <p className="text-slate-400 font-bold">📍 {provider.location} • Identity Verified ✓</p>
            </div>
            
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm italic text-lg text-slate-600 mb-10">
              "{provider.description}"
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href={whatsappUrl} target="_blank" className="flex-[2] bg-green-500 hover:bg-green-600 text-white font-black py-6 rounded-[2rem] flex items-center justify-center gap-4 shadow-xl shadow-green-500/20 transition-all text-xl">
                <span>💬 WHATSAPP</span>
              </a>
              <a href={callUrl} className="flex-1 bg-slate-900 hover:bg-black text-white font-black py-6 rounded-[2rem] flex items-center justify-center gap-2">
                📞 CALL
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SignUpFlow = () => {
    const [step, setStep] = useState(1);
    const [userData, setUserData] = useState({ fullName: '', phoneNumber: '', email: '', password: '' });
    const [profileData, setProfileData] = useState({ category: ServiceCategory.OTHER, location: 'Nairobi', bio: '' });

    const handleStep2 = async (e: React.FormEvent) => {
      e.preventDefault();
      await firebaseService.createAccount(userData);
      setCurrentUser(firebaseService.getCurrentUser());
      setStep(3);
    };

    const handleStep3 = async (e: React.FormEvent) => {
      e.preventDefault();
      await firebaseService.createProviderProfile({
        serviceCategory: profileData.category,
        location: profileData.location,
        description: profileData.bio
      });
      alert("Business Profile Created! Contact info is synced from your account.");
      window.location.hash = '#/';
      window.location.reload();
    };

    if (step === 1) return (
      <div className="max-w-md mx-auto py-20 px-6 text-center">
        <h2 className="text-3xl font-black mb-8">Join Jua Kazi</h2>
        <div className="space-y-4">
          <button onClick={() => setStep(2)} className="w-full py-8 bg-blue-600 text-white font-black rounded-[2rem] shadow-xl hover:scale-105 transition-all">
            I OFFER A SERVICE
          </button>
          <button onClick={() => window.location.hash = '#/'} className="w-full py-8 bg-slate-100 text-slate-900 font-black rounded-[2rem] hover:bg-slate-200 transition-all">
            I NEED A SERVICE
          </button>
        </div>
      </div>
    );

    if (step === 2) return (
      <form onSubmit={handleStep2} className="max-w-md mx-auto py-20 px-6 space-y-6">
        <h2 className="text-3xl font-black mb-2">1. Secure Identity</h2>
        <p className="text-slate-400 mb-8">This phone number will be used for all WhatsApp and Call contacts.</p>
        <input required placeholder="Full Name" className="w-full p-5 rounded-2xl bg-white border font-bold" value={userData.fullName} onChange={e => setUserData({...userData, fullName: e.target.value})} />
        <input required placeholder="Phone (e.g. 254700...)" className="w-full p-5 rounded-2xl bg-white border font-bold" value={userData.phoneNumber} onChange={e => setUserData({...userData, phoneNumber: e.target.value})} />
        <input required type="email" placeholder="Email Address" className="w-full p-5 rounded-2xl bg-white border font-bold" value={userData.email} onChange={e => setUserData({...userData, email: e.target.value})} />
        <input required type="password" placeholder="Password" className="w-full p-5 rounded-2xl bg-white border font-bold" value={userData.password} onChange={e => setUserData({...userData, password: e.target.value})} />
        <button type="submit" className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl shadow-lg">CONTINUE TO PROFILE</button>
      </form>
    );

    return (
      <form onSubmit={handleStep3} className="max-w-md mx-auto py-20 px-6 space-y-6">
        <h2 className="text-3xl font-black mb-2">2. Business Profile</h2>
        <p className="text-slate-400 mb-8">What services do you offer? Contact info is pre-filled from your account.</p>
        <div className="space-y-4">
          <select className="w-full p-5 rounded-2xl bg-white border font-bold" value={profileData.category} onChange={e => setProfileData({...profileData, category: e.target.value as ServiceCategory})}>
            {Object.values(ServiceCategory).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="w-full p-5 rounded-2xl bg-white border font-bold" value={profileData.location} onChange={e => setProfileData({...profileData, location: e.target.value})}>
            {KENYAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <textarea required placeholder="Brief Professional Bio (Expert mason, professional cleaner, etc.)" className="w-full p-5 rounded-2xl bg-white border font-bold h-32" value={profileData.bio} onChange={e => setProfileData({...profileData, bio: e.target.value})} />
        </div>
        <button type="submit" className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl shadow-lg">LAUNCH BUSINESS</button>
      </form>
    );
  };

  const ExploreView = () => (
    <div className="px-6 md:px-8 py-12">
      <h2 className="text-4xl font-black mb-12 tracking-tight">Explore Verified Pros</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProviders.map(p => (
          <div key={p.id} onClick={() => window.location.hash = `#/provider/${p.id}`} className="cursor-pointer">
            <ProviderCard provider={p} />
          </div>
        ))}
      </div>
      {filteredProviders.length === 0 && !loading && (
        <div className="py-20 text-center text-slate-400 font-bold">No results found for your search.</div>
      )}
    </div>
  );

  const renderContent = () => {
    if (route.startsWith('#/provider/')) return <ProviderDetailView id={route.split('/').pop() || ''} />;
    if (route === '#/signup') return <SignUpFlow />;
    if (route === '#/explore') return <ExploreView />;
    if (route === '#/settings') return <AccountSettingsView />;
    return <HomeView />;
  };

  const getActiveTab = () => {
    if (route.includes('explore')) return 'explore';
    if (route.includes('settings')) return 'settings';
    if (route.includes('signup')) return 'dashboard';
    if (route.includes('admin')) return 'admin';
    return 'home';
  }

  return (
    <Layout activeTab={getActiveTab()} isLoggedIn={!!currentUser}>
      {renderContent()}
    </Layout>
  );
};

export default App;
