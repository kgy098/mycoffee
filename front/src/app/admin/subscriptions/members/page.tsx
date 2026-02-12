"use client";

import AdminBadge from "@/components/admin/AdminBadge";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminTable from "@/components/admin/AdminTable";
import { useGet } from "@/hooks/useApi";
 
 type SubscriptionMember = {
   id: number;
   user_id: number;
   user_name?: string | null;
   blend_name?: string | null;
   status: string;
   next_billing_date?: string | null;
 };
 
 export default function SubscriptionMembersPage() {
   const { data: members = [], isLoading, error } = useGet<SubscriptionMember[]>(
     ["admin-subscription-members"],
     "/api/admin/subscriptions",
     undefined,
     { refetchOnWindowFocus: false }
   );
 
   return (
     <div className="space-y-6">
       <AdminPageHeader
         title="구독 회원 관리"
         description="구독 중인 회원의 상태와 일정 관리."
       />
 
       <AdminTable
         columns={["회원", "구독 상품", "주기", "다음 결제일", "상태"]}
        rows={
          isLoading
            ? []
            : members.map((member) => [
                member.user_name || `회원 #${member.user_id}`,
                member.blend_name || "-",
                "-",
                member.next_billing_date
                  ? new Date(member.next_billing_date).toLocaleDateString()
                  : "-",
                <AdminBadge
                  key={`sub-member-${member.id}`}
                  label={member.status}
                  tone={member.status === "active" ? "success" : "warning"}
                />,
              ])
        }
        emptyMessage={
          isLoading
            ? "로딩 중..."
            : error
            ? "구독 회원 데이터를 불러오지 못했습니다."
            : "구독 회원이 없습니다."
        }
       />
     </div>
   );
 }
