
import { Provider, User, ServiceCategory } from '../types';
import { MOCK_PROVIDERS, MOCK_USERS } from '../constants';

// Simulated database state
let providersStore: Provider[] = [...MOCK_PROVIDERS];
let userStore: User[] = [...MOCK_USERS];
let currentUser: User | null = null;

export const firebaseService = {
  getProviders: async (): Promise<Provider[]> => {
    return new Promise((res) => {
      setTimeout(() => {
        // Source of Truth: Join provider listings with latest account contact data
        const joined = providersStore.map(p => ({
          ...p,
          user: userStore.find(u => u.id === p.userId)
        }));
        res(joined);
      }, 300);
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

  getProviderByUserId: async (userId: string): Promise<Provider | undefined> => {
    return providersStore.find(p => p.userId === userId);
  },

  createAccount: async (data: { fullName: string; phoneNumber: string; email: string, password?: string }): Promise<User> => {
    const newUser: User = {
      id: 'u-' + Math.random().toString(36).substr(2, 9),
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      email: data.email,
      password: data.password || 'password123',
      role: 'provider',
      isVerified: false,
      createdAt: Date.now()
    };
    userStore.push(newUser);
    currentUser = newUser;
    return newUser;
  },

  updateUserAccount: async (userId: string, updates: Partial<User>): Promise<User> => {
    const index = userStore.findIndex(u => u.id === userId);
    if (index === -1) throw new Error("Account not found");
    
    userStore[index] = { ...userStore[index], ...updates };
    if (currentUser?.id === userId) {
      currentUser = userStore[index];
    }
    return userStore[index];
  },

  createProviderProfile: async (data: Partial<Provider>): Promise<Provider> => {
    if (!currentUser) throw new Error("Not logged in");
    
    const newProvider: Provider = {
      id: 'p-' + Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
      serviceCategory: data.serviceCategory || ServiceCategory.OTHER,
      location: data.location || 'Nairobi',
      description: data.description || '',
      images: data.images || [`https://picsum.photos/seed/${Math.random()}/800/800`],
      priceRange: data.priceRange || 'Contact for quote',
      isFeatured: false,
      isApproved: false, // NEW PROFILES START AS PENDING
      createdAt: Date.now(),
    };
    providersStore.push(newProvider);
    return newProvider;
  },

  updateProviderProfile: async (id: string, updates: Partial<Provider>): Promise<Provider> => {
    const index = providersStore.findIndex(p => p.id === id);
    if (index === -1) throw new Error("Profile not found");
    providersStore[index] = { ...providersStore[index], ...updates };
    return providersStore[index];
  },

  login: async (email: string): Promise<User> => {
    const existing = userStore.find(u => u.email === email);
    if (existing) {
      currentUser = existing;
      return existing;
    }
    throw new Error("Invalid credentials");
  },

  getCurrentUser: () => currentUser,

  logout: async (): Promise<void> => {
    currentUser = null;
  }
};
