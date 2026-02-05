"use client";

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

interface TagsProps {
    activeTag: string;
    onTagChange: (tag: string) => void;
}

const Tags = ({ activeTag, onTagChange }: TagsProps) => {

    const tags = [
        { id: "전체", label: "전체" },
        { id: "주문접수", label: "주문접수" },
        { id: "배송준비", label: "배송 준비" },
        { id: "배송중", label: "배송중" },
        { id: "배송완료", label: "배송 완료" },
        { id: "취소", label: "취소" },
    ];

    return (
        <div className="pl-4 mt-3 mb-4">
            <Swiper
                spaceBetween={8}
                slidesPerView="auto"
                className="w-full h-auto"
            >
                {tags.map((tag) => (
                    <SwiperSlide key={tag.id} className="!w-auto">
                        <button
                            onClick={() => onTagChange(tag.id)}
                            className={`px-[9px] py-1 cursor-pointer rounded-sm text-sm leading-[142%] font-bold transition-all duration-200 whitespace-nowrap ${
                                activeTag === tag.id
                                    ? "bg-linear-gradient text-white border border-action-primary"
                                    : "bg-white text-action-primary border border-action-primary"
                            }`}
                        >
                            {tag.label}
                        </button>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};
export default Tags;