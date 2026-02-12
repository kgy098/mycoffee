 "use client";
 
 import Link from "next/link";
 import { useState } from "react";
 import AdminPageHeader from "@/components/admin/AdminPageHeader";
 import { usePost } from "@/hooks/useApi";
 
 type ScoreScale = {
   id: number;
   attribute_key: string;
   attribute_label?: string | null;
   score: number;
   description?: string | null;
 };
 
 export default function ScoreScaleCreatePage() {
   const [attributeKey, setAttributeKey] = useState("");
   const [attributeLabel, setAttributeLabel] = useState("");
   const [score, setScore] = useState("");
   const [description, setDescription] = useState("");
   const [message, setMessage] = useState<string | null>(null);
 
   const { mutate: createScale, isPending } = usePost<ScoreScale, ScoreScale>(
     "/api/admin/score-scales",
     {
       onSuccess: () => {
         setAttributeKey("");
         setAttributeLabel("");
         setScore("");
         setDescription("");
         setMessage("등록되었습니다.");
       },
       onError: (err: any) => {
         setMessage(err?.response?.data?.detail || "등록에 실패했습니다.");
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
         title="취향 분석 항목 등록"
         description="항목 키는 등록 후 수정할 수 없습니다."
         actions={
           <Link
             href="/admin/score-scales"
             className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white/70"
           >
             목록으로
           </Link>
         }
       />
 
       <div className="rounded-xl border border-white/10 bg-[#141414] p-6">
         <div className="grid gap-4 md:grid-cols-2">
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
 
         <div className="mt-6 flex flex-wrap gap-2">
           <button
             className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#101010]"
             onClick={submit}
             disabled={isPending}
           >
             {isPending ? "저장 중..." : "등록"}
           </button>
         </div>
         {message && <p className="mt-3 text-xs text-white/60">{message}</p>}
       </div>
     </div>
   );
 }
