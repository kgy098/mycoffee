"use client";

import AdminBadge from "@/components/admin/AdminBadge";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminTable from "@/components/admin/AdminTable";
import { useGet } from "@/hooks/useApi";
 
 type AdminUser = {
   id: number;
   email: string;
   display_name?: string | null;
   created_at: string;
 };
 
 export default function AdminAccountsPage() {
   const { data: admins = [], isLoading, error } = useGet<AdminUser[]>(
     ["admin-admins"],
     "/api/admin/admins",
     undefined,
     { refetchOnWindowFocus: false }
   );
 
   return (
     <div className="space-y-6">
       <AdminPageHeader
         title="관리자 계정 / 권한"
         description="운영자 계정과 권한을 관리합니다."
       />
 
       <AdminTable
         columns={["계정ID", "이름", "이메일", "권한", "상태", "최근 접속"]}
        rows={
          isLoading
            ? []
            : admins.map((admin) => [
                admin.id,
                admin.display_name || "-",
                admin.email,
                "관리자",
                <AdminBadge key={`${admin.id}-status`} label="활성" tone="success" />,
                new Date(admin.created_at).toLocaleDateString(),
              ])
        }
        emptyMessage={
          isLoading
            ? "로딩 중..."
            : error
            ? "관리자 계정을 불러오지 못했습니다."
            : "등록된 관리자 계정이 없습니다."
        }
       />
     </div>
   );
 }
