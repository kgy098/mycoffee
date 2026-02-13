"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"confirming" | "done" | "error">("confirming");
  const [message, setMessage] = useState("결제 확인 중...");

  useEffect(() => {
    const paymentKey = searchParams.get("paymentKey");
    const orderId = searchParams.get("orderId");
    const amountStr = searchParams.get("amount");
    if (!paymentKey || !orderId || !amountStr) {
      setStatus("error");
      setMessage("결제 정보가 없습니다.");
      return;
    }
    const amount = parseInt(amountStr, 10);
    if (isNaN(amount)) {
      setStatus("error");
      setMessage("잘못된 결제 금액입니다.");
      return;
    }

    (async () => {
      try {
        const { data } = await api.post<{
          success: boolean;
          type: string;
          order_id?: number;
          subscription_id?: number;
        }>("/api/payments/confirm", {
          paymentKey,
          orderId,
          amount,
        });
        if (!data?.success) {
          setStatus("error");
          setMessage("결제 확인에 실패했습니다.");
          return;
        }
        setStatus("done");
        const isSubscription = data.type === "subscription";
        const redirectUrl = isSubscription
          ? `/success-order?subscriptionId=${data.subscription_id ?? ""}`
          : `/success-order?orderId=${data.order_id ?? ""}`;
        if (typeof window !== "undefined" && window.opener) {
          window.opener.location.href = redirectUrl;
          window.close();
        } else {
          router.replace(redirectUrl);
        }
      } catch (e: any) {
        setStatus("error");
        setMessage(e?.response?.data?.detail ?? "결제 확인 중 오류가 발생했습니다.");
      }
    })();
  }, [searchParams, router]);

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center p-6 bg-background">
      {status === "confirming" && (
        <p className="text-text-primary font-medium">{message}</p>
      )}
      {status === "done" && (
        <p className="text-text-primary font-medium">결제가 완료되었습니다. 이동 중...</p>
      )}
      {status === "error" && (
        <div className="text-center space-y-4">
          <p className="text-red-600 font-medium">{message}</p>
          <button
            type="button"
            onClick={() => router.push("/home")}
            className="btn-primary"
          >
            홈으로
          </button>
        </div>
      )}
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-[100dvh] flex items-center justify-center">로딩 중...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
