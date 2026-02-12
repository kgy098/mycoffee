"use client";

import Link from "next/link";
import { useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminTable from "@/components/admin/AdminTable";
import { useGet, usePut } from "@/hooks/useApi";
 
 type ScoreScale = {
   id: number;
   attribute_key: string;
   attribute_label?: string | null;
   score: number;
   description?: string | null;
 };
 
 export default function ScoreScalesPage() {
   const [message, setMessage] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [editScore, setEditScore] = useState("");
  const [editDescription, setEditDescription] = useState("");
 
   const {
     data: scales = [],
     isLoading,
     error,
     refetch,
   } = useGet<ScoreScale[]>(
     ["admin-score-scales"],
    "/api/admin/score-scales",
     undefined,
     { refetchOnWindowFocus: false }
   );
 
  const { mutate: updateScale, isPending } = usePut<ScoreScale, Partial<ScoreScale>>(
    editingId ? `/api/admin/score-scales/${editingId}` : "/api/admin/score-scales/0",
     {
       onSuccess: () => {
        setEditingId(null);
        setEditLabel("");
        setEditScore("");
        setEditDescription("");
        setMessage("수정되었습니다.");
         refetch();
       },
       onError: (err: any) => {
        setMessage(err?.response?.data?.detail || "수정에 실패했습니다.");
       },
     }
   );
 
  const startEdit = (scale: ScoreScale) => {
    setMessage(null);
    setEditingId(scale.id);
    setEditLabel(scale.attribute_label || "");
    setEditScore(String(scale.score));
    setEditDescription(scale.description || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditLabel("");
    setEditScore("");
    setEditDescription("");
  };

  const submitEdit = () => {
    if (!editingId) return;
    if (!editScore) {
      setMessage("점수는 필수입니다.");
      return;
    }
    updateScale({
      attribute_label: editLabel || null,
      score: Number(editScore),
      description: editDescription || null,
    });
   };
 
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="취향 분석 항목 관리"
        description="추천 알고리즘 기준이 되는 항목을 관리합니다."
        actions={
          <Link
            href="/admin/score-scales/new"
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#101010]"
          >
            항목 등록
          </Link>
        }
      />

      <AdminTable
        columns={["라벨", "점수", "설명", "관리"]}
        rows={
          isLoading
            ? []
            : scales.map((scale) => {
                const isEditing = editingId === scale.id;
                return [
                  isEditing ? (
                    <input
                      key={`label-${scale.id}`}
                      className="w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white/80"
                      value={editLabel}
                      onChange={(event) => setEditLabel(event.target.value)}
                    />
                  ) : (
                    scale.attribute_label || "-"
                  ),
                  isEditing ? (
                    <input
                      key={`score-${scale.id}`}
                      className="w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white/80"
                      value={editScore}
                      onChange={(event) => setEditScore(event.target.value)}
                    />
                  ) : (
                    String(scale.score)
                  ),
                  isEditing ? (
                    <input
                      key={`desc-${scale.id}`}
                      className="w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white/80"
                      value={editDescription}
                      onChange={(event) => setEditDescription(event.target.value)}
                    />
                  ) : (
                    scale.description || "-"
                  ),
                  isEditing ? (
                    <div key={`actions-${scale.id}`} className="flex gap-2">
                      <button
                        className="rounded-lg bg-white px-3 py-1 text-xs font-semibold text-[#101010]"
                        onClick={submitEdit}
                        disabled={isPending}
                      >
                        저장
                      </button>
                      <button
                        className="rounded-lg border border-white/20 px-3 py-1 text-xs text-white/70"
                        onClick={cancelEdit}
                      >
                        취소
                      </button>
                    </div>
                  ) : (
                    <button
                      key={`edit-${scale.id}`}
                      className="rounded-lg border border-white/20 px-3 py-1 text-xs text-white/70"
                      onClick={() => startEdit(scale)}
                    >
                      수정
                    </button>
                  ),
                ];
              })
        }
        emptyMessage={isLoading ? "로딩 중..." : "등록된 항목이 없습니다."}
      />
      {message && <p className="text-xs text-white/60">{message}</p>}
      {error && (
        <p className="text-xs text-rose-200">데이터를 불러오지 못했습니다.</p>
      )}
    </div>
  );
}
