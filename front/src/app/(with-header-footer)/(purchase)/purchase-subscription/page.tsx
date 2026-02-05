"use client";
import React, { useState, useEffect } from "react";
import { ChevronUp, ChevronDown, ChevronRight, XIcon } from "lucide-react";
import Link from "next/link";
import { useHeaderStore } from "@/stores/header-store";
const PurchaseSubscription = () => {
  const { setHeader } = useHeaderStore();
  const [quantity, setQuantity] = useState(1);
  const [pointUsage, setPointUsage] = useState(0);
  const [agreements, setAgreements] = useState({
    all: false,
    personalInfo: false,
    terms: false,
    marketing: false,
  });

  const [expandedSections, setExpandedSections] = useState({
    orderInfo: true,
    deliveryInfo: true,
    pointUsage: true,
    paymentMethod: false,
    finalAmount: true,
    subscriptionInfo: true,
  });

  useEffect(() => {
    setHeader({
      title: "주문하기",
      showBackButton: true,
    });
  }, [setHeader]);

  const handleQuantityChange = (type: "increase" | "decrease") => {
    if (type === "increase") {
      setQuantity((prev) => prev + 1);
    } else if (type === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handlePointUsage = (type: "all" | "custom") => {
    if (type === "all") {
      setPointUsage(12000);
    }
  };

  const handleAgreementChange = (type: keyof typeof agreements) => {
    if (type === "all") {
      const newValue = !agreements.all;
      setAgreements({
        all: newValue,
        personalInfo: newValue,
        terms: newValue,
        marketing: newValue,
      });
    } else {
      setAgreements((prev) => ({
        ...prev,
        [type]: !prev[type],
        all: false,
      }));
    }
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const productPrice = 36000;
  const deliveryFee = 0;
  const totalPrice = productPrice * quantity - pointUsage + deliveryFee;

  return (
    <>
      <div className="bg-background p-4 pb-2 flex flex-col justify-between">
        <div className="space-y-4 overflow-y-auto h-[calc(100vh-246px)]">
          {/* 주문 정보 (Order Information) */}
          <div className="bg-white rounded-lg p-3 border border-border-default">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection("orderInfo")}
            >
              <h2 className="text-sm leading-[20px] font-bold">주문 정보</h2>
              {expandedSections.orderInfo ? (
                <ChevronUp size={24} className="text-icon-default" />
              ) : (
                <ChevronDown size={24} className="text-icon-default" />
              )}
            </div>

            {expandedSections.orderInfo && (
              <div className="border border-border-default rounded-lg p-3 mt-4">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-bold text-xs leading-[18px] text-gray-0">
                    나만의 커피 1호기/클래식 하모니 블랜드
                  </p>
                  <button>
                    <XIcon size={16} stroke="#1A1A1A" />
                  </button>
                </div>

                <div className="text-sm text-text-secondary mb-4 flex items-center gap-1">
                  {["카페인", "홀빈", "벌크", "500g", "라벨"].map(
                    (item, idx) => (
                      <span
                        key={idx}
                        className="text-[12px] leading-[16px] flex items-center gap-1"
                      >
                        {item}{" "}
                        {idx !== 4 && (
                          <span className="size-1 bg-[#9CA3AF] rounded-full inline-block"></span>
                        )}
                      </span>
                    )
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-[22px]">
                    <button
                      onClick={() => handleQuantityChange("decrease")}
                      className="w-7 h-7 flex items-center justify-center border border-border-default rounded cursor-pointer"
                    >
                      <span className="w-[12px] h-[2px] bg-[#4E2A18] rounded-full inline-block"></span>
                    </button>
                    <span className="text-lg font-medium">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange("increase")}
                      className="w-7 h-7 flex items-center justify-center bg-primary text-white rounded cursor-pointer"
                    >
                      <svg
                        width="12"
                        height="12"
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
                  <div className="text-base font-bold leading-[24px]">
                    {productPrice.toLocaleString()}원
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 구독 정보 ( Subscription Information) */}
          <div className="bg-white rounded-lg p-3 border border-border-default">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection("subscriptionInfo")}
            >
              <h2 className="text-sm leading-[20px] font-bold">구독 정보</h2>
              {expandedSections.subscriptionInfo ? (
                <ChevronUp size={24} className="text-icon-default" />
              ) : (
                <ChevronDown size={24} className="text-icon-default" />
              )}
            </div>

            {expandedSections.subscriptionInfo && (
              <div className="mt-2">
                <ul className="space-y-2 text-xs leading-[18px]">
                  <li className="flex justify-between items-center">
                    <span className="font-normal">첫 배송 희망일</span>
                    <span className="font-bold">9월 3일(수)</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="font-normal">1회차 결제일</span>
                    <span className="font-bold">9월 1일(월)</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="font-normal">이용 횟수</span>
                    <span className="font-bold">총 4회</span>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* 배송지 정보 (Delivery Information) */}
          <div className="bg-white rounded-lg p-3 border border-border-default">
            <div className="flex items-center justify-between cursor-pointer">
              <h2 className="text-sm leading-[20px] font-bold">배송지 정보</h2>
              <span className="text-[12px] leading-[16px] text-[#3182F6] font-bold">
                변경
              </span>
            </div>

            <div className="flex items-start gap-3 mt-4">
              <div className="w-8 h-8 bg-action-secondary rounded-full flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <g clip-path="url(#clip0_2859_14531)">
                    <path d="M10.0002 14.6664C9.82335 14.6664 9.65378 14.5962 9.52876 14.4712C9.40373 14.3462 9.3335 14.1766 9.3335 13.9998V11.3331C9.33348 11.2234 9.36055 11.1153 9.4123 11.0186C9.46405 10.9218 9.53889 10.8393 9.63016 10.7784L11.6302 9.44511C11.7397 9.37202 11.8685 9.33301 12.0002 9.33301C12.1319 9.33301 12.2606 9.37202 12.3702 9.44511L14.3702 10.7784C14.4614 10.8393 14.5363 10.9218 14.588 11.0186C14.6398 11.1153 14.6668 11.2234 14.6668 11.3331V13.9998C14.6668 14.1766 14.5966 14.3462 14.4716 14.4712C14.3465 14.5962 14.177 14.6664 14.0002 14.6664H10.0002Z" stroke="#62402D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12.0002 6.66634C12.0002 5.25185 11.4383 3.8953 10.4381 2.89511C9.43787 1.89491 8.08132 1.33301 6.66683 1.33301C5.25234 1.33301 3.89579 1.89491 2.89559 2.89511C1.8954 3.8953 1.3335 5.25185 1.3335 6.66634C1.3335 9.99501 5.02616 13.4617 6.26616 14.5323C6.38174 14.619 6.52235 14.6658 6.66683 14.6657" stroke="#62402D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 14.667V12.667" stroke="#62402D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6.6665 8.66699C7.77107 8.66699 8.6665 7.77156 8.6665 6.66699C8.6665 5.56242 7.77107 4.66699 6.6665 4.66699C5.56193 4.66699 4.6665 5.56242 4.6665 6.66699C4.6665 7.77156 5.56193 8.66699 6.6665 8.66699Z" stroke="#62402D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                  <defs>
                    <clipPath id="clip0_2859_14531">
                      <rect width="16" height="16" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>

              <div className="flex-1">
                <p className="text-xs leading-[18px] font-bold">
                  이기홍 01012341234
                </p>
                <p className="text-xs leading-[18px] font-bold">
                  인천 부평구 길주남로123번길 12
                </p>
              </div>
            </div>
          </div>

          {/* 포인트 사용 (Point Usage) */}
          <div className="bg-white rounded-lg p-3 border border-border-default">
            <div
              className="flex items-center justify-between  cursor-pointer"
              onClick={() => toggleSection("pointUsage")}
            >
              <h2 className="text-sm leading-[20px] font-bold ">포인트 사용</h2>
              {expandedSections.pointUsage ? (
                <ChevronUp size={24} className="text-icon-default" />
              ) : (
                <ChevronDown size={24} className="text-icon-default" />
              )}
            </div>

            {expandedSections.pointUsage && (
              <div className=" mt-2">
                <span className="text-xs leading-[16px] font-bold">
                  보유 포인트 12,000
                </span>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="number"
                    value={pointUsage}
                    onChange={(e) => setPointUsage(Number(e.target.value))}
                    className="flex-1 h-10 pl-3 border border-border-default rounded-lg text-left text-xs placeholder:text-text-secondary focus:outline-none focus:ring-[#A45F37] focus:border-[#A45F37]"
                    placeholder="0"
                  />
                  <button
                    onClick={() => handlePointUsage("all")}
                    className=" h-10 px-4 py-2.5 border bg-action-secondary border-action-secondary  text-action-primary rounded-lg text-sm leading-[20px] font-bold"
                  >
                    전액 사용
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 결제수단 (Payment Method) */}
          <div className="bg-white rounded-lg p-3 border border-border-default">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection("paymentMethod")}
            >
              <h2 className="text-sm leading-[20px] font-bold ">결제수단</h2>
              {expandedSections.paymentMethod ? (
                <ChevronUp size={24} className="text-icon-default" />
              ) : (
                <ChevronDown size={24} className="text-icon-default" />
              )}
            </div>
            {expandedSections.paymentMethod && (
              <div className="mt-4">
                <p className="text-sm text-text-secondary"></p>
              </div>
            )}
          </div>

          {/* 최종 결제금액 (Final Payment Amount) */}
          <div className="bg-white rounded-lg p-3 border border-border-default">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection("finalAmount")}
            >
              <h2 className="text-sm leading-[20px] font-bold ">
                최종 결제금액
                <span className=" ml-2 text-text-primary px-2 py-1 rounded-sm font-bold">
                  36,000원
                </span>
              </h2>
              {expandedSections.finalAmount ? (
                <ChevronUp size={24} className="text-icon-default" />
              ) : (
                <ChevronDown size={24} className="text-icon-default" />
              )}
            </div>

            {expandedSections.finalAmount && (
              <>
                <div className="space-y-2  mt-2">
                  <div className="flex justify-between">
                    <span className="text-xs leading-[18px] font-normal">
                      상품금액
                    </span>

                    <span className="text-xs leading-[18px] font-bold">
                      {(productPrice * quantity).toLocaleString()}원
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs leading-[18px] font-normal">
                      배송비
                    </span>
                    <span className="text-xs leading-[18px] font-bold">
                      {deliveryFee.toLocaleString()}원
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs leading-[18px] font-normal">
                      포인트 할인
                    </span>
                    <span className="text-xs leading-[18px] font-bold">
                      {pointUsage.toLocaleString()}원
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* 약관 동의 (Terms and Conditions) */}
          <div className="bg-white rounded-lg p-3 border border-border-default">
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreements.all}
                  onChange={() => handleAgreementChange("all")}
                  className="auth-checkbox w-5 h-5 rounded-sm border border-border-default"
                />
                <span className="text-xs leading-[16px] font-normal ">
                  구매조건/약관 및 개인정보 이용 전체 동의
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreements.personalInfo}
                  onChange={() => handleAgreementChange("personalInfo")}
                  className="auth-checkbox w-5 h-5 rounded-sm border border-border-default"
                />
                <span className="text-xs leading-[16px] font-normal ">
                  개인정보 수집 및 이용 동의 (필수)
                </span>
                <ChevronRight size={20} className="ml-auto text-icon-default" />
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreements.terms}
                  onChange={() => handleAgreementChange("terms")}
                  className="auth-checkbox w-5 h-5 rounded-sm border border-border-default"
                />
                <span className="text-xs leading-[16px] font-normal ">
                  이용약관 동의 (필수)
                </span>
                <ChevronRight size={20} className="ml-auto text-icon-default" />
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreements.marketing}
                  onChange={() => handleAgreementChange("marketing")}
                  className="auth-checkbox w-5 h-5 rounded-sm border border-border-default"
                />
                <span className="text-xs leading-[16px] font-normal ">
                  개인정보 마케팅 활용 동의 (선택)
                </span>
                <ChevronRight size={20} className="ml-auto text-icon-default" />
              </label>
            </div>
          </div>
        </div>
        <div className="pt-4 w-full ">
          {agreements.all ||
            agreements.personalInfo ||
            agreements.terms ||
            agreements.marketing ? (
            <>
              <Link
                href={"/success-order"}
                className="w-full inline-block text-center py-3 border border-transparent bg-linear-gradient text-white rounded-lg font-bold leading-[24px]"
              >
                주문하기
              </Link>
            </>
          ) : (
            <button className="w-full py-3 border border-transparent bg-action-disabled text-text-disabled rounded-lg font-bold leading-[24px] cursor-not-allowed">
              주문하기
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default PurchaseSubscription;
