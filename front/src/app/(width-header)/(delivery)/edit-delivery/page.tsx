"use client";
import ActionSheet from "@/components/ActionSheet";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useHeaderStore } from "@/stores/header-store";
import Link from "next/link";

const EditDelivery = () => {
  const [recipient, setRecipient] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [zipAddress, setZipAddress] = useState("");
  const [addressFloor, setAddressFloor] = useState("");
  const [isDefaultDeliveryAddress, setIsDefaultDeliveryAddress] =
    useState(false);

  const [showLogOutModal, setShowLogOutModal] = useState(false);

  const router = useRouter();
  const { setHeader } = useHeaderStore();

  // filling inputs with fake data
  useEffect(() => { 
    setRecipient("홍길동");
    setPhoneNumber("01012341234");
    setZipCode("12345");
    setZipAddress("서울특별시 강남구 강남대로 1234");
    setAddressFloor("101호"); 
  }, []);

  useEffect(() => {
    setHeader({
      title: "배송지 수정",
      showBackButton: true,
    });
  }, []);

  const isDisabled =
    !recipient || !phoneNumber || !zipCode || !zipAddress || !addressFloor;

  return (
    <>
      <div className="bg-background h-full p-4 w-full flex-1 flex flex-col justify-between">
        <div className="">
          {/* Recipient */}
          <div className="mb-4">
            <label className="block text-xs leading-[16px] font-bold text-gray-0 mb-2">
              수령인
            </label>
            <input
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="수령인을 입력해주세요."
              className="w-full h-10 px-4 text-xs leading-[16px] rounded-lg border border-border-default text-gray-0 placeholder:text-text-secondary"
            />
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label className="block text-xs leading-[16px] font-bold text-gray-0 mb-2">
              휴대폰 번호
            </label>
            <input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="휴대폰 번호를 입력해주세요."
              className="w-full h-10 px-4 text-xs leading-[16px] rounded-lg border border-border-default text-gray-0 placeholder:text-text-secondary"
            />
          </div>

          {/* zip code */}
          <div className="mb-2">
            <label className="block text-xs leading-[16px] font-bold text-gray-0 mb-2">
              배송지
            </label>
            <div className="flex items-center gap-2">
              <input
                value={zipCode}
                placeholder="우편번호"
                onChange={(e) => setZipCode(e.target.value)}
                className="flex-1 h-10 px-4 text-xs leading-[16px] rounded-lg border border-border-default text-gray-0"
              />
              <button
                // onClick={handleChangePhone}
                className="px-4 h-10 text-xs leading-[20px] rounded-lg border border-primary text-primary font-bold"
              >
                우편번호 찾기
              </button>
            </div>
          </div>

          {/* shipping address */}
          <div className="flex flex-col gap-2 mb-4">
            <input
              type="text"
              value={zipAddress}
              onChange={(e) => setZipAddress(e.target.value)}
              className="w-full h-10 text-xs  px-4 rounded-lg border border-border-default text-gray-0"
            />

            <input
              type="text"
              value={addressFloor}
              placeholder="상세 주소를 입력해주세요."
              onChange={(e) => setAddressFloor(e.target.value)}
              className="w-full h-10  text-xs  px-4 rounded-lg border border-border-default text-gray-0"
            />
          </div>

          {/* checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="defaultDeliveryAddress"
              className="w-4 h-4 auth-checkbox "
              checked={isDefaultDeliveryAddress}
              onChange={(e) => setIsDefaultDeliveryAddress(e.target.checked)}
            />
            <label
              htmlFor="defaultDeliveryAddress"
              className="text-xs leading-[22px] font-normal text-gray-0"
            >
              기본 배송지 저장
            </label>
          </div>
        </div>

        <button
          disabled={isDisabled}
          onClick={() => setShowLogOutModal(true)}
          className={`w-full h-12 font-bold mt-auto text-base leading-[24px] px-4 rounded-lg  ${
            isDisabled
              ? "bg-[#E6E6E6] text-[#9CA3AF] cursor-not-allowed"
              : "bg-linear-gradient text-white"
          }`}
        >
          완료
        </button>
      </div>

      {/* Show modal action sheet */}
      <ActionSheet
        isOpen={showLogOutModal}
        onClose={() => setShowLogOutModal(false)}
      >
        <div className="pb-6 pt-2">
          <p className="mb-6 text-center text-base leading-[20px] font-bold">
            배송지가 등록되었습니다.
          </p>
          <Link
            href="/delivery-address-management"
            className={`btn-primary text-center block `}
          >
            확인
          </Link>
        </div>
      </ActionSheet>
    </>
  );
};

export default EditDelivery;
