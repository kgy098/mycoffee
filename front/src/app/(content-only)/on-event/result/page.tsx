'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useRecommendationStore } from '@/stores/recommendation-store';
import { CoffeePreferences } from '@/types/coffee';
import { useGet } from '@/hooks/useApi';
import SpiderChart from '../../analysis/SpiderChart';
import RegisterBtn from './components/registerBtn';
import OnEventResultCollapse from './components/collapse';
import { useTokenNavigationGuard } from '@/hooks/useTokenNavigationGuard';
import Link from 'next/link';

type BlendType = {
    name: string;
    description: string;
    origins: string[];
    ratings: CoffeePreferences;
}

function TokenGuard() {
    useTokenNavigationGuard();
    return null;
}

function ResultContent() {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const { recommendations, setRecommendations } = useRecommendationStore();
    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);
    
    const [coffeeBlend, setCoffeeBlend] = useState<BlendType | null>(null);

    useEffect(() => {
        let currentRecommendations = recommendations;
        
        if (!currentRecommendations?.length && typeof window !== 'undefined') {
            const stored = localStorage.getItem('recommendation');
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    currentRecommendations = [parsed];
                    setRecommendations([parsed]);
                } catch (e) {
                    console.error('Failed to parse recommendation from localStorage', e);
                }
            }
        }
        
        if (!currentRecommendations?.length) {
            router.replace('/on-event');
            return;
        }
        
        const firstRec = currentRecommendations[0];
        if (firstRec) {
            setCoffeeBlend({
                name: firstRec.coffee_name,
                description: firstRec.summary,
                origins: [],
                ratings: {
                    aroma: firstRec.aroma_score,
                    acidity: firstRec.acidity_score,
                    sweetness: firstRec.sweetness_score,
                    nuttiness: firstRec.nutty_score,
                    body: firstRec.body_score
                }
            });
        }
    }, [recommendations, router, setRecommendations]);

    const hasRecommendations = recommendations?.length && recommendations?.[0]?.coffee_blend_id;

    const { data: originData } = useGet<any>(
        ["mycoffee", "blend", "origin", recommendations?.[0]?.coffee_blend_id],
        `/mycoffee/blend/${recommendations?.[0]?.coffee_blend_id}/origin`,
        {
            params: {
                coffee_blend_id: recommendations?.[0]?.coffee_blend_id,
            },
        },
        {
            enabled: !!(hasRecommendations && recommendations?.[0]?.coffee_blend_id)
        }
    );

    useEffect(() => {
        if (hasRecommendations && originData?.origin_summary) {
            const origins = originData.origin_summary.match(/.*?\d+%/g)?.map((origin: any) => origin.trim()) || [];
            setCoffeeBlend(prev => prev ? ({ ...prev, origins }) : prev);
        }
    }, [originData, hasRecommendations]);

    const { data: tastesData } = useGet(
        ["mycoffee", "blend", "taste", recommendations?.[0]?.coffee_blend_id],
        `/mycoffee/blend/${recommendations?.[0]?.coffee_blend_id}/taste`,
        {},
        {
            enabled: !!(hasRecommendations && recommendations?.[0]?.coffee_blend_id)
        }
    );
    

    return (
        <>
            <TokenGuard />
            <div className="flex flex-col justify-center items-center px-4 pb-10">
                <div className='overflow-y-auto h-[calc(100vh-167px)] pt-[30px]'>
                <div className=''>
                    <div className='w-full'>
                        <div className='px-[7px]'>
                            <h1 className="text-xl font-bold text-gray-0 mb-2">{coffeeBlend?.name || ""}</h1>
                            <p className="text-sm mb-2 font-normal text-text-secondary">{coffeeBlend?.description || ""}</p>

                            <div className="flex gap-1 mb-16">
                                {(coffeeBlend?.origins || []).map((origin, idx) => (
                                    <span
                                        key={idx}
                                        className="px-2 py-1 bg-[rgba(0,0,0,0.05)] rounded-[10px] text-[12px] text-gray-0 leading-[16px]"
                                    >
                                        {origin}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <SpiderChart
                                ratings={coffeeBlend?.ratings || { aroma: 1, acidity: 1, sweetness: 1, nuttiness: 1, body: 1 }}
                                setRatings={() => { }}
                                isChangable={false}
                                isClickable={true}
                                tastes={tastesData?.tastes}
                            />
                        </div>
                    </div>
                </div>
                <OnEventResultCollapse />
                {/* <Link href='/on-event/detail' className='text-text-secondary font-normal text-sm cursor-pointer hover:text-text-primary transition-colors duration-75 underline text-center px-4 mt-4 py-2 block mx-auto'>자세히 보기</Link> */}
                </div>
                

                <div className="space-y-2 mt-auto w-full">
                    <RegisterBtn
                        onOpenModal={onOpenModal}
                        onCloseModal={onCloseModal}
                        open={open}
                        setOpen={setOpen}
                        coffeeBlendId={recommendations?.[0]?.coffee_blend_id || ''}
                        recommendation={recommendations?.[0] || ''}
                    />
                    <button onClick={() => router.push('/on-event')} className="btn-primary-outline w-full" >다시 하기</button>
                </div>
            </div>
        </>
    );
}

export default function ResultPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResultContent />
        </Suspense>
    );
}
