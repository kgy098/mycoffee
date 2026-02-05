'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import OtherCoffeeSlider from './OtherCoffeeSlider';

const MyCollectionTab = () => {
    const [isGuestView, setIsGuestView] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const cookies = document.cookie.split(';');
            const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
            const hasToken = !!tokenCookie;
            setIsGuestView(!hasToken);
        }
    }, []);

    if (isGuestView) {
        return (
            <div className="bg-background-sub rounded-lg px-4 text-gray-0 text-center pb-[194px] pt-[128px]">
                <div>
                    <p className="text-[14px] font-normal text-text-secondary mb-2 leading-[20px]">
                        지금 로그인하고, 내 커피 취향을 확인하세요!
                    </p>
                    <Link href="/auth/login" className="btn-action w-full text-center px-[14px]">
                        로그인
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className='pl-4'>
            <OtherCoffeeSlider />
        </div>
    );
};

export default MyCollectionTab;
