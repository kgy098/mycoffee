'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useQryMutation } from '@/hooks/useApi';
import { CoffeeData } from '@/types/coffee';
import { useRecommendationStore } from '@/stores/recommendation-store';
import SpiderChart from './SpiderChart';
import { api } from '@/lib/api';

type GetRecommendationsParams = {
  aroma: number;
  acidity: number;
  nutty: number;
  body: number;
  sweetness: number;
  userId: number;
  saveAnalysis: number;
};

export default function AnalysisPage() {

  const router = useRouter();
  const [ratings, setRatings] = useState({
    aroma: 1,
    acidity: 1,
    sweetness: 1,
    nutty: 1,
    body: 1,
  });
  const [userId] = useState(0);
  const { setPreferences, setRecommendations } = useRecommendationStore();

  const { mutate: saveTasteHistory, isPending: isSavingTasteHistory } = useQryMutation<any, any>({
    mutationFn: async (data) => {
      const response = await api.post("/api/taste-histories/", data);
      return response.data;
    },
    options: {
      onSuccess: () => {
        // After saving taste history, get recommendations
        getRecommendations({
          aroma: ratings.aroma,
          acidity: ratings.acidity,
          nutty: ratings.nutty,
          body: ratings.body,
          sweetness: ratings.sweetness,
          userId: userId,
          saveAnalysis: 0,
        });
      },
    },
  });

  const { mutate: getRecommendations, isPending: isGettingRecommendations } = useQryMutation<CoffeeData, GetRecommendationsParams>({
    mutationFn: async (data: GetRecommendationsParams) => {
      const response = await api.get<CoffeeData>("/mycoffee/blend/top5", { params: data });
      return response.data;
    },
    options: {
      onSuccess: (data) => {
        setRecommendations(data?.reco_list);
        router.push('/result');
      },
    },
  });

  // Handle form submission
  const handleSubmitAnalysis = useCallback(() => {
    // First, save taste history to backend
    saveTasteHistory({
      acidity: ratings.acidity,
      sweetness: ratings.sweetness,
      body: ratings.body,
      nuttiness: ratings.nutty,
      bitterness: ratings.aroma,
      anonymous_id: `session_${Date.now()}`,
    });
  }, [ratings, userId, saveTasteHistory, getRecommendations]);

  return (
    <>
      <div className="h-[100dvh] flex-1 flex flex-col justify-center items-center px-4 pb-10">
        <div className="my-auto">
          <div className="w-full sm:mx-auto px-4 py-4">
            <Image
              src="/images/logo.svg"
              alt="My Coffee.Ai"
              className="w-[220px] h-[32px] mx-auto"
              width={220}
              height={32}
            />
            <p className="text-text-secondary text-center mt-3 text-[14px] leading-[20px]">
              나만의 커피 취향을 찾아볼까요?
            </p>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center px-6 pb-8 sm:mx-auto">
            <SpiderChart
              ratings={ratings}
              setRatings={setRatings}
              size='large'
            />
          </div>
        </div>
        <button
          onClick={handleSubmitAnalysis}
          disabled={isGettingRecommendations || isSavingTasteHistory}
          className="btn-primary w-full text-center block disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSavingTasteHistory ? '취향 저장 중...' : isGettingRecommendations ? '취향 분석 중...' : '취향 분석 시작'}
        </button>
      </div>
    </>
  );
}
