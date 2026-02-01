
import { Provider, User, ServiceCategory } from '../types';
import { MOCK_PROVIDERS, MOCK_USERS } from '../constants';

// Simulated database
let providersStore: Provider[] = [...MOCK_PROVIDERS];
let userStore: User[] = [...MOCK_USERS];
let currentUser: User | null = null;

export const firebaseService = {
  // Get all approved providers with their associated user account data
  getProviders: async (): Promise<Provider[]> => {
    return new Promise((res) => {
      setTimeout(() => {
        const joined = providersStore.map(p => ({
          ...p,
          user: userStore.find(u => u.id === p.userId)
        }));
        res(joined);
      }, 600);
    });
  },

  getProviderById: async (id: string): Promise<Provider | undefined> => {
    const provider = providersStore.find(p => p.id === id);
    if (!provider) return undefined;
    return {
      ...provider,
      user: userStore.find(u => u.id === provider.userId)
    };
  },

  // Step 2 of Signup: Identity Creation
  createAccount: async (data: { fullName: string; phoneNumber: string; email: string }): Promise<User> => {
    const newUser: User = {
      id: 'u-' + Math.random().toString(36).substr(2, 9),
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      email: data.email,
      role: 'provider',
      isVerified: false,
      createdAt: Date.now()
    };
    userStore.push(newUser);
    currentUser = newUser;
    return newUser;
  },

  // Step 3 of Signup: Storefront Creation
  createProviderProfile: async (data: Partial<Provider>): Promise<Provider> => {
    if (!currentUser) throw new Error("No authenticated user");
    
    const newProvider: Provider = {
      id: 'p-' + Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
      serviceCategory: data.serviceCategory || ServiceCategory.OTHER,
      location: data.location || '',
      description: data.description || '',
      images: data.images || ['https://picsum.photos/seed/new/800/800'],
      priceRange: data.priceRange,
      isFeatured: false,
      isApproved: true, // Auto-approved for demo
      createdAt: Date.now(),
    };
    providersStore.push(newProvider);
    return newProvider;
  },

  login: async (email: string): Promise<User> => {
    const existing = userStore.find(u => u.email === email);
    if (existing) {
      currentUser = existing;
      return existing;
    }
    throw new Error("User not found");
  },

  getCurrentUser: () => currentUser,

  logout: async (): Promise<void> => {
    currentUser = null;
  }
};
