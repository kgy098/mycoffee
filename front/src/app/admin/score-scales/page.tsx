"use client";

import { useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminTable from "@/components/admin/AdminTable";
import { useGet, usePost } from "@/hooks/useApi";
 
 type ScoreScale = {
   id: number;
   attribute_key: string;
   attribute_label?: string | null;
   score: number;
   description?: string | null;
 };
 
 export default function ScoreScalesPage() {
   const [attributeKey, setAttributeKey] = useState("");
   const [attributeLabel, setAttributeLabel] = useState("");
   const [score, setScore] = useState("");
   const [description, setDescription] = useState("");
   const [message, setMessage] = useState<string | null>(null);
 
   const {
     data: scales = [],
     isLoading,
     error,
     refetch,
   } = useGet<ScoreScale[]>(
     ["admin-score-scales"],
     "/api/score-scales",
     undefined,
     { refetchOnWindowFocus: false }
   );
 
   const { mutate: createScale, isPending } = usePost<ScoreScale, ScoreScale>(
     "/api/score-scales",
     {
       onSuccess: () => {
         setAttributeKey("");
         setAttributeLabel("");
         setScore("");
         setDescription("");
         setMessage("저장되었습니다.");
         refetch();
       },
       onError: (err: any) => {
         setMessage(err?.response?.data?.detail || "저장에 실패했습니다.");
       },
     }
   );
 
   const submit = () => {
     setMessage(null);
     if (!attributeKey || !score) {
       setMessage("항목 키와 점수는 필수입니다.");
       return;
     }
     createScale({
       attribute_key: attributeKey,
       attribute_label: attributeLabel || null,
       score: Number(score),
       description: description || null,
     } as any);
   };
 
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="취향 분석 항목 관리"
        description="추천 알고리즘 기준이 되는 항목을 관리합니다."
      />

      <div className="rounded-xl border border-white/10 bg-[#141414] p-6">
        <h2 className="text-sm font-semibold text-white">항목 추가</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs text-white/60">라벨</label>
            <input
              className="mt-1 w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white/80"
              placeholder="예: 산미"
              value={attributeLabel}
              onChange={(event) => setAttributeLabel(event.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-white/60">항목 키</label>
            <input
              className="mt-1 w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white/80"
              placeholder="예: acidity"
              value={attributeKey}
              onChange={(event) => setAttributeKey(event.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-white/60">점수</label>
            <input
              className="mt-1 w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white/80"
              placeholder="0~5"
              value={score}
              onChange={(event) => setScore(event.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-white/60">설명</label>
            <input
              className="mt-1 w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white/80"
              placeholder="항목 설명을 입력하세요"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>
        </div>
        <div className="mt-4">
          <button
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#101010]"
            onClick={submit}
            disabled={isPending}
          >
            {isPending ? "저장 중..." : "저장"}
          </button>
          {message && <p className="mt-3 text-xs text-white/60">{message}</p>}
          {error && (
            <p className="mt-3 text-xs text-rose-200">
              데이터를 불러오지 못했습니다.
            </p>
          )}
        </div>
      </div>

      <AdminTable
        columns={["항목 키", "라벨", "점수", "설명"]}
        rows={
          isLoading
            ? []
            : scales.map((scale) => [
                scale.attribute_key,
                scale.attribute_label || "-",
                String(scale.score),
                scale.description || "-",
              ])
        }
        emptyMessage={isLoading ? "로딩 중..." : "등록된 항목이 없습니다."}
      />
    </div>
  );
}
