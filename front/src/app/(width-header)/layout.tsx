import React from "react";
import Header from "@/components/Header";

export default function LayoutFooter({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="h-[100dvh] bg-background flex flex-col">
        <Header  />
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
            {children}
        </div>
    </div>
  );
}
