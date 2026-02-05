"use client";

import React, { useState } from "react";
import Link from "next/link";
import ActionSheet from "@/components/ActionSheet";
import LikeModal from "./[id]/components/LikeModal";
import { useGet, usePost } from "@/hooks/useApi";
import { useUserStore } from "@/stores/user-store";

type SelectItem = {
  id: number;
  title: string;
  date: string;
  time: string;
  tag: string;
  description: string;
};
const coffeeAnalyses = [
  {
    id: 1,
    title: "나만의 커피 1호기",
    date: "2025-08-24",
    time: "오후 12:34",
    tag: "클래식 하모니 블렌드",
    description: "달달한 커피가 먹고 싶을 때 추천받은 커피"
  },
  {
    id: 2,
    title: "나만의 커피 2호기",
    date: "2025-08-23",
    time: "오후 3:15",
    tag: "프레시 아로마 블렌드",
    description: "상큼한 과일향이 돋보이는 커피"
  },
  {
    id: 3,
    title: "나만의 커피 2호기",
    date: "2025-08-23",
    time: "오후 3:15",
    tag: "프레시 아로마 블렌드",
    description: "상큼한 과일향이 돋보이는 커피"
  },
  {
    id: 4,
    title: "나만의 커피 2호기",
    date: "2025-08-23",
    time: "오후 3:15",
    tag: "프레시 아로마 블렌드",
    description: "상큼한 과일향이 돋보이는 커피"
  },
  {
    id: 5,
    title: "나만의 커피 2호기",
    date: "2025-08-23",
    time: "오후 3:15",
    tag: "프레시 아로마 블렌드",
    description: "상큼한 과일향이 돋보이는 커피"
  }
];

const CollectionPage = () => {
  const [showWarning, setShowWarning] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateModalIsOpen, setUpdateModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [selectItem, setselectItem] = useState<SelectItem | null>(null);
  // Sample coffee analyses data
  const { data } = useUserStore((state) => state.user);

  const { data: myCollection } = useGet(['collections', data?.user_id], '/collections', { params: { user_id: data?.user_id } });

  const openModal = (item: SelectItem) => {
    setselectItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveChanges = (coffeeName: string, comment: string) => {
    console.log('Saved coffee:', { coffeeName, comment });
  };

  const handleDelete = () => {
    if (selectItem) {
      console.log('Deleting coffee:', selectItem);
      setDeleteModalIsOpen(false);
      setIsModalOpen(false);
      setselectItem(null);
    }
  };

  const { mutate: getRecommendations, isPending: isGettingRecommendations } = usePost('/collections/save');

  // Handle form submission
  const handleSubmitAnalysis = () => {
    getRecommendations({
      "p_user_id": data?.user_id,
      "p_analysis_id": 0,
      "p_collection_name": "collection 1",
      "p_personal_comment": "collection 1"
    });
  }

    return (
      <div className="px-4 py-4">
        <div className="overflow-y-auto h-[calc(100vh-220px)]">
          {/* Warning Banner */}
          {/* <button onClick={handleSubmitAnalysis}>save</button> */}
          {showWarning && (
            <div className="bg-[#FFF3CD] rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 8V12" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 16H12.01" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex-1">
                  <p className="text-[12px] text-[#F59E0B] leading-[140%]">
                    부담 없이 시작하세요, 첫 달은 무료입니다!
                  </p>
                </div>
                <button
                  onClick={() => setShowWarning(false)}
                  className="flex-shrink-0 cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6 6L18 18" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Coffee Analysis Cards */}
          <div className="space-y-3">
            {coffeeAnalyses.map((analysis) => (
              <div key={analysis.id} className="bg-white rounded-2xl px-4 py-3 border border-border-default">
                <div className="mb-4">
                  <h3 className="text-sm font-bold text-gray-0 mb-2">{analysis.title}</h3>
                  <p className="text-[12px] text-text-secondary mb-2 font-normal">{analysis.date} {analysis.time}</p>

                  <div className="flex items-center justify-center w-fit bg-[rgba(0,0,0,0.05)] rounded-lg px-2 py-1 mb-4">
                    <span className="text-[12px] text-gray-0 font-medium leading-[160%]">{analysis.tag}</span>
                  </div>

                  <p className="text-[12px] text-gray-0 leading-[150%]">{analysis.description}</p>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <Link
                    href={`/my-coffee/collection/${analysis.id}`}
                    className="btn-action text-center"
                  >
                    주문하기
                  </Link>

                  <button onClick={() => openModal(analysis)} className="cursor-pointer size-8 border border-border-default rounded-sm flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M3.3335 4.1665H16.6668" stroke="#4E2A18" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M3.3335 10H16.6668" stroke="#4E2A18" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M3.3335 15.8335H16.6668" stroke="#4E2A18" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {coffeeAnalyses.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 17L12 22L22 17" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 12L12 17L22 12" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">아직 저장된 커피가 없어요</h3>
              <p className="text-gray-500 mb-6">커피 취향 분석을 통해 나만의 커피를 찾아보세요!</p>
              <Link
                href="/my-coffee/taste-analysis"
                className="inline-block px-6 py-3 bg-action-primary text-white rounded-lg font-medium hover:bg-action-primary-hover transition-colors"
              >
                취향 분석 시작하기
              </Link>
            </div>
          )}
        </div>
        <ActionSheet
          isOpen={isModalOpen}
          onClose={closeModal}
        >
          <div>
            <Link href={`/my-coffee/collection/${selectItem?.id}`} className="block w-full btn-primary text-center mb-2">상세보기</Link>
            <button onClick={() => setUpdateModalIsOpen(true)} className="w-full btn-primary-empty border border-action-primary !py-[11px] text-action-primary text-center mb-2 flex items-center justify-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                <path d="M10.5 2.50049H4.66667C4.22464 2.50049 3.80072 2.67608 3.48816 2.98864C3.17559 3.3012 3 3.72513 3 4.16715V15.8338C3 16.2758 3.17559 16.6998 3.48816 17.0123C3.80072 17.3249 4.22464 17.5005 4.66667 17.5005H16.3333C16.7754 17.5005 17.1993 17.3249 17.5118 17.0123C17.8244 16.6998 18 16.2758 18 15.8338V10.0005" stroke="#4E2A18" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15.8123 2.18818C16.1438 1.85666 16.5934 1.67041 17.0623 1.67041C17.5311 1.67041 17.9807 1.85666 18.3123 2.18818C18.6438 2.5197 18.83 2.96934 18.83 3.43818C18.83 3.90702 18.6438 4.35666 18.3123 4.68818L10.8014 12.1998C10.6035 12.3975 10.3591 12.5423 10.0906 12.6207L7.69642 13.3207C7.62471 13.3416 7.5487 13.3428 7.47634 13.3243C7.40399 13.3058 7.33794 13.2681 7.28512 13.2153C7.23231 13.1625 7.19466 13.0964 7.17612 13.0241C7.15758 12.9517 7.15884 12.8757 7.17975 12.804L7.87975 10.4098C7.95852 10.1416 8.10353 9.89739 8.30142 9.69984L15.8123 2.18818Z" stroke="#4E2A18" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              수정
            </button>
            <button onClick={() => setDeleteModalIsOpen(true)} className="w-full btn-primary-empty border border-action-primary !py-[11px] text-action-primary text-center flex items-center justify-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                <path d="M16.3337 5V16.6667C16.3337 17.1087 16.1581 17.5326 15.8455 17.8452C15.5329 18.1577 15.109 18.3333 14.667 18.3333H6.33366C5.89163 18.3333 5.46771 18.1577 5.15515 17.8452C4.84259 17.5326 4.66699 17.1087 4.66699 16.6667V5" stroke="#4E2A18" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 5H18" stroke="#4E2A18" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7.16699 4.99984V3.33317C7.16699 2.89114 7.34259 2.46722 7.65515 2.15466C7.96771 1.8421 8.39163 1.6665 8.83366 1.6665H12.167C12.609 1.6665 13.0329 1.8421 13.3455 2.15466C13.6581 2.46722 13.8337 2.89114 13.8337 3.33317V4.99984" stroke="#4E2A18" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              삭제
            </button>
          </div>
        </ActionSheet>
        <LikeModal
          data={selectItem || null}
          isOpen={updateModalIsOpen}
          onClose={() => setUpdateModalIsOpen(false)}
          onSave={handleSaveChanges}
          href={`/my-coffee/collection`}
        />

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
                className="w-full btn-primary"
              >
                예
              </button>
              <button
                onClick={() => setDeleteModalIsOpen(false)}
                className="w-full btn-primary-empty"
              >
                아니오
              </button>
            </div>
          </div>
        </ActionSheet>
      </div>
    );
  };

  export default CollectionPage;