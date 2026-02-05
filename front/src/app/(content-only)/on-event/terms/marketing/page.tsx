"use client";
import Header from "@/components/Header";
import { useHeaderStore } from "@/stores/header-store";
import { useEffect } from "react";

export default function MarketingTermsPage() {

    const { setHeader } = useHeaderStore();

    useEffect(() => {
      setHeader({
        title: "앱 출시 알림 동의",
        showBackButton: true,
      });
      sessionStorage.setItem("internal-navigation", "true");
    }, []);

    return (
        <div>
            <Header />
            <div className="p-4">
                <div className="bg-white rounded-2xl border border-border-default p-3">
                    <h1 className="text-base leading-[20px] font-bold text-gray-0 mb-4 text">
                        앱 출시 알림 동의
                    </h1>
                    <ul className="space-y-1 text-[12px] leading-[16px] pl-4 list-disc text-secondary [&>li]:text-text-secondary">
                        <li className="text-xs leading-[18px]  font-normal">앱 출시 및 주요 업데이트 안내를 위해 휴대전화번호를 활용하여 문자 알림을 발송할 수 있습니다. 알림 발송 외 다른 목적으로는 사용하지 않습니다.</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}