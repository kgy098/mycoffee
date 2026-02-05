"use client";
import './loader.css';
import { useLoaderStore } from '@/stores/loader-store';
import { useState, useEffect, useRef } from 'react';

const MIN_DISPLAY_TIME = 1500; // 1.5 seconds

export const SpinnerGlobalLoader = () => {
    const { isLoading } = useLoaderStore();
    const [showLoader, setShowLoader] = useState(false);
    const startTimeRef = useRef<number | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isLoading) {
            const startTime = Date.now();
            startTimeRef.current = startTime;
            setShowLoader(true);

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        } else {
            if (startTimeRef.current !== null) {
                const elapsedTime = Date.now() - startTimeRef.current;
                const remainingTime = MIN_DISPLAY_TIME - elapsedTime;

                if (remainingTime > 0) {
                    // Agar 1.5 sekunddan kam vaqt o'tgan bo'lsa, qolgan vaqtni kutamiz
                    timeoutRef.current = setTimeout(() => {
                        setShowLoader(false);
                        startTimeRef.current = null;
                        timeoutRef.current = null;
                    }, remainingTime);
                } else {
                    setShowLoader(false);
                    startTimeRef.current = null;
                }
            }
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [isLoading]);

    if (!showLoader) return null;

    return (
        <div 
            className="fixed inset-0 z-[1001] flex items-center justify-center" 
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.40)' }}
        >
            <span className={`spinner-global-loader loading`}></span>
        </div>
    );
}