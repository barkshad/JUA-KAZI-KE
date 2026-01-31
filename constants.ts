
import { ServiceCategory, Provider } from './types';

export const KENYAN_CITIES = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Kiambu', 'Malindi', 'Machakos'
];

export const CATEGORY_ICONS: Record<string, string> = {
  [ServiceCategory.PLUMBING]: '🚰',
  [ServiceCategory.ELECTRICAL]: '⚡',
  [ServiceCategory.CLEANING]: '🧹',
  [ServiceCategory.CONSTRUCTION]: '🧱',
  [ServiceCategory.TUTORING]: '📚',
  [ServiceCategory.PHOTOGRAPHY]: '📸',
  [ServiceCategory.MECHANIC]: '🔧',
  [ServiceCategory.SALON]: '✂️',
  [ServiceCategory.OTHER]: '✨',
};

export const MOCK_PROVIDERS: Provider[] = [
  {
    id: '1',
    userId: 'u1',
    name: 'John the Fundi',
    serviceCategory: ServiceCategory.CONSTRUCTION,
    location: 'Nairobi',
    description: 'Expert mason with over 10 years experience in tiling and walling. Fast and reliable service for your home.',
    priceRange: 'KES 2,000 - 5,000',
    whatsappNumber: '254700000000',
    images: ['https://picsum.photos/seed/fundi/400/300'],
    isFeatured: true,
    isApproved: true,
    createdAt: Date.now() - 1000000,
  },
  {
    id: '2',
    userId: 'u2',
    name: 'Mary Cleaners',
    serviceCategory: ServiceCategory.CLEANING,
    location: 'Mombasa',
    description: 'Specialized in deep cleaning, laundry, and office sanitation. We use eco-friendly materials.',
    priceRange: 'KES 1,500/day',
    whatsappNumber: '254711111111',
    images: ['https://picsum.photos/seed/cleaner/400/300'],
    isFeatured: false,
    isApproved: true,
    createdAt: Date.now() - 500000,
  },
  {
    id: '3',
    userId: 'u3',
    name: 'Sam Electric',
    serviceCategory: ServiceCategory.ELECTRICAL,
    location: 'Kisumu',
    description: 'Licensed electrician for domestic and commercial wiring. Emergency repairs available 24/7.',
    priceRange: 'Varies',
    whatsappNumber: '254722222222',
    images: ['https://picsum.photos/seed/electric/400/300'],
    isFeatured: true,
    isApproved: true,
    createdAt: Date.now() - 200000,
  }
];
