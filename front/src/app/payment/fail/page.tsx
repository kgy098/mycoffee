"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function PaymentFailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");

  const isScriptError = reason === "script";

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center p-6 bg-background">
      <p className="text-text-primary font-medium mb-2 text-center">
        {isScriptError
          ? "결제 창을 불러오지 못했습니다. 광고 차단 기능을 해제하거나 네트워크를 확인한 뒤 다시 시도해 주세요."
          : "결제가 취소되었거나 실패했습니다."}
      </p>
      <button
        type="button"
        onClick={() => router.push("/home")}
        className="btn-primary mt-4"
      >
        홈으로
      </button>
    </div>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense fallback={null}>
      <PaymentFailContent />
    </Suspense>
  );
}
