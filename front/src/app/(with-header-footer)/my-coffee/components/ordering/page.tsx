"use client";
import React, { useState } from "react";
import OrderSelectOption from "./components/orderSelectOption";
import OrderSelectLabelOption from "./components/orderImageUploader";
import OrderSelectSubscriptionDeleviryDate from "./components/orderSelectSubscriptionDeleviryDate";
import Link from "next/link";
import ActionSheet from "@/components/ActionSheet";

const Ordering = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTooltipOpen, setIsTooltipOpen] = useState(true);
  const [orderSelectOption, setOrderSelectOption] = useState(false);
  const [orderLabelOption, setOrderLabelOption] = useState(false);
  const [orderSubscriptionDeleviryDate, setOrderSubscriptionDeleviryDate] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeTooltip = () => {
    setIsTooltipOpen(false);
  };

  return (
    <>
      <div className="p-4 min-h-[100dvh]">
        <button onClick={openModal} className="btn-primary block w-full mb-0">
          주문하기
        </button>

        {/* ActionSheet Modal */}
        <ActionSheet
          isOpen={isModalOpen}
          onClose={closeModal}
          title="구매하기"
        >
          {/* Option Dropdowns */}
          <div className="space-y-3 mb-6 mt-4">
            <div className="relative">
              <p
                onClick={() => setOrderSelectOption(true)}
                className="w-full h-[40px] leading-[40px] text-xs text-text-secondary pl-4 pr-2 border border-border-default rounded-lg bg-white"
              >
                옵션을 선택해주세요.
              </p>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                {/* this svg size should be 8px 4px  */}
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    stroke={"var(--icon-default)"}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            <div className="relative">
              <p
                onClick={() => setOrderLabelOption(true)}
                className="w-full h-[40px] leading-[40px] text-xs text-text-secondary pl-4 pr-2 border border-border-default rounded-lg appearance-none bg-white"
              >
                라벨 옵션을 선택해주세요.
              </p>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-4 h-4 "
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    stroke={"var(--icon-default)"}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Selected Item Display */}
          <div className="border border-border-default rounded-lg p-3 mb-6">
            <div className="flex justify-between items-start mb-2">
              <p className="font-bold text-xs leading-[18px]">
                나만의 커피 1호기/클래식 하모니 블랜드
              </p>
              <button onClick={() => { }}>
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    stroke={"var(--icon-default)"}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="text-sm text-text-secondary mb-6 flex items-center gap-1">
              {["카페인", "홀빈", "벌크", "500g", "라벨"].map((item, idx) => (
                <span
                  key={idx}
                  className="text-[12px] leading-[16px] flex items-center gap-1"
                >
                  {item}{" "}
                  {idx !== 4 && (
                    <span className="size-1 bg-[#9CA3AF] rounded-full inline-block"></span>
                  )}
                </span>
              ))}
            </div>

            <div className="flex justify-between items-center">
              {/* Quantity Selector */}
              <div className="flex items-center space-x-[22px]">
                <button
                  onClick={() => {
                    console.log("minus");
                  }}
                  className="w-7 h-7 flex items-center justify-center border border-border-default rounded cursor-pointer"
                >
                  <span className="w-[12px] h-[2px] bg-[#4E2A18] rounded-full inline-block"></span>
                </button>
                <span className="text-lg font-medium">1</span>
                <button
                  onClick={() => {
                    console.log("plus");
                  }}
                  className="w-7 h-7 flex items-center justify-center bg-primary text-white rounded cursor-pointer"
                >
                  {/* plus svg size should be 12px 12px */}
                  {/* stroke color should be #FFF  size should be 12px 12px */}
                  {/* fix this  */}
                  <svg
                    width="18"
                    height="18"
                    fill="none"
                    stroke="#FFF"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              </div>

              {/* Price */}

              <div className="text-base font-bold leading-[24px]">36,000원</div>
            </div>
          </div>

          {/* Final Payment Amount */}
          <div className="flex justify-between items-center mb-6 gap-2">
            <span className="text-sm font-bold leading-[20px]">
              최종 결제금액
            </span>
            <span className="bg-brand-secondary-accent-sub text-action-secondary px-2 py-1 rounded-sm font-bold">
              36,000원
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <div className="relative group flex-1">
              <button onClick={() => setOrderSubscriptionDeleviryDate(true)} className="w-full bg-action-secondary py-3 border border-gradient-primary rounded-lg font-bold leading-[24px] color-[#4E2A18] ">
                정기구독
              </button>

              {/* Tooltip */}

              {isTooltipOpen && (
                <div className="absolute bottom-full flex items-center gap-2 left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-xs font-medium text-white bg-gray-900 rounded-lg shadow-lg opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  첫 구독 결제시 1달 무료
                  {/* Arrow */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
                  {/* X button */}
                  <button
                    onClick={closeTooltip}
                    className="size-4 cursor-pointer inline-flex items-center justify-center hover:bg-gray-700 rounded"
                  >
                    <svg
                      width="12"
                      height="12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            <Link href={"/purchase-individual-item"} className="flex-1 inline-block text-center py-3 border border-transparent bg-linear-gradient text-white rounded-lg font-bold leading-[24px]">
              단품 구매
            </Link>
          </div>
        </ActionSheet>
      </div>

      {/* <OrderSelectOption
        isOpen={orderSelectOption}
        onClose={() => setOrderSelectOption(false)}

      /> */}

      <OrderSelectOption
        isOpen={orderSelectOption}
        onClose={() => setOrderSelectOption(false)}
        orderLabelOption={orderLabelOption}
        setOrderLabelOption={setOrderLabelOption}
      />

      <OrderSelectLabelOption
        isOpen={orderLabelOption}
        onClose={() => setOrderLabelOption(false)}
      />

      <OrderSelectSubscriptionDeleviryDate
        isOpen={orderSubscriptionDeleviryDate}
        onClose={() => setOrderSubscriptionDeleviryDate(false)}
      />
    </>
  );
};

export default Ordering;
