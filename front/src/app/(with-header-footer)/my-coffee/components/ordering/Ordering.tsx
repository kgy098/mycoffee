"use client";
import React, { useState } from "react";
import OrderSelectOption from "./components/orderSelectOption";
import OrderSelectLabelOption from "./components/orderImageUploader";
import OrderSelectSubscriptionDeleviryDate from "./components/orderSelectSubscriptionDeleviryDate";
import Link from "next/link";
import ActionSheet from "@/components/ActionSheet";
import { ChevronDown, PlusIcon, X, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useOrderStore } from "@/stores/order-store";

const OrderingComponent = ({
  className,
  title,
  isTooltipOpenHave = true,
  children,
}: {
  className?: string;
  title?: string;
  isTooltipOpenHave?: boolean;
  children?: React.ReactNode;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTooltipOpen, setIsTooltipOpen] = useState(true);
  const [orderSelectOption, setOrderSelectOption] = useState(false);
  const [orderLabelOption, setOrderLabelOption] = useState(false);
  const [orderSubscriptionDeleviryDate, setOrderSubscriptionDeleviryDate] = useState(false);

  const { order, increaseQuantity, decreaseQuantity } = useOrderStore();
  const router = useRouter();

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeTooltip = () => {
    setIsTooltipOpen(false);
  };

  const navigatePurchaseIndividualItem = () => {
    router.push("/purchase-individual-item");
  };

  const totalPrice =
    order &&
    order.reduce((acc, item) => acc + Number(item.price!) * item.quantity!, 0);


    console.log("order", order);
    
  return (
    <>
      {isTooltipOpenHave && isTooltipOpen ? (
        <div className="relative group block w-full">
          {children ? (
            <div onClick={openModal}>{children}</div>
          ) : (
            <button
              onClick={openModal}
              className={className || "w-full block text-center btn-primary"}
            >
              {title}
            </button>
          )}

          {/* Tooltip - Default holatda ochiq */}
          {isTooltipOpenHave && isTooltipOpen && (
            <div
              id="tooltip-default"
              role="tooltip"
              className="absolute -top-[28px] z-10 left-7 inline-block px-[18px] py-[4px] text-sm font-medium text-white bg-[#1C1C1C] rounded-lg shadow-lg tooltip mb-2 min-w-max"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-normal text-white leading-[150%]">
                  첫 구독 결제시 1달 무료
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsTooltipOpen(false);
                  }}
                  className="text-white hover:text-gray-300 transition-colors p-1 rounded-full hover:bg-gray-700"
                  title="Tooltip yopish"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M12 4L4 12"
                      stroke="white"
                      strokeWidth="1.33333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4 4L12 12"
                      stroke="white"
                      strokeWidth="1.33333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
              <div className="absolute top-full left-[20px] transform w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-[#1C1C1C]"></div>
            </div>
          )}
        </div>
      ) : children ? (
        <div className="flex-1" onClick={openModal}>
          {children}
        </div>
      ) : (
        <button
          onClick={openModal}
          className={className || "w-full block text-center btn-primary"}
        >
          {title}
        </button>
      )}
      <ActionSheet isOpen={isModalOpen} onClose={closeModal} title="구매하기">
        {/* Option Dropdowns */}
        <div className="space-y-3 mb-6 mt-4">
          <div className="relative">
            <p
              onClick={() => setOrderSelectOption(true)}
              className="w-full h-[40px] leading-[40px] text-xs text-text-secondary pl-4 pr-2 border border-border-default rounded-lg bg-white"
            >
              옵션(필수)
            </p>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <ChevronDown size={16} />
            </div>
          </div>
        </div>

        {/* Selected Item Display */}
        {order &&
          order.map((item, idx) => (
            <div
              key={idx}
              className="border border-border-default rounded-lg p-3 mb-6"
            >
              <div className="flex justify-between items-start mb-2">
                <p className="font-bold text-xs leading-[18px]">
                  나만의 커피 {idx + 1}호기/클래식 하모니 블랜드
                </p>
                <button onClick={() => { }}>
                  <XIcon size={16} stroke="#1A1A1A" />
                </button>
              </div>

              <div className="text-sm text-text-secondary mb-6 flex items-center gap-1">
                {[item?.caffeineStrength === "CAFFEINE" ? "카페인" : "데카페인", item?.grindLevel === "WHOLE_BEAN" ? "홀빈" : "분쇄 그라인딩", item?.packaging === "STICK" ? "스틱" : "벌크", item.weight, "라벨"].map((item, idx) => (
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
                <div className="flex items-center space-x-[22px]">
                  <button
                    onClick={() => {
                      decreaseQuantity(idx);
                    }}
                    className="w-7 h-7 flex items-center justify-center border border-border-default rounded cursor-pointer"
                  >
                    <span className="w-[12px] h-[2px] bg-[#4E2A18] rounded-full inline-block"></span>
                  </button>
                  <span className="text-lg font-medium">{item.quantity}</span>
                  <button
                    onClick={() => {
                      increaseQuantity(idx);
                    }}
                    className="w-7 h-7 flex items-center justify-center bg-primary text-white rounded cursor-pointer"
                  >
                    <PlusIcon size={20} className="text-white" />
                  </button>
                </div>
                <div className="text-sm font-bold leading-[24px]">
                  {(item.price! * item.quantity!).toLocaleString()}원
                </div>
              </div>
            </div>
          ))}

        {/* Final Payment Amount */}
        {order && order.length > 0 && (
          <div className="flex justify-between items-center mb-6 gap-2">
            <span className="text-sm font-bold leading-[20px]">
              최종 결제금액
            </span>
            <span className="text-text-primary px-2 py-1 rounded-sm font-bold text-sm">
              {totalPrice.toLocaleString()} 원
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <div className="relative group  w-1/2">
            <button
              disabled={order && order.length === 0}
              onClick={() => setOrderSubscriptionDeleviryDate(true)}
              className="flex-1 w-full py-3 border border-action-secondary bg-action-secondary text-action-primary rounded-lg font-bold text-base leading-[24px] disabled:bg-action-disabled disabled:text-[#9CA3AF] disabled:cursor-not-allowed disabled:border-action-disabled "
            > 
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

          <button
            onClick={navigatePurchaseIndividualItem}
            disabled={order && order.length === 0}
            className=" w-1/2 btn-primary inline-block text-center py-3 border border-transparent bg-linear-gradient text-white rounded-lg font-bold leading-[24px] disabled:bg-action-disabled disabled:text-[#9CA3AF] disabled:cursor-not-allowed disabled:border-action-disabled "
          >
            단품 구매
          </button>
        </div>
      </ActionSheet>

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

export default OrderingComponent;
