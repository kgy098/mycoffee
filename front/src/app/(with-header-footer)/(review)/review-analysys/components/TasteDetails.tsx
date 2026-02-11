"use client";

import React from "react";

const StarIcon = ({ filled, fillColor }: { filled: boolean; fillColor: string }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={fillColor} className="shrink-0">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

interface TasteRating {
  aroma: number;
  sweetness: number;
  body: number;
  nuttiness: number;
  acidity: number;
}

interface TasteDetailsProps {
  ratings: TasteRating;
}

const TasteDetails: React.FC<TasteDetailsProps> = ({ ratings }) => {
  const tasteLabels = [
    { key: 'aroma', label: '향', color: 'aroma' },
    { key: 'acidity', label: '산미', color: 'acidity' },
    { key: 'nuttiness', label: '고소함', color: 'nutty' },
    { key: 'sweetness', label: '단맛', color: 'sweetness' },
    { key: 'body', label: '바디', color: 'body' }
  ];

  const tasteDescriptions = {
    aroma: '" 풍부하고 매혹적인 향이 인상적입니다. "',
    acidity: '" 산미가 거의 느껴지지 않고 부드럽습니다."',
    sweetness: '" 은은한 단맛이 혀끝에 맴돕니다. "',
    nuttiness: '" 볶은 견과류 같은 깊은 고소함이 강조됩니다. "',
    body: '" 진하고 크리미한 바디감이 인상적입니다. "'
  };

  return (
    <div className="space-y-2">
      {tasteLabels.map((taste) => {
        const score = ratings[taste.key as keyof TasteRating];
        const activeColor = `var(--${taste.color})`;
        return (
          <div key={taste.key} className="bg-background-sub border border-line rounded-lg px-4 py-3">
            <h3 className="text-xs font-bold text-gray-0 mb-2">{taste.label}</h3>
            <div className="flex items-center justify-between mb-2">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <StarIcon
                    key={n}
                    filled={n <= score}
                    fillColor={n <= score ? activeColor : '#E6E6E6'}
                  />
                ))}
              </div>
              <span className="text-xl font-bold text-gray-0 tabular-nums">{score}</span>
            </div>
            <p className="text-[12px] text-text-secondary leading-[160%]">
              {tasteDescriptions[taste.key as keyof typeof tasteDescriptions]}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default TasteDetails;
