"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const MonthlyCoffeePage = () => {
  const tasteRatings = {
    aroma: 3,
    acidity: 4,
    sweetness: 4,
    nutty: 5,
    body: 3
  };

  const tasteLabels = [
    { key: 'aroma', label: '향', color: 'aroma' },
    { key: 'acidity', label: '단맛', color: 'acidity' },
    { key: 'sweetness', label: '바디', color: 'sweetness' },
    { key: 'nutty', label: '고소함', color: 'nutty' },
    { key: 'body', label: '산미', color: 'body' }
  ];

  return (
    <div>
      <div className="px-4 pt-6">
        <div className="bg-white rounded-2xl p-3 border border-border-default mb-2 overflow-y-auto h-[calc(100vh-288px)]">
          <div className="max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="">
              <h1 className="text-[14px] font-medium text-gray-0 mb-0.5">📌 이달의 추천 커피 : 스무스 터치 블렌드</h1>
              <p className="text-[12px] text-text-secondary font-normal">오늘 이 커피를 추천하는 이유, 직접 전해드립니다.</p>
            </div>

            {/* Coffee Profile Section */}
            <div className="grid grid-cols-2 gap-2 items-center">
              {/* Left Side - Taste Attributes */}
              <div className="space-y-1 xs:pr-10 pr-5">
                {tasteLabels.map((taste) => (
                  <div key={taste.key} className="flex items-center justify-between">
                    <span className="text-[12px] font-normal text-gray-0 leading-[160%]">{taste.label}</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((dot) => (
                        <div
                          key={dot}
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: dot <= tasteRatings[taste.key as keyof typeof tasteRatings]
                              ? `var(--${taste.color})`
                              : '#E6E6E6'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Side - Radar Chart */}
              <div className="flex justify-center">
                <svg
                  className="w-48 h-48"
                  viewBox="0 0 200 200"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {/* Gradient definition */}
                  <defs>
                    <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="rgba(255, 255, 255, 0.20)" />
                      <stop offset="35.51%" stopColor="rgba(255, 224, 173, 0.20)" />
                      <stop offset="81.76%" stopColor="rgba(255, 131, 54, 0.20)" />
                      <stop offset="102.66%" stopColor="rgba(255, 117, 32, 0.20)" />
                      <stop offset="114.74%" stopColor="rgba(255, 113, 26, 0.20)" />
                    </linearGradient>
                  </defs>

                  {/* Grid - Concentric pentagons with dashed lines */}
                  {[1, 2, 3, 4, 5].map((level) => {
                    const centerX = 100;
                    const centerY = 100;
                    const maxRadius = 70;
                    const radius = (level / 5) * maxRadius;

                    let pentagonPath = '';
                    for (let i = 0; i < 5; i++) {
                      const angle = (i * 72 - 90) * (Math.PI / 180);
                      const x = centerX + radius * Math.cos(angle);
                      const y = centerY + radius * Math.sin(angle);

                      if (i === 0) {
                        pentagonPath += `M ${x} ${y} `;
                      } else {
                        pentagonPath += `L ${x} ${y} `;
                      }
                    }
                    pentagonPath += 'Z';

                    return (
                      <path
                        key={level}
                        d={pentagonPath}
                        fill="none"
                        stroke="#B3B3B3"
                        strokeWidth="1"
                        strokeDasharray="2,2"
                        opacity="0.8"
                      />
                    );
                  })}

                  {/* Radial lines */}
                  {[0, 1, 2, 3, 4].map((i) => {
                    const centerX = 100;
                    const centerY = 100;
                    const maxRadius = 70;
                    const angle = (i * 72 - 90) * (Math.PI / 180);
                    const x = centerX + maxRadius * Math.cos(angle);
                    const y = centerY + maxRadius * Math.sin(angle);

                    return (
                      <line
                        key={i}
                        x1={centerX}
                        y1={centerY}
                        x2={x}
                        y2={y}
                        stroke="#B3B3B3"
                        strokeWidth="1"
                        strokeDasharray="2,2"
                        opacity="0.8"
                      />
                    );
                  })}

                  {/* Filled area with gradient */}
                  <path
                    d={(() => {
                      const centerX = 100;
                      const centerY = 100;
                      const maxRadius = 70;
                      let path = '';

                      tasteLabels.forEach((taste, index) => {
                        const angle = (index * 72 - 90) * (Math.PI / 180);
                        const currentRadius = (tasteRatings[taste.key as keyof typeof tasteRatings] / 5) * maxRadius;
                        const x = centerX + currentRadius * Math.cos(angle);
                        const y = centerY + currentRadius * Math.sin(angle);

                        if (index === 0) {
                          path += `M ${x} ${y} `;
                        } else {
                          path += `L ${x} ${y} `;
                        }
                      });
                      path += 'Z';
                      return path;
                    })()}
                    fill="url(#chartGradient)"
                    stroke="#FF7927"
                    strokeWidth="0.715"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Rounded corner circles at connection points */}
                  {tasteLabels.map((taste, index) => {
                    const centerX = 100;
                    const centerY = 100;
                    const maxRadius = 70;
                    const angle = (index * 72 - 90) * (Math.PI / 180);
                    const currentRadius = (tasteRatings[taste.key as keyof typeof tasteRatings] / 5) * maxRadius;
                    const pointX = centerX + currentRadius * Math.cos(angle);
                    const pointY = centerY + currentRadius * Math.sin(angle);

                    return (
                      <circle
                        key={`connection-${taste.key}`}
                        cx={pointX}
                        cy={pointY}
                        r="1.556"
                        fill="#FF7927"
                        width="3.112"
                        height="3.439"
                      />
                    );
                  })}

                  {/* Labels */}
                  {tasteLabels.map((taste, index) => {
                    const angle = (index * 72 - 90) * (Math.PI / 180);
                    const labelRadius = 85;
                    const labelX = 100 + labelRadius * Math.cos(angle);
                    const labelY = 100 + labelRadius * Math.sin(angle);

                    return (
                      <text
                        key={taste.key}
                        x={labelX}
                        y={labelY}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-[12px] font-normal fill-gray-0"
                      >
                        {taste.label}
                      </text>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Recommendation Quote */}
            <div className="bg-[#DAF6E0] rounded-lg px-4 py-3 mb-4 text-center border border-[#22C55E]">
              <p className="text-xs text-[#22C55E] font-normal leading-[150%]">
                "오늘은 부담 없이 즐기기 좋은, 깊이 있으면서도 깔끔한 딥 바디 블렌드가 잘 어울려요."
              </p>
            </div>

            {/* Description */}
            <div className="space-y-4 mb-4">
              <p className="text-gray-0 leading-[160%] text-[12px] font-normal">
                스무스 터치 블렌드는 브라질의 부드러움, 에티오피아의 산뜻한 산미, 과테말라의 은은한 고소함이 조화를 이루고 있습니다.
              </p>
              <p className="text-gray-0 leading-[160%] text-[12px] font-normal">
                특히 바디감이 무겁지 않아 아침이나 점심, 부담 없이 즐기기에 제격이죠.
              </p>
              <p className="text-gray-0 leading-[160%] text-[12px] font-normal">
                은은한 향과 부드러운 산미가 하루의 리듬을 깨우면서도 편안하게 이어줍니다.오늘 같은 날, 가볍게 시작하고 싶은 당신께 이 커피를 추천합니다.
              </p>
            </div>

            {/* Coffee Image */}
            <div className="mb-4">
              <Image src="/images/monthly-coffee-img.png" alt="Monthly Coffee" width={337} height={400} className="w-full h-[400px]" />
            </div>

            {/* Footer */}
            <div className="text-right">
              <p className="text-[12px] text-text-secondary font-normal">- 김OO 연구원 -</p>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 py-2 bg-white" style={{ boxShadow: "0 -1px 2px 0 rgba(0,0,0,0.04)",  }}>
        <Link href="/my-coffee/monthly-coffee/detail" className="block btn-primary text-center">
          커피 취향 분석 보기
        </Link>
      </div>
    </div>
  );
};

export default MonthlyCoffeePage;