
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
  const [hasSelectedRole, setHasSelectedRole] = useState(false);

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
      const matchesSearch = nameMatch || descMatch;
      const matchesCategory = selectedCategory === 'All' || p.serviceCategory === selectedCategory;
      return p.isApproved && matchesSearch && matchesCategory;
    });
  }, [providers, searchTerm, selectedCategory]);

  const RoleSelectionView = () => (
    <div className="max-w-xl mx-auto py-24 px-6 text-center">
      <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight leading-tight">
        Karibu Jua Kazi.
      </h2>
      <p className="text-slate-500 mb-12 text-lg font-medium">
        How do you want to use the app today?
      </p>
      
      <div className="grid grid-cols-1 gap-4">
        <button 
          onClick={() => { setHasSelectedRole(true); window.location.hash = '#/explore'; }}
          className="group relative overflow-hidden p-8 bg-white border border-slate-200 rounded-[2.5rem] text-left hover:border-blue-500 transition-all shadow-sm hover:shadow-xl"
        >
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">🔍</div>
            <div>
              <div className="text-xl font-black text-slate-900">I Need a Service</div>
              <div className="text-slate-400 font-bold text-sm">Find verified local professionals</div>
            </div>
          </div>
        </button>

        <button 
          onClick={() => { setHasSelectedRole(true); window.location.hash = '#/signup'; }}
          className="group relative overflow-hidden p-8 bg-slate-900 text-white border border-slate-800 rounded-[2.5rem] text-left hover:bg-black transition-all shadow-xl"
        >
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">🛠️</div>
            <div>
              <div className="text-xl font-black">I Offer a Service</div>
              <div className="text-slate-400 font-bold text-sm">List your business & get hired</div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );

  const AccountSettingsView = () => {
    const [formData, setFormData] = useState({
      fullName: currentUser?.fullName || '',
      phoneNumber: currentUser?.phoneNumber || '',
    });
    const [saving, setSaving] = useState(false);

    const handleUpdate = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!currentUser) return;
      setSaving(true);
      try {
        await firebaseService.updateUserAccount(currentUser.id, formData);
        setCurrentUser(firebaseService.getCurrentUser());
        alert("Account updated. Your public contact buttons are now using your new number.");
      } catch (err) {
        alert("Update failed.");
      } finally {
        setSaving(false);
      }
    };

    if (!currentUser) return <div className="p-20 text-center text-slate-400 font-bold">Please login.</div>;

    return (
      <div className="max-w-2xl mx-auto py-16 px-6">
        <h2 className="text-4xl font-black mb-10 tracking-tight">Account Settings</h2>
        
        <form onSubmit={handleUpdate} className="space-y-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Public Name</label>
            <input required className="w-full p-5 rounded-2xl bg-slate-50 border-none font-bold focus:ring-2 focus:ring-blue-600 transition-all" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Primary Phone (Call + WhatsApp Source)</label>
            <input required className="w-full p-5 rounded-2xl bg-slate-50 border-none font-bold focus:ring-2 focus:ring-blue-600 transition-all" value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} />
          </div>
          <button type="submit" disabled={saving} className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 active:scale-95 transition-all">
            {saving ? 'SAVING...' : 'UPDATE CONTACT INFO'}
          </button>
        </form>

        <button onClick={async () => { await firebaseService.logout(); window.location.hash = '#/'; window.location.reload(); }} className="mt-8 text-sm font-black text-red-500 uppercase tracking-widest block mx-auto">
          Logout
        </button>
      </div>
    );
  };

  const ProviderDetailView = ({ id }: { id: string }) => {
    const provider = providers.find(p => p.id === id);
    if (!provider || !provider.user) return <div className="p-20 text-center text-slate-400">Not found</div>;

    // SOURCE OF TRUTH: Always pull contact from the User record
    const phone = provider.user.phoneNumber;
    const whatsappUrl = `https://wa.me/${phone}?text=Hi%20${encodeURIComponent(provider.user.fullName)},%20I%20saw%20your%20${encodeURIComponent(provider.serviceCategory)}%20listing%20on%20JuaKazi.`;
    const callUrl = `tel:${phone}`;

    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="w-full lg:w-1/2">
            <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl">
              <img src={provider.images[0]} className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="w-full lg:w-1/2 space-y-8">
            <button onClick={() => window.history.back()} className="text-xs font-black text-slate-400">← BACK TO EXPLORE</button>
            <div>
              <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-tight mb-2">{provider.user.fullName}</h2>
              <div className="flex gap-2 items-center text-sm font-bold text-blue-600 uppercase tracking-widest">
                <span>{CATEGORY_ICONS[provider.serviceCategory]} {provider.serviceCategory}</span>
                <span>•</span>
                <span>📍 {provider.location}</span>
              </div>
            </div>
            
            <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 italic text-xl text-slate-600 leading-relaxed shadow-sm">
              "{provider.description}"
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a href={whatsappUrl} target="_blank" className="bg-green-500 hover:bg-green-600 text-white font-black py-6 rounded-[2rem] flex items-center justify-center gap-4 shadow-xl transition-all text-xl">
                <span>💬 WHATSAPP</span>
              </a>
              <a href={callUrl} className="bg-slate-900 hover:bg-black text-white font-black py-6 rounded-[2rem] flex items-center justify-center gap-2 text-xl">
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

    const handleAccountCreation = async (e: React.FormEvent) => {
      e.preventDefault();
      await firebaseService.createAccount(userData);
      setCurrentUser(firebaseService.getCurrentUser());
      setStep(2);
    };

    const handleProfileCreation = async (e: React.FormEvent) => {
      e.preventDefault();
      await firebaseService.createProviderProfile({
        serviceCategory: profileData.category,
        location: profileData.location,
        description: profileData.bio
      });
      window.location.hash = '#/';
      window.location.reload();
    };

    if (step === 1) return (
      <form onSubmit={handleAccountCreation} className="max-w-md mx-auto py-20 px-6 space-y-6">
        <h2 className="text-4xl font-black tracking-tight mb-2">1. Your Account</h2>
        <p className="text-slate-400 font-medium mb-8">This information is your permanent identity and primary contact.</p>
        <input required placeholder="Full Legal Name" className="w-full p-5 rounded-2xl bg-white border font-bold" value={userData.fullName} onChange={e => setUserData({...userData, fullName: e.target.value})} />
        <input required placeholder="Phone Number (e.g. 254...)" className="w-full p-5 rounded-2xl bg-white border font-bold" value={userData.phoneNumber} onChange={e => setUserData({...userData, phoneNumber: e.target.value})} />
        <input required type="email" placeholder="Work Email" className="w-full p-5 rounded-2xl bg-white border font-bold" value={userData.email} onChange={e => setUserData({...userData, email: e.target.value})} />
        <input required type="password" placeholder="Password" className="w-full p-5 rounded-2xl bg-white border font-bold" value={userData.password} onChange={e => setUserData({...userData, password: e.target.value})} />
        <button type="submit" className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl shadow-lg">CREATE ACCOUNT</button>
      </form>
    );

    return (
      <form onSubmit={handleProfileCreation} className="max-w-md mx-auto py-20 px-6 space-y-6">
        <h2 className="text-4xl font-black tracking-tight mb-2">2. Business Profile</h2>
        <p className="text-slate-400 font-medium mb-8">Tell us what you do. Contact info will be pulled from your account.</p>
        <select className="w-full p-5 rounded-2xl bg-white border font-bold" value={profileData.category} onChange={e => setProfileData({...profileData, category: e.target.value as ServiceCategory})}>
          {Object.values(ServiceCategory).map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="w-full p-5 rounded-2xl bg-white border font-bold" value={profileData.location} onChange={e => setProfileData({...profileData, location: e.target.value})}>
          {KENYAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <textarea required placeholder="Professional Bio..." className="w-full p-5 rounded-2xl bg-white border font-bold h-40" value={profileData.bio} onChange={e => setProfileData({...profileData, bio: e.target.value})} />
        <button type="submit" className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl shadow-lg">GO PUBLIC</button>
      </form>
    );
  };

  const ExploreView = () => (
    <div className="px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
        <div className="flex-1 w-full max-w-lg">
          <h2 className="text-4xl font-black tracking-tight mb-4">Verified Pros</h2>
          <div className="relative">
            <input type="text" placeholder="Search by name or keyword..." className="w-full p-5 pr-16 rounded-2xl border-none bg-white shadow-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-600 font-medium" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xl">🔍</span>
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
          {['All', ...Object.values(ServiceCategory)].map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-white text-slate-500'}`}>
              {cat.split('/')[0]}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProviders.map(p => (
          <div key={p.id} onClick={() => window.location.hash = `#/provider/${p.id}`} className="cursor-pointer">
            <ProviderCard provider={p} />
          </div>
        ))}
      </div>
    </div>
  );

  const HomeView = () => (
    <div className="space-y-24 py-16 px-6">
      <section className="text-center max-w-4xl mx-auto">
        <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.05] mb-8">
          Quality services <br/> built on <span className="text-blue-600">verified identity.</span>
        </h2>
        <p className="text-xl text-slate-500 font-medium mb-12 max-w-2xl mx-auto">
          Jua Kazi connects you with Kenyan professionals whose accounts are verified and identity-linked. No anonymous listings.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button onClick={() => window.location.hash = '#/explore'} className="px-10 py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all">
            Find a Professional
          </button>
          {!currentUser && (
            <button onClick={() => window.location.hash = '#/signup'} className="px-10 py-5 bg-white border border-slate-200 text-slate-900 font-black rounded-2xl hover:bg-slate-50 transition-all">
              Join as a Provider
            </button>
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: "Single Identity", desc: "One account manages your entire public presence.", icon: "🆔" },
          { title: "Direct Contact", desc: "Reach pros instantly via WhatsApp or direct call.", icon: "📲" },
          { title: "Real Professionals", desc: "Every profile is identity-linked for safety.", icon: "✅" }
        ].map(feat => (
          <div key={feat.title} className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm">
            <div className="text-4xl mb-6">{feat.icon}</div>
            <h4 className="text-xl font-black mb-3">{feat.title}</h4>
            <p className="text-slate-500 font-medium leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );

  const renderContent = () => {
    // Identity Gate: If no user and no role selected, force role selection
    if (!currentUser && !hasSelectedRole && route === '#/') return <RoleSelectionView />;
    
    if (route.startsWith('#/provider/')) return <ProviderDetailView id={route.split('/').pop() || ''} />;
    if (route === '#/signup') return <SignUpFlow />;
    if (route === '#/explore') return <ExploreView />;
    if (route === '#/settings') return <AccountSettingsView />;
    return <HomeView />;
  };

  return (
    <Layout activeTab={route.replace('#/', '') || 'home'} isLoggedIn={!!currentUser}>
      {renderContent()}
    </Layout>
  );
};

export default App;
