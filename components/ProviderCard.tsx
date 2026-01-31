
import React from 'react';
import { Provider } from '../types';
import { CATEGORY_ICONS } from '../constants';

interface ProviderCardProps {
  provider: Provider;
}

const ProviderCard: React.FC<ProviderCardProps> = ({ provider }) => {
  return (
    <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group flex flex-col h-full ring-1 ring-slate-200/50">
      {/* Image Section */}
      <div className="relative aspect-[1/1] overflow-hidden">
        <img 
          src={provider.images[0] || 'https://picsum.photos/400/400'} 
          alt={provider.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
        
        {/* Category Badge */}
        <div className="absolute bottom-4 left-4">
          <span className="text-[10px] font-black bg-blue-600 text-white px-3 py-1.5 rounded-xl uppercase tracking-widest shadow-lg shadow-blue-600/20 flex items-center gap-1.5">
            {CATEGORY_ICONS[provider.serviceCategory]} {provider.serviceCategory.split('/')[0]}
          </span>
        </div>

        {/* Status Badge */}
        {provider.isFeatured && (
          <div className="absolute top-4 right-4">
             <span className="bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-black px-3 py-1.5 rounded-full border border-slate-100 shadow-xl uppercase tracking-tighter">
               Verified
             </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-1">
        <div className="mb-4">
          <h3 className="font-black text-slate-900 text-xl leading-tight group-hover:text-blue-600 transition-colors tracking-tight">
            {provider.name}
          </h3>
          <div className="flex items-center gap-1.5 mt-1.5 text-slate-400 font-bold text-xs uppercase tracking-widest">
            <span>📍 {provider.location}</span>
          </div>
        </div>

        <p className="text-slate-500 text-sm line-clamp-2 mb-6 leading-relaxed font-medium flex-1 italic">
          "{provider.description}"
        </p>

        <div className="flex items-center justify-between pt-5 border-t border-slate-50 mt-auto">
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">Price Range</span>
            <span className="text-sm font-black text-slate-800 tracking-tight">{provider.priceRange || 'Contact'}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
            →
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderCard;
