"use client";
import { useHeaderStore } from "@/stores/header-store";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const inquiries = [
  {
    id: 1,
    product: "커피 스토리 1",
    image: "/images/ice-coffee.png",
    date: "2025-01-01",
    title: "커피 스토리 1",
    type: "finished",
    queryType: "문의 상품",
    subtitle: "나만의 커피 1호기/클래식 하모니 블랜드",
    ingridient: "내용",
    description:
      "제품이 훼손되었어요 ㅠㅠ제품이 훼손되었어요 ㅠㅠ제품이 훼손되었어요 ㅠㅠ제품이 훼손되었어요 ㅠㅠ제품이 훼손되었어요 ㅠㅠ제품이 훼손되었어요 ㅠㅠ제품이 훼손되었어요 ㅠㅠ제품이 훼손되었어요 ㅠㅠ제품이 훼손되었어요 ㅠㅠ",
  },
  {
    id: 2,
    product: "커피 스토리 2",
    image: "/images/ice-coffee.png",
    date: "2025-01-01",
    title: "커피 스토리 2", 
    type: "pending",
    queryType: "문의 종류",
    subtitle: "반품요청",
    ingridient: "내용",
    description:
      "제품이 훼손되었어요 ㅠㅠ제품이 훼손되었어요 ㅠㅠ제품이 훼손되었어요 ㅠㅠ제품이 훼손되었어요 ㅠㅠ제품이 훼손되었어요 ㅠㅠ제품이 훼손되었어요 ㅠㅠ제품이 훼손되었어요 ㅠㅠ제품이 훼손되었어요 ㅠㅠ제품이 훼손되었어요 ㅠㅠ",
  },
];

const Inquiries = () => {
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "finished">(
    "all"
  );

  const { setHeader } = useHeaderStore();

  useEffect(() => {
    setHeader({
      title: "내 문의",
      showBackButton: true,
    });
  }, [setHeader]);

  // Filter coffie based on active tab
  const filteredInquiries = inquiries.filter((inquiry) => {
    if (activeTab === "all") return true;
    return inquiry.type === activeTab;
  });

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "pending":
        return "답변대기";
      case "finished":
        return "답변완료";
      default:
        return "";
    }
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case "pending":
        return "bg-[#8B5E3C] text-white";
      case "finished":
        return "bg-[#C4A484] text-white";
      default:
        return "";
    }
  };

  const tabs = [
    { key: "all", label: "전체" },
    { key: "pending", label: "답변대기" },
    { key: "finished", label: "답변완료" },
  ];

  return (
    <div className="bg-background p-4 pb-2">
      {/* Tab Buttons */}
      <div className="flex items-center gap-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`h-7 px-2.5 py-1 rounded-sm text-sm leading-[20px] font-bold cursor-pointer ${
              activeTab === tab.key
                ? "bg-action-primary text-white"
                : " text-action-primary border border-action-primary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {/* if there is no transactions, show the empty state */}
        {filteredInquiries.length === 0 && (
          <div className="flex items-center justify-center h-[100px] bg-white rounded-lg p-3 border border-border-default">
            <p className="text-sm leading-[20px]">등록된 문의가 없습니다.</p>
          </div>
        )}

        {filteredInquiries.map((inquiry) => (
          <div key={inquiry.id}>
            <div
              key={inquiry.id}
              className="bg-white rounded-lg p-3 border border-border-default"
            >
              {/* status and date */}
              <div className="flex justify-between items-center mb-2">
                <span
                  className={`px-2 py-1 rounded-sm text-[12px] leading-[16px] font-normal ${getTypeStyle(
                    inquiry.type
                  )}`}
                >
                  {getTypeLabel(inquiry.type)}
                </span>

                <span className="text-[12px] leading-[16px] font-normal text-text-secondary">
                  {/* change lines to dots */}
                  {inquiry.date.replaceAll("-", ".")}
                </span>
              </div>

              {/* query type title*/}
              <p className="text-sm leading-[20px] font-bold mb-1">
                {inquiry.queryType}
              </p>

              {/* subtitle */}
              <p className=" text-xs leading-[18px] font-normal mb-2">
                {inquiry.subtitle}
              </p>

              <p className="text-sm leading-[20px] font-bold mb-1">
                {inquiry.ingridient}
              </p>

              {/* Review Image */}
              <div className="mb-1 rounded-lg overflow-hidden">
                <img
                  src={inquiry.image}
                  alt="Coffee review"
                  className="w-full h-90 max-h-[350px] object-cover rounded-lg"
                />
              </div>

              {/* Title*/}
              {/* <Link
                href={`/community/coffee-story-main/${inquiry.id}`}
                className="text-base font-bold inline-block leading-[20px] mb-1 cursor-pointer"
              >
                오늘의 커피 이야기: {inquiry.title}
              </Link> */}
              {/* Date */}
              {/* <p className="text-[12px] font-normal text-text-secondary mb-3">
                {inquiry.date}
              </p> */}

              {/* Description */}
              <p className="text-xs leading-[20px]  line-clamp-2">
                {inquiry.description}
              </p>
            </div>
          </div>
        ))}

        {/* footer */}

        <div className="bg-white rounded-lg p-3 border border-border-default">
          <div className="mb-2">
            <p className="text-sm leading-[20px] font-bold mb-1">답변</p>
            <p className="text-[12px] leading-[16px] font-normal text-text-secondary">
              2025.08.25
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs leading-[20px] font-normal text-text-secondary">
              안녕하세요. Mycoffee.Ai입니다.
            </p>
            <p className="text-xs leading-[20px] font-normal text-text-secondary">
              죄송합니다. 반품 진행해드리도록 하겠습니다.
            </p>
            <p className="text-xs leading-[20px] font-normal text-text-secondary">
              감사합니다
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inquiries;
