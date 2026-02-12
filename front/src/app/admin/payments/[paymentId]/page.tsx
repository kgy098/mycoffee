"use client";

import Link from "next/link";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminBadge from "@/components/admin/AdminBadge";
import { useGet } from "@/hooks/useApi";

type PaymentDetail = {
  id: number;
  subscription_id: number;
  user_id: number;
  amount: number;
  status: string;
  payment_method?: string | null;
  created_at: string;
};

export default function PaymentDetailPage({
  params,
}: {
  params: { paymentId: string };
}) {
  const { data: payment, isLoading, error } = useGet<PaymentDetail>(
    ["admin-payment", params.paymentId],
    `/api/admin/payments/${params.paymentId}`,
    undefined,
    { refetchOnWindowFocus: false }
  );

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="결제/환불 상세"
        description="결제 및 환불 처리 정보를 확인합니다."
        actions={
          <Link
            href="/admin/payments"
            className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white/70"
          >
            목록으로
          </Link>
        }
      />

      {error && (
        <p className="text-sm text-rose-200">
          결제 정보를 불러오지 못했습니다.
        </p>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-[#141414] p-6 space-y-4">
          <div>
            <p className="text-xs text-white/50">결제 ID</p>
            <p className="text-sm text-white">{payment?.id || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-white/50">결제일시</p>
            <p className="text-sm text-white">
              {payment?.created_at
                ? new Date(payment.created_at).toLocaleString()
                : "-"}
            </p>
          </div>
          <div>
            <p className="text-xs text-white/50">판매타입</p>
            <p className="text-sm text-white">구독</p>
          </div>
          <div>
            <p className="text-xs text-white/50">상태</p>
            <AdminBadge label={payment?.status || "로딩 중"} tone="warning" />
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#141414] p-6 space-y-4">
          <div>
            <p className="text-xs text-white/50">회원</p>
            <p className="text-sm text-white">
              {payment ? `회원 #${payment.user_id}` : "-"}
            </p>
          </div>
          <div>
            <p className="text-xs text-white/50">결제수단</p>
            <p className="text-sm text-white">{payment?.payment_method || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-white/50">결제 금액</p>
            <p className="text-sm text-white">
              {payment?.amount
                ? `${Number(payment.amount).toLocaleString()}원`
                : "-"}
            </p>
          </div>
          <div>
            <p className="text-xs text-white/50">구독 ID</p>
            <p className="text-sm text-white">{payment?.subscription_id || "-"}</p>
          </div>
        </div>
      </div>
      {isLoading && <p className="text-xs text-white/60">로딩 중...</p>}
    </div>
  );
}
