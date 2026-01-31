
import { Provider, User, ServiceCategory } from '../types';
import { MOCK_PROVIDERS } from '../constants';

// Simulated database
let providersStore: Provider[] = [...MOCK_PROVIDERS];
let userStore: User | null = null;

export const firebaseService = {
  getProviders: async (): Promise<Provider[]> => {
    return new Promise((res) => setTimeout(() => res([...providersStore]), 800));
  },

  getProviderById: async (id: string): Promise<Provider | undefined> => {
    return providersStore.find(p => p.id === id);
  },

  createProfile: async (data: Partial<Provider>): Promise<Provider> => {
    const newProvider: Provider = {
      id: Math.random().toString(36).substr(2, 9),
      userId: userStore?.id || 'guest',
      name: data.name || '',
      serviceCategory: data.serviceCategory || ServiceCategory.OTHER,
      location: data.location || '',
      description: data.description || '',
      whatsappNumber: data.whatsappNumber || '',
      images: data.images || [],
      priceRange: data.priceRange,
      isFeatured: false,
      isApproved: false,
      createdAt: Date.now(),
    };
    providersStore = [newProvider, ...providersStore];
    return newProvider;
  },

  updateProfile: async (id: string, data: Partial<Provider>): Promise<void> => {
    providersStore = providersStore.map(p => p.id === id ? { ...p, ...data } : p);
  },

  adminApproveProvider: async (id: string, approved: boolean): Promise<void> => {
    providersStore = providersStore.map(p => p.id === id ? { ...p, isApproved: approved } : p);
  },

  adminFeatureProvider: async (id: string, featured: boolean): Promise<void> => {
    providersStore = providersStore.map(p => p.id === id ? { ...p, isFeatured: featured } : p);
  },

  login: async (email: string): Promise<User> => {
    userStore = {
      id: 'u-auth-' + Math.random().toString(36).substr(2, 5),
      email,
      displayName: email.split('@')[0],
      role: email.includes('admin') ? 'admin' : 'provider'
    };
    return userStore;
  },

  logout: async (): Promise<void> => {
    userStore = null;
  }
};
