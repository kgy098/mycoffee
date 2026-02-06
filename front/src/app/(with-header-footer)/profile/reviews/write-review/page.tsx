"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useGet } from "@/hooks/useApi";
import { useUserStore } from "@/stores/user-store";

const ReviewWrite = () => {
    const [showAlert, setShowAlert] = useState(true);

    const { data: user } = useUserStore((state) => state.user);
    const { data: reviewableItems } = useGet<any[]>(
        ["reviewable-orders", user?.user_id],
        "/api/reviews/reviewable",
        { params: { user_id: user?.user_id } },
        { enabled: !!user?.user_id }
    );

    const reviewItems = useMemo(() => reviewableItems || [], [reviewableItems]);

    return (
        <div>
            {/* Alert Banner */}
            {showAlert && (
                <div className="bg-[#FFF3CD] rounded-lg py-3 px-4 mb-4">
                    <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M12 8V12" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M12 16H12.01" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p className="text-[12px] text-[#F59E0B] leading-[140%]">
                            포토 리뷰 작성 시, 확인 후 1000포인트를 드려요! 작성일로부터 48시간 이내 적립됩니다.
                        </p>
                        <button
                            onClick={() => setShowAlert(false)}
                            className="flex-shrink-0 cursor-pointer ml-auto"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M18 6L6 18" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M6 6L18 18" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Review Items List */}
            <div className="space-y-3">
                {reviewItems.map((item) => (
                    <div key={item.order_item_id || item.order_id} className="bg-white rounded-2xl px-4 py-3 border border-border-default">
                        {/* Header with date and order number */}
                        <div className="flex items-center justify-between border-b border-border-default pb-4 mb-4">
                            <span className="text-[12px] font-bold leading-[160%] text-gray-500">
                                {item.order_date
                                    ? new Date(item.order_date).toLocaleDateString("ko-KR").replace(/\. /g, ".")
                                    : ""} | {item.order_number}
                            </span>
                            <Link
                                href={`/profile/write-review/${item.order_item_id || item.order_id}`}
                                className="text-[12px] font-bold flex items-center gap-2 text-[#3182F6]"
                            >
                                주문 상세보기
                                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="12" viewBox="0 0 8 12" fill="none">
                                    <path d="M1.5 10.5L6.5 6L1.5 1.5" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </Link>
                        </div>

                        <h3 className="text-sm font-bold mb-[12px]">
                            {item.blend_name || "나만의 커피"}
                        </h3>
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-1">
                                {[
                                    item.options?.caffeine,
                                    item.options?.grind,
                                    item.options?.package,
                                    item.options?.weight,
                                    item.quantity ? `${item.quantity}개` : null,
                                ].filter(Boolean).map((detail: string, index: number, list: string[]) => (
                                    <span key={index} className="text-[12px] text-text-secondary flex items-center gap-1">
                                        {detail}
                                        {index < list.length - 1 && <span className="text-brand-secondary-accent-sub w-1 h-1 rounded-full flex items-center">•</span>}
                                    </span>
                                ))}
                            </div>
                            <span className="text-sm font-bold leading-[142%]">
                                {item.unit_price ? `${Number(item.unit_price).toLocaleString("ko-KR")}원` : "-"}
                            </span>
                        </div>

                        <Link
                            href={`/profile/write-review/${item.order_item_id || item.order_id}`}
                            className="btn-action block text-center"
                        >
                            리뷰 작성
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default ReviewWrite;