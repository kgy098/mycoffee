'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRecommendationStore } from '@/stores/recommendation-store';
import SpiderChart from './SpiderChart';

export default function AnalysisPage() {

  const router = useRouter();
  const [ratings, setRatings] = useState({
    aroma: 1,
    acidity: 1,
    sweetness: 1,
    nutty: 1,
    body: 1,
  });
  const { setPreferences } = useRecommendationStore();

  /** 결과 페이지로 이동. analysis_results 저장은 /result에서 POST /api/recommendation (save_analysis:1)로 한 번만 수행 (blend_id, score 포함) */
  const handleSubmitAnalysis = useCallback(() => {
    setPreferences(ratings);
    router.push('/result');
  }, [ratings, setPreferences, router]);

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
          className="btn-primary w-full text-center block"
        >
          취향 분석 시작
        </button>
      </div>
    </>
  );
}
