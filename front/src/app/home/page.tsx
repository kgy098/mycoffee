'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import MainBanner from '@/components/MainBanner';
import MyCoffeeSummary from '@/components/MyCoffeeSummary';
import TodaysCoffeePick from '@/components/TodaysCoffeePick';
import UserReviews from '@/components/UserReviews';
import CoffeeStories from '@/components/CoffeeStories';
import Footer from '@/components/Footer';
import { setAccessTokenCookie } from '@/utils/cookies';

function HomePageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

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
            <div className="z-10 py-[18px] flex justify-center bg-white">
                <Image
                    src="/images/logo.svg"
                    alt="My Coffee.Ai"
                    className="w-[137.5px] h-[20px] my-auto"
                    width={137.5}
                    height={20}
                />
            </div>

            {/* Main Content */}
            <div className='bg-background'>
                {/* Main Banner */}
                <MainBanner />

                {/* My Coffee Summary */}
                <MyCoffeeSummary />

                {/* User Reviews */}
                <UserReviews />

                {/* Coffee Stories */}
                <CoffeeStories />

                {/* Footer */}
                <Footer />
            </div>
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
