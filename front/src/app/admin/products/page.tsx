"use client";

import Link from "next/link";
import { useState } from "react";
import AdminBadge from "@/components/admin/AdminBadge";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminTable from "@/components/admin/AdminTable";
import { useGet } from "@/hooks/useApi";
 
 type Blend = {
   id: number;
   name: string;
   aroma?: number;
   acidity?: number;
   sweetness?: number;
   body?: number;
   nuttiness?: number;
   price?: number | null;
   stock?: number | null;
   is_active?: boolean;
   created_at?: string;
 };
 
 export default function ProductsListPage() {
   const [search, setSearch] = useState("");
  const [saleStatus, setSaleStatus] = useState("");
  const { data: blends = [], isLoading, error } = useGet<Blend[]>(
    ["admin-blends", search],
    "/api/admin/blends",
    {
      params: {
        skip: 0,
        limit: 50,
        q: search || undefined,
        is_active: saleStatus ? saleStatus === "active" : undefined,
      },
    },
     { refetchOnWindowFocus: false }
   );
 
  const filtered = blends;
 
   return (
     <div className="space-y-6">
       <AdminPageHeader
         title="커피 상품"
         description="상품 정보를 등록하고 판매 상태를 관리합니다."
         actions={
           <Link
             href="/admin/products/new"
             className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#101010]"
           >
             상품 등록
           </Link>
         }
       />
 
       <div className="rounded-xl border border-white/10 bg-[#141414] p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <div>
             <label className="text-xs text-white/60">판매 상태</label>
            <select
              className="mt-1 w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white/80"
              value={saleStatus}
              onChange={(event) => setSaleStatus(event.target.value)}
            >
              <option value="">전체</option>
              <option value="active">판매중</option>
              <option value="inactive">중지</option>
            </select>
           </div>
           <div className="md:col-span-2">
             <label className="text-xs text-white/60">검색</label>
             <input
               className="mt-1 w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white/80"
               placeholder="상품명을 입력하세요"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
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
              setSearch("");
              setSaleStatus("");
            }}
          >
             검색 초기화
           </button>
         </div>
       </div>
 
       <AdminTable
         columns={[
           "상품명",
           "맛 프로파일",
           "가격",
           "재고상태",
           "상태",
           "등록일",
           "관리",
         ]}
        rows={
          isLoading
            ? []
            : filtered.map((product) => [
                product.name,
                `향 ${product.aroma ?? "-"} · 산미 ${product.acidity ?? "-"} · 단맛 ${
                  product.sweetness ?? "-"
                } · 바디 ${product.body ?? "-"} · 고소함 ${product.nuttiness ?? "-"}`,
                product.price ? `${Number(product.price).toLocaleString()}원` : "-",
                product.stock ?? "-",
                <AdminBadge
                  key={`${product.id}-status`}
                  label={product.is_active ? "판매중" : "중지"}
                  tone={product.is_active ? "success" : "warning"}
                />,
                product.created_at ? new Date(product.created_at).toLocaleDateString() : "-",
                <Link
                  key={`${product.id}-link`}
                  href={`/admin/products/${product.id}`}
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
            ? "상품 데이터를 불러오지 못했습니다."
            : "등록된 상품이 없습니다."
        }
       />
     </div>
   );
 }
