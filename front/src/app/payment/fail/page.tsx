"use client";

import { useRouter } from "next/navigation";

export default function PaymentFailPage() {
  const router = useRouter();
  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center p-6 bg-background">
      <p className="text-text-primary font-medium mb-2">결제가 취소되었거나 실패했습니다.</p>
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
