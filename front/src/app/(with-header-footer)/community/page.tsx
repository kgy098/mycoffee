"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Community = () => {
  const router = useRouter();

  useEffect(() => { 
    // Redirect to coffee-story-main as default tab
    router.replace("/community/coffee-story-main");
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

export default Community;
