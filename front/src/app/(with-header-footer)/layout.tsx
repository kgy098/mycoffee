import React from "react";
import BottomMenuBar from "@/components/BottomMenuBar";
import Header from "@/components/Header";


export default function LayoutHeaderFooter({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex-1 flex child-width-full">
        {children}
      </div>

      <BottomMenuBar />
    </div>
  );
}
