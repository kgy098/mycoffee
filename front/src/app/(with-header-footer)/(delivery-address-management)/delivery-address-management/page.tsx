"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import ActionSheet from "@/components/ActionSheet";
import { useRouter } from "next/navigation";
import { useHeaderStore } from "@/stores/header-store";
import { useGet } from "@/hooks/useApi";
import { useUserStore } from "@/stores/user-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
const DeliveryAddressManagement = () => {
  const [readyModalIsOpen, setReadyModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);

  const { setHeader } = useHeaderStore();
  const { data: user } = useUserStore((state) => state.user);
  const queryClient = useQueryClient();
  useEffect(() => {
    setHeader({
      title: "배송지 관리",
      showBackButton: true,
    });
  }, []);

  const router = useRouter();

  const navigateToEditDelivery = (addressId?: number | null) => {
    if (addressId) {
      router.push(`/edit-delivery?id=${addressId}`);
      return;
    }
    router.push("/edit-delivery");
  };

  const navigateToCreateDelivery = () => {
    router.push("/create-delivery");
  };

  const { data: deliveryAddresses } = useGet<any[]>(
    ["delivery-addresses", user?.user_id],
    "/api/delivery-addresses",
    { params: { user_id: user?.user_id } },
    { enabled: !!user?.user_id }
  );

  const { mutate: setDefaultAddress } = useMutation({
    mutationFn: async (addressId: number) => {
      const response = await api.put(`/api/delivery-addresses/${addressId}/set-default`, null, {
        params: { user_id: user?.user_id },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery-addresses", user?.user_id] });
    },
  });

  const { mutate: deleteAddress } = useMutation({
    mutationFn: async (addressId: number) => {
      const response = await api.delete(`/api/delivery-addresses/${addressId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery-addresses", user?.user_id] });
      setDeleteModalIsOpen(false);
      setReadyModalIsOpen(false);
      setSelectedAddressId(null);
    },
  });

  const handleDeleteAddress = () => {
    if (selectedAddressId) {
      deleteAddress(selectedAddressId);
    }
  };
  return (
    <div className="px-4 pt-4 flex-1 flex flex-col ">
      {/* element list */}
      <div
        className="space-y-4 flex-1 overflow-y-auto mb-4 max-h-[calc(100vh-240px)]"
        style={{ scrollbarWidth: "none" }}
      >
        {(deliveryAddresses || []).map((address) => (
          <div
            key={address.id}
            className="border border-border-default rounded-2xl py-3 px-4 bg-white"
          >
            <div className="mb-5 flex items-center gap-2">
              <span className="text-sm leading-[20px] font-bold">
                {address.recipient_name}
              </span>

              {address.is_default && (
                <div
                  className={`bg-[#A67C52] px-2 py-1 rounded-lg h-[24px] text-[12px] text-white font-bold`}
                >
                  기본 배송지
                </div>
              )}
            </div>

            {/* text address */}
            <div className="text-xs leading-[18px] font-normal space-y-1 pb-4 text-text-secondary">
              <p>{address.address_line1}</p>
              {address.address_line2 && <p>{address.address_line2}</p>}
              <p>{address.phone_number}</p>
            </div>

            {/* buttons group */}
            <div className="flex items-center justify-between gap-2">
              <button
                className="btn-action text-center"
                onClick={() => setDefaultAddress(address.id)}
              >
                선택
              </button>
              <button
                onClick={() => { setReadyModalIsOpen(true); setSelectedAddressId(address.id); }}
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
            onClick={() => navigateToEditDelivery(selectedAddressId)}
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
            onClick={handleDeleteAddress}
            className={`inline-block mb-2 text-center w-full mt-auto py-3 rounded-lg font-bold leading-[24px] bg-linear-gradient text-white`}
          >
            삭제
          </button>
          <button
            onClick={() => setDeleteModalIsOpen(false)}
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
