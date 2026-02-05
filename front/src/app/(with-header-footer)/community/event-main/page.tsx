"use client";
import { useHeaderStore } from "@/stores/header-store";
import Link from "next/link";
import React, { useEffect } from "react";

const EventMain = () => {

  const { setHeader } = useHeaderStore();

  useEffect(() => {
    setHeader({
      title: "이벤트",
      showBackButton: false,
    });
  }, []);


  const events = [
    {
      id: 1,
      product: "커피 스토리 1",
      image: "/images/ice-coffee.png",
      date: "2025-01-01",
      title: "커피 스토리 1",
      status: "진행중",
    },
    {
      id: 2,
      product: "커피 스토리 2",
      image: "/images/ice-coffee.png",
      date: "2025-01-01",
      title: "커피 스토리 2",
      status: "종료",
    },
    {
      id: 3,
      product: "커피 스토리 3",
      image: "/images/ice-coffee.png",
      date: "2025-01-01",
      title: "커피 스토리 3",
      status: "진행중",
    },
  ];
  return (
    <div className="bg-background">
      <div className="px-4 space-y-4">
        {events.map((event) => (
          <Link
            href={`/community/event-main/${event.id}`}
            key={event.id}
            className="bg-white block rounded-lg p-3 border border-border-default"
          >
            {/* Review Image */}
            <div className="mb-3 rounded-lg overflow-hidden relative">
              {/* Status */}
              <span
                className="inline-block text-[12px] leading-[16px] font-bold absolute top-2 left-2 px-2 py-1 rounded-[100px]"
                style={{
                  backgroundColor:
                    event.status === "진행중" ? "#C97A50" : "#E6E6E6",
                  color: event.status === "진행중" ? "#FFF" : "#9CA3AF",
                }}
              >
                {event.status}
              </span>
              <img
                src={event.image}
                alt="Coffee review"
                className="w-full h-90 max-h-[180px] object-cover rounded-lg"
              />
            </div>

            {/* Title*/}
            <p className="text-base font-bold leading-[20px] mb-1 cursor-pointer">
              오늘의 커피 이야기: {event.title}
            </p>
            {/* Date */}
            <p className="text-[12px] font-normal text-text-secondary">
              {event.date}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default EventMain;
