import { create } from 'zustand';

interface GlobalState {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useGlobalStore = create<GlobalState>((set) => ({
  theme: 'light',
  setTheme: (theme) => set({ theme }),
})); 