"use client";
import { useHeaderStore } from "@/stores/header-store";
import React, { useEffect } from "react";

const EventDetail = () => {


  const { setHeader } = useHeaderStore();

  useEffect(() => {
    setHeader({
      title: "이벤트",
      showBackButton: true,
    });
  }, []);


  const event = {
    id: 1,
    product: "커피 스토리 1",
    image: "/images/ice-coffee.png",
    date: "2025-01-01",
    title: "커피 스토리 1",
    status: "진행중",
    description:
      "오늘의 커피 이야기는 콜롬비아 수프리마입니다\n안데스 고지대에서 자라 풍부한 향과 부드러운 산미가 매력적이며, 오늘의 커피 이야기는 콜롬비아 수프리마입니다\n안데스 고지대에서 자라 풍부한 향과 부드러운 산미가 매력적이며, 오늘의 커피 이야기는 콜롬비아 수프리마입니다\n안데스 고지대에서 자라 풍부한 향과 부드러운 산미가 매력적이며,  오늘의 커피 이야기는 콜롬비아 수프리마입니다\n안데스 고지대에서 자라 풍부한 향과 부드러운 산미가 매력적이며, 오늘의 커피 이야기는 콜롬비아 수프리마입니다\n안데스 고지대에서 자라 풍부한 향과 부드러운 산미가 매력적이며, 오늘의 커피 이야기는 콜롬비아 수프리마입니다\n안데스 고지대에서 자라 풍부한 향과 부드러운 산미가 매력적이며,  ",
  };

  return (
    <div className="bg-background">
      <div className="px-4 pt-4">
        <div className="bg-white rounded-lg p-3 border border-border-default">
          {/* Status */}
          <span
            className="inline-block mb-1 text-[12px] leading-[16px] font-bold px-2 py-1 rounded-[100px]"
            style={{
              backgroundColor:
                event.status === "진행중" ? "#C97A50" : "#E6E6E6",
              color: event.status === "진행중" ? "#FFF" : "#9CA3AF",
            }}
          >
            {event.status}
          </span>
          <br />
          {/* Title*/}
          <p className="text-base font-bold inline-block leading-[20px] mb-1">
            오늘의 커피 이야기 : {event.title}
          </p>
          {/* Date */}
          <p className="text-[12px] font-normal text-text-secondary mb-3">
            {event.date}
          </p>

          {/* Review Image */}
          <div className="mb-3 rounded-lg overflow-hidden">
            <img
              src={event.image}
              alt="Coffee review"
              className="w-full h-90 max-h-[350px] object-cover rounded-lg"
            />
          </div>

          {/* Description */}
          <p className="text-xs leading-[20px]">{event.description}</p>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
