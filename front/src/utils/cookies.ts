"use client";

export const setAccessTokenCookie = (token: string) => {
  if (typeof document === "undefined" || typeof window === "undefined") {
    return;
  }

  const hostname = window.location.hostname;
  const isLocalhost =
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1";

  const cookieParts = [`token=${token}`, "path=/"];

  if (!isLocalhost) {
    // Set domain to .mycoffeeai.com so cookie is accessible to api.mycoffeeai.com
    cookieParts.push("domain=.mycoffeeai.com");
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

  const hostname = window.location.hostname;
  const isLocalhost =
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1";

  const cookieParts = [
    "token=",
    "path=/",
    "expires=Thu, 01 Jan 1970 00:00:00 UTC",
  ];

  if (!isLocalhost) {
    cookieParts.push("domain=.mycoffeeai.com");
  }

  document.cookie = cookieParts.join("; ");
};
