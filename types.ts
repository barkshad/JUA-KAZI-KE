
export enum ServiceCategory {
  PLUMBING = 'Plumbing',
  ELECTRICAL = 'Electrical',
  CLEANING = 'Cleaning',
  CONSTRUCTION = 'Construction/Fundi',
  TUTORING = 'Tutoring',
  PHOTOGRAPHY = 'Photography',
  MECHANIC = 'Mechanic',
  SALON = 'Salon/Barber',
  OTHER = 'Other'
}

export interface User {
  id: string;
  email: string;
  role: 'provider' | 'admin' | 'customer';
  fullName: string;
  phoneNumber: string; // SINGLE SOURCE OF TRUTH for WhatsApp and Calls
  isVerified: boolean;
  createdAt: number;
  password?: string; // For mock authentication
}

export interface Provider {
  id: string;
  userId: string; // Foreign key linking to User
  serviceCategory: ServiceCategory;
  location: string;
  description: string;
  priceRange?: string;
  images: string[];
  isFeatured: boolean;
  isApproved: boolean;
  createdAt: number;
  // UI Helper: Joined data
  user?: User; 
}

export interface AppState {
  providers: Provider[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}
