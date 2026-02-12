"use client";

import Link from "next/link";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminBadge from "@/components/admin/AdminBadge";
import { useGet } from "@/hooks/useApi";

type OrderItem = {
  id: number;
  blend_name?: string | null;
  collection_name?: string | null;
  quantity: number;
  unit_price?: number | null;
  options?: Record<string, any> | null;
};

type OrderDetail = {
  id: number;
  order_number: string;
  order_type: string;
  status: string;
  total_amount?: number | null;
  delivery_fee?: number | null;
  created_at: string;
  items: OrderItem[];
  delivery_address?: {
    recipient_name?: string;
    phone_number?: string;
    postal_code?: string;
    address_line1?: string;
    address_line2?: string;
  } | null;
};

export default function OrderDetailPage({
  params,
}: {
  params: { orderId: string };
}) {
  const { data: order, isLoading, error } = useGet<OrderDetail>(
    ["admin-order", params.orderId],
    `/api/admin/orders/${params.orderId}`,
    undefined,
    { refetchOnWindowFocus: false }
  );

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="주문 상세"
        description="주문 정보와 처리 상태를 확인합니다."
        actions={
          <Link
            href="/admin/orders"
            className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white/70"
          >
            목록으로
          </Link>
        }
      />

      {error && (
        <p className="text-sm text-rose-200">
          주문 정보를 불러오지 못했습니다.
        </p>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-[#141414] p-6 space-y-4">
          <div>
            <p className="text-xs text-white/50">주문번호</p>
            <p className="text-sm text-white">{order?.order_number || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-white/50">주문일시</p>
            <p className="text-sm text-white">
              {order?.created_at ? new Date(order.created_at).toLocaleString() : "-"}
            </p>
          </div>
          <div>
            <p className="text-xs text-white/50">판매타입</p>
            <p className="text-sm text-white">
              {order?.order_type === "subscription" ? "구독" : "단품"}
            </p>
          </div>
          <div>
            <p className="text-xs text-white/50">상태</p>
            <AdminBadge label={order?.status || "로딩 중"} tone="info" />
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#141414] p-6 space-y-4">
          <div>
            <p className="text-xs text-white/50">상품명</p>
            <p className="text-sm text-white">
              {order?.items?.[0]?.blend_name || order?.items?.[0]?.collection_name || "-"}
            </p>
          </div>
          <div>
            <p className="text-xs text-white/50">옵션</p>
            <p className="text-sm text-white">
              {order?.items?.[0]?.options
                ? JSON.stringify(order.items[0].options)
                : "-"}
            </p>
          </div>
          <div>
            <p className="text-xs text-white/50">주문수량</p>
            <p className="text-sm text-white">
              {order?.items?.[0]?.quantity ? `${order.items[0].quantity}개` : "-"}
            </p>
          </div>
          <div>
            <p className="text-xs text-white/50">결제금액</p>
            <p className="text-sm text-white">
              {order?.total_amount
                ? `${Number(order.total_amount).toLocaleString()}원`
                : "-"}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-[#141414] p-6 space-y-4">
        <h2 className="text-sm font-semibold text-white">배송 정보</h2>
        {isLoading ? (
          <p className="text-sm text-white/60">로딩 중...</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs text-white/50">수령인</p>
              <p className="text-sm text-white">
                {order?.delivery_address?.recipient_name || "-"}
              </p>
            </div>
            <div>
              <p className="text-xs text-white/50">연락처</p>
              <p className="text-sm text-white">
                {order?.delivery_address?.phone_number || "-"}
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs text-white/50">배송지</p>
              <p className="text-sm text-white">
                {order?.delivery_address
                  ? `${order.delivery_address.postal_code || ""} ${
                      order.delivery_address.address_line1 || ""
                    } ${order.delivery_address.address_line2 || ""}`
                  : "-"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
