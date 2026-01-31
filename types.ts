
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

export interface Provider {
  id: string;
  userId: string;
  name: string;
  serviceCategory: ServiceCategory;
  location: string;
  description: string;
  priceRange?: string;
  whatsappNumber: string;
  images: string[];
  isFeatured: boolean;
  isApproved: boolean;
  createdAt: number;
}

export interface User {
  id: string;
  email: string;
  role: 'provider' | 'admin' | 'customer';
  displayName: string;
}

export interface AppState {
  providers: Provider[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}
