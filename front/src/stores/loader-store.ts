import { create } from 'zustand';

interface LoaderState {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  resetIsLoading: () => void;
}

export const useLoaderStore = create<LoaderState>((set) => ({
  isLoading: false,
  setIsLoading: (isLoading: boolean) => set({ isLoading: isLoading }),
  resetIsLoading: () => set({ isLoading: false }),
}));