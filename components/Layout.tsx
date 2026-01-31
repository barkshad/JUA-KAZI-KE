
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab = 'home' }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 relative">
      {/* Header - Centered content on large screens */}
      <header className="sticky top-0 z-50 bg-blue-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-black tracking-tight cursor-pointer" onClick={() => window.location.hash = '#/'}>
            JUA KAZI
          </h1>
          <div className="flex gap-4 md:gap-6">
            <a href="#/explore" className="hover:opacity-80 flex items-center gap-1">
              <span className="hidden md:inline text-sm font-bold uppercase tracking-wider">Find Pros</span>
              <span className="text-xl">🔍</span>
            </a>
            <a href="#/dashboard" className="hover:opacity-80 flex items-center gap-1">
              <span className="hidden md:inline text-sm font-bold uppercase tracking-wider">Account</span>
              <span className="text-xl">👤</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pb-24 md:pb-12">
        <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8">
          <div className="bg-white min-h-screen shadow-sm sm:rounded-lg overflow-hidden">
            {children}
          </div>
        </div>
      </main>

      {/* Navigation - Bottom on mobile, but could be adapted. Centered on desktop. */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t flex justify-around py-3 px-2 z-50 md:max-w-xl md:mx-auto md:mb-4 md:rounded-full md:shadow-2xl md:border">
        <NavItem href="#/" icon="🏠" label="Home" active={activeTab === 'home'} />
        <NavItem href="#/explore" icon="🌍" label="Explore" active={activeTab === 'explore'} />
        <NavItem href="#/dashboard" icon="🛠️" label="My Pro" active={activeTab === 'dashboard'} />
        <NavItem href="#/admin" icon="🛡️" label="Admin" active={activeTab === 'admin'} />
      </nav>
      
      {/* Desktop Footer */}
      <footer className="hidden md:block py-8 bg-gray-100 border-t">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-xs">
          © {new Date().getFullYear()} JUA KAZI - Kenya's Number 1 Professional Marketplace.
        </div>
      </footer>
    </div>
  );
};

const NavItem = ({ href, icon, label, active }: { href: string, icon: string, label: string, active: boolean }) => (
  <a href={href} className={`flex flex-col items-center gap-1 px-4 transition-all duration-200 ${active ? 'text-blue-600 scale-110' : 'text-gray-400 hover:text-blue-400'}`}>
    <span className="text-xl md:text-2xl">{icon}</span>
    <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
  </a>
);

export default Layout;
