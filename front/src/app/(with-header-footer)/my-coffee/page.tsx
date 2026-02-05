"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const MyCoffee = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to taste-analysis as default tab
    router.replace("/my-coffee/taste-analysis");
  }, [router]);

  return (
    <div className="h-[100dvh] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF7939] mx-auto mb-4"></div>
        <p className="text-gray-500">로딩 중...</p>
      </div>
    </div>
  );
};

export default MyCoffee;
