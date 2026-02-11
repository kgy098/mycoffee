'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation'; 
import Image from 'next/image';
import MainBanner from '@/components/MainBanner';
import MyCoffeeSummary from '@/components/MyCoffeeSummary'; 
import TodaysCoffeePick from '@/components/TodaysCoffeePick';
import UserReviews from '@/components/UserReviews';
import CoffeeStories from '@/components/CoffeeStories';
import Footer from '@/components/Footer';
import LoginRequiredAlert from '@/components/LoginRequiredAlert';
import { setAccessTokenCookie } from '@/utils/cookies';
import { useUserStore } from '@/stores/user-store';

function HomePageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [showLoginAlert, setShowLoginAlert] = useState(false);
    const { user } = useUserStore();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = searchParams.get('token');
            if (token) {
                setAccessTokenCookie(token);
                
                // Remove token from URL
                const url = new URL(window.location.href);
                url.searchParams.delete('token');
                router.replace(url.pathname + url.search, { scroll: false });
            }
        }
    }, [searchParams, router]);

    return (
        <div className="bg-background w-full">
            <div className="z-10 py-[18px] px-4 bg-white">
                <div className="flex justify-center">
                    <Image
                        src="/images/logo.svg"
                        alt="My Coffee.Ai"
                        className="w-[137.5px] h-[20px] my-auto"
                        width={137.5}
                        height={20}
                    />
                </div>
            </div>

            {/* 로고 하단 · 배너 위 인사 문구 (로그인 시만) */}
            {user?.isAuthenticated && user?.data?.display_name && (
                <div className="bg-background px-4 pt-4 pb-2 flex justify-end">
                    <span className="text-sm text-gray-700">{user.data.display_name}님 반갑습니다.</span>
                </div>
            )}

            {/* Main Content */}
            <div className='bg-background'> 
                {/* Main Banner - 메인 취향분석: 비로그인 시 로그인 필요 알럿 */}
                <MainBanner onRequireLogin={() => setShowLoginAlert(true)} />

                {/* My Coffee Summary */}
                <MyCoffeeSummary />

                {/* User Reviews */}
                <UserReviews />

                {/* Coffee Stories */}
                <CoffeeStories />

                {/* Footer */}
                <Footer /> 
            </div>

            {/* 로그인 필요 알럿 (화면 하단) */}
            <LoginRequiredAlert isOpen={showLoginAlert} onClose={() => setShowLoginAlert(false)} />
        </div>
    );
}

export default function HomePage() {
    return (
        <Suspense fallback={
            <div className="bg-background w-full">
                <div className="z-10 py-[18px] flex justify-center bg-white">
                    <Image
                        src="/images/logo.svg"
                        alt="My Coffee.Ai"
                        className="w-[137.5px] h-[20px] my-auto"
                        width={137.5}
                        height={20}
                    />
                </div>
                <div className='bg-background'>
                    <MainBanner />
                    <MyCoffeeSummary />
                    <UserReviews />
                    <CoffeeStories />
                    <Footer />
                </div>
            </div>
        }>
            <HomePageContent />
        </Suspense>
    );
}
