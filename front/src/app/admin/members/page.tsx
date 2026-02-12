"use client";

import Link from "next/link";
import { useState } from "react";
import AdminBadge from "@/components/admin/AdminBadge";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminTable from "@/components/admin/AdminTable";
import { useGet } from "@/hooks/useApi";
 
 type AdminUser = {
   id: number;
   email: string;
   display_name?: string | null;
   phone_number?: string | null;
   provider?: string | null;
   is_admin: boolean;
   created_at: string;
   subscription_count: number;
 };
 
 export default function MembersListPage() {
   const [search, setSearch] = useState("");
   const [provider, setProvider] = useState("");
  const [isAdmin, setIsAdmin] = useState("");
 
  const { data: members = [], isLoading, error } = useGet<AdminUser[]>(
    ["admin-users", search, provider, isAdmin],
     "/api/admin/users",
     {
       params: {
         q: search || undefined,
         provider: provider || undefined,
        is_admin: isAdmin ? isAdmin === "true" : undefined,
       },
     },
     { refetchOnWindowFocus: false }
   );
 
   return (
     <div className="space-y-6">
       <AdminPageHeader
         title="회원관리"
         description="회원 상태와 정보를 관리합니다."
         actions={
           <Link
             href="/admin/members/new"
             className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#101010]"
           >
             회원 등록
           </Link>
         }
       />
 
       <div className="rounded-xl border border-white/10 bg-[#141414] p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <div>
             <label className="text-xs text-white/60">가입 채널</label>
            <select
              className="mt-1 w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white/80"
              value={provider}
              onChange={(event) => setProvider(event.target.value)}
            >
              <option value="">전체</option>
              <option value="email">이메일</option>
              <option value="kakao">카카오</option>
              <option value="naver">네이버</option>
              <option value="apple">애플</option>
            </select>
           </div>
          <div>
            <label className="text-xs text-white/60">관리자 여부</label>
            <select
              className="mt-1 w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white/80"
              value={isAdmin}
              onChange={(event) => setIsAdmin(event.target.value)}
            >
              <option value="">전체</option>
              <option value="true">관리자</option>
              <option value="false">일반 회원</option>
            </select>
          </div>
           <div>
             <label className="text-xs text-white/60">검색</label>
             <input
               className="mt-1 w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white/80"
               placeholder="이름 또는 이메일"
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
              setProvider("");
              setIsAdmin("");
            }}
          >
             검색 초기화
           </button>
         </div>
       </div>
 
       <AdminTable
         columns={[
           "이름",
           "이메일",
           "전화번호",
           "가입채널",
           "구독수",
           "상태",
           "가입일시",
           "관리",
         ]}
        rows={
          isLoading
            ? []
            : members.map((member) => [
                member.display_name || "-",
                member.email,
                member.phone_number || "-",
                member.provider || "-",
                `${member.subscription_count}건`,
                <AdminBadge
                  key={`${member.id}-status`}
                  label={member.is_admin ? "관리자" : "일반"}
                  tone={member.is_admin ? "info" : "success"}
                />,
                new Date(member.created_at).toLocaleDateString(),
                <Link
                  key={`${member.id}-link`}
                  href={`/admin/members/${member.id}`}
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
            ? "회원 데이터를 불러오지 못했습니다."
            : "회원이 없습니다."
        }
       />
     </div>
   );
 }
