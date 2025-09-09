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

// Temporary simple store without persist to avoid initialization issues
export const useAuthStore = create<AuthState>((set) => ({
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

