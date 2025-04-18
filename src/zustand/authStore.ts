// store/authStore.ts
import { create } from 'zustand';

interface AuthState {
  email: string;
  username: string;
  isLoading: boolean;
  otp: string;
  setEmail: (email: string) => void;
  setUsername: (username: string) => void;
  setOtp: (otp: string) => void;
  setLoading: (isLoading: boolean) => void;
  resetAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  email: '',
  username: '',
  otp: '',
  isLoading: false,

  setEmail: (email) => set({ email }),
  setUsername: (username) => set({ username }),
  setOtp: (otp) => set({ otp }),
  setLoading: (isLoading) => set({ isLoading }),

  resetAuth: () => set({ email: '', username: '', otp: '', isLoading: false }),
}));
