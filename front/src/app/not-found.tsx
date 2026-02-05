"use client";
import { useRouter } from "next/navigation";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      {/* Header */}
      <div className="sticky h-11 top-0 z-10 bg-white px-4 py-2.5 flex items-center justify-between w-full" style={{boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.08)"}}>
        <div className="flex items-center">
          <button onClick={handleGoBack} className="flex items-center py-0 px-2 cursor-pointer">
            <ArrowLeft size={24} stroke="black" strokeWidth={2} />
          </button>
        </div>
        <div className="flex absolute left-1/2 -translate-x-1/2 shrink-0 text-nowrap">
          <h1 className="text-[16px] font-bold text-gray-0">
            페이지를 찾을 수 없습니다
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-border-default p-6 text-center max-w-sm w-full">
          {/* 404 Icon */}
          <div className="mb-6">
            <div className="w-30 h-30 mx-auto bg-accent-sub rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-primary">404</span>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-lg font-bold text-gray-0 mb-2">
            페이지를 찾을 수 없습니다
          </h2>

          {/* Description */}
          <p className="text-sm text-text-secondary mb-6 leading-[20px]">
            요청하신 페이지가 존재하지 않거나<br />
            이동되었을 수 있습니다.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleGoHome}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <Home size={20} />
              홈으로 이동
            </button>
            
            <button
              onClick={handleGoBack}
              className="btn-primary-empty w-full flex items-center justify-center gap-2 text-text-secondary border border-border-default"
            > 
              이전 페이지로
            </button>
          </div>
        </div>

        {/* Coffee Illustration */}
        <div className="mt-8 opacity-20">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <svg 
              width="32" 
              height="32" 
              viewBox="0 0 24 24" 
              fill="none" 
              className="text-white"
            >
              <path 
                d="M3 8h18v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M7 2v6M17 2v6" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
