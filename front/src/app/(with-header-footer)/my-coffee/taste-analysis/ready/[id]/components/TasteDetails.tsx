"use client";

import React from "react";
import { CoffeePreferences } from "@/types/coffee";

const ATTRIBUTE_KEYS: (keyof CoffeePreferences)[] = ["aroma", "acidity", "sweetness", "nutty", "body"];

const FALLBACK_LABELS: Record<string, string> = {
  aroma: "향",
  acidity: "산미",
  sweetness: "단맛",
  nutty: "고소함",
  body: "바디",
};

const FALLBACK_DESCRIPTIONS: Record<string, string> = {
  aroma: "풍부하고 매혹적인 향이 인상적입니다.",
  acidity: "산미가 거의 느껴지지 않고 부드럽습니다.",
  sweetness: "은은한 단맛이 혀끝에 맴돕니다.",
  nutty: "볶은 견과류 같은 깊은 고소함이 강조됩니다.",
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
    { key: "sweetness", color: "sweetness" },
    { key: "nutty", color: "nutty" },
    { key: "body", color: "body" },
  ] as const;

  return (
    <div className="space-y-2">
      {tasteItems.map(({ key, color }) => {
        const score = ratings[key as keyof CoffeePreferences] ?? 1;
        const label = labelByKey[key] ?? FALLBACK_LABELS[key];
        const description =
          descriptionByKeyScore[`${key}_${score}`] ?? FALLBACK_DESCRIPTIONS[key];

        return (
          <div
            key={key}
            className="bg-background-sub border border-line rounded-lg px-4 py-3"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-xs font-bold text-gray-0">{label}</h3>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((dot) => (
                  <div
                    key={dot}
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor:
                        dot <= score ? `var(--${color})` : "#E6E6E6",
                    }}
                  />
                ))}
              </div>
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
