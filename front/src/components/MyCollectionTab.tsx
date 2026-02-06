'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import OtherCoffeeSlider from './OtherCoffeeSlider';
import { useUserStore } from '@/stores/user-store';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

const MyCollectionTab = () => {
    const [isGuestView, setIsGuestView] = useState(false);
    const { user } = useUserStore();
    const userId = user?.data?.user_id || 0;

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

    const { data: collectionBlends, isLoading } = useQuery({
        queryKey: ['home-collections', userId],
        enabled: userId > 0,
        queryFn: async () => {
            const { data: collections } = await api.get('/api/collections', {
                params: { user_id: userId }
            });

            if (!Array.isArray(collections) || collections.length === 0) {
                return [];
            }

            const blends = await Promise.all(
                collections.map(async (item: any) => {
                    try {
                        const { data: blend } = await api.get(`/api/blends/${item.blend_id}`);
                        return {
                            id: blend.id,
                            name: blend.name,
                            summary: blend.summary,
                            acidity: blend.acidity,
                            sweetness: blend.sweetness,
                            body: blend.body,
                            nuttiness: blend.nuttiness,
                            bitterness: blend.bitterness,
                        };
                    } catch (error) {
                        return null;
                    }
                })
            );

            return blends.filter(Boolean);
        }
    });

    if (isLoading) {
        return (
            <div className="bg-background-sub rounded-lg px-4 text-gray-0 text-center py-8">
                <p className="text-text-secondary text-sm">로딩 중...</p>
            </div>
        );
    }

    if (!collectionBlends || collectionBlends.length === 0) {
        return (
            <div className="bg-background-sub rounded-lg px-4 text-gray-0 text-center py-8">
                <p className="text-text-secondary text-sm mb-2">저장된 내 커피 컬렉션이 없습니다.</p>
                <Link href="/analysis" className="btn-action w-full text-center px-[14px]">
                    커피 취향 분석하기
                </Link>
            </div>
        );
    }

    return (
        <div className='pl-4'>
            <OtherCoffeeSlider data={collectionBlends} />
        </div>
    );
};

export default MyCollectionTab;
