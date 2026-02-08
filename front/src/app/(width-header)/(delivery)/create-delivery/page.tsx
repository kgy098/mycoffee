"use client";
import ActionSheet from "@/components/ActionSheet";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useHeaderStore } from "@/stores/header-store";
import { usePost } from "@/hooks/useApi";
import { useUserStore } from "@/stores/user-store";

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
  const { user } = useUserStore();
  const userId = user?.data?.user_id;

  useEffect(() => {
    setHeader({
      title: "배송지 추가",
      showBackButton: true,
    });
  }, []);

  const isDisabled =
    !recipient || !phoneNumber || !zipCode || !zipAddress || !addressFloor;

  const { mutate: createAddress, isPending } = usePost("/api/delivery-addresses", {
    onSuccess: () => {
      setShowLogOutModal(true);
    },
  });

  const handleSubmit = () => {
    if (!userId || isDisabled) return;
    createAddress({
      user_id: userId,
      recipient_name: recipient,
      phone_number: phoneNumber,
      postal_code: zipCode,
      address_line1: zipAddress,
      address_line2: addressFloor,
      is_default: isDefaultDeliveryAddress,
    });
  };

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
              className="input-default"
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
              className="input-default"
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
                className="input-default"
              />
              <button
                // onClick={handleChangePhone}
                className="shrink-0 px-4 h-10 text-xs leading-[20px] rounded-lg bg-action-secondary text-action-primary font-bold"
              >
                우편번호 찾기
              </button>
            </div>
          </div>

          {/* shipping address */}
          <div className="flex flex-col gap-2 mb-4 ">
            <input
              type="text"
              value={zipAddress}
              onChange={(e) => setZipAddress(e.target.value)}
              className="input-default"
            />

            <input
              type="text"
              value={addressFloor}
              placeholder="상세 주소를 입력해주세요."
              onChange={(e) => setAddressFloor(e.target.value)}
              className="input-default"
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
          onClick={handleSubmit}
          disabled={isDisabled || isPending}
          className={`w-full h-12 font-bold mt-auto text-base leading-[24px] px-4 rounded-lg ${
            isDisabled || isPending
              ? "bg-[#E6E6E6] text-[#9CA3AF] cursor-not-allowed"
              : "bg-linear-gradient text-white"
          }`}
        >
          {isPending ? "저장 중..." : "완료"}
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
          <button
            onClick={() => router.push("/delivery-address-management")}
            className={`btn-primary text-center block w-full`}
          >
            확인
          </button>
        </div>
      </ActionSheet>
    </>
  );
};

export default EditDelivery;
