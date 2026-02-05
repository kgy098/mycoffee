"use client";
import ActionSheet from "@/components/ActionSheet";
import { useHeaderStore } from "@/stores/header-store";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const ChangePhone = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpNumber, setOtpNumber] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { setHeader } = useHeaderStore();

  useEffect(() => {
    setHeader({
      title: "휴대폰변경",
      showBackButton: true,
    });
  }, []);

  const handleSendOtp = () => {
    console.log("send otp");
    setIsOtpSent(true);
  };

  const handleChangeOtpNumber = () => {
    console.log("change otp number");
    setIsOtpSent(false);
    setShowModal(true);
  };



  return (
    <div className="bg-background p-4 pt-6 pb-2 flex flex-col justify-between ">
      <div className="">
        <div className="mb-4">
          <label className="block text-sm leading-[20px] font-bold text-gray-0 mb-2">
            휴대폰 번호
          </label>
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={phoneNumber}
              placeholder="휴대폰 번호를 입력해주세요"
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="input-default"
            />
            <button
              onClick={handleSendOtp}
              disabled={isOtpSent}
              className={`shrink-0 px-4 h-10 text-sm leading-[20px] rounded-lg bg-action-secondary text-action-primary font-bold ${
                isOtpSent
                  ? "bg-action-disabled text-icon-disabled border-transparent"
                  : " text-action-primary"
              }`}
            >
              인증 요청
            </button>
          </div>
          {isOtpSent && (
            <span className="inline-block text-[12px] leading-[16px] mt-2">
              00:53 후에 새 코드를 보내기
            </span>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm leading-[20px] font-bold text-gray-0 mb-2">
            인증 번호
          </label>
          <input
            value={otpNumber}
            type="number"
            placeholder="인증 번호를 입력하세요."
            onChange={(e) => setOtpNumber(e.target.value)}
            className="input-default"
          />
        </div>
      </div>

      <button
        onClick={handleChangeOtpNumber}
        disabled={otpNumber.length < 4}
        className={`inline-block text-center w-full mt-auto  py-3  rounded-lg font-bold leading-[24px] ${
          otpNumber.length < 4
            ? "bg-action-disabled text-icon-disabled"
            : "bg-linear-gradient text-white"
        }`}
      >
        휴대폰 변경하기
      </button>

      {/* Show modal action sheet */}
      <ActionSheet isOpen={showModal} onClose={() => setShowModal(false)}>
        <div>
          <p className="mb-6 text-center text-base leading-[20px] font-bold">
            변경이 완료 되었습니다.
          </p>
          <button
            className={`inline-block text-center w-full mt-auto py-3 rounded-lg font-bold leading-[24px] bg-linear-gradient text-white`}
          >
            확인
          </button>
        </div>
      </ActionSheet>
    </div>
  );
};

export default ChangePhone;
