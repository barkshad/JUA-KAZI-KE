
import React from 'react';
import { Provider } from '../types';
import { CATEGORY_ICONS } from '../constants';

interface ProviderCardProps {
  provider: Provider;
}

const ProviderCard: React.FC<ProviderCardProps> = ({ provider }) => {
  // Pull from joined User data
  const displayName = provider.user?.fullName || 'Anonymous Pro';
  const isVerified = provider.user?.isVerified || false;

  return (
    <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group flex flex-col h-full ring-1 ring-slate-200/50">
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={provider.images[0]} 
          alt={displayName} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
        <div className="absolute bottom-4 left-4">
          <span className="text-[10px] font-black bg-blue-600 text-white px-3 py-1.5 rounded-xl uppercase tracking-widest shadow-lg">
            {CATEGORY_ICONS[provider.serviceCategory]} {provider.serviceCategory.split('/')[0]}
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="mb-4">
          <h3 className="font-black text-slate-900 text-xl leading-tight group-hover:text-blue-600 transition-colors tracking-tight">
            {displayName}
          </h3>
          <div className="flex items-center gap-1.5 mt-1.5 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
            <span>📍 {provider.location}</span>
            {isVerified && <span className="text-green-600">✓ Verified</span>}
          </div>
        </div>

        <p className="text-slate-500 text-sm line-clamp-2 mb-6 leading-relaxed font-medium flex-1 italic">
          "{provider.description}"
        </p>

        <div className="flex items-center justify-between pt-5 border-t border-slate-50 mt-auto">
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">Pricing</span>
            <span className="text-sm font-black text-slate-800">{provider.priceRange || 'Competitive'}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
            →
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderCard;
