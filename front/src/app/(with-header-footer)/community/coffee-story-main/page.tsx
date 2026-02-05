"use client";
import { useHeaderStore } from "@/stores/header-store";
import Link from "next/link";
import React, { useEffect } from "react";

const CoffeStoryMain = () => {
  const { setHeader } = useHeaderStore();

  useEffect(() => {
    setHeader({
      title: "커피스토리",
      showBackButton: false,
    });
  }, []);

  
  const coffeeStries = [
    {
      id: 1,
      product: "커피 스토리 1",
      image: "/images/ice-coffee.png",
      date: "2025-01-01",
      title: "커피 스토리 1",
      description:
        "오늘의 커피 이야기는 콜롬비아 수프리마입니다\n안데스 고지대에서 자라 풍부한 향과 부드러운 산미가 매력적이며, 오늘의 커피 이야기는 콜롬비아 수프리마입니다\n안데스 고지대에서 자라 풍부한 향과 부드러운 산미가 매력적이며,",
    },
    {
      id: 2,
      product: "커피 스토리 2",
      image: "/images/ice-coffee.png",
      date: "2025-01-01",
      title: "커피 스토리 2",
      description:
        "오늘의 커피 이야기는 콜롬비아 수프리마입니다\n안데스 고지대에서 자라 풍부한 향과 부드러운 산미가 매력적이며, 오늘의 커피 이야기는 콜롬비아 수프리마입니다\n안데스 고지대에서 자라 풍부한 향과 부드러운 산미가 매력적",
    },
  ];
  return (
    <div className="bg-background">
      <div className="px-4 space-y-4">
        {coffeeStries.map((story) => (
          <div
            key={story.id}
            className="bg-white rounded-lg p-3 border border-border-default"
          >
            {/* Review Image */}

            <div className="mb-3 rounded-lg overflow-hidden">
              <Link href={`/community/coffee-story-main/${story.id}`}>
                <img
                  src={story.image}
                  alt="Coffee review"
                  className="w-full h-90 max-h-[350px] object-cover rounded-lg"
                />
              </Link>
            </div>

            {/* Title*/}
            <Link
              href={`/community/coffee-story-main/${story.id}`}
              className="text-base font-bold inline-block leading-[20px] mb-1 cursor-pointer"
            >
              오늘의 커피 이야기: {story.title}
            </Link>
            {/* Date */}
            <p className="text-[12px] font-normal text-text-secondary mb-3">
              {story.date}
            </p>

            {/* Description */}
            <p className="text-xs leading-[20px]  line-clamp-2">
              {story.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoffeStoryMain;
