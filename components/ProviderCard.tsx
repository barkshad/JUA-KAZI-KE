
import React from 'react';
import { Provider } from '../types';
import { CATEGORY_ICONS } from '../constants';

interface ProviderCardProps {
  provider: Provider;
}

const ProviderCard: React.FC<ProviderCardProps> = ({ provider }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group flex flex-col h-full">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={provider.images[0] || 'https://picsum.photos/400/400'} 
          alt={provider.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
        <div className="absolute bottom-4 left-4 text-white">
          <span className="text-[10px] md:text-[11px] font-black bg-blue-600 px-3 py-1 rounded-lg uppercase tracking-widest shadow-lg">
            {CATEGORY_ICONS[provider.serviceCategory]} {provider.serviceCategory}
          </span>
        </div>
        {provider.isFeatured && (
          <div className="absolute top-4 right-4">
             <span className="bg-yellow-400 text-yellow-900 text-[9px] font-black px-3 py-1 rounded-full border border-yellow-500 shadow-xl uppercase">★ Top Pro</span>
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="mb-2">
          <h3 className="font-black text-gray-900 text-xl leading-tight group-hover:text-blue-600 transition-colors">{provider.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-bold text-gray-400">📍 {provider.location}</span>
          </div>
        </div>
        <p className="text-gray-500 text-sm line-clamp-3 mb-6 leading-relaxed flex-1">
          {provider.description}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Rate</span>
            <span className="text-sm font-black text-gray-800">{provider.priceRange || 'Contact'}</span>
          </div>
          <span className="bg-blue-50 text-blue-600 font-black text-[10px] uppercase px-4 py-2 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
            Profile →
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProviderCard;
