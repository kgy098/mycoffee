'use client';

import React from 'react';
import Link from 'next/link';
import ActionSheet from './ActionSheet';

interface LoginRequiredAlertProps {
  isOpen: boolean;
  onClose: () => void;
}

/** 비로그인 시 화면 하단에 띄우는 "로그인 후 이용 가능합니다." 알럿 (로그인 / 닫기) */
const LoginRequiredAlert = ({ isOpen, onClose }: LoginRequiredAlertProps) => {
  return (
    <ActionSheet isOpen={isOpen} onClose={onClose}>
      <p className="text-center text-gray-0 text-base leading-[24px] mb-6">
        로그인 후 이용 가능합니다.
      </p>
      <div className="flex flex-col gap-2">
        <Link
          href="/auth/login-select"
          className="btn-primary w-full text-center block"
          onClick={onClose}
        >
          로그인
        </Link>
        <button
          type="button"
          onClick={onClose}
          className="w-full btn-primary-empty text-center py-3 rounded-lg border border-border-default text-gray-0 font-bold"
        >
          닫기
        </button>
      </div>
    </ActionSheet>
  );
};

export default LoginRequiredAlert;
