"use client";

import React, { useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { useGet } from "@/hooks/useApi";
import { useHeaderStore } from "@/stores/header-store";

const OrderDeliveryDetail = () => {
  const params = useParams();
  const orderId = params?.id ? Number(params.id) : null;
  const { setHeader } = useHeaderStore();

  useEffect(() => {
    setHeader({
      title: "주문 상세",
      showBackButton: true,
    });
  }, [setHeader]);

  const { data: order } = useGet<any>(
    ["order-detail", orderId],
    orderId ? `/api/orders/${orderId}` : "/api/orders/0",
    {},
    { enabled: !!orderId }
  );

  const statusLabel = useMemo(() => {
    const statusMap: Record<string, string> = {
      pending: "주문 접수",
      preparing: "배송 준비",
      shipping: "배송중",
      delivered: "배송 완료",
      cancelled: "취소",
      returned: "반품",
    };
    return statusMap[order?.status] || order?.status || "";
  }, [order?.status]);

  if (!orderId) {
    return <div className="p-4 text-sm text-text-secondary">주문 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <div className="bg-white rounded-lg p-3 border border-border-default">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-text-secondary">주문번호</p>
            <p className="text-sm font-bold">{order?.order_number || "-"}</p>
          </div>
          <span className="text-sm font-bold">{statusLabel}</span>
        </div>
        <p className="text-xs text-text-secondary mt-2">
          {order?.created_at ? new Date(order.created_at).toLocaleString("ko-KR") : ""}
        </p>
      </div>

      <div className="bg-white rounded-lg p-3 border border-border-default">
        <h3 className="text-sm font-bold mb-3">상품 정보</h3>
        {(order?.items || []).map((item: any) => (
          <div key={item.id} className="border border-border-default rounded-lg p-3 mb-3 last:mb-0">
            <p className="text-xs font-bold mb-2">
              {item.collection_name || item.blend_name || "나만의 커피"}
            </p>
            <div className="text-[12px] text-text-secondary mb-2 flex items-center gap-1 flex-wrap">
              {[
                item?.options?.caffeine,
                item?.options?.grind,
                item?.options?.package,
                item?.options?.weight,
                item?.quantity ? `${item.quantity}개` : null,
              ]
                .filter(Boolean)
                .map((detail: string, idx: number) => (
                  <span key={`${item.id}-detail-${idx}`} className="flex items-center gap-1">
                    {detail}
                    {idx < 4 && <span className="size-1 bg-[#9CA3AF] rounded-full inline-block"></span>}
                  </span>
                ))}
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-text-secondary">판매가</span>
              <span className="font-bold">
                {item?.unit_price ? Number(item.unit_price).toLocaleString("ko-KR") : "0"}원
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg p-3 border border-border-default">
        <h3 className="text-sm font-bold mb-3">배송지 정보</h3>
        {order?.delivery_address ? (
          <>
            <p className="text-xs font-bold">
              {order.delivery_address.recipient_name} {order.delivery_address.phone_number}
            </p>
            <p className="text-xs text-text-secondary mt-1">
              {order.delivery_address.address_line1} {order.delivery_address.address_line2 || ""}
            </p>
          </>
        ) : (
          <p className="text-xs text-text-secondary">배송지 정보가 없습니다.</p>
        )}
      </div>

      <div className="bg-white rounded-lg p-3 border border-border-default">
        <h3 className="text-sm font-bold mb-3">결제 정보</h3>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-text-secondary">상품금액</span>
          <span className="font-bold">
            {order?.total_amount ? Number(order.total_amount).toLocaleString("ko-KR") : "0"}원
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-text-secondary">배송비</span>
          <span className="font-bold">
            {order?.delivery_fee ? Number(order.delivery_fee).toLocaleString("ko-KR") : "0"}원
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderDeliveryDetail;
