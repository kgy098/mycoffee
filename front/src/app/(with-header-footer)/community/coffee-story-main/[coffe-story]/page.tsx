"use client";
import { useHeaderStore } from "@/stores/header-store";
import React, { useEffect } from "react";

const CoffeeStoryDetail = () => {

  const { setHeader } = useHeaderStore();

  useEffect(() => {
    setHeader({
      title: "커피스토리",
      showBackButton: true,
    });
  }, []);
  const coffeeStory = {
    id: 1,
    product: "커피 스토리 1",
    image: "/images/ice-coffee.png",
    date: "2025-01-01",
    title: "커피 스토리 1",
    description:
      "오늘의 커피 이야기는 콜롬비아 수프리마입니다\n안데스 고지대에서 자라 풍부한 향과 부드러운 산미가 매력적이며, 오늘의 커피 이야기는 콜롬비아 수프리마입니다\n안데스 고지대에서 자라 풍부한 향과 부드러운 산미가 매력적이며, 오늘의 커피 이야기는 콜롬비아 수프리마입니다\n안데스 고지대에서 자라 풍부한 향과 부드러운 산미가 매력적이며,  오늘의 커피 이야기는 콜롬비아 수프리마입니다\n안데스 고지대에서 자라 풍부한 향과 부드러운 산미가 매력적이며, 오늘의 커피 이야기는 콜롬비아 수프리마입니다\n안데스 고지대에서 자라 풍부한 향과 부드러운 산미가 매력적이며, 오늘의 커피 이야기는 콜롬비아 수프리마입니다\n안데스 고지대에서 자라 풍부한 향과 부드러운 산미가 매력적이며,  ",
  };

  return (
    <div className="bg-background">
      <div className="px-4 pt-4 pb-2">
        <div className="bg-white rounded-lg p-3 border border-border-default">
          {/* Title*/}
          <p className="text-base font-bold inline-block leading-[20px] mb-1">
            오늘의 커피 이야기 : {coffeeStory.title}
          </p>
          {/* Date */}
          <p className="text-[12px] font-normal text-text-secondary mb-3">
            {coffeeStory.date}
          </p>

          {/* Review Image */}
          <div className="mb-3 rounded-lg overflow-hidden">
            <img
              src={coffeeStory.image}
              alt="Coffee review"
              className="w-full h-90 max-h-[350px] object-cover rounded-lg"
            />
          </div>

          {/* Description */}
          <p className="text-xs leading-[20px]">{coffeeStory.description}</p>
        </div>
      </div>
    </div>
  );
};

export default CoffeeStoryDetail;
