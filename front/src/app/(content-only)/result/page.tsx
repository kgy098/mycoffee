'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useRecommendationStore } from '@/stores/recommendation-store';
import SpiderChart from '../analysis/SpiderChart';
import { CoffeePreferences } from '@/types/coffee';

const ATTRIBUTES: Array<{
  key: keyof CoffeePreferences;
  label: string;
  description: string;
}> = [
  { key: 'aroma', label: '향', description: '풍부하고 매혹적인 향이 인상적입니다.' },
  { key: 'acidity', label: '산미', description: '상큼한 산미가 또렷하게 느껴집니다.' },
  { key: 'sweetness', label: '단맛', description: '입안 가득 자연스러운 단맛이 감돕니다.' },
  { key: 'nutty', label: '고소함', description: '볶은 견과류 같은 깊은 고소함이 강조됩니다.' },
  { key: 'body', label: '바디', description: '적당한 농도와 무게감이 있습니다.' },
];

function StarRating({ score }: { score: number }) {
  const full = Math.min(5, Math.max(0, Math.round(score)));
  return (
    <span className="text-accent text-base tracking-tight" aria-label={`${full}점`}>
      {'★'.repeat(full)}{'☆'.repeat(5 - full)}
    </span>
  );
}

export default function ResultPage() {
  const router = useRouter();
  const { preferences } = useRecommendationStore();

  const hasPreferences = !!(
    preferences &&
    typeof preferences.aroma === 'number' &&
    typeof preferences.body === 'number'
  );

  useEffect(() => {
    if (!hasPreferences) {
      router.replace('/analysis');
    }
  }, [hasPreferences, router]);

  if (!hasPreferences) {
    return null;
  }

  const safePrefs = preferences ?? {
    aroma: 1,
    acidity: 1,
    sweetness: 1,
    nutty: 1,
    body: 1,
  };

  return (
    <div className="min-h-[100dvh] bg-white flex flex-col">
      <div className="flex-1 px-4 pt-6 pb-8">
        {/* 추천 블렌드 (화면설계 [01-02] 기준) */}
        <div className="mb-6">
          <h1 className="text-lg font-bold text-text-primary mb-0.5">
            벨벳 터치 블렌드
          </h1>
          <p className="text-xs text-text-secondary mb-1">
            (케냐 51% 코스타리카 49%)
          </p>
          <p className="text-sm text-text-secondary leading-relaxed">
            깔끔한 마무리와 산뜻한 입안 감촉이 좋은 커피입니다.
          </p>
        </div>

        {/* 레이더 차트 */}
        <div className="flex justify-center mb-8">
          <SpiderChart
            ratings={safePrefs}
            setRatings={() => {}}
            isChangable={false}
            isClickable={false}
            size="large"
          />
        </div>

        {/* 항목별 한 줄: 향 + 별점 + 문구 */}
        <ul className="space-y-3 mb-10">
          {ATTRIBUTES.map(({ key, label, description }) => (
            <li key={key} className="text-text-primary text-sm leading-relaxed">
              <span className="font-medium">{label}</span>
              {' '}
              <StarRating score={safePrefs[key]} />
              {' '}
              <span className="text-text-secondary">{description}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="space-y-3">
          <p className="text-center text-text-primary text-sm font-medium leading-relaxed">
            나만의 맞춤 커피 추천, 지금 회원가입하고 시작하세요!
          </p>
          <Link
            href="/auth/login-select"
            className="btn-primary w-full text-center block"
          >
            회원가입하기
          </Link>
          <Link
            href="/home"
            className="block w-full text-center text-sm text-text-secondary underline underline-offset-2 py-2"
          >
            둘러보고 나중에 할래요.
          </Link>
        </div>
      </div>
    </div>
  );
}
