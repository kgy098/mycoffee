"use client";

import { useState } from "react";
import AdminBadge from "@/components/admin/AdminBadge";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminTable from "@/components/admin/AdminTable";
import { useGet } from "@/hooks/useApi";
 
 type ShipmentItem = {
   id: number;
   subscription_id: number;
   user_id: number;
   blend_name?: string | null;
   tracking_number?: string | null;
   status: string;
   shipped_at?: string | null;
   delivered_at?: string | null;
 };
 
 export default function ShipmentsPage() {
   const [status, setStatus] = useState("");
  const [query, setQuery] = useState("");
   const { data: shipments = [], isLoading, error } = useGet<ShipmentItem[]>(
    ["admin-shipments", status, query],
     "/api/admin/shipments",
    { params: { status_filter: status || undefined, q: query || undefined } },
     { refetchOnWindowFocus: false }
   );
 
   return (
     <div className="space-y-6">
       <AdminPageHeader
         title="배송 관리"
         description="배송 상태를 확인하고 송장 업로드를 관리합니다."
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
              <option value="pending">배송준비중</option>
              <option value="processing">배송중</option>
              <option value="delivered">배송완료</option>
            </select>
           </div>
          <div className="md:col-span-2">
            <label className="text-xs text-white/60">송장번호</label>
            <input
              className="mt-1 w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white/80"
              placeholder="tracking number"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
         </div>
         <div className="mt-4 flex flex-wrap gap-2">
           <button className="rounded-lg bg-white px-4 py-2 text-xs font-semibold text-[#101010]">
             검색
           </button>
          <button
            className="rounded-lg border border-white/20 px-4 py-2 text-xs text-white/70"
            onClick={() => {
              setStatus("");
              setQuery("");
            }}
          >
             검색 초기화
           </button>
           <button className="rounded-lg border border-white/20 px-4 py-2 text-xs text-white/70">
             운송장 일괄 업로드
           </button>
         </div>
       </div>
 
       <AdminTable
         columns={["주문번호", "구분", "주문자", "송장번호", "상품명", "상태", "배송시작", "배송완료"]}
        rows={
          isLoading
            ? []
            : shipments.map((shipment) => [
                shipment.id,
                "구독",
                `회원 #${shipment.user_id}`,
                shipment.tracking_number || "-",
                shipment.blend_name || "-",
                <AdminBadge
                  key={`${shipment.id}-status`}
                  label={shipment.status}
                  tone={shipment.status === "delivered" ? "success" : "warning"}
                />,
                shipment.shipped_at
                  ? new Date(shipment.shipped_at).toLocaleDateString()
                  : "-",
                shipment.delivered_at
                  ? new Date(shipment.delivered_at).toLocaleDateString()
                  : "-",
              ])
        }
        emptyMessage={
          isLoading
            ? "로딩 중..."
            : error
            ? "배송 데이터를 불러오지 못했습니다."
            : "배송 내역이 없습니다."
        }
       />
     </div>
   );
 }
