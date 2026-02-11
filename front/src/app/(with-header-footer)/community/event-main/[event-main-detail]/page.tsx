"use client";
import { useHeaderStore } from "@/stores/header-store";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useGet } from "@/hooks/useApi";

const EventDetail = () => {


  const { setHeader } = useHeaderStore();

  useEffect(() => {
    setHeader({
      title: "이벤트",
      showBackButton: true,
    });
  }, []);


  const params = useParams();
  const eventIdParam = Array.isArray(params["event-main-detail"])
    ? params["event-main-detail"][0]
    : params["event-main-detail"];
  const eventId = Number(eventIdParam);

  const { data: event } = useGet<any>(
    ["event-detail", eventId],
    `/api/events/${eventId}`,
    {},
    { enabled: Number.isFinite(eventId) }
  );

  return (
    <div className="bg-background">
      <div className="px-4 pt-4">
        <div className="bg-white rounded-lg p-3 border border-border-default">
          {/* Status */}
          <span
            className="inline-block mb-1 text-[12px] leading-[16px] font-bold px-2 py-1 rounded-[100px]"
            style={{
              backgroundColor:
                (event?.status || "진행중") === "진행중" ? "#C97A50" : "#E6E6E6",
              color: (event?.status || "진행중") === "진행중" ? "#FFF" : "#9CA3AF",
            }}
          >
            {event?.status || "진행중"}
          </span>
          <br />
          {/* Title*/}
          <p className="text-base font-bold inline-block leading-[20px] mb-1">
            {event?.title || "이벤트"}
          </p>
          {/* Date */}
          <p className="text-[12px] font-normal text-text-secondary mb-3">
            {event?.created_at
              ? new Date(event.created_at).toLocaleDateString("ko-KR")
              : ""}
          </p>

          {/* 상세 이미지: 전체가 보이도록 표시 (잘리지 않음) */}
          <div className="mb-3 rounded-lg overflow-hidden">
            <img
              src={event?.detail_image_url || event?.thumbnail_url || "/images/ice-coffee.png"}
              alt={event?.title || "이벤트"}
              className="w-full rounded-lg object-contain"
            />
          </div>

          {/* Description */}
          <p className="text-xs leading-[20px]">{event?.content || ""}</p>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
