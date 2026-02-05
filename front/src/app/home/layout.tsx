import React from "react";
import BottomMenuBar from "@/components/BottomMenuBar";

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
