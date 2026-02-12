"use client";

import { useState } from "react";
import AdminBadge from "@/components/admin/AdminBadge";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminTable from "@/components/admin/AdminTable";
import { useGet } from "@/hooks/useApi";
 
 type SubscriptionItem = {
   id: number;
   user_id: number;
  user_name?: string | null;
   blend_name?: string | null;
   status: string;
   next_billing_date?: string | null;
   total_amount?: number | null;
   quantity: number;
 };
 
 export default function SubscriptionsPage() {
  const [userIdInput, setUserIdInput] = useState("");
  const [appliedUserId, setAppliedUserId] = useState<number | null>(null);
 
   const { data: subscriptions = [], isLoading, error } = useGet<SubscriptionItem[]>(
     ["admin-subscriptions", appliedUserId],
    "/api/admin/subscriptions",
     {
      params: { user_id: appliedUserId ?? undefined },
     },
     {
       refetchOnWindowFocus: false,
     }
   );
 
   const applyFilter = () => {
     const nextId = Number(userIdInput);
     setAppliedUserId(Number.isNaN(nextId) || nextId <= 0 ? null : nextId);
   };
 
   return (
     <div className="space-y-6">
       <AdminPageHeader
         title="구독 상품"
         description="구독 상품의 가격과 할인율을 관리합니다."
       />
 
       <div className="rounded-xl border border-white/10 bg-[#141414] p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="md:col-span-2">
            <label className="text-xs text-white/60">조회할 회원 ID</label>
            <input
              className="mt-1 w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white/80"
              placeholder="예: 1"
              value={userIdInput}
              onChange={(event) => setUserIdInput(event.target.value)}
            />
          </div>
        </div>
         <div className="mt-4 flex flex-wrap gap-2">
          <button
            className="rounded-lg bg-white px-4 py-2 text-xs font-semibold text-[#101010]"
            onClick={applyFilter}
          >
            조회
          </button>
          <button
            className="rounded-lg border border-white/20 px-4 py-2 text-xs text-white/70"
            onClick={() => {
              setUserIdInput("");
              setAppliedUserId(null);
            }}
          >
            초기화
          </button>
         </div>
       </div>
 
       <AdminTable
        columns={["구독ID", "회원", "상품명", "수량", "다음 결제일", "상태"]}
        rows={
          isLoading
            ? []
            : subscriptions.map((item) => [
                item.id,
                item.user_name || `회원 #${item.user_id}`,
                item.blend_name || "-",
                `${item.quantity}개`,
                item.next_billing_date
                  ? new Date(item.next_billing_date).toLocaleDateString()
                  : "-",
                <AdminBadge
                  key={`subscription-${item.id}`}
                  label={item.status}
                  tone={item.status === "active" ? "success" : "warning"}
                />,
              ])
        }
        emptyMessage={
          isLoading
            ? "로딩 중..."
            : error
            ? "구독 데이터를 불러오지 못했습니다."
          : "구독 내역이 없습니다."
        }
       />
     </div>
   );
 }
