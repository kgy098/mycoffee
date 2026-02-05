"use client";
import { ChevronRight } from "lucide-react";
import React, { useEffect } from "react";
import Link from "next/link";
import { useHeaderStore } from "@/stores/header-store";
const ApplyTermOfUse = () => {

  const { setHeader } = useHeaderStore();

  useEffect(() => {
    setHeader({
      title: "약관 및 개인정보 처리 동의",
      showBackButton: true,
    });
  }, []);


  return (
    <div className="p-4">
      <div className="bg-white rounded-2xl border border-border-default p-3">
        <Link
          href="/profile/settings/apply-term-of-use/collect-and-use-personal-info"
          className="flex items-center justify-between py-2"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs leading-[18px] font-normal">
              개인정보 수집 및 이용 동의
            </span>
          </div>
          <ChevronRight size={20} className="text-icon-default" />
        </Link>
        <Link
          href="/profile/settings/apply-term-of-use/2"
          className="flex items-center justify-between py-2"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs leading-[18px] font-normal">
              이용약관 동의
            </span>
          </div>
          <ChevronRight size={20} className="text-icon-default" />
        </Link>
        <Link
          href="/profile/settings/apply-term-of-use/third-party-provision"
          className="flex items-center justify-between py-2"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs leading-[18px] font-normal">
              구매 조건 및 개인정보 제3자 제공
            </span>
          </div>
          <ChevronRight size={20} className="text-icon-default" />
        </Link>
        <Link
          href="/profile/settings/apply-term-of-use/4"
          className="flex items-center justify-between py-2"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs leading-[18px] font-normal">
              정기구독 이용약관 동의
            </span>
          </div>
          <ChevronRight size={20} className="text-icon-default" />
        </Link>
        <Link
          href="/profile/settings/apply-term-of-use/5"
          className="flex items-center justify-between py-2"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs leading-[18px] font-normal">
              개인정보 마케팅 활용 동의
            </span>
          </div>
          <ChevronRight size={20} className="text-icon-default" />
        </Link>
      </div>
    </div>
  );
};

export default ApplyTermOfUse;
