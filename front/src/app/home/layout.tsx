import React from "react";
import BottomMenuBar from "@/components/BottomMenuBar";

// 정적 생성으로 초기 문서 TTFB 단축 (콜드 스타트 시 5초대 완화)
export const dynamic = "force-static";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-[100dvh] bg-background">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>

      {/* Bottom Menu Bar */}
      <BottomMenuBar />
    </div>
  );
}
