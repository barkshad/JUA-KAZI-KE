
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab = 'home' }) => {
  return (
    <div className="min-h-screen flex flex-col relative pb-20 md:pb-0">
      {/* Universal Header */}
      <header className="sticky top-0 z-50 glass border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div 
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={() => window.location.hash = '#/'}
          >
            <div className="bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center font-black">JK</div>
            <h1 className="text-lg md:text-xl font-black tracking-tighter text-slate-900 group-hover:text-blue-600 transition-colors">
              JUA KAZI
            </h1>
          </div>
          
          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <DesktopNavItem href="#/" label="Home" active={activeTab === 'home'} />
            <DesktopNavItem href="#/explore" label="Explore" active={activeTab === 'explore'} />
            <DesktopNavItem href="#/dashboard" label="Grow Business" active={activeTab === 'dashboard'} />
            <DesktopNavItem href="#/admin" label="Admin" active={activeTab === 'admin'} />
          </nav>

          <div className="flex gap-2">
            <a href="#/explore" className="p-2 hover:bg-slate-100 rounded-full transition-colors md:hidden">🔍</a>
            <div className="hidden md:block">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-bold transition-all shadow-md shadow-blue-500/20 active:scale-95">
                Join as a Pro
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full page-enter">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Floating Nav - Optimized for Thumbs */}
      <nav className="fixed bottom-4 left-4 right-4 h-16 glass border border-slate-200 rounded-3xl flex justify-around items-center px-4 z-50 md:hidden shadow-2xl shadow-slate-900/10">
        <MobileNavItem href="#/" icon="🏠" active={activeTab === 'home'} />
        <MobileNavItem href="#/explore" icon="🌍" active={activeTab === 'explore'} />
        <MobileNavItem href="#/dashboard" icon="🛠️" active={activeTab === 'dashboard'} />
        <MobileNavItem href="#/admin" icon="🛡️" active={activeTab === 'admin'} />
      </nav>
      
      {/* Desktop Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6 mt-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-white font-black text-xl mb-2 tracking-tighter">JUA KAZI</h2>
            <p className="text-sm max-w-xs">Connecting Kenya's finest professionals with the clients who need them most.</p>
          </div>
          <div className="flex gap-8 text-sm font-medium">
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
          <div className="text-xs text-slate-500">
            © {new Date().getFullYear()} Jua Kazi Ltd. Built with precision.
          </div>
        </div>
      </footer>
    </div>
  );
};

const DesktopNavItem = ({ href, label, active }: { href: string, label: string, active: boolean }) => (
  <a 
    href={href} 
    className={`text-sm font-bold transition-all px-1 py-2 border-b-2 ${
      active 
      ? 'text-blue-600 border-blue-600' 
      : 'text-slate-500 border-transparent hover:text-slate-900'
    }`}
  >
    {label}
  </a>
);

const MobileNavItem = ({ href, icon, active }: { href: string, icon: string, active: boolean }) => (
  <a 
    href={href} 
    className={`flex items-center justify-center w-12 h-12 rounded-2xl transition-all ${
      active ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40 scale-110' : 'text-slate-400'
    }`}
  >
    <span className="text-xl">{icon}</span>
  </a>
);

export default Layout;
