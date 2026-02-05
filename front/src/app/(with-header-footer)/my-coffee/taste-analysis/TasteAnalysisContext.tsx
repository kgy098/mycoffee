"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CoffeeRecommendation {
  id: number;
  name: string;
  summary: string | null;
  price: number | null;
  thumbnail_url: string | null;
  acidity: number;
  sweetness: number;
  body: number;
  nuttiness: number;
  bitterness: number;
  similarity_score: number;
}

interface TasteAnalysisContextType {
  recommendations: CoffeeRecommendation[];
  setRecommendations: (recommendations: CoffeeRecommendation[]) => void;
  clearRecommendations: () => void;
}

const TasteAnalysisContext = createContext<TasteAnalysisContextType | undefined>(undefined);

export function TasteAnalysisProvider({ children }: { children: ReactNode }) {
  const [recommendations, setRecommendations] = useState<CoffeeRecommendation[]>([]);

  const clearRecommendations = () => {
    setRecommendations([]);
  };

  return (
    <TasteAnalysisContext.Provider
      value={{
        recommendations,
        setRecommendations,
        clearRecommendations,
      }}
    >
      {children}
    </TasteAnalysisContext.Provider>
  );
}

export function useTasteAnalysis() {
  const context = useContext(TasteAnalysisContext);
  
  if (context === undefined) {
    throw new Error('useTasteAnalysis must be used within a TasteAnalysisProvider');
  }
  
  return context;
}

