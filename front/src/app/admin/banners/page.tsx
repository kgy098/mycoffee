 "use client";
 
 import React, { useMemo } from "react";
 import AdminPageHeader from "@/components/admin/AdminPageHeader";
 import AdminTable from "@/components/admin/AdminTable";
 import { useGet } from "@/hooks/useApi";
 
 type MonthlyCoffeeRow = {
   id: number;
   blend_id: number;
   month: string;
   banner_url?: string | null;
   comment?: string | null;
   desc?: string | null;
   is_visible: boolean;
   created_at: string;
   updated_at: string;
 };
 
 export default function AdminBannerPage() {
   const { data } = useGet<MonthlyCoffeeRow[]>(
     ["admin-banners"],
     "/api/monthly-coffees",
     { params: { limit: 200 } }
   );
 
   const rows = useMemo(() => {
     const items = data || [];
     return items.map((item) => {
       const monthText = item.month
         ? new Date(item.month).toLocaleDateString("ko-KR")
         : "-";
       const createdAt = item.created_at
         ? new Date(item.created_at).toLocaleDateString("ko-KR")
         : "-";
       return [
         item.id,
         monthText,
         item.blend_id,
         item.banner_url ? (
           <a
             key={`banner-${item.id}`}
             href={item.banner_url}
             target="_blank"
             rel="noreferrer"
             className="text-blue-400 underline"
           >
             배너 보기
           </a>
         ) : (
           <span className="text-white/40">-</span>
         ),
         item.is_visible ? "노출" : "비노출",
         createdAt,
       ];
     });
   }, [data]);
 
   return (
     <div>
       <AdminPageHeader
         title="배너 관리"
         description="메인 배너에 노출되는 이달의 커피 정보를 확인합니다."
       />
       <AdminTable
         columns={[
           "ID",
           "월",
           "블렌드 ID",
           "배너",
           "노출 여부",
           "생성일",
         ]}
         rows={rows}
         emptyMessage="등록된 배너가 없습니다."
       />
     </div>
   );
 }
