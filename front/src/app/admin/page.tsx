"use client";

import Link from "next/link";
import AdminBadge from "@/components/admin/AdminBadge";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminStatCard from "@/components/admin/AdminStatCard";
import AdminTable from "@/components/admin/AdminTable";
import { useGet } from "@/hooks/useApi";
 
 type DashboardStats = {
   today_sales: number;
   new_members: number;
   active_users: number;
   shipping_in_progress: number;
 };
 
 type NewMember = {
   id: number;
   name?: string | null;
   provider?: string | null;
   created_at: string;
 };
 
 type PopularCoffee = {
   blend_id: number;
   name: string;
   order_count: number;
 };
 
 export default function AdminDashboardPage() {
   const { data: stats } = useGet<DashboardStats>(
     ["admin-dashboard-stats"],
     "/api/admin/dashboard/stats",
     undefined,
     { refetchOnWindowFocus: false }
   );
   const { data: newMembers = [] } = useGet<NewMember[]>(
     ["admin-dashboard-new-members"],
     "/api/admin/dashboard/new-members",
     undefined,
     { refetchOnWindowFocus: false }
   );
   const { data: popularCoffee = [] } = useGet<PopularCoffee[]>(
     ["admin-dashboard-popular-coffee"],
     "/api/admin/dashboard/popular-coffee",
     undefined,
     { refetchOnWindowFocus: false }
   );
 
   const statCards = [
     {
       label: "오늘 매출",
       value: `${Number(stats?.today_sales || 0).toLocaleString()}원`,
       description: "오늘 기준",
     },
     {
       label: "신규 가입 회원",
       value: `${stats?.new_members || 0}명`,
       description: "최근 24시간 기준",
     },
     {
       label: "활성 사용자",
       value: `${stats?.active_users || 0}명`,
       description: "최근 7일 기준",
     },
     {
       label: "배송 진행",
       value: `${stats?.shipping_in_progress || 0}건`,
       description: "배송 준비/배송중",
     },
   ];
 
   return (
     <div className="space-y-8">
       <AdminPageHeader
         title="대시보드"
         description="운영 현황을 빠르게 확인하세요."
         actions={
           <Link
             href="/admin/orders"
             className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/80 hover:border-white/30"
           >
             주문 내역 보기
           </Link>
         }
       />
 
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => (
          <AdminStatCard key={stat.label} {...stat} />
        ))}
      </section>
 
       <section className="grid gap-6 xl:grid-cols-2">
         <div className="space-y-4">
           <div className="flex items-center justify-between">
             <h2 className="text-lg font-semibold text-white">신규 가입 회원</h2>
             <Link href="/admin/members" className="text-xs text-white/60 hover:text-white">
               회원 전체보기
             </Link>
           </div>
          <AdminTable
            columns={["이름", "가입일시", "가입채널", "상태"]}
            rows={newMembers.map((member) => [
              member.name || `회원 #${member.id}`,
              new Date(member.created_at).toLocaleString(),
              member.provider || "-",
              <AdminBadge key={`${member.id}-status`} label="정상" tone="success" />,
            ])}
          />
         </div>
 
         <div className="space-y-4">
           <div className="flex items-center justify-between">
             <h2 className="text-lg font-semibold text-white">인기 커피 현황</h2>
             <Link href="/admin/products" className="text-xs text-white/60 hover:text-white">
               상품 관리로 이동
             </Link>
           </div>
          <AdminTable
            columns={["순위", "커피", "주문수"]}
            rows={popularCoffee.map((item, index) => [
              `${index + 1}위`,
              item.name,
              `${item.order_count}건`,
            ])}
          />
         </div>
       </section>
     </div>
   );
 }
