"use client";

import { useUserStore } from "@/stores/user-store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { api } from "@/lib/api";

export const publicRoutes = ["/", "/analysis", "/result", "/home", "/on-event", "/on-event/history", "/on-event/analysis", "/on-event/result", "/on-event/terms/privacy", "/on-event/terms/marketing", "/admin-event", "/admin-event/order-history", "/admin-event/requests"];

interface VerifyResponse {
  authenticated: boolean;
  userId: number;
  expAt: string;
  reason: string;
}

export default function ProtectedRoutes({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser } = useUserStore();
  const hasRequestedMe = useRef(false);
    
  useEffect(() => {
    const fetchUserMe = async () => {
      if (hasRequestedMe.current) return;
      
      const cookies = document.cookie.split(';');
      const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
      const tokenValue = tokenCookie?.split('=')[1]?.trim();
      
      if (tokenCookie && tokenValue) {
        hasRequestedMe.current = true;
        try {
          const response = await api.get<VerifyResponse>('/auth/me', {
            withCredentials: true,
          });          
          
          if (response.data) {
            if (response.data.authenticated) {
              if (!user.isAuthenticated) {
                const expAtTimestamp = response.data.expAt ? new Date(response.data.expAt).getTime() / 1000 : 0;
                
                setUser({
                  data: {
                    user_id: response.data.userId,
                    session_id: user.data?.session_id || '',
                    token: tokenValue,
                    token_type: 'Bearer',
                    expires_in: expAtTimestamp,
                    result_code: '0',
                    result_message: 'Success'
                  },
                  meta: { timestamp: new Date().toISOString() },
                  isAuthenticated: true
                });
              }
            } else {
              document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
              useUserStore.getState().resetUser();
              if (!publicRoutes.includes(pathname)) {
                router.push("/auth/login");
                return;
              }
            }
          }
        } catch (error: any) {
          if (error.response?.status === 401) {
            document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            useUserStore.getState().resetUser();
            if (!publicRoutes.includes(pathname)) {
              router.push("/auth/login");
              return;
            }
          } else {
            console.error('Failed to verify token:', error);
          }
        }
      }
    };

    fetchUserMe();
  }, [user.isAuthenticated, setUser, pathname, router]);

  useEffect(() => {
    const isAuthRoute = pathname.startsWith("/auth");

    if (!user.isAuthenticated && !isAuthRoute && !publicRoutes.includes(pathname)) {
      router.push("/auth/login");
    }
  }, [pathname, user.isAuthenticated, router]);

  const isAuthRoute = pathname.startsWith("/auth");
  const isPublic = isAuthRoute || publicRoutes.includes(pathname);

  if (!user.isAuthenticated && !isPublic) {
    return null;
  }

  return <>{children}</>;
}
