import { create } from 'zustand';

interface Farmer {
  id: string;
  phone: string;
  name: string;
  language: 'en' | 'hi';
  createdAt: string;
}

interface AuthState {
  isAuthenticated: boolean;
  farmer: Farmer | null;
  token: string | null;
  login: (farmer: Farmer, token: string) => void;
  logout: () => void;
  updateFarmer: (updates: Partial<Farmer>) => void;
}

// Create store with error handling
let authStore: any = null;

try {
  authStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    farmer: null,
    token: null,
    login: (farmer, token) => set({ isAuthenticated: true, farmer, token }),
    logout: () => set({ isAuthenticated: false, farmer: null, token: null }),
    updateFarmer: (updates) =>
      set((state) => ({
        farmer: state.farmer ? { ...state.farmer, ...updates } : null,
      })),
  }));
} catch (error) {
  console.warn('Failed to create auth store:', error);
  // Fallback store
  authStore = create<AuthState>(() => ({
    isAuthenticated: false,
    farmer: null,
    token: null,
    login: () => {},
    logout: () => {},
    updateFarmer: () => {},
  }));
}

export const useAuthStore = authStore;

