
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
  const [currentUser, setCurrentUser] = useState<User | null>(firebaseService.getCurrentUser());
  const [guestMode, setGuestMode] = useState<'customer' | 'provider' | null>(null);
  const [providerProfile, setProviderProfile] = useState<Provider | null>(null);

  // Initial Data Fetch
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
      
      const user = firebaseService.getCurrentUser();
      setCurrentUser(user);
      
      if (user && user.role === 'provider') {
        const profile = await firebaseService.getProviderByUserId(user.id);
        setProviderProfile(profile || null);
      }
      
      setLoading(false);
    };
    fetchData();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [route]);

  const filteredProviders = useMemo(() => {
    return providers.filter(p => {
      const nameMatch = p.user?.fullName.toLowerCase().includes(searchTerm.toLowerCase());
      const descMatch = p.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSearch = nameMatch || descMatch;
      const matchesCategory = selectedCategory === 'All' || p.serviceCategory === selectedCategory;
      return p.isApproved && matchesSearch && matchesCategory;
    });
  }, [providers, searchTerm, selectedCategory]);

  // --- 2. ROLE SELECTION SCREEN ---
  const RoleSelectionView = () => (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 max-w-2xl mx-auto text-center animate-fadeIn">
      <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter mb-6 leading-tight">
        How do you want to use the app?
      </h2>
      <p className="text-slate-500 text-lg font-medium mb-12">
        Select your role to continue to Jua Kazi.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <button 
          onClick={() => { setGuestMode('customer'); window.location.hash = '#/explore'; }}
          className="group relative p-8 bg-white border-2 border-slate-100 rounded-[3rem] text-left hover:border-blue-600 hover:shadow-2xl transition-all"
        >
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform">🔍</div>
          <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">I Need a Service</h3>
          <p className="text-slate-400 font-bold text-sm leading-relaxed">Find verified local pros instantly. No account required to browse.</p>
        </button>

        <button 
          onClick={() => { setGuestMode('provider'); window.location.hash = '#/signup'; }}
          className="group relative p-8 bg-slate-900 text-white rounded-[3rem] text-left hover:bg-black hover:shadow-2xl transition-all"
        >
          <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform">🛠️</div>
          <h3 className="text-2xl font-black mb-2 tracking-tight">I Offer a Service</h3>
          <p className="text-slate-400 font-bold text-sm leading-relaxed">Create a professional profile and reach more customers.</p>
        </button>
      </div>
    </div>
  );

  // --- 4 & 5. CUSTOMER BROWSE / EXPLORE ---
  const ExploreView = () => (
    <div className="px-6 py-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
        <div className="w-full max-w-2xl">
          <h2 className="text-5xl font-black tracking-tight mb-6">Find Local Pros</h2>
          <div className="relative group">
            <input 
              type="text" 
              placeholder="What are you looking for today?" 
              className="w-full p-6 pr-16 rounded-[2rem] border-none bg-white shadow-lg ring-1 ring-slate-200 focus:ring-4 focus:ring-blue-100 font-bold text-lg transition-all" 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
            />
            <span className="absolute right-8 top-1/2 -translate-y-1/2 text-2xl group-hover:scale-110 transition-transform">🔍</span>
          </div>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-4 w-full md:w-auto no-scrollbar">
          {['All', ...Object.values(ServiceCategory)].map(cat => (
            <button 
              key={cat} 
              onClick={() => setSelectedCategory(cat)} 
              className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all shadow-sm ${selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
            >
              {cat.split('/')[0]}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
        {filteredProviders.map((p, idx) => (
          <div 
            key={p.id} 
            onClick={() => window.location.hash = `#/provider/${p.id}`} 
            className="cursor-pointer animate-fadeIn"
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            <ProviderCard provider={p} />
          </div>
        ))}
      </div>
      {filteredProviders.length === 0 && !loading && (
        <div className="py-32 text-center">
          <div className="text-6xl mb-6">🏝️</div>
          <h3 className="text-2xl font-black text-slate-900 mb-2">No pros found.</h3>
          <p className="text-slate-400 font-medium">Try a different search term or category.</p>
        </div>
      )}
    </div>
  );

  // --- 6. PROVIDER PROFILE PAGE (Customer View) ---
  const ProviderDetailView = ({ id }: { id: string }) => {
    const provider = providers.find(p => p.id === id);
    if (!provider || !provider.user) return <div className="p-20 text-center text-slate-400">Loading profile...</div>;

    const phone = provider.user.phoneNumber;
    const whatsappUrl = `https://wa.me/${phone}?text=Hello%20${encodeURIComponent(provider.user.fullName)},%20I%20saw%20your%20listing%20on%20JuaKazi%20and%20I'd%20like%20to%20discuss%20your%20${encodeURIComponent(provider.serviceCategory)}%20services.`;
    const callUrl = `tel:${phone}`;

    return (
      <div className="max-w-7xl mx-auto px-6 py-12 animate-fadeIn">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="w-full lg:w-1/2">
            <div className="aspect-square rounded-[4rem] overflow-hidden shadow-2xl ring-1 ring-slate-100">
              <img src={provider.images[0]} className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-10">
            <div>
              <button onClick={() => window.history.back()} className="mb-10 text-xs font-black text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest flex items-center gap-2">
                <span>←</span> BACK TO EXPLORE
              </button>
              <div className="flex gap-2 items-center text-xs font-black text-blue-600 uppercase tracking-widest mb-4">
                <span className="bg-blue-50 px-3 py-1.5 rounded-lg">{CATEGORY_ICONS[provider.serviceCategory]} {provider.serviceCategory}</span>
                <span className="text-slate-300">•</span>
                <span>📍 {provider.location}</span>
              </div>
              <h2 className="text-6xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-4">{provider.user.fullName}</h2>
              <div className="flex items-center gap-2 text-green-600 font-black text-xs uppercase tracking-widest">
                <span className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center text-[10px]">✓</span> Verified Identity
              </div>
            </div>
            
            <div className="p-10 bg-white rounded-[3rem] border border-slate-100 italic text-2xl text-slate-600 leading-relaxed shadow-sm ring-1 ring-slate-200/50">
              "{provider.description}"
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="bg-[#25D366] hover:bg-[#128C7E] text-white font-black py-7 rounded-[2.5rem] flex items-center justify-center gap-4 shadow-xl shadow-green-200 transition-all text-xl hover:scale-[1.02] active:scale-95">
                <span className="text-2xl">💬</span> WHATSAPP
              </a>
              <a href={callUrl} className="bg-slate-900 hover:bg-black text-white font-black py-7 rounded-[2.5rem] flex items-center justify-center gap-4 shadow-xl transition-all text-xl hover:scale-[1.02] active:scale-95">
                <span className="text-2xl">📞</span> DIRECT CALL
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- 4, 6 & 7. PROVIDER DASHBOARD / SIGNUP / REVIEW ---
  const ProviderWorkflow = () => {
    const [step, setStep] = useState(currentUser ? (providerProfile ? 'dashboard' : 'profile-create') : 'auth');
    const [userData, setUserData] = useState({ fullName: '', phoneNumber: '', email: '', password: '' });
    const [profileData, setProfileData] = useState({ category: ServiceCategory.OTHER, location: 'Nairobi', bio: '' });

    // Step: Auth
    if (step === 'auth') return (
      <form onSubmit={async (e) => {
        e.preventDefault();
        await firebaseService.createAccount(userData);
        setCurrentUser(firebaseService.getCurrentUser());
        setStep('profile-create');
      }} className="max-w-md mx-auto py-20 px-6 space-y-6 animate-slideUp">
        <h2 className="text-4xl font-black tracking-tight mb-4">Create Your Account</h2>
        <p className="text-slate-400 font-medium mb-10 leading-relaxed">
          One account, one identity. Your phone number will be your public contact point for WhatsApp and Calls.
        </p>
        <div className="space-y-4">
          <input required placeholder="Full Name" className="w-full p-5 rounded-2xl bg-white border border-slate-200 font-bold" value={userData.fullName} onChange={e => setUserData({...userData, fullName: e.target.value})} />
          <input required placeholder="Phone Number (e.g. 254...)" className="w-full p-5 rounded-2xl bg-white border border-slate-200 font-bold" value={userData.phoneNumber} onChange={e => setUserData({...userData, phoneNumber: e.target.value})} />
          <input required type="email" placeholder="Email Address" className="w-full p-5 rounded-2xl bg-white border border-slate-200 font-bold" value={userData.email} onChange={e => setUserData({...userData, email: e.target.value})} />
          <input required type="password" placeholder="Password" className="w-full p-5 rounded-2xl bg-white border border-slate-200 font-bold" value={userData.password} onChange={e => setUserData({...userData, password: e.target.value})} />
        </div>
        <button type="submit" className="w-full py-6 bg-blue-600 text-white font-black rounded-[2rem] shadow-xl shadow-blue-500/20 hover:scale-105 transition-all text-lg">
          CREATE ACCOUNT
        </button>
      </form>
    );

    // Step: Profile Creation
    if (step === 'profile-create') return (
      <form onSubmit={async (e) => {
        e.preventDefault();
        const profile = await firebaseService.createProviderProfile({
          serviceCategory: profileData.category,
          location: profileData.location,
          description: profileData.bio
        });
        setProviderProfile(profile);
        setStep('dashboard');
      }} className="max-w-md mx-auto py-20 px-6 space-y-6 animate-slideUp">
        <h2 className="text-4xl font-black tracking-tight mb-4">Your Service Profile</h2>
        <p className="text-slate-400 font-medium mb-10 leading-relaxed">
          Tell us about the work you do. Note: Contact buttons will use the phone number from your account automatically.
        </p>
        <div className="space-y-4">
          <select className="w-full p-5 rounded-2xl bg-white border border-slate-200 font-bold appearance-none" value={profileData.category} onChange={e => setProfileData({...profileData, category: e.target.value as ServiceCategory})}>
            {Object.values(ServiceCategory).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="w-full p-5 rounded-2xl bg-white border border-slate-200 font-bold appearance-none" value={profileData.location} onChange={e => setProfileData({...profileData, location: e.target.value})}>
            {KENYAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <textarea required placeholder="Professional Bio (e.g. Expert mason with 10 years exp...)" className="w-full p-5 rounded-2xl bg-white border border-slate-200 font-bold h-40 resize-none" value={profileData.bio} onChange={e => setProfileData({...profileData, bio: e.target.value})} />
        </div>
        <button type="submit" className="w-full py-6 bg-slate-900 text-white font-black rounded-[2rem] shadow-xl hover:scale-105 transition-all text-lg">
          SUBMIT FOR REVIEW
        </button>
      </form>
    );

    // Step: Dashboard / Review Status
    if (providerProfile) return (
      <div className="max-w-3xl mx-auto py-20 px-6 space-y-12 animate-fadeIn">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-5xl font-black tracking-tight mb-2">My Dashboard</h2>
            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">
              Manager for {currentUser?.fullName}
            </p>
          </div>
          <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${providerProfile.isApproved ? 'bg-green-50 text-green-600 border-green-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
            {providerProfile.isApproved ? 'LIVE' : 'PENDING REVIEW'}
          </div>
        </div>

        {!providerProfile.isApproved && (
          <div className="p-10 bg-amber-50 border border-amber-200 rounded-[3rem] text-center">
            <div className="text-5xl mb-6">🛡️</div>
            <h3 className="text-2xl font-black text-amber-900 mb-4 tracking-tight">Your profile is under review</h3>
            <p className="text-amber-800/70 font-medium leading-relaxed max-w-md mx-auto">
              Our team is verifying your details to ensure the highest quality of service on Jua Kazi. You will appear publicly once approved.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-10 bg-white rounded-[3rem] border border-slate-100 shadow-sm space-y-4">
             <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Listing Details</h4>
             <div className="text-lg font-bold text-slate-900">{CATEGORY_ICONS[providerProfile.serviceCategory]} {providerProfile.serviceCategory}</div>
             <div className="text-sm text-slate-500 italic">"{providerProfile.description}"</div>
             <button onClick={() => alert("Edit feature coming soon!")} className="text-blue-600 font-black text-xs uppercase tracking-widest hover:underline pt-4 block">Edit Service Profile</button>
          </div>
          <div className="p-10 bg-white rounded-[3rem] border border-slate-100 shadow-sm space-y-4">
             <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Account Contact</h4>
             <div className="text-lg font-bold text-slate-900">📞 {currentUser?.phoneNumber}</div>
             <div className="text-sm text-slate-500">Linked to your Call & WhatsApp buttons.</div>
             <button onClick={() => window.location.hash = '#/settings'} className="text-blue-600 font-black text-xs uppercase tracking-widest hover:underline pt-4 block">Change Account Settings</button>
          </div>
        </div>

        <div className="text-center pt-10">
          <button 
            onClick={async () => { await firebaseService.logout(); window.location.hash = '#/'; window.location.reload(); }} 
            className="text-xs font-black text-red-500 uppercase tracking-widest hover:text-red-600 transition-colors"
          >
            LOGOUT FROM JUA KAZI
          </button>
        </div>
      </div>
    );

    return null;
  };

  const AccountSettingsView = () => {
    const [formData, setFormData] = useState({ fullName: currentUser?.fullName || '', phoneNumber: currentUser?.phoneNumber || '' });
    const [saving, setSaving] = useState(false);

    const handleUpdate = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!currentUser) return;
      setSaving(true);
      await firebaseService.updateUserAccount(currentUser.id, formData);
      setCurrentUser(firebaseService.getCurrentUser());
      setSaving(false);
      alert("Settings updated!");
    };

    return (
      <div className="max-w-2xl mx-auto py-20 px-6">
        <h2 className="text-4xl font-black mb-10 tracking-tight">Account Settings</h2>
        <form onSubmit={handleUpdate} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Account Name</label>
            <input required className="w-full p-5 rounded-2xl bg-slate-50 border-none font-bold focus:ring-2 focus:ring-blue-600 transition-all" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Phone Number (Public Contact)</label>
            <input required className="w-full p-5 rounded-2xl bg-slate-50 border-none font-bold focus:ring-2 focus:ring-blue-600 transition-all" value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} />
          </div>
          <button type="submit" disabled={saving} className="w-full py-6 bg-blue-600 text-white font-black rounded-2xl shadow-xl hover:scale-105 transition-all">
            {saving ? 'SAVING...' : 'SAVE CHANGES'}
          </button>
        </form>
      </div>
    );
  };

  const HomeView = () => (
    <div className="space-y-32 py-24 px-6 animate-fadeIn">
      <section className="text-center max-w-5xl mx-auto">
        <h2 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tight leading-[0.95] mb-10">
          Trusted Pros <br/> built on <span className="text-blue-600">verified identity.</span>
        </h2>
        <p className="text-xl md:text-2xl text-slate-500 font-medium mb-16 max-w-2xl mx-auto leading-relaxed">
          The fastest way to hire plumbers, fundis, and cleaners in Kenya. Direct WhatsApp contact with verified accounts.
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          <button onClick={() => window.location.hash = '#/explore'} className="px-12 py-7 bg-blue-600 text-white font-black rounded-[2.5rem] shadow-2xl shadow-blue-500/20 hover:scale-110 active:scale-95 transition-all text-xl">
            Find a Professional
          </button>
          {!currentUser && (
            <button onClick={() => window.location.hash = '#/signup'} className="px-12 py-7 bg-white border border-slate-200 text-slate-900 font-black rounded-[2.5rem] hover:bg-slate-50 hover:shadow-xl transition-all text-xl">
              I Offer a Service
            </button>
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {[
          { title: "Direct Action", desc: "No chat walls inside the app. Hit 'WhatsApp' and start talking instantly.", icon: "💬" },
          { title: "Verified Identity", desc: "Every professional is linked to a single verified account for accountability.", icon: "🆔" },
          { title: "Kenya First", desc: "Optimized for the local market, including cities like Nairobi, Mombasa, and Kisumu.", icon: "🇰🇪" }
        ].map(feat => (
          <div key={feat.title} className="p-10 bg-white border border-slate-100 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all">
            <div className="text-5xl mb-8">{feat.icon}</div>
            <h4 className="text-2xl font-black mb-4 tracking-tight">{feat.title}</h4>
            <p className="text-slate-500 font-medium leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );

  const renderContent = () => {
    // 1. Role Selection Check
    if (!currentUser && !guestMode && route === '#/') return <RoleSelectionView />;
    
    // 2. Routing Logic
    if (route.startsWith('#/provider/')) return <ProviderDetailView id={route.split('/').pop() || ''} />;
    if (route === '#/signup') return <ProviderWorkflow />;
    if (route === '#/explore') return <ExploreView />;
    if (route === '#/settings') return <AccountSettingsView />;
    
    // Default Home
    return <HomeView />;
  };

  const getActiveTab = () => {
    if (route.includes('explore')) return 'explore';
    if (route.includes('settings')) return 'settings';
    if (route.includes('signup')) return 'dashboard';
    return 'home';
  }

  return (
    <Layout activeTab={getActiveTab()} isLoggedIn={!!currentUser}>
      {renderContent()}
    </Layout>
  );
};

export default App;
