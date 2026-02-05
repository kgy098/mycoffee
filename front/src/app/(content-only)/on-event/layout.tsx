"use client";

import { useEffect, useRef } from "react";
import { useUserStore } from "@/stores/user-store";
import { api } from "@/lib/api";
import { useRouter, usePathname } from "next/navigation";

interface VerifyResponse {    
    user_id: number,
    provider: string,
    token: string,
    nickname: string,
    social_provider: string | null,
    social_id: string,
    phone_number: string
}

export default function OnEventLayout({ children }: { children: React.ReactNode }) {
    const { setUser } = useUserStore();
    const router = useRouter();
    const pathname = usePathname();
    const hasRequestedMe = useRef(false);

    useEffect(() => {
        if (hasRequestedMe.current || typeof window === 'undefined') return;
        
        const searchParams = new URLSearchParams(window.location.search);
        let token = searchParams.get('token');
        const tokenFromUrl = !!token;
        
        // Agar URL da token bo'lmasa, cookie dan olish
        if (!token) {
            const cookies = document.cookie.split(';');
            const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
            token = tokenCookie?.split('=')[1]?.trim() || null;
        }
        
        if (!token) return;
        
        if (tokenFromUrl) {
            const expires = new Date();
            expires.setTime(expires.getTime() + (365 * 24 * 60 * 60 * 1000)); // 1 yil
            document.cookie = `token=${token}; path=/; expires=${expires.toUTCString()}`;
        }
        
        hasRequestedMe.current = true;
        
        api.get<VerifyResponse>('/auth/me', { withCredentials: true })
            .then(response => {
                console.log("response", response);
                if (response.data?.user_id) {
                    setUser({
                        data: {
                            user_id: response.data.user_id,
                            session_id: '',
                            token: response.data?.token || token,
                            token_type: 'Bearer',
                            expires_in: new Date().getTime() / 1000,
                            result_code: '0',
                            result_message: 'Success',
                            username: response.data?.nickname,
                            phone: response.data?.phone_number
                        },
                        meta: { timestamp: new Date().toISOString() },
                        isAuthenticated: true
                    });
                    
                    if (tokenFromUrl) {
                        const newParams = new URLSearchParams(window.location.search);
                        newParams.delete('token');
                        const newUrl = newParams.toString() 
                            ? `${pathname}?${newParams.toString()}` 
                            : pathname;
                        router.replace(newUrl, { scroll: false });
                    }
                }
            })
            .catch(error => {
                if (error.response?.status === 401) {
                    useUserStore.getState().resetUser();
                }
            });
    }, [setUser, router, pathname]);

    return <>{children}</>;
}