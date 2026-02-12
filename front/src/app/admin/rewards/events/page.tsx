"use client";

import AdminBadge from "@/components/admin/AdminBadge";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminTable from "@/components/admin/AdminTable";
import { useGet } from "@/hooks/useApi";
 
 type RewardItem = {
   id: number;
   event_title: string;
   reward_points: number;
   status: string;
   created_at: string;
 };
 
 export default function EventRewardsPage() {
   const { data: rewards = [], isLoading, error } = useGet<RewardItem[]>(
     ["admin-rewards"],
     "/api/admin/rewards/events",
     undefined,
     { refetchOnWindowFocus: false }
   );
 
   return (
     <div className="space-y-6">
       <AdminPageHeader
         title="이벤트 리워드 지급"
         description="이벤트 리워드 지급 현황을 확인합니다."
       />
 
       <AdminTable
         columns={["지급ID", "이벤트", "회원", "리워드", "상태", "지급일"]}
        rows={
          isLoading
            ? []
            : rewards.map((reward) => [
                reward.id,
                reward.event_title,
                "-",
                `${reward.reward_points}P`,
                <AdminBadge
                  key={`${reward.id}-status`}
                  label={reward.status}
                  tone={reward.status === "진행중" ? "success" : "warning"}
                />,
                new Date(reward.created_at).toLocaleDateString(),
              ])
        }
        emptyMessage={
          isLoading
            ? "로딩 중..."
            : error
            ? "리워드 데이터를 불러오지 못했습니다."
            : "이벤트 리워드가 없습니다."
        }
       />
     </div>
   );
 }
