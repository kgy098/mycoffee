"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface LikeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (coffeeName: string, comment: string) => void;
  href: string;
  data?: any;
}

const LikeModal: React.FC<LikeModalProps> = ({ isOpen, onClose, onSave, href, data }) => {
  const router = useRouter();
  const [coffeeName, setCoffeeName] = useState(data?.title || "");
  const [comment, setComment] = useState(data?.description || "");
  const [errors, setErrors] = useState<{coffeeName?: string; comment?: string}>({});
  const [isDuplicate, setIsDuplicate] = useState(false);

  // Update input fields when data changes
  useEffect(() => {
    if (data) {
      setCoffeeName(data.title || "");
      setComment(data.description || "");
    } else {
      setCoffeeName("");
      setComment("");
    }
    setErrors({});
    setIsDuplicate(false);
  }, [data]);

  const handleSave = () => {
    const newErrors: {coffeeName?: string; comment?: string} = {};
    
    // Validation
    if (!coffeeName.trim()) {
      newErrors.coffeeName = "내 커피 이름을 입력해주세요.";
    }
    if (!comment.trim()) {
      newErrors.comment = "나만의 한줄 코멘트를 입력해주세요.";
    }
    
    // Check for duplicate (simulate)
    if (coffeeName.trim() === "클래식 모닝" && comment.trim() === "매일 아침의 활력") {
      setIsDuplicate(true);
      newErrors.coffeeName = "이미 저장된 내 커피 이름입니다.";
    } else {
      setIsDuplicate(false);
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      onSave(coffeeName, comment);
      setCoffeeName("");
      setComment("");
      setErrors({});
      setIsDuplicate(false);
      onClose();
      // Redirect to collection page
      router.push(href);
    }
  };

  const handleCoffeeNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCoffeeName(e.target.value);
    if (errors.coffeeName) {
      setErrors(prev => ({ ...prev, coffeeName: undefined }));
    }
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
    if (errors.comment) {
      setErrors(prev => ({ ...prev, comment: undefined }));
    }
  };

  const isFormValid = coffeeName.trim() && comment.trim() && Object.keys(errors).length === 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="bg-white rounded-2xl p-3 w-[361px] mx-4">
        <h2 className="text-sm font-bold text-gray-0 mb-2">내 커피 이름</h2>
        
        <div className="mb-3">
          <input
            type="text"
            value={coffeeName}
            onChange={handleCoffeeNameChange}
            placeholder="내 커피 이름을 입력해주세요."
            className={`w-full bg-transparent placeholder:text-[#6E6E6E] placeholder:font-normal font-bold border text-gray-0 text-[12px] rounded-lg focus:outline-none focus:ring-[#A45F37] focus:border-[#A45F37] px-4 py-2.5 ${
              errors.coffeeName 
                ? isDuplicate 
                  ? 'border-orange-500' 
                  : 'border-[#EF4444]'
                : 'border-[#E6E6E6]'
            }`}
          />
          {errors.coffeeName && (
            <div className="flex items-center gap-1 mt-2">
              <span className={`text-[12px] ${isDuplicate ? 'text-orange-500' : 'text-[#EF4444]'}`}>!</span>
              <span className={`text-[12px] font-normal ${isDuplicate ? 'text-orange-500' : 'text-[#EF4444]'}`}>
                {errors.coffeeName}
              </span>
            </div>
          )}
        </div>

        <h3 className="text-sm font-bold text-gray-0 mb-2">나만의 한줄 코멘트</h3>
        
        <div className="mb-6">
          <input
            type="text"
            value={comment}
            onChange={handleCommentChange}
            placeholder="메모를 입력해주세요."
            className={`w-full bg-transparent placeholder:text-[#6E6E6E] placeholder:font-normal font-bold border text-gray-0 text-[12px] rounded-lg focus:outline-none focus:ring-[#A45F37] focus:border-[#A45F37] px-4 py-2.5 ${
              errors.comment ? 'border-[#EF4444]' : 'border-[#E6E6E6]'
            }`}
          />
          {errors.comment && (
            <div className="flex items-center gap-1 mt-2">
              <span className="text-[12px] text-[#EF4444]">!</span>
              <span className="text-[12px] font-normal text-[#EF4444]">{errors.comment}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={handleSave}
            className={`w-full text-center  ${
              isFormValid 
                ? 'btn-primary' 
                : 'btn-primary-empty bg-action-disabled text-[#9CA3AF] !cursor-not-allowed'
            }`}
            disabled={!isFormValid}
          >
            저장하기
          </button>
          <button
            onClick={onClose}
            className="btn-primary-empty w-full text-center"
          >
            취소하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default LikeModal;