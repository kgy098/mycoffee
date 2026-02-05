"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import ActionSheet from "@/components/ActionSheet";
import { CircleAlert, Trash, X } from "lucide-react";
import { useGet } from "@/hooks/useApi";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface AnalysisResult {
  id: number;
  blend_id: number | null;
  blend_name: string | null;
  acidity: number;
  sweetness: number;
  body: number;
  nuttiness: number;
  bitterness: number;
  score: any;
  created_at: string;
}

const ReadyPage = () => {

  const [showWarning, setShowWarning] = useState(true);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [selectedResultId, setSelectedResultId] = useState<number | null>(null);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const queryClient = useQueryClient();

  // 24시간 이내 분석 결과 조회
  const { data, isLoading } = useGet(['/api/analysis-results'], '/api/analysis-results?hours=24');

  // 삭제 mutation
  const { mutate: deleteResult, isPending: isDeleting } = useMutation({
    mutationFn: async (resultId: number) => {
      const response = await api.delete(`/api/analysis-results/${resultId}`);
      return response.data;
    },
    onSuccess: () => {
      // 삭제 후 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ['/api/analysis-results'] });
      setDeleteModalIsOpen(false);
      setSelectedResultId(null);
    },
    onError: (error) => {
      console.error('삭제 실패:', error);
      alert('삭제에 실패했습니다.');
    }
  });

  useEffect(() => {
    if (data) {
      console.log('Analysis Results:', data);
      setAnalysisResults(Array.isArray(data) ? data : []);
    }
  }, [data]);

  const handleDelete = () => {
    if (selectedResultId) {
      deleteResult(selectedResultId);
    }
  };

  const openDeleteModal = (resultId: number) => {
    setSelectedResultId(resultId);
    setDeleteModalIsOpen(true);
  };
  
  return (
    <div className="bg-background">
      {/* Warning Banner */}
      {showWarning && (
        <div className="bg-[#FFF3CD] mx-4 mt-4 rounded-lg px-4 py-3 flex items-center gap-2">
          <CircleAlert size={24} className="text-[#F59E0B]" />
          <p className="text-[#F59E0B] text-xs font-normal flex-1 leading-[150%]">
            지난 커피 분석은 24시간 후 사라집니다. 마음에 드는 커피는 내 컬렉션에 담아두세요.
          </p>
          <button
            onClick={() => setShowWarning(false)}
            className="flex-shrink-0 cursor-pointer"
          >
            <X size={24} className="text-gray-0" />
          </button>
        </div>
      )}

      {/* Coffee Analysis Cards */}
      <div className="px-4 mt-4 space-y-4 pb-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-action-primary"></div>
          </div>
        ) : analysisResults.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-text-secondary">추천된 커피가 없습니다.</p>
          </div>
        ) : (
          analysisResults.map((result) => (
            <div key={result.id} className="bg-white rounded-2xl px-4 py-4 border border-border-default">
              {/* 날짜/시간 */}
              <p className="text-xs text-text-secondary mb-3">
                {new Date(result.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\. /g, '-').replace('.', '')} {new Date(result.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })}
              </p>

              {/* 커피 이름 */}
              <h3 className="text-lg font-bold text-gray-0 mb-4">
                {result.blend_name || '클래식 하모니 블렌드'}
              </h3>

              {/* 버튼 영역 */}
              <div className="flex items-center justify-between gap-2">
                <Link
                  href={`/my-coffee/taste-analysis/ready/${result.id}`}
                  className="flex-1 bg-action-secondary text-action-primary rounded-lg py-3 text-center font-bold text-sm"
                >
                  자세히 보기
                </Link>

                <button
                  onClick={() => openDeleteModal(result.id)}
                  className="w-12 h-12 border border-border-default rounded-lg flex items-center justify-center cursor-pointer"
                >
                  <Trash size={20} className="text-action-primary" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Delete Confirmation ActionSheet */}
      <ActionSheet
        isOpen={deleteModalIsOpen}
        onClose={() => setDeleteModalIsOpen(false)}
      >
        <div className="text-center">
          <p className="text-base font-bold text-gray-0 mb-6 leading-[20px]">
            정말 삭제하시겠습니까?
          </p>
          <div className="flex flex-col gap-2">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="w-full btn-primary disabled:opacity-50"
            >
              {isDeleting ? '삭제 중...' : '예'}
            </button>
            <button
              onClick={() => setDeleteModalIsOpen(false)}
              disabled={isDeleting}
              className="w-full btn-primary-empty disabled:opacity-50"
            >
              아니오
            </button>
          </div>
        </div>
      </ActionSheet>
    </div>
  );
};

export default ReadyPage;
