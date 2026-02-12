"use client";

import AdminBadge from "@/components/admin/AdminBadge";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminTable from "@/components/admin/AdminTable";
import { useGet } from "@/hooks/useApi";
 
 type ManagementItem = {
   subscription_id: number;
   user_id: number;
   user_name?: string | null;
   blend_name?: string | null;
   status: string;
   last_payment_at?: string | null;
   next_shipment_at?: string | null;
 };
 
 export default function SubscriptionManagementPage() {
   const { data: managementItems = [], isLoading, error } = useGet<ManagementItem[]>(
     ["admin-subscription-management"],
     "/api/admin/subscriptions/management",
     undefined,
     { refetchOnWindowFocus: false }
   );
 
   return (
     <div className="space-y-6">
       <AdminPageHeader
         title="결제/배송/해지 관리"
         description="구독 결제, 배송, 해지 요청을 처리합니다."
       />
 
       <AdminTable
         columns={["구독번호", "회원", "상품", "상태", "최근 결제일", "다음 배송일"]}
        rows={
          isLoading
            ? []
            : managementItems.map((item) => [
                item.subscription_id,
                item.user_name || `회원 #${item.user_id}`,
                item.blend_name || "-",
                <AdminBadge
                  key={`${item.subscription_id}-status`}
                  label={item.status}
                  tone={item.status === "active" ? "success" : "warning"}
                />,
                item.last_payment_at
                  ? new Date(item.last_payment_at).toLocaleDateString()
                  : "-",
                item.next_shipment_at
                  ? new Date(item.next_shipment_at).toLocaleDateString()
                  : "-",
              ])
        }
        emptyMessage={
          isLoading
            ? "로딩 중..."
            : error
            ? "구독 관리 데이터를 불러오지 못했습니다."
            : "구독 관리 내역이 없습니다."
        }
       />
     </div>
   );
 }
