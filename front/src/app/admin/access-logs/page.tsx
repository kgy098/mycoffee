"use client";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminTable from "@/components/admin/AdminTable";
import { useGet } from "@/hooks/useApi";
 
 type AccessLog = {
   id: number;
   admin_id: number;
   action: string;
   ip_address: string;
   created_at: string;
 };
 
 export default function AccessLogsPage() {
   const { data: logs = [], isLoading, error } = useGet<AccessLog[]>(
     ["admin-access-logs"],
     "/api/admin/access-logs",
     undefined,
     { refetchOnWindowFocus: false }
   );
 
   return (
     <div className="space-y-6">
       <AdminPageHeader
         title="접근 로그"
         description="관리자 활동 로그를 확인합니다."
       />
 
       <AdminTable
         columns={["로그ID", "관리자", "IP", "행동", "시간"]}
        rows={
          isLoading
            ? []
            : logs.map((log) => [
                log.id,
                `관리자 #${log.admin_id}`,
                log.ip_address,
                log.action,
                new Date(log.created_at).toLocaleString(),
              ])
        }
        emptyMessage={
          isLoading
            ? "로딩 중..."
            : error
            ? "접근 로그를 불러오지 못했습니다."
            : "접근 로그가 없습니다."
        }
       />
     </div>
   );
 }
