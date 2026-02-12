"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AdminBadge from "@/components/admin/AdminBadge";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminTable from "@/components/admin/AdminTable";
import { useGet } from "@/hooks/useApi";
import { useUserStore } from "@/stores/user-store";
 
 type OrderItem = {
   id: number;
   blend_name?: string | null;
   collection_name?: string | null;
   quantity: number;
   unit_price?: number | null;
 };
 
 type OrderResponse = {
   id: number;
   order_number: string;
   order_type: string;
   status: string;
   total_amount?: number | null;
   created_at: string;
   items: OrderItem[];
 };
 
 export default function OrdersPage() {
   const userIdFromStore = useUserStore((state) => state.user.data.user_id);
   const [userIdInput, setUserIdInput] = useState(
     userIdFromStore ? String(userIdFromStore) : ""
   );
   const [appliedUserId, setAppliedUserId] = useState<number | null>(
     userIdFromStore || null
   );
   const [status, setStatus] = useState("");
 
   const {
     data: orders = [],
     isLoading,
     error,
   } = useGet<OrderResponse[]>(
     ["admin-orders", appliedUserId, status],
     "/api/orders",
     {
       params: {
         user_id: appliedUserId ?? undefined,
         status: status || undefined,
       },
     },
     {
       enabled: Boolean(appliedUserId),
       refetchOnWindowFocus: false,
     }
   );
 
   useEffect(() => {
     if (!appliedUserId && userIdFromStore) {
       setAppliedUserId(userIdFromStore);
     }
   }, [appliedUserId, userIdFromStore]);
 
   const applyFilter = () => {
     const nextId = Number(userIdInput);
     setAppliedUserId(Number.isNaN(nextId) || nextId <= 0 ? null : nextId);
   };
 
   return (
     <div className="space-y-6">
       <AdminPageHeader
         title="주문 내역"
         description="주문 상태별로 관리하고 처리합니다."
       />
 
       <div className="rounded-xl border border-white/10 bg-[#141414] p-4">
         <div className="grid gap-3 md:grid-cols-4">
           <div>
             <label className="text-xs text-white/60">구분</label>
             <select className="mt-1 w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white/80">
              <option>전체</option>
              <option>단품</option>
              <option>구독</option>
             </select>
           </div>
           <div>
             <label className="text-xs text-white/60">상태</label>
            <select
              className="mt-1 w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white/80"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="">전체</option>
              <option value="pending">결제대기</option>
              <option value="paid">결제완료</option>
              <option value="shipping">배송중</option>
              <option value="delivered">배송완료</option>
              <option value="canceled">취소</option>
              <option value="refunded">반품</option>
            </select>
           </div>
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
           <button className="rounded-lg border border-white/20 px-4 py-2 text-xs text-white/70">
             검색 초기화
           </button>
         </div>
       </div>
 
       <AdminTable
         columns={["주문번호", "주문일시", "구분", "주문자", "상품명", "결제금액", "상태", "관리"]}
        rows={
          isLoading
            ? []
            : orders.map((order) => [
                order.order_number,
                new Date(order.created_at).toLocaleString(),
                order.order_type === "subscription" ? "구독" : "단품",
                appliedUserId ? `회원 #${appliedUserId}` : "-",
                order.items?.[0]?.blend_name ||
                  order.items?.[0]?.collection_name ||
                  "-",
                order.total_amount
                  ? `${Number(order.total_amount).toLocaleString()}원`
                  : "-",
                <AdminBadge
                  key={`${order.id}-status`}
                  label={order.status}
                  tone={order.status === "delivered" ? "success" : "info"}
                />,
                <Link
                  key={`${order.id}-link`}
                  href={`/admin/orders/${order.id}`}
                  className="text-xs text-sky-200 hover:text-sky-100"
                >
                  상세보기
                </Link>,
              ])
        }
        emptyMessage={
          isLoading
            ? "로딩 중..."
            : error
            ? "주문 데이터를 불러오지 못했습니다."
            : appliedUserId
            ? "주문 내역이 없습니다."
            : "회원 ID를 입력해주세요."
        }
       />
     </div>
   );
 }
