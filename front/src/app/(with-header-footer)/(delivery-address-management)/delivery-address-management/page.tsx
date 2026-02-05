"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import ActionSheet from "@/components/ActionSheet";
import { useRouter } from "next/navigation";
import { useHeaderStore } from "@/stores/header-store";

const delevireAddresses = [
  {
    id: 1,
    address: "서울시 강남구 역삼동 123-123",
    type: "기본 배송지",
    status: "이기홍",
    productName: "나만의 커피 1호기/클래식 하모니 블랜드",
    productDetails: ["카페인", "홀빈", "벌크", "500g", "라벨"],
    price: 10000,
  },
  {
    id: 2,
    name: "홍길동",
    address: "서울시 강남구 역삼동 123-123",
    type: "",
    status: "홍길동",
    productName: "나만의 커피 1호기/클래식 하모니 블랜드",
    productDetails: ["카페인", "홀빈", "벌크", "500g", "라벨"],
    price: 10000,
  },
  {
    id: 9,
    name: "이기홍",
    address: "서울시 강남구 역삼동 123-123",
    type: "",
    status: "홍길동",
    productName: "나만의 커피 1호기/클래식 하모니 블랜드",
    productDetails: ["카페인", "홀빈", "벌크", "500g", "라벨"],
    price: 10000,
  },
  {
    id: 3,
    name: "이기홍",
    address: "서울시 강남구 역삼동 123-123",
    type: "",
    status: "홍길동",
    productName: "나만의 커피 1호기/클래식 하모니 블랜드",
    productDetails: ["카페인", "홀빈", "벌크", "500g", "라벨"],
    price: 10000,
  },
  {
    id: 4,
    name: "이기홍",
    address: "서울시 강남구 역삼동 123-123",
    type: "",
    status: "홍길동",
    productName: "나만의 커피 1호기/클래식 하모니 블랜드",
    productDetails: ["카페인", "홀빈", "벌크", "500g", "라벨"],
    price: 10000,
  },
  {
    id: 5,
    name: "이기홍",
    address: "서울시 강남구 역삼동 123-123",
    type: "",
    status: "홍길동",
    productName: "나만의 커피 1호기/클래식 하모니 블랜드",
    productDetails: ["카페인", "홀빈", "벌크", "500g", "라벨"],
    price: 10000,
  },
];
const DeliveryAddressManagement = () => {
  const [readyModalIsOpen, setReadyModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

  const { setHeader } = useHeaderStore();
  useEffect(() => {
    setHeader({
      title: "배송지 관리",
      showBackButton: true,
    });
  }, []);

  const router = useRouter();

  const navigateToEditDelivery = () => {
    router.push("/edit-delivery");
  };

  const navigateToCreateDelivery = () => {
    router.push("/create-delivery");
  };
  return (
    <div className="px-4 pt-4 flex-1 flex flex-col ">
      {/* element list */}
      <div
        className="space-y-4 flex-1 overflow-y-auto mb-4 max-h-[calc(100vh-240px)]"
        style={{ scrollbarWidth: "none" }}
      >
        {delevireAddresses.map((address) => (
          <div
            key={address.id}
            className="border border-border-default rounded-2xl py-3 px-4 bg-white"
          >
            <div className="mb-5 flex items-center gap-2">
              <span className="text-sm leading-[20px] font-bold">
                {address.status}
              </span>

              {address.type && (
                <div
                  className={`bg-[#A67C52] px-2 py-1 rounded-lg h-[24px] text-[12px] text-white font-bold`}
                >
                  {address.type}
                </div>
              )}
            </div>

            {/* text address */}
            <div className="text-xs leading-[18px] font-normal space-y-1 pb-4 text-text-secondary">
              <p>인천 부평구 길주남로 113번길 12</p>
              <p>동아아파트 2동 512호</p>
              <p>010-2934-3017</p>
            </div>

            {/* buttons group */}
            <div className="flex items-center justify-between gap-2">
              <Link
                href={"#"}
                className="btn-action text-center"
              >
                선택
              </Link>
              <button
                onClick={() => setReadyModalIsOpen(true)}
                className="cursor-pointer size-8 border border-border-default rounded-sm flex items-center justify-center"
              >
                <Menu size={20} className="text-action-primary" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={navigateToCreateDelivery}
        className={`flex-none h-[48px] inline-block text-center w-full  py-3 rounded-lg font-bold leading-[24px] bg-linear-gradient text-white`}
      >
        배송지 추가
      </button>

      {/* ActionSheet Modal */}
      <ActionSheet
        isOpen={readyModalIsOpen}
        onClose={() => setReadyModalIsOpen(false)}
      >
        <div>
          <button
            onClick={navigateToEditDelivery}
            className={`inline-block mb-2 text-center w-full mt-auto py-3 rounded-lg font-bold leading-[24px] bg-linear-gradient text-white`}
          >
            수정
          </button>
          <button
            onClick={() => setDeleteModalIsOpen(true)}
            className={`inline-block text-center w-full mt-auto py-3 rounded-lg font-bold leading-[24px]`}
          >
            삭제
          </button>
        </div>
      </ActionSheet>

      {/* ActionSheet Modal */}
      <ActionSheet
        isOpen={deleteModalIsOpen}
        onClose={() => setDeleteModalIsOpen(false)}
      >
        <div>
          <p className="mb-6 text-center text-base leading-[20px] font-bold">
            배송지를 삭제하시겠습니까?
          </p>
          <button
            className={`inline-block mb-2 text-center w-full mt-auto py-3 rounded-lg font-bold leading-[24px] bg-linear-gradient text-white`}
          >
            삭제
          </button>
          <button
            className={`inline-block text-center w-full mt-auto py-3 rounded-lg font-bold leading-[24px]`}
          >
            취소
          </button>
        </div>
      </ActionSheet>
    </div>
  );
};

export default DeliveryAddressManagement;

// <div key={address.id} className="border border-border-default rounded-2xl py-3 px-4">
