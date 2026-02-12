"use client";

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

interface StorySection {
    title: string;
    icon: string;
    content: string[];
}

const CoffeeCollectionSlider: React.FC<{ data?: StorySection[] }> = ({ data }) => {
    const [activeSlide, setActiveSlide] = useState(0);

    const slides = data && data.length > 0 ? data : [];

    if (slides.length === 0) {
        return (
            <div className="bg-white rounded-lg px-4 py-4 border border-border-default">
                <p className="text-xs text-text-secondary">추천 스토리가 없습니다.</p>
            </div>
        );
    }

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
                {slides.map((slide, index) => (
                    <SwiperSlide key={index}>
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
