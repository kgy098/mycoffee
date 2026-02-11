import React from "react";
import Script from "next/script";
import Header from "@/components/Header";

export default function LayoutFooter({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <>
      <Script
        src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        strategy="lazyOnload"
      />
    <div className="h-[100dvh] bg-background flex flex-col">
        <Header  />
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
            {children}
        </div>
    </div>
    </>
  );
}
