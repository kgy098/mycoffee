"use client";
import { Bell, ChevronRight, ShieldAlert } from "lucide-react";
import React, { useEffect } from "react";
import Link from "next/link";
import { useHeaderStore } from "@/stores/header-store";

const MySettings = () => {
  const { setHeader } = useHeaderStore();
  useEffect(() => {
    setHeader({
      title: "설정",
      showBackButton: true,
    });
  }, []);
  return (
    <div className="p-4">
      {/* Management List */}
      <div className="bg-white rounded-2xl border border-border-default p-3">
        {/* Payment Method Management */}
        <Link
          href="/profile/settings/notification-settings"
          className="flex items-center justify-between py-1.5"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[rgba(0,0,0,0.05)] rounded-full flex items-center justify-center">
              <Bell size={20} className="text-action-primary" />
            </div>
            <span className="text-sm leading-[20px] font-bold">알림 설정</span>
          </div>
          <ChevronRight size={20} className="text-icon-default" />
        </Link>

        {/* Delivery Address Management */}
        <Link
          href="/profile/settings/apply-term-of-use"
          className="flex items-center justify-between py-1.5"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[rgba(0,0,0,0.05)] rounded-full flex items-center justify-center">
              <ShieldAlert size={20} className="text-action-primary" />
            </div>
            <span className="text-sm leading-[20px] font-bold">
              약관 및 개인정보 처리 동의
            </span>
          </div>
          <ChevronRight size={20} className="text-icon-default" />
        </Link>
      </div>
    </div>
  );
};

export default MySettings;
