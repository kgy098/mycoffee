'use client';

import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import Link from 'next/link';
import Image from 'next/image';
import { useGet } from '@/hooks/useApi';

// Import Swiper styles
import 'swiper/css';

interface CoffeePick {
    id: number;
    name: string;
    subtitle: string;
    description: string;
    description2: string;
    hashtags: string[];
    imageUrl?: string | null;
}

const TodaysCoffeePick = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const { data: monthlyCoffees } = useGet<any[]>(
        ["home-monthly-coffees"],
        "/api/monthly-coffees/current",
        { params: { visible_only: true } }
    );

    const coffeePicks: CoffeePick[] = (monthlyCoffees || []).map((item) => ({
        id: item.id,
        name: "오늘의 커피 Pick!",
        subtitle: item.blend_name || "이달의 커피",
        description: item.comment || "",
        description2: item.desc || item.blend_summary || "",
        hashtags: [],
        imageUrl: item.banner_url || item.blend_thumbnail_url || null,
    }));

    return (
        <div className="pb-4 bg-background-sub mb-3">
            {coffeePicks.length === 0 ? (
                <div className="bg-primary rounded-lg px-[22px] pt-[23.5px] pb-[24.5px] text-[#FCFCFC]">
                    <p className="text-sm font-normal text-accent mb-1 leading-[20px]">오늘의 커피</p>
                    <p className="text-[20px] font-bold leading-[28px]">추천 커피가 없습니다.</p>
                </div>
            ) : (
                <Swiper
                    spaceBetween={0}
                    slidesPerView={1}
                    onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex)}
                    className="todays-coffee-swiper"
                >
                    {coffeePicks.map((pick) => (
                        <SwiperSlide key={pick.id} className="relative">
                            <div className="bg-primary rounded-lg px-[22px] pt-[23.5px] pb-[24.5px] overflow-hidden text-[#FCFCFC]">
                                <div className="relative z-10 flex items-center gap-6">
                                    <div className="flex-1">
                                        <h2 className="text-sm font-normal text-accent mb-1 leading-[20px]">{pick.name}</h2>
                                        <p className="text-[20px] mb-[22px] font-bold leading-[28px]">
                                            {pick.subtitle}
                                        </p>
                                        <div className="flex gap-1 mb-1.5">
                                            {pick.hashtags.map((tag, idx) => (
                                                <span
                                                    key={idx}
                                                    className="text-[12px] font-normal leading-[16px]"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <p className="text-xs font-normal leading-[18px] mb-0">
                                            {pick.description}
                                        </p>
                                        <p className="text-xs font-normal leading-[18px]">
                                            {pick.description2}
                                        </p>
                                    </div>
                                </div>
                                <div className="absolute right-0 bottom-0 top-0 w-full h-full">
                                    <Image
                                        src={pick.imageUrl || "/images/coffee.png"}
                                        alt="Coffee"
                                        width={400}
                                        height={180}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                            </div>
                        </SwiperSlide>
                    ))}
                    <div className="absolute top-3 right-2.5 z-20 bg-gray-0 w-10 h-5 rounded-[15px] flex items-center justify-center">
                        <span className="text-[12px] font-bold text-white">
                            {String(currentSlide + 1).padStart(2, '0')}<span className="text-[#BEBEBE]">/{String(coffeePicks.length).padStart(2, '0')}</span>
                        </span>
                    </div>
                </Swiper>
            )}

            {/* CTA Button - Swiper tashqarisida */}
            <div className="mt-3 px-4">
                <Link href="/analysis" className="btn-primary w-full text-center flex items-center justify-between !text-base !p-3 !pl-5">
                    <span>지금 내 커피 취향을 찾아보세요!</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M6 12L10 8L6 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </Link>
            </div>
        </div>
    );
};

export default TodaysCoffeePick;
