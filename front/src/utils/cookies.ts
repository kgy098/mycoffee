"use client";

/** 현재 호스트가 mycoffeeai.com 계열일 때만 domain 설정 (connet.co.kr 등 다른 도메인에서는 생략) */
function getCookieDomain(): string | null {
  if (typeof window === "undefined") return null;
  const hostname = window.location.hostname;
  if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1")
    return null;
  if (hostname === "mycoffeeai.com" || hostname.endsWith(".mycoffeeai.com"))
    return ".mycoffeeai.com";
  return null;
}

function isLocalhost(): boolean {
  if (typeof window === "undefined") return true;
  const h = window.location.hostname;
  return h === "localhost" || h === "127.0.0.1" || h === "::1";
}

export const setAccessTokenCookie = (token: string) => {
  if (typeof document === "undefined" || typeof window === "undefined") {
    return;
  }

  const cookieParts = [`token=${token}`, "path=/"];
  const domain = getCookieDomain();
  if (domain) {
    cookieParts.push(`domain=${domain}`, "SameSite=None", "Secure");
  } else if (!isLocalhost()) {
    cookieParts.push("SameSite=None", "Secure");
  } else {
    cookieParts.push("SameSite=Lax");
  }

  document.cookie = cookieParts.join("; ");
};

export const removeAccessTokenCookie = () => {
  if (typeof document === "undefined" || typeof window === "undefined") {
    return;
  }

  const cookieParts = [
    "token=",
    "path=/",
    "expires=Thu, 01 Jan 1970 00:00:00 UTC",
  ];
  const domain = getCookieDomain();
  if (domain) cookieParts.push(`domain=${domain}`);

  document.cookie = cookieParts.join("; ");
};

/** 자동로그인용 토큰 쿠키 (DB와 비교용, API 토큰과 별도) */
export const setRememberTokenCookie = (token: string) => {
  if (typeof document === "undefined" || typeof window === "undefined") return;
  const parts = [`remember_token=${token}`, "path=/", "max-age=2592000"]; // 30일
  const domain = getCookieDomain();
  if (domain) {
    parts.push(`domain=${domain}`, "SameSite=None", "Secure");
  } else if (!isLocalhost()) {
    parts.push("SameSite=None", "Secure");
  } else {
    parts.push("SameSite=Lax");
  }
  document.cookie = parts.join("; ");
};

export const removeRememberTokenCookie = () => {
  if (typeof document === "undefined" || typeof window === "undefined") return;
  const parts = [
    "remember_token=",
    "path=/",
    "expires=Thu, 01 Jan 1970 00:00:00 UTC",
  ];
  const domain = getCookieDomain();
  if (domain) parts.push(`domain=${domain}`);
  document.cookie = parts.join("; ");
};

/** 자동로그인 체크박스 여부 (로그인 페이지에서 체크 상태 복원용) */
export const setRememberMeCookie = (checked: boolean) => {
  if (typeof document === "undefined" || typeof window === "undefined") return;
  const domain = getCookieDomain();
  const parts = [
    `remember_me=${checked ? "1" : "0"}`,
    "path=/",
    checked ? "max-age=2592000" : "expires=Thu, 01 Jan 1970 00:00:00 UTC",
  ];
  if (domain) parts.push(`domain=${domain}`);
  if (checked && (domain || !isLocalhost())) parts.push("SameSite=None", "Secure");
  else if (checked && isLocalhost()) parts.push("SameSite=Lax");
  document.cookie = parts.join("; ");
};

export const getRememberMeCookie = (): boolean => {
  if (typeof document === "undefined") return false;
  const match = document.cookie.match(/\bremember_me=([^;]*)/);
  return match ? match[1].trim() === "1" : false;
};
