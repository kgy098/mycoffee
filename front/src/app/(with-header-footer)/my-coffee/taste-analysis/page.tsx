"use client";

import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import CoffeeBrewingAnimation from "./CoffeeBrewingAnimation";
import Link from "next/link";
import SpiderChart from "@/components/SpiderChart";
import { CoffeePreferences } from "@/types/coffee";
import { usePost } from "@/hooks/useApi";
import { useRecommendationStore } from "@/stores/recommendation-store";
import { useUserStore } from "@/stores/user-store";
import { useTasteAnalysis } from "./TasteAnalysisContext";

const TasteAnalysisPage = () => {
  const [showBrewingAnimation, setShowBrewingAnimation] = useState(false);
  const router = useRouter();
  const { user } = useUserStore();
  const { setRecommendations } = useTasteAnalysis();
  const [ratings, setRatings] = useState<CoffeePreferences>({
    aroma: 1,
    sweetness: 1,
    body: 1,
    nutty: 1,
    acidity: 1,
  });
  const { setPreferences } = useRecommendationStore();


  const handleStartAnalysis = () => {
    handleSubmitAnalysis();
    setShowBrewingAnimation(true);
  };

  const handleAnimationComplete = () => {
    setShowBrewingAnimation(false);
    // Navigate to ready page using Next.js router
    router.push('/my-coffee/taste-analysis/ready');
  };


  const { mutate: getRecommendations, isPending: isGettingRecommendations } = usePost(
    '/api/recommendation',
    {
      onSuccess: (data) => {
        console.log('API Response:', data);
        console.log('Full data structure:', JSON.stringify(data, null, 2));
        
        // data 또는 data.data 중 어디에 preferences가 있는지 확인
        const responseData = data?.data || data;
        
        if (responseData?.preferences) {
          console.log('Setting preferences:', responseData.preferences);
          setPreferences(responseData.preferences);
        }
        // Save recommendations to context
        if (responseData?.recommendations) {
          console.log('Setting recommendations:', responseData.recommendations);
          setRecommendations(responseData.recommendations);
        } else {
          console.log('No recommendations in response. Response data:', responseData);
        }
      },
      onError: (error) => {
        console.error('API Error:', error);
      },
    }
  );

  // Handle form submission
  const handleSubmitAnalysis = useCallback(() => {
    getRecommendations({
      aroma: ratings.aroma,
      sweetness: ratings.sweetness,
      body: ratings.body,
      nutty: ratings.nutty,
      acidity: ratings.acidity,
      user_id: user?.data?.user_id,
      save_analysis: 1,
    });
  }, [ratings, user, getRecommendations]);


  if (showBrewingAnimation) {
    return <CoffeeBrewingAnimation onComplete={handleAnimationComplete} isGettingRecommendations={isGettingRecommendations} />;
  }

  return (
    <div className="px-4 pt-[36px] pb-6 h-[calc(100dvh-206px)] flex flex-col">
      {/* Main Prompt */}
      <div className="text-center mb-6">
        <h1 className="text-[20px] font-bold text-gray-0 leading-[28px]">나만의 커피 취향을 찾아볼까요?</h1>
      </div>

      {/* Radar Chart */}
      <div className="flex justify-center mb-1 overflow-y-auto">
        <SpiderChart ratings={ratings} setRatings={setRatings} />
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 mt-4">
        <button
          onClick={handleStartAnalysis}
          className="block w-full btn-primary text-center"
        >
          취향 분석 시작
        </button>

        <Link href={'/my-coffee/taste-analysis/ready'} className="block w-full rounded-lg font-bold !py-2.5 border-1 border-[#4E2A18] text-[#4E2A18] text-center">
          지난 커피 분석 보기
        </Link>
      </div>
    </div>
  );
};

export default TasteAnalysisPage;
