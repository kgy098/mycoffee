"use client";
import React from "react";
import { useRouter } from "next/navigation";

const SuccessFinish = () => {
  const router = useRouter();

  const handleMainHome = () => {
    router.push("/home");
  };

  const handleOrderDetails = () => {
    // Navigate to order details page
    console.log("View order details");
  };

  return (
    <div className="min-h-screen bg-background  p-4 pb-10 flex flex-col items-center justify-center">
      {/* Success Icon */}
      <svg
        className="mb-9"
        xmlns="http://www.w3.org/2000/svg"
        width="169"
        height="168"
        viewBox="0 0 169 168"
        fill="none"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M84.5015 168.002C130.893 168.002 168.501 130.394 168.501 84.0019C168.501 37.61 130.893 0.00195312 84.5015 0.00195312C38.1095 0.00195312 0.501465 37.61 0.501465 84.0019C0.501465 130.394 38.1095 168.002 84.5015 168.002ZM123.426 70.4266C127.527 66.3261 127.527 59.6778 123.426 55.5773C119.326 51.4768 112.677 51.4768 108.577 55.5773L74.0015 90.1527L60.4261 76.5773C56.3256 72.4768 49.6773 72.4768 45.5768 76.5773C41.4763 80.6778 41.4763 87.3261 45.5768 91.4266L66.5768 112.427C70.6773 116.527 77.3256 116.527 81.4261 112.427L123.426 70.4266Z"
          fill="#28A745"
        />
      </svg>

      {/* Success Messages */}
      <div className="text-center mb-12">
        <p className="text-[20px] leading-[28px] font-bold mb-2">
          구매가 완료되었습니다. <br/>
          오늘도 향긋한 하루 되세요.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-sm space-y-3 absolute bottom-10 p-4">
        {/* Main Home Button */}
        <button
          onClick={handleMainHome}
          className="w-full py-3 bg-linear-gradient text-white rounded-lg font-bold text-base leading-[24px]"
        >
          메인홈으로
        </button>

        {/* Order Details Link */}
        <button
          onClick={handleOrderDetails}
          className="w-full py-3 text-gray-0 text-base font-bold leading-[24px]"
        >
          주문 상세 보기
        </button>
      </div>
    </div>
  );
};

export default SuccessFinish;
