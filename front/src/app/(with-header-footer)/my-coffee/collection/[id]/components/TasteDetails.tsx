"use client";

import React from "react";

interface TasteRating {
  aroma: number;
  sweetness: number;
  body: number;
  nutty: number;
  acidity: number;
}

interface TasteDetailsProps {
  ratings: TasteRating;
}

const TasteDetails: React.FC<TasteDetailsProps> = ({ ratings }) => {
  const tasteLabels = [
    { key: 'aroma', label: '향', color: 'aroma' },
    { key: 'acidity', label: '산미', color: 'acidity' },
    { key: 'sweetness', label: '단맛', color: 'sweetness' },
    { key: 'nutty', label: '고소함', color: 'nutty' },
    { key: 'body', label: '바디', color: 'body' }
  ];

  const tasteDescriptions = {
    aroma: '“ 풍부하고 매혹적인 향이 인상적입니다. ”',
    acidity: '“ 산미가 거의 느껴지지 않고 부드럽습니다.”',
    sweetness: '“ 은은한 단맛이 혀끝에 맴돕니다. ”',
    nutty: '“ 볶은 견과류 같은 깊은 고소함이 강조됩니다. ”',
    body: '“ 진하고 크리미한 바디감이 인상적입니다. ”'
  };

  return (
    <div className="space-y-2">
      {tasteLabels.map((taste) => (
        <div key={taste.key} className="bg-background-sub border border-line rounded-lg px-4 py-3">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xs font-bold text-gray-0">{taste.label}</h3>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((dot) => (
                <div
                  key={dot}
                  className={`w-2 h-2 rounded-full`}
                  style={{
                    backgroundColor: dot <= ratings[taste.key as keyof TasteRating]
                      ? `var(--${taste.color})`
                      : '#E6E6E6'
                  }}
                />
              ))}
            </div>
          </div>
          <p className="text-[12px] text-text-secondary leading-[160%]">
            {tasteDescriptions[taste.key as keyof typeof tasteDescriptions]}
          </p>
        </div>
      ))}
    </div>
  );
};

export default TasteDetails;
