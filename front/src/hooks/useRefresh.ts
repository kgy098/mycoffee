"use client";

import { useEffect, useState, useRef } from 'react';
import { api } from '@/lib/api';
import { useUserStore } from '@/stores/user-store';

interface RefreshResponse {
    data: {
        user_id: number;
        session_id: string;
        token: string;
        token_type: string;
        expires_in: number;
        result_code: string;
        result_message: string;
    };
    meta: {
        timestamp: string;
    };
}

export function useRefresh() {

    const [isRefreshing, setIsRefreshing] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const { user, setUser } = useUserStore();
    const hasAttempted = useRef(false);

    const refresh = async () => {
        if (user.isAuthenticated || hasAttempted.current) {
            return;
        }
        if (typeof window !== 'undefined' && sessionStorage.getItem('auth_redirect') === 'true') {
            return;
        }

        hasAttempted.current = true;
        setIsRefreshing(true);
        setError(null);

        try {
            const response = await api.post<RefreshResponse>('/auth/refresh');
            
            if (response.status === 200 && response.data?.data?.token) {
                sessionStorage.removeItem('auth_redirect');
                setUser({data: response.data.data, meta: response.data.meta, isAuthenticated: true});
            }
        } catch (err) {
            const error = err as Error;
            setError(error);
            console.error('Token refresh failed in useRefresh:', error);
        } finally {
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        if (!user.isAuthenticated && !hasAttempted.current) {
            refresh();
        }
    }, []);

    return {
        refresh,
        isRefreshing,
        error,
    };
}

