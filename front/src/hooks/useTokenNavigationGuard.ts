"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/user-store";

export function useTokenNavigationGuard() {
    const router = useRouter();
    const { setUser } = useUserStore();
    const checkedRef = useRef(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        
        if (checkedRef.current) return;
        checkedRef.current = true;

        const searchParams = new URLSearchParams(window.location.search);
        const token = searchParams.get("token");
        const isInternalNav = sessionStorage.getItem("internal-navigation");

        if (!token && !isInternalNav) {
            setTimeout(() => {
                //   router.replace("/on-event");
            }, 0);
            return;
        }

        sessionStorage.removeItem("internal-navigation");
    }, [router]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        
        const searchParams = new URLSearchParams(window.location.search);
        const token = searchParams.get("token");
        if (token) {
            setUser({
                data: {
                    user_id: 0,
                    session_id: '',
                    token: token,
                    token_type: 'Bearer',
                    expires_in: new Date().getTime() / 1000,
                    result_code: '0',
                    result_message: 'Success'
                },
                meta: { timestamp: new Date().toISOString() },
                isAuthenticated: true
            });
        }
    }, [setUser]);
}