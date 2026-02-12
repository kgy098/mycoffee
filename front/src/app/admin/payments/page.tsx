"use client";

import Link from "next/link";
import { useState } from "react";
import AdminBadge from "@/components/admin/AdminBadge";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminTable from "@/components/admin/AdminTable";
import { useGet } from "@/hooks/useApi";
 
 type PaymentItem = {
   id: number;
   subscription_id: number;
   user_id: number;
   amount: number;
   status: string;
   payment_method?: string | null;
   created_at: string;
 };
 
 export default function PaymentsPage() {
   const [status, setStatus] = useState("");
   const { data: payments = [], isLoading, error } = useGet<PaymentItem[]>(
     ["admin-payments", status],
     "/api/admin/payments",
     { params: { status_filter: status || undefined } },
     { refetchOnWindowFocus: false }
   );
 
   return (
     <div className="space-y-6">
       <AdminPageHeader
         title="결제/환불 내역"
         description="결제 상태와 환불 처리를 관리합니다."
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
              <option value="pending">대기</option>
              <option value="completed">결제완료</option>
              <option value="failed">결제실패</option>
              <option value="refunded">환불완료</option>
            </select>
           </div>
           <div className="md:col-span-2">
             <label className="text-xs text-white/60">검색</label>
             <input
               className="mt-1 w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white/80"
               placeholder="주문번호 또는 고객명"
             />
           </div>
         </div>
         <div className="mt-4 flex flex-wrap gap-2">
           <button className="rounded-lg bg-white px-4 py-2 text-xs font-semibold text-[#101010]">
             검색
           </button>
           <button className="rounded-lg border border-white/20 px-4 py-2 text-xs text-white/70">
             검색 초기화
           </button>
         </div>
       </div>
 
       <AdminTable
         columns={["주문번호", "결제일시", "구분", "주문자", "결제수단", "결제금액", "상태", "관리"]}
        rows={
          isLoading
            ? []
            : payments.map((payment) => [
                payment.id,
                new Date(payment.created_at).toLocaleString(),
                "구독",
                `회원 #${payment.user_id}`,
                payment.payment_method || "-",
                `${Number(payment.amount).toLocaleString()}원`,
                <AdminBadge
                  key={`${payment.id}-status`}
                  label={payment.status}
                  tone={payment.status === "completed" ? "success" : "warning"}
                />,
                <Link
                  key={`${payment.id}-link`}
                  href={`/admin/payments/${payment.id}`}
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
            ? "결제 데이터를 불러오지 못했습니다."
            : "결제 내역이 없습니다."
        }
       />
     </div>
   );
 }
