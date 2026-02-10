'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useRecommendationStore } from '@/stores/recommendation-store';
import { useGet } from '@/hooks/useApi';
import { api } from '@/lib/api';
import SpiderChart from '../analysis/SpiderChart';
import { CoffeePreferences } from '@/types/coffee';

/** 추천 API 응답 블렌드 */
type BlendRecommendation = {
  id: number;
  name: string;
  summary: string | null;
  similarity_score: number;
};
/** 추천 API 전체 응답 */
type RecommendationResponse = {
  recommendations: BlendRecommendation[];
};
/** 블렌드 원산지 API 응답 */
type BlendOriginItem = { origin: string; pct: number };

/** API 응답: 취향 항목별 점수·문구 */
export type ScoreScaleItem = {
  id: number;
  attribute_key: string;
  attribute_label: string | null;
  score: number;
  description: string | null;
};

/** 결과 화면 표시 순서 (DB attribute_key) */
const ATTRIBUTE_KEYS: (keyof CoffeePreferences)[] = ['aroma', 'acidity', 'sweetness', 'nutty', 'body'];

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
  const { data: scoreScales, isLoading: isLoadingScales } = useGet<ScoreScaleItem[]>(
    ['score-scales'],
    '/api/score-scales'
  );

  const hasPreferences = !!(
    preferences &&
    typeof preferences.aroma === 'number' &&
    typeof preferences.body === 'number'
  );

  const safePrefs = preferences ?? {
    aroma: 1,
    acidity: 1,
    sweetness: 1,
    nutty: 1,
    body: 1,
  };

  /** 사용자 취향 → blends 근사값 추천 (POST /api/recommendation) */
  const { data: recommendationData } = useQuery({
    queryKey: ['recommendation', safePrefs.aroma, safePrefs.acidity, safePrefs.sweetness, safePrefs.nutty, safePrefs.body],
    queryFn: async (): Promise<RecommendationResponse> => {
      const { data } = await api.post<RecommendationResponse>('/api/recommendation', {
        aroma: safePrefs.aroma,
        acidity: safePrefs.acidity,
        sweetness: safePrefs.sweetness,
        nutty: safePrefs.nutty,
        body: safePrefs.body,
        user_id: 0,
        save_analysis: 0,
      });
      return data;
    },
    enabled: hasPreferences,
  });

  const topBlend = recommendationData?.recommendations?.[0];

  /** 추천 1등 블렌드의 원산지 배합 (blend_origins) */
  const { data: originsData } = useGet<BlendOriginItem[]>(
    ['blend-origins', topBlend?.id ?? 0],
    `/api/blends/${topBlend?.id ?? 0}/origins`,
    undefined,
    { enabled: !!topBlend?.id }
  );

  /** 배합 문구 예: "케냐 51% 코스타리카 49%" */
  const originsText = useMemo(() => {
    if (!originsData?.length) return null;
    return originsData.map((o) => `${o.origin} ${o.pct}%`).join(' ');
  }, [originsData]);

  useEffect(() => {
    if (!hasPreferences) {
      router.replace('/analysis');
    }
  }, [hasPreferences, router]);

  /** (attribute_key, score) → description */
  const descriptionMap = useMemo(() => {
    const map = new Map<string, string>();
    if (!scoreScales?.length) return map;
    for (const row of scoreScales) {
      const key = `${row.attribute_key}_${row.score}`;
      if (row.description) map.set(key, row.description);
    }
    return map;
  }, [scoreScales]);

  /** attribute_key → 표시명 (attribute_label) */
  const labelMap = useMemo(() => {
    const map = new Map<string, string>();
    if (!scoreScales?.length) return map;
    for (const row of scoreScales) {
      if (!map.has(row.attribute_key) && row.attribute_label) {
        map.set(row.attribute_key, row.attribute_label);
      }
    }
    return map;
  }, [scoreScales]);

  if (!hasPreferences) {
    return null;
  }

  const fallbackLabels: Record<string, string> = {
    aroma: '향',
    acidity: '산미',
    sweetness: '단맛',
    nutty: '고소함',
    body: '바디',
  };

  return (
    <div className="min-h-[100dvh] bg-white flex flex-col">
      <div className="flex-1 px-4 pt-6 pb-8">
        {/* 추천 블렌드: blends 근사값 1등 + 배합·문구 (중앙 정렬) */}
        <div className="mb-6 text-center">
          <h1 className="text-lg font-bold text-text-primary mb-0.5">
            {topBlend?.name ?? '—'}
          </h1>
          {originsText && (
            <p className="text-xs text-text-secondary mb-1">
              ({originsText})
            </p>
          )}
          {topBlend?.summary && (
            <p className="text-sm text-text-secondary leading-relaxed">
              {topBlend.summary}
            </p>
          )}
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

        {/* 항목별 한 줄: 향 + 별점 + 문구 (DB score_scales 연동) */}
        <ul className="space-y-3 mb-10">
          {ATTRIBUTE_KEYS.map((key) => {
            const score = safePrefs[key];
            const label = labelMap.get(key) ?? fallbackLabels[key] ?? key;
            const description =
              descriptionMap.get(`${key}_${score}`) ??
              (isLoadingScales ? '…' : '');
            return (
              <li key={key} className="text-text-primary text-sm leading-relaxed">
                <span className="font-medium">{label}</span>
                {' '}
                <StarRating score={score} />
                {' '}
                {description && (
                  <span className="text-text-secondary">{description}</span>
                )}
              </li>
            );
          })}
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
