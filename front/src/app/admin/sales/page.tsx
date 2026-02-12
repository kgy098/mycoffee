"use client";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminStatCard from "@/components/admin/AdminStatCard";
import AdminTable from "@/components/admin/AdminTable";
import { useGet } from "@/hooks/useApi";
 
 type SalesSummary = {
   today_sales: number;
   subscription_ratio: number;
   single_ratio: number;
 };
 
 type DailySales = {
   date: string;
   total_amount: number;
 };
 
 type ProductSales = {
   blend_id: number;
   name: string;
   order_count: number;
 };
 
type TasteDistribution = {
  aroma: number;
  acidity: number;
  sweetness: number;
  body: number;
  nuttiness: number;
};

 export default function SalesPage() {
   const { data: summary } = useGet<SalesSummary>(
     ["admin-sales-summary"],
     "/api/admin/sales/summary",
     undefined,
     { refetchOnWindowFocus: false }
   );
   const { data: dailySales = [] } = useGet<DailySales[]>(
     ["admin-sales-daily"],
     "/api/admin/sales/daily",
     undefined,
     { refetchOnWindowFocus: false }
   );
   const { data: productSales = [] } = useGet<ProductSales[]>(
     ["admin-sales-products"],
     "/api/admin/sales/products",
     undefined,
     { refetchOnWindowFocus: false }
   );
  const { data: taste } = useGet<TasteDistribution>(
    ["admin-sales-taste"],
    "/api/admin/sales/taste-distribution",
    undefined,
    { refetchOnWindowFocus: false }
  );
 
   return (
     <div className="space-y-6">
       <AdminPageHeader
         title="판매 통계"
         description="기간별 매출과 인기 상품 지표를 확인합니다."
       />
 
       <div className="grid gap-4 md:grid-cols-3">
        <AdminStatCard
          label="오늘 매출"
          value={`${Number(summary?.today_sales || 0).toLocaleString()}원`}
          description="실시간 집계"
        />
        <AdminStatCard
          label="구독 비중"
          value={`${summary?.subscription_ratio || 0}%`}
          description="최근 30일"
        />
        <AdminStatCard
          label="단품 비중"
          value={`${summary?.single_ratio || 0}%`}
          description="최근 30일"
        />
       </div>
 
       <div className="grid gap-6 xl:grid-cols-2">
         <div className="rounded-xl border border-white/10 bg-[#141414] p-6">
           <h3 className="text-sm font-semibold text-white">기간별 매출 현황</h3>
          <div className="mt-4">
            <AdminTable
              columns={["일자", "매출"]}
              rows={dailySales.map((item) => [
                new Date(item.date).toLocaleDateString(),
                `${Number(item.total_amount).toLocaleString()}원`,
              ])}
              emptyMessage="매출 데이터가 없습니다."
            />
          </div>
         </div>
         <div className="rounded-xl border border-white/10 bg-[#141414] p-6">
           <h3 className="text-sm font-semibold text-white">상품별 매출 현황</h3>
          <div className="mt-4">
            <AdminTable
              columns={["상품", "주문수"]}
              rows={productSales.map((item) => [
                item.name,
                `${item.order_count}건`,
              ])}
              emptyMessage="상품별 매출 데이터가 없습니다."
            />
          </div>
         </div>
       </div>
 
       <div className="rounded-xl border border-white/10 bg-[#141414] p-6">
         <h3 className="text-sm font-semibold text-white">취향 분포도</h3>
        <div className="mt-4">
          <AdminTable
            columns={["항목", "평균 점수"]}
            rows={[
              ["향", (taste?.aroma ?? 0).toFixed(1)],
              ["산미", (taste?.acidity ?? 0).toFixed(1)],
              ["단맛", (taste?.sweetness ?? 0).toFixed(1)],
              ["바디", (taste?.body ?? 0).toFixed(1)],
              ["고소함", (taste?.nuttiness ?? 0).toFixed(1)],
            ]}
            emptyMessage="데이터가 없습니다."
          />
        </div>
       </div>
     </div>
   );
 }
