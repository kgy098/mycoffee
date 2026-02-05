"use client";

import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import { useEffect } from "react";

export default function GlobalLoader({ children }: { children: React.ReactNode }) {

    const pathname = usePathname();

    useEffect(() => {
        NProgress.start();
        const timeout = setTimeout(() => {
            NProgress.done();
        }, 300);

        return () => {
            clearTimeout(timeout);
        };
    }, [pathname]);

    return children;
}