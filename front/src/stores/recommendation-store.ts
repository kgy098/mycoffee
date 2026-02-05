import { CoffeePreferences, CoffeeData } from '@/types/coffee'
import { create } from 'zustand'

interface RecommendationState {
  preferences: CoffeePreferences;
  recommendations: CoffeeData[];
  setPreferences: (preferences: CoffeePreferences) => void;
  setRecommendations: (recommendations: CoffeeData[]) => void;
}

export const useRecommendationStore = create<RecommendationState>((set) => ({
  preferences: {
    aroma: 1,
    acidity: 1,
    nutty: 1,
    body: 1,
    sweetness: 1,
  },
  recommendations: [],
  setRecommendations: (recommendations: CoffeeData[]) => set({ recommendations }),
  setPreferences: (preferences: CoffeePreferences) => set({ preferences }),
}))