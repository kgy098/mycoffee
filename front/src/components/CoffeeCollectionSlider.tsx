"use client";

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const CoffeeCollectionSlider: React.FC = ({data}: {data?: any}) => {
    const [activeSlide, setActiveSlide] = useState(0);

    const slides = data || [
        {
            id: 1,
            title: "이렇게 즐겨보세요.",
            icon: "🌱",
            content: [
                "원두는 중·굵게 분쇄해보세요. 너무 곱게 갈면 이 부드러운 하모니가 무겁게 눌려버립니다.",
                "핸드드립으로 내리면 꽃향기가 선명하게 피어나고, 프렌치프레스를 쓰면 고소하고 크리미한 바디감이 강조됩니다.",
                " 혹은 진한 풍미를 원한다면 에스프레소로 짧고 강렬하게 즐겨도 좋습니다."
            ]
        },
        {
            id: 2,
            title: "함께하면 좋은 순간",
            icon: "🍰",
            content: [
                "이 커피에는 치즈케이크 한 조각이 잘 어울립니다. 치즈의 크리미함이 커피의 바디와 맞물려 마치 두터운 오케스트라 선율처럼 감싸주거든요.",
                "혹은 호두 파이처럼 견과류가 들어간 디저트를 곁들이면, 커피 속 깊게 깔린 고소한 풍미가 더 살아납니다."
            ]
        },
        {
            id: 3,
            title: "오늘은 이런 음악과",
            icon: "🎶",
            content: [
                "잔잔히 흐르는 노라 존스(Norah Jones)의 목소리, 혹은 드뷔시의 Clair de Lune을 틀어두면 어떨까요?",
                "커피의 부드러운 크리미함과 음악의 서정성이 서로 겹치며, 평범한 오후를 특별한 순간으로 바꿔줍니다."
            ]
        },
        {
            id: 4,
            title: "영화와 함께라면",
            icon: "🎬",
            content: [
                "'한 잔의 커피와 함께라면, Before Sunrise 같은 영화가 잘 어울립니다. 대화 속에 잔잔히 흐르는 낭만이, 이 블렌드의 향기와 꼭 닮아 있으니까요.",
                "혹은 리틀 포레스트처럼 따뜻한 위로를 전하는 영화도 좋습니다. 커피 향처럼 은은하게 스며드는 치유의 시간이 될 거예요."
            ]
        }
    ];

    return (
        <div className="w-full relative">
            <Swiper
                modules={[Pagination]}
                spaceBetween={8}
                slidesPerView={1.35}
                pagination={false}
                onSlideChange={(swiper) => setActiveSlide(swiper.activeIndex)}
                className="w-full"
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div className="bg-white rounded-lg px-4 py-3 min-h-[174px] border border-border-default">
                            <div className="flex items-center gap-1 mb-2">
                                <span className="text-sm">{slide.icon}</span>
                                <h3 className="text-sm font-bold text-gray-0">{slide.title}</h3>
                            </div>

                            <div className="space-y-2 text-text-secondary">
                                {slide.content.map((item, index) => (
                                    <div key={index} className="flex items-start gap-2">
                                        <span className="text-xs leading-[100%]">•</span>
                                        <p className="text-[12px] font-normal flex-1 leading-[160%]">
                                            {item}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </SwiperSlide>
                 ))}
             </Swiper>
             
             {/* Custom pagination dots */}
             <div className="flex justify-center mt-3 gap-1 absolute bottom-4 z-[1] left-1/2 -translate-x-1/2">
                 {slides.map((_, index) => (
                     <div
                         key={index}
                         className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${index === activeSlide ? 'bg-action-primary w-10' : 'bg-action-disabled'
                             }`}
                     />
                 ))}
             </div>
        </div>
    );
};

export default CoffeeCollectionSlider;
