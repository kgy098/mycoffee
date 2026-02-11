"use client";

import React from "react";
import { CoffeePreferences } from "@/types/coffee";

/** 별 아이콘 (색상 유지, 채움/비움) */
const StarIcon = ({ filled, fillColor }: { filled: boolean; fillColor: string }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={fillColor} className="shrink-0">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

/** 화면 표시 순서: 향 → 산미 → 고소함 → 단맛 → 바디 */
const ATTRIBUTE_KEYS: (keyof CoffeePreferences)[] = ["aroma", "acidity", "nuttiness", "sweetness", "body"];

const FALLBACK_LABELS: Record<string, string> = {
  aroma: "향",
  acidity: "산미",
  sweetness: "단맛",
  nuttiness: "고소함",
  body: "바디",
};

const FALLBACK_DESCRIPTIONS: Record<string, string> = {
  aroma: "풍부하고 매혹적인 향이 인상적입니다.",
  acidity: "산미가 거의 느껴지지 않고 부드럽습니다.",
  sweetness: "은은한 단맛이 혀끝에 맴돕니다.",
  nuttiness: "볶은 견과류 같은 깊은 고소함이 강조됩니다.",
  body: "진하고 크리미한 바디감이 인상적입니다.",
};

interface TasteDetailsProps {
  ratings: CoffeePreferences;
  /** (attribute_key_score) → 설명 문구 (score_scales 테이블) */
  descriptionByKeyScore?: Record<string, string>;
  /** attribute_key → 표시명 (score_scales.attribute_label) */
  labelByKey?: Record<string, string>;
}

const TasteDetails: React.FC<TasteDetailsProps> = ({
  ratings,
  descriptionByKeyScore = {},
  labelByKey = {},
}) => {
  const tasteItems = [
    { key: "aroma", color: "aroma" },
    { key: "acidity", color: "acidity" },
    { key: "nuttiness", color: "nutty" },
    { key: "sweetness", color: "sweetness" },
    { key: "body", color: "body" },
  ] as const;

  return (
    <div className="space-y-2">
      {tasteItems.map(({ key, color }) => {
        const score = ratings[key as keyof CoffeePreferences] ?? 1;
        const label = labelByKey[key] ?? FALLBACK_LABELS[key];
        const description =
          descriptionByKeyScore[`${key}_${score}`] ?? FALLBACK_DESCRIPTIONS[key];

        const activeColor = `var(--${color})`;
        return (
          <div
            key={key}
            className="bg-background-sub border border-line rounded-lg px-4 py-3"
          >
            <h3 className="text-xs font-bold text-gray-0 mb-2">{label}</h3>
            <div className="flex items-center justify-between mb-2">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <StarIcon
                    key={n}
                    filled={n <= score}
                    fillColor={n <= score ? activeColor : "#E6E6E6"}
                  />
                ))}
              </div>
              <span className="text-xl font-bold text-gray-0 tabular-nums">{score}</span>
            </div>
            <p className="text-[12px] text-text-secondary leading-[160%]">
              {description}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default TasteDetails;
