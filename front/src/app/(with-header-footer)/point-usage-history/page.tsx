"use client";
import { useHeaderStore } from "@/stores/header-store";
import React, { useEffect, useState } from "react";
import { formatAmount } from "@/utils/helpers";

interface PointTransaction {
  id: number;
  description: string;
  type: "earned" | "used" | "canceled";
  amount: number;
  date: string;
  year: number;
}
// Fake data
const transactions: PointTransaction[] = [
  {
    id: 1,
    description: "포인트 상세 내역",
    type: "earned",
    amount: 1000,
    date: "08월 25일 15:33",
    year: 2025,
  },
  {
    id: 2,
    description: "신규 회원가입",
    type: "earned",
    amount: 3000,
    date: "08월 25일 15:33",
    year: 2025,
  },
  {
    id: 3,
    description: "상품 반품 포인트",
    type: "earned",
    amount: 1512,
    date: "08월 25일 15:33",
    year: 2025,
  },
//   {
//     id: 4,
//     description: "포인트 사용",
//     type: "used",
//     amount: -1123,
//     date: "08월 25일 15:33",
//     year: 2025,
//   },
//   {
//     id: 5,
//     description: "포인트 사용",
//     type: "used",
//     amount: -1123,
//     date: "08월 25일 15:33",
//     year: 2025,
//   },
//   {
//     id: 6,
//     description: "포인트 사용",
//     type: "used",
//     amount: -1123,
//     date: "08월 25일 15:33",
//     year: 2025,
//   },
  {
    id: 7,
    description: "리뷰 작성 삭제",
    type: "canceled",
    amount: -1000,
    date: "08월 25일 15:33",
    year: 2025,
  },
  {
    id: 8,
    description: "리뷰 작성 삭제",
    type: "canceled",
    amount: -1000,
    date: "08월 24일 15:33",
    year: 2024,
  },
  {
    id: 9,
    description: "리뷰 작성 삭제",
    type: "canceled",
    amount: -1000,
    date: "08월 24일 15:33",
    year: 2024,
  },
  {
    id: 10,
    description: "리뷰 작성 삭제",
    type: "canceled",
    amount: -1000,
    date: "08월 24일 15:33",
    year: 2024,
  },
  {
    id: 11,
    description: "리뷰 작성 삭제",
    type: "canceled",
    amount: -1000,
    date: "08월 24일 15:33",
    year: 2024,
  },
  {
    id: 12,
    description: "리뷰 작성 삭제",
    type: "canceled",
    amount: -1000,
    date: "08월 24일 15:33",
    year: 2024,
  },
  {
    id: 13,
    description: "리뷰 작성 삭제",
    type: "canceled",
    amount: -1000,
    date: "08월 24일 15:33",
    year: 2024,
  },
  {
    id: 14,
    description: "리뷰 작성 삭제",
    type: "canceled",
    amount: -1000,
    date: "08월 24일 15:33",
    year: 2024,
  },
];

const PointUsageHistory = () => {
  const [activeTab, setActiveTab] = useState<
    "all" | "earned" | "used" | "canceled"
  >("all");

  const { setHeader } = useHeaderStore();

  useEffect(() => {
    setHeader({
      title: "포인트 이용내역",
      showBackButton: true, 
    });
  }, [setHeader]);

  // Filter transactions based on active tab
  const filteredTransactions = transactions.filter((transaction) => {
    if (activeTab === "all") return true;
    return transaction.type === activeTab;
  });

  // Group transactions by year
  const groupedTransactions = filteredTransactions.reduce(
    (acc, transaction) => {
      if (!acc[transaction.year]) {
        acc[transaction.year] = [];
      }
      acc[transaction.year].push(transaction);
      return acc;
    },
    {} as Record<number, PointTransaction[]>
  );

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "earned":
        return "적립";
      case "used":
        return "사용";
      case "canceled":
        return "취소";
      default:
        return "";
    }
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case "earned":
        return "bg-[#8B5E3C] text-white";
      case "used":
        return "bg-[#C97A50] text-white";
      case "canceled":
        return "bg-[#B94C3C] text-white";
      default:
        return "";
    }
  };

  const tabs = [
    { key: "all", label: "전체" },
    { key: "earned", label: "적립" },
    { key: "used", label: "사용" },
    { key: "canceled", label: "취소" },
  ];

  return (
    <div className="bg-background p-4">
      {/* Header - My Points */}
      <div className="bg-white p-3 rounded-2xl mb-4 border border-border-default">
        <p className="text-[12px] leading-[16px] mb-1">나의 포인트</p>
        <p className="text-base leading-[20px] font-bold text-action-primary">
          1,155원
        </p>
      </div>

      {/* Point Details History Card */}
      <div className="bg-white rounded-2xl p-3 border border-border-default">
        <h2 className="text-base leading-[20px] font-bold text-gray-0 mb-2">
          포인트 상세 내역
        </h2>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`h-7 px-2.5 py-1 rounded-sm text-sm leading-[20px] font-bold cursor-pointer ${
                activeTab === tab.key
                  ? "bg-action-primary text-white"
                  : "text-action-primary border border-action-primary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
 
        <div className="space-y-6 max-h-[calc(100dvh-360px)] overflow-y-auto">

          {/* if there is no transactions, show the empty state */}
          {Object.entries(groupedTransactions).length === 0 && (
            <div className="flex items-center justify-center h-[100px]">
              <p className="text-sm leading-[20px]">포인트 내역이 없습니다.</p>
            </div>
          )}

          {Object.entries(groupedTransactions)
            .sort(([a], [b]) => Number(b) - Number(a))
            .map(([year, yearTransactions]) => (
              <div key={year}>
                {/* Year Separator */}
                <div className="relative mb-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border-default"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-2 text-[12px] leading-[16px] text-text-secondary">
                      {year}
                    </span>
                  </div>
                </div>

                {/* Transactions for this year */}
                <div className="space-y-3">
                  {yearTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-start justify-between"
                    >
                      <div className="">
                        <div className="flex items-center gap-2">
                          <span className="text-xs leading-[16px] font-bold text-gray-0">
                            {transaction.description}
                          </span>

                          <span
                            className={`px-1 py-0.5 rounded-sm text-[12px] leading-[16px] font-normal ${getTypeStyle(
                              transaction.type
                            )}`}
                          >
                            {getTypeLabel(transaction.type)}
                          </span>
                        </div>
                        <p className="text-[12px] leading-[16px] text-text-secondary">
                          {transaction.date}
                        </p>
                      </div>
                      <div className="text-sm leading-[20px] font-bold text-gray-0">
                        {formatAmount(transaction.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PointUsageHistory;
