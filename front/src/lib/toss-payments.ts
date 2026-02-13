/**
 * 토스페이먼츠 결제 요청 (스크립트 로드 후 requestPayment)
 * @see https://docs.tosspayments.com
 */

const TOSS_SCRIPT_URL = "https://js.tosspayments.com/v2/payment";

declare global {
  interface Window {
    TossPayments?: (clientKey: string) => {
      requestPayment: (
        method: string,
        params: {
          orderId: string;
          amount: number;
          orderName: string;
          successUrl: string;
          failUrl: string;
          customerName?: string;
          customerEmail?: string;
        }
      ) => Promise<void>;
    };
  }
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof document === "undefined") {
      reject(new Error("document is not available"));
      return;
    }
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      if (window.TossPayments) resolve();
      else existing.addEventListener("load", () => resolve());
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.onload = () => resolve();
    script.onerror = () =>
      reject(
        new Error(
          "결제 창을 불러오지 못했습니다. 광고 차단 기능을 해제하거나 네트워크를 확인한 뒤 다시 시도해 주세요."
        )
      );
    document.head.appendChild(script);
  });
}

export interface RequestPaymentParams {
  orderId: string;
  amount: number;
  orderName: string;
  successUrl?: string;
  failUrl?: string;
}

/**
 * 토스 결제 창 요청 (카드).
 * successUrl/failUrl 미지정 시 현재 origin 기준 /payment/success, /payment/fail 사용.
 */
export async function requestTossPayment(params: RequestPaymentParams): Promise<void> {
  const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
  if (!clientKey) {
    throw new Error("NEXT_PUBLIC_TOSS_CLIENT_KEY가 설정되지 않았습니다.");
  }
  await loadScript(TOSS_SCRIPT_URL);
  const TossPayments = window.TossPayments;
  if (!TossPayments) {
    throw new Error("토스페이먼츠 스크립트를 불러올 수 없습니다.");
  }
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const successUrl = params.successUrl ?? `${origin}/payment/success`;
  const failUrl = params.failUrl ?? `${origin}/payment/fail`;
  const client = TossPayments(clientKey);
  await client.requestPayment("카드", {
    orderId: params.orderId,
    amount: params.amount,
    orderName: params.orderName,
    successUrl,
    failUrl,
  });
}
