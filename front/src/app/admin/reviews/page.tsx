"use client";

import AdminBadge from "@/components/admin/AdminBadge";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminTable from "@/components/admin/AdminTable";
import { useGet } from "@/hooks/useApi";
 
 type ReviewItem = {
   id: number;
   blend_name?: string | null;
   user_display_name?: string | null;
   rating?: number | null;
   created_at: string;
 };
 
 export default function ReviewsPage() {
   const { data: reviews = [], isLoading, error } = useGet<ReviewItem[]>(
     ["admin-reviews"],
     "/api/reviews",
     undefined,
     { refetchOnWindowFocus: false }
   );
 
   return (
     <div className="space-y-6">
       <AdminPageHeader
         title="리뷰 모니터링"
         description="최근 작성된 리뷰를 관리합니다."
       />
 
       <AdminTable
         columns={["리뷰ID", "커피", "작성자", "평점", "작성일", "상태"]}
        rows={
          isLoading
            ? []
            : reviews.map((review) => [
                review.id,
                review.blend_name || "-",
                review.user_display_name || "-",
                review.rating ? `${review.rating}점` : "-",
                new Date(review.created_at).toLocaleDateString(),
                <AdminBadge
                  key={`${review.id}-status`}
                  label="정상"
                  tone="success"
                />,
              ])
        }
        emptyMessage={
          isLoading
            ? "로딩 중..."
            : error
            ? "리뷰 데이터를 불러오지 못했습니다."
            : "등록된 리뷰가 없습니다."
        }
       />
     </div>
   );
 }
