
import { ServiceCategory, Provider, User } from './types';

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

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    fullName: 'John Kamau',
    phoneNumber: '254700000000',
    email: 'john@example.com',
    role: 'provider',
    isVerified: true,
    createdAt: Date.now()
  },
  {
    id: 'u2',
    fullName: 'Mary Atieno',
    phoneNumber: '254711111111',
    email: 'mary@example.com',
    role: 'provider',
    isVerified: true,
    createdAt: Date.now()
  }
];

export const MOCK_PROVIDERS: Provider[] = [
  {
    id: 'p1',
    userId: 'u1',
    serviceCategory: ServiceCategory.CONSTRUCTION,
    location: 'Nairobi',
    description: 'Expert mason with over 10 years experience in tiling and walling. Fast and reliable service for your home.',
    priceRange: 'KES 2,000 - 5,000',
    images: ['https://picsum.photos/seed/fundi/800/800'],
    isFeatured: true,
    isApproved: true,
    createdAt: Date.now() - 1000000,
  },
  {
    id: 'p2',
    userId: 'u2',
    serviceCategory: ServiceCategory.CLEANING,
    location: 'Mombasa',
    description: 'Specialized in deep cleaning, laundry, and office sanitation. We use eco-friendly materials.',
    priceRange: 'KES 1,500/day',
    images: ['https://picsum.photos/seed/cleaner/800/800'],
    isFeatured: false,
    isApproved: true,
    createdAt: Date.now() - 500000,
  }
];
