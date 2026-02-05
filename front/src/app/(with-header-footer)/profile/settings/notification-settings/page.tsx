"use client";
import { ChevronRight, CircleAlert } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const NotificationsSettings = () => {
  const [appPushEnabled, setAppPushEnabled] = useState(false);
  const [marketingEnabled, setMarketingEnabled] = useState(false);
  const router = useRouter();

  const handleMarketingEnabled = (checked: boolean) => {
    setMarketingEnabled(checked);
    console.log("checked", checked);
    if (checked) {
      router.push("/profile/settings/marketing-permission");
    }
  };

  return (
    <div className="p-4">
      {/* Banner */}
      <div className="bg-[#FFF3CD] rounded-lg px-4 py-3 flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full">
            <CircleAlert size={24} color="#F59E0B" />
          </div>
          <p className="text-xs leading-[18px] font-normal text-[#F59E0B]">
            휴대폰 알림 설정을 켜주세요
          </p>
        </div>
        <Link
          href="#"
          className="flex items-center gap-1 text-blue-400 text-xs leading-[18px]"
        >
          설정하기
          <ChevronRight size={12} />
        </Link>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl p-3 border border-border-default">
        {/* App Push */}
        <div className="flex items-center justify-between pb-4">
          <div>
            <h3 className="text-sm leading-[20px] font-bold mb-0.5">
              앱 푸시 알림
            </h3>
            <p className="text-[12px] text-text-secondary">
              주문부터 구독까지, 진행 상황을 바로바로 알려드릴게요
            </p>
          </div>

         
           {/* combine checked functionality with state management */}
           <label className="inline-flex items-center cursor-pointer">
             <input
               type="checkbox"
               className="sr-only peer"
               checked={appPushEnabled}
               onChange={(e) => setAppPushEnabled(e.target.checked)}
             />
             <div className="relative w-13 h-8 bg-[#78788029] rounded-full peer dark:bg-[#78788029] peer-checked:after:translate-x-[70%] rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all dark:border-gray-600 peer-checked:bg-[#34C759] dark:peer-checked:bg-[#22C55E]"></div>
           </label>
        </div>

        {/* Marketing */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm leading-[20px] font-bold mb-0.5">
              혜택/마케팅 알림
            </h3>
            <p className="text-[12px] text-text-secondary">
              특가와 이벤트 소식을 가장 먼저 전해드려요.
            </p>
          </div>
         <label className="inline-flex items-center cursor-pointer">
             <input
               type="checkbox"
               className="sr-only peer"
               checked={marketingEnabled}
               onChange={(e) => handleMarketingEnabled(e.target.checked)}
             />
             <div className="relative w-13 h-8 bg-[#78788029] rounded-full peer dark:bg-[#78788029] peer-checked:after:translate-x-[70%] rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all dark:border-gray-600 peer-checked:bg-[#34C759] dark:peer-checked:bg-[#22C55E]"></div>
           </label>
        </div>
      </div>
    </div>
  );
};

export default NotificationsSettings;
