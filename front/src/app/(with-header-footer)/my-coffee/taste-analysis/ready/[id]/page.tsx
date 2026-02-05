"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CoffeeCollectionSlider from "@/components/CoffeeCollectionSlider";
import LikeModal from "./components/LikeModal";
import OrderingComponent from "../../../components/ordering/Ordering";
import ActionSheet from "@/components/ActionSheet";
import Link from "next/link";
import { useTasteAnalysis } from "../../TasteAnalysisContext";
import { CoffeePreferences } from "@/types/coffee";
import { useGet } from "@/hooks/useApi";
import SpiderChart from "@/app/(content-only)/analysis/SpiderChart";
import OtherCoffeeSlider from "@/components/OtherCoffeeSlider";

const CoffeeAnalysisDetail = () => {

    const params = useParams();
    const coffeeBlendId = params.id;
    const [openItems, setOpenItems] = useState<number[]>([0, 1, 2]);
    const [tasteRatings, setTasteRatings] = useState<CoffeePreferences>({
        aroma: 1,
        sweetness: 1,
        body: 1,
        nutty: 1,
        acidity: 1
    });

    const [isLikeModalOpen, setIsLikeModalOpen] = useState(false);
    const [likedItemSaved, setLikedItemSaved] = useState(false);
    const { recommendations } = useTasteAnalysis();
    const recommendation = recommendations.find((recommendation) => recommendation.coffee_blend_id === coffeeBlendId);

    useEffect(() => {
        setTasteRatings({
            aroma: recommendation?.aroma_score || 1,
            sweetness: recommendation?.sweetness_score || 1,
            body: recommendation?.body_score || 1,
            nutty: recommendation?.nutty_score || 1,
            acidity: recommendation?.acidity_score || 1
        })
    }, [recommendation]);

    const accordionItems = [
        {
            id: 0,
            title: "원두 프로파일",
        },
        {
            id: 1,
            title: "AI 커피 스토리",
        },
        {
            id: 2,
            title: "다른 커피는 어때요?",
        }
    ];

    const { data: coffeeBlend } = useGet<any>(
        ['/analytics/similar', coffeeBlendId],
        `/analytics/similar/${coffeeBlendId}`,
        {
            params: {
                limit: 5
            }
        },
        {
            enabled: !!coffeeBlendId
        }
    );
    const { data: AIStory } = useGet<any>(
        ['/analytics/ai-story', coffeeBlendId],
        `/analytics/ai-story/${coffeeBlendId}`,
        {},
        {
            enabled: !!coffeeBlendId
        }
    );

    const toggleItem = (id: number) => {
        setOpenItems(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    const handleLikeSave = (coffeeName: string, comment: string) => {
        console.log('Saved coffee:', { coffeeName, comment });
    };

    return (
        <div className="">
            <div className="overflow-y-auto h-[calc(100vh-253px)] pl-4 pt-3 pb-2">
                <div className="pr-4">
                    <h2 className="text-[20px] font-bold text-gray-0 mb-2 text-center leading-[28px]">나만의 커피 취향을 찾아볼까요?</h2>
                    <p className="text-xs text-gray-0 mb-6 text-center leading-[18px]">" 향긋한 꽃향기와 크리미한 바디감이 인상 깊습니다. "</p>
                </div>

                <div className="">

                    <div className="space-y-[26px]">
                        {accordionItems.map((item, index) => (
                            <div key={item.id} className="overflow-hidden">
                                <div className="pr-[22px]">
                                    <button
                                        type="button"
                                        onClick={() => toggleItem(item.id)}
                                        className="r-4 flex items-center justify-between w-full py-0 font-medium text-gray-500 rounded-lg transition-colors duration-200 cursor-pointer"
                                    >
                                        <div className="flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M20 6L9 17L4 12" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <p className="flex items-center mt-[3px] text-gray-0 text-base font-bold leading-[125%]">{item.title}</p>
                                        </div>
                                        <svg
                                            className={`shrink-0 transition-transform duration-200 ${openItems.includes(item.id) ? '' : 'rotate-180'
                                                }`}
                                            xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8" fill="none">
                                            <path d="M10.5 6.5L6 1.5L1.5 6.5" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                </div>

                                <div
                                    className={`transition-all duration-300 ease-in-out ${openItems.includes(item.id)
                                        ? 'max-h-[2000px] opacity-100'
                                        : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    <div className="pt-3">
                                        {item.id === 0 ? (
                                            <div className="border border-border-default rounded-2xl p-3 bg-white mr-4">
                                                {/* Radar Chart */}
                                                <SpiderChart
                                                    ratings={tasteRatings}
                                                    setRatings={() => { }}
                                                    isChangable={false}
                                                    isClickable={true}
                                                    size="medium"
                                                    wrapperClassName="!mb-1"
                                                />
                                                {/* Origin Info */}
                                                <div className="text-center mb-4">
                                                    <p className="text-xs text-gray-0 leading-[16px]">
                                                        (브라질 42%, 페루 58%)
                                                    </p>
                                                </div>

                                                {/* Taste Details */}
                                                {/* <TasteDetails ratings={tasteRatings} /> */}
                                            </div>
                                        ) : item.id === 1 ? (
                                            <div>
                                                {/* Coffee Collection Slider */}
                                                <CoffeeCollectionSlider />
                                            </div>
                                        ) : item.id === 2 ? (
                                            <div>                                                
                                                <OtherCoffeeSlider />
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white py-2 px-4" style={{ boxShadow: "0 -1px 2px 0 rgba(0,0,0,0.04)" }}>
                <div className="flex justify-center gap-2">
                    <button
                        onClick={() => setIsLikeModalOpen(true)}
                        className="size-12 flex-shrink-0 border border-border-default rounded-lg flex items-center justify-center cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M1.66675 7.91662C1.66677 6.98929 1.94808 6.08377 2.47353 5.31967C2.99898 4.55557 3.74385 3.96883 4.60976 3.63695C5.47567 3.30507 6.42188 3.24366 7.32343 3.46082C8.22497 3.67799 9.03944 4.16352 9.65925 4.85329C9.7029 4.89996 9.75568 4.93718 9.81431 4.96262C9.87294 4.98806 9.93617 5.00119 10.0001 5.00119C10.064 5.00119 10.1272 4.98806 10.1859 4.96262C10.2445 4.93718 10.2973 4.89996 10.3409 4.85329C10.9588 4.15904 11.7734 3.66943 12.6764 3.44962C13.5795 3.22982 14.528 3.29024 15.3958 3.62286C16.2636 3.95547 17.0096 4.5445 17.5343 5.31154C18.0591 6.07858 18.3378 6.98725 18.3334 7.91662C18.3334 9.82495 17.0834 11.25 15.8334 12.5L11.2567 16.9275C11.1015 17.1058 10.91 17.249 10.6951 17.3477C10.4802 17.4464 10.2468 17.4982 10.0103 17.4997C9.77386 17.5012 9.53979 17.4523 9.32365 17.3564C9.10752 17.2605 8.91427 17.1196 8.75675 16.9433L4.16675 12.5C2.91675 11.25 1.66675 9.83329 1.66675 7.91662Z" stroke="#4E2A18" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <OrderingComponent title={"주문하기"} />
                </div>
            </div>

            {/* Like Modal */}
            <LikeModal
                isOpen={isLikeModalOpen}
                onClose={() => setIsLikeModalOpen(false)}
                onSave={handleLikeSave}
                setLikedItemSaved={setLikedItemSaved}
            />

            <ActionSheet
                isOpen={likedItemSaved}
                onClose={() => setLikedItemSaved(false)}
            >
                <p className="text-base font-bold text-gray-0 mb-6 text-center leading-[20px]">컬렉션 저장 완료!<br />이어서 한 번에 주문까지 끝내시겠어요?</p>
                <div className="flex flex-col gap-2">
                    <Link href={'/my-coffee/collection/1'} className="btn-primary text-center">
                        지금 주문하기
                    </Link>
                    <Link href={'/my-coffee/collection'} className="btn-primary-empty text-center">
                        내 커피 컬렉션 보기
                    </Link>
                </div>
            </ActionSheet>
        </div>
    );
};

export default CoffeeAnalysisDetail;
