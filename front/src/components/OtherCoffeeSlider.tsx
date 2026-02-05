"use client";

import React, { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { CoffeePreferences } from "@/types/coffee";
import SpiderChart from "@/app/(content-only)/analysis/SpiderChart";

interface TasteRating {
    aroma: number;
    acidity: number;
    sweetness: number;
    nutty: number;
    body: number;
}


interface CoffeeBlend {
    name: string;
    description: string;
    hashtags: string[];
    ratings: TasteRating;
}

const OtherCoffeeSlider: React.FC = () => {

    const coffeeBlends: CoffeeBlend[] = [
        {
            name: "벨벳 터치 블렌드",
            description: "오늘, 깊고 깔끔한 맛을 가진, 마시기 편한 Deep Body Blend가 당신에게 딱 맞습니다.",
            hashtags: ["씁쓸 달콤", "고소한 맛"],
            ratings: {
                aroma: 4,
                acidity: 3,
                sweetness: 4,
                nutty: 5,
                body: 5
            }
        },
        {
            name: "벨벳 터치 블렌드",
            description: "깔끔한 마무리와 산뜻한 입안 감촉이 좋은 커피입니다.",
            hashtags: ["씁쓸 달콤", "고소한 맛"],
            ratings: {
                aroma: 5,
                acidity: 4,
                sweetness: 4,
                nutty: 3,
                body: 4
            }
        },
        {
            name: "벨벳 터치 블렌드 ",
            description: "깔끔한 마무리와 산뜻한 입안 감촉이 좋은 커피입니다.",
            hashtags: ["씁쓸 달콤", "고소한 맛"],
            ratings: {
                aroma: 5,
                acidity: 4,
                sweetness: 4,
                nutty: 3,
                body: 4
            }
        },
        {
            name: "벨벳 터치 블렌드 ",
            description: "깔끔한 마무리와 산뜻한 입안 감촉이 좋은 커피입니다.",
            hashtags: ["씁쓸 달콤", "고소한 맛", "밸런스"],
            ratings: {
                aroma: 5,
                acidity: 4,
                sweetness: 4,
                nutty: 3,
                body: 4
            }
        }
    ];

    return (
        <div className="w-full">
            <Swiper
                spaceBetween={8}
                slidesPerView={1.3}
                loop={true}
                className="coffee-collection-swiper"
            >
                {coffeeBlends.map((blend, index) => (
                    <SwiperSlide key={index}>
                        <div className="bg-background-sub rounded-lg p-3 border border-border-default text-gray-0">
                            <div className='mb-2'>
                                <h3 className="text-[14px] font-medium leading-[20px]">{blend.name}</h3>
                                {/* <div className="flex items-center gap-2">
                                    {
                                        blend.hashtags.map((hashtag, index) => (
                                            <span key={index} className="bg-[rgba(0,0,0,0.05)] px-2 py-0.5 rounded-full text-[10px] font-light text-gray-0 leading-[16px]">#{hashtag}</span>
                                        ))
                                    }
                                </div> */}
                            </div>
                            <SpiderChart
                                ratings={blend.ratings}
                                setRatings={() => { }}
                                isChangable={false}
                                isClickable={true}
                                size="small"
                                wrapperClassName="!mb-0"
                            />
                            <div className="flex justify-center gap-2 mt-3">
                                <button className='btn-primary w-full !py-1.5 leading-5 !text-sm font-bold'>
                                    주문하기
                                </button>
                                <button
                                    className="size-[32px] flex-shrink-0 border border-border-default rounded-lg flex items-center justify-center cursor-pointer"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="16" viewBox="0 0 19 16" fill="none">
                                        <path d="M0.833313 5.43005C0.83333 4.50271 1.11464 3.5972 1.64009 2.8331C2.16554 2.069 2.91041 1.48226 3.77632 1.15038C4.64223 0.818497 5.58844 0.757083 6.48999 0.97425C7.39154 1.19142 8.206 1.67695 8.82581 2.36671C8.86947 2.41339 8.92225 2.4506 8.98088 2.47605C9.03951 2.50149 9.10274 2.51462 9.16665 2.51462C9.23056 2.51462 9.29379 2.50149 9.35242 2.47605C9.41105 2.4506 9.46382 2.41339 9.50748 2.36671C10.1253 1.67246 10.94 1.18285 11.843 0.963048C12.746 0.743243 13.6946 0.803669 14.5624 1.13628C15.4302 1.4689 16.1761 2.05792 16.7009 2.82496C17.2257 3.59201 17.5044 4.50068 17.5 5.43005C17.5 7.33838 16.25 8.76338 15 10.0134L10.4233 14.4409C10.268 14.6192 10.0766 14.7625 9.86169 14.8611C9.64678 14.9598 9.41335 15.0116 9.17689 15.0131C8.94043 15.0146 8.70635 14.9657 8.49022 14.8698C8.27408 14.7739 8.08084 14.6331 7.92331 14.4567L3.33331 10.0134C2.08331 8.76338 0.833313 7.34671 0.833313 5.43005Z" stroke="#4E2A18" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default OtherCoffeeSlider;
