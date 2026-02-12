"use client";

import { useState } from "react";
import AdminBadge from "@/components/admin/AdminBadge";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminTable from "@/components/admin/AdminTable";
import { useGet } from "@/hooks/useApi";
 
 type PointsTransaction = {
   id: number;
   user_id: number;
   change_amount: number;
   reason: string;
   note?: string | null;
   created_at: string;
 };
 
 export default function PointsPage() {
  const [userIdInput, setUserIdInput] = useState("");
  const [appliedUserId, setAppliedUserId] = useState<number | null>(null);
   const [txnType, setTxnType] = useState("all");
 
   const { data: transactions = [], isLoading, error } = useGet<PointsTransaction[]>(
     ["admin-points", appliedUserId, txnType],
    "/api/admin/points/transactions",
     {
       params: {
         user_id: appliedUserId ?? undefined,
         txn_type: txnType,
       },
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
         title="포인트 적립/사용 내역"
         description="회원 포인트 내역을 관리합니다."
       />
 
      <div className="rounded-xl border border-white/10 bg-[#141414] p-4">
        <div className="grid gap-3 md:grid-cols-4">
          <div>
            <label className="text-xs text-white/60">조회할 회원 ID</label>
            <input
              className="mt-1 w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white/80"
              placeholder="예: 1"
              value={userIdInput}
              onChange={(event) => setUserIdInput(event.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-white/60">구분</label>
            <select
              className="mt-1 w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white/80"
              value={txnType}
              onChange={(event) => setTxnType(event.target.value)}
            >
              <option value="all">전체</option>
              <option value="earned">적립</option>
              <option value="used">사용</option>
              <option value="canceled">취소/환불</option>
            </select>
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
              setTxnType("all");
            }}
          >
            초기화
          </button>
        </div>
      </div>

       <AdminTable
         columns={["내역ID", "회원", "구분", "포인트", "사유", "일자"]}
        rows={
          isLoading
            ? []
            : transactions.map((point) => [
                point.id,
                `회원 #${point.user_id}`,
                <AdminBadge
                  key={`${point.id}-type`}
                  label={point.change_amount >= 0 ? "적립" : "사용"}
                  tone={point.change_amount >= 0 ? "success" : "warning"}
                />,
                `${Math.abs(point.change_amount).toLocaleString()}P`,
                point.reason,
                new Date(point.created_at).toLocaleDateString(),
              ])
        }
        emptyMessage={
          isLoading
            ? "로딩 중..."
            : error
            ? "포인트 데이터를 불러오지 못했습니다."
          : "내역이 없습니다."
        }
       />
     </div>
   );
 }
