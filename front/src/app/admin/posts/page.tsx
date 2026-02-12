"use client";

import AdminBadge from "@/components/admin/AdminBadge";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminTable from "@/components/admin/AdminTable";
import { useGet } from "@/hooks/useApi";
 
 type PostItem = {
   id: number;
   category: string;
   title: string;
   created_at: string;
   status: string;
 };
 
 export default function PostsPage() {
   const { data: posts = [], isLoading, error } = useGet<PostItem[]>(
     ["admin-posts"],
     "/api/admin/posts",
     undefined,
     { refetchOnWindowFocus: false }
   );
 
   return (
     <div className="space-y-6">
       <AdminPageHeader
         title="게시글 관리"
         description="커뮤니티 게시글을 등록하고 관리합니다."
       />
 
       <AdminTable
         columns={["게시글ID", "카테고리", "제목", "작성자", "등록일", "상태"]}
        rows={
          isLoading
            ? []
            : posts.map((post) => [
                post.id,
                post.category,
                post.title,
                "관리자",
                new Date(post.created_at).toLocaleDateString(),
                <AdminBadge
                  key={`${post.id}-status`}
                  label={post.status}
                  tone={post.status === "공개" ? "success" : "info"}
                />,
              ])
        }
        emptyMessage={
          isLoading
            ? "로딩 중..."
            : error
            ? "게시글 데이터를 불러오지 못했습니다."
            : "게시글이 없습니다."
        }
       />
     </div>
   );
 }
