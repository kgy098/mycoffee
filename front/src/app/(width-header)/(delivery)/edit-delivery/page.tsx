"use client";
import ActionSheet from "@/components/ActionSheet";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { useHeaderStore } from "@/stores/header-store";
import { useGet, usePut } from "@/hooks/useApi";
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
  const searchParams = useSearchParams();
  const addressIdParam = searchParams.get("id");
  const addressId = addressIdParam ? Number(addressIdParam) : null;
  const { setHeader } = useHeaderStore();
  const { user } = useUserStore();
  const userId = user?.data?.user_id;

  const { data: deliveryAddresses } = useGet<any[]>(
    ["delivery-addresses", userId],
    "/api/delivery-addresses",
    { params: { user_id: userId } },
    { enabled: !!userId }
  );

  const address = useMemo(() => {
    if (!addressId || !deliveryAddresses) return null;
    return deliveryAddresses.find((item) => item.id === addressId);
  }, [deliveryAddresses, addressId]);

  useEffect(() => {
    setHeader({
      title: "배송지 수정",
      showBackButton: true,
    });
  }, []);

  useEffect(() => {
    if (!address) return;
    setRecipient(address.recipient_name || "");
    setPhoneNumber(address.phone_number || "");
    setZipCode(address.postal_code || "");
    setZipAddress(address.address_line1 || "");
    setAddressFloor(address.address_line2 || "");
    setIsDefaultDeliveryAddress(!!address.is_default);
  }, [address]);

  const isDisabled =
    !recipient || !phoneNumber || !zipCode || !zipAddress || !addressFloor;

  const { mutate: updateAddress, isPending } = usePut(
    addressId ? `/api/delivery-addresses/${addressId}` : "/api/delivery-addresses",
    {
      onSuccess: () => {
        setShowLogOutModal(true);
      },
    }
  );

  const handleSubmit = () => {
    if (!userId || !addressId || isDisabled) return;
    updateAddress({
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
          disabled={isDisabled || isPending}
          onClick={handleSubmit}
          className={`w-full h-12 font-bold mt-auto text-base leading-[24px] px-4 rounded-lg  ${
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
