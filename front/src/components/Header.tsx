'use client';

import { useRouter } from 'next/navigation';
import { useHeaderStore } from '@/stores/header-store';
import { Settings } from 'lucide-react';
import Link from 'next/link';

const Header = () => {
    const router = useRouter();
    const { title, showBackButton, backHref, showSettingsButton } = useHeaderStore();

    const handleBackClick = () => {
        if (backHref) {
            router.push(backHref);
        } else {
            router.back();
        }
    };

    return (
        <div className="sticky h-11 top-0 z-10 bg-white px-4 py-2.5 flex items-center justify-between w-full" style={{boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.08)"}}>
            {/* Left side - Back button */}
            <div className="flex items-center">
                {showBackButton && (
                    <button onClick={handleBackClick} className="flex items-center py-0 px-2 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M15 18L9 12L15 6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>  
                    </button>
                )}
            </div>

            {/* Center - Title */}
            {
                title && (
                <div className="flex absolute left-1/2 -translate-x-1/2 shrink-0 text-nowrap">
                    <h1 className="text-[16px] font-bold text-gray-0">
                        {title}
                    </h1>
                </div>
            )}
            
            {
                showSettingsButton && (
                    <Link href="/profile/settings/my-settings" className="flex items-center p-2.5 cursor-pointer">
                        <Settings size={24} />
                    </Link>
                )
            } 
        </div>
    );
};

export default Header;