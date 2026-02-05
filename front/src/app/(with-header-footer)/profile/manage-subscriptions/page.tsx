"use client";

import { useHeaderStore } from "@/stores/header-store";
import Link from "next/link";
import { useEffect, useState } from "react";

const ManageSubscriptions = () => {
    const [activeTag, setActiveTag] = useState("전체");

    const { setHeader } = useHeaderStore();

    useEffect(() => {
        setHeader({
            title: "구독 관리",
        });
    }, []);

    const tags = [
        { id: "전체", label: "전체" },
        { id: "구독", label: "구독" },
        { id: "일시정지", label: "일시정지" },
        { id: "종료", label: "종료" },
    ];

    // Demo data for subscription cards
    const subscriptionData = [
        {
            id: 1,
            status: "구독",
            statusColor: "bg-[#8B5E3C]",
            statusTextColor: "text-white",
            title: "나만의 커피 1호기",
            subtitle: "(클래식 하모니 블랜드)",
            details: ["카페인", "홀빈", "벌크", "500g", "1개"],
            price: "36,000원",
            subscriptionCount: "1/4",
            nextPaymentDate: "2025년 10월 01일 (화)",
            nextDeliveryDate: "2025년 10월 03일 (목)",
            deliveryName: "이기홍",
            deliveryAddress: "인천 부평구 길주남로 113번길 12 동아아파트 2동 512호",
            phone: "010-2934-3017",
            buttons: ["결제 수단 관리"]
        },
        {
            id: 2,
            status: "일시정지",
            statusColor: "bg-[rgba(0,0,0,0.05)]",
            statusTextColor: "text-[#1A1A1A]",
            title: "나만의 커피 1호기",
            subtitle: "(클래식 하모니 블랜드)",
            details: ["카페인", "홀빈", "벌크", "500g", "1개"],
            price: "36,000원",
            subscriptionCount: "1/4",
            nextPaymentDate: "2025년 10월 01일 (화)",
            nextDeliveryDate: "2025년 10월 03일 (목)",
            deliveryName: "이기홍",
            deliveryAddress: "인천 부평구 길주남로 113번길 12 동아아파트 2동 512호",
            phone: "010-2934-3017",
            buttons: ["결제 수단 관리", "재개하기"]
        },
        {
            id: 3,
            status: "종료",
            statusColor: "bg-[#C97A50]",
            statusTextColor: "text-white",
            title: "나만의 커피 1호기",
            subtitle: "(클래식 하모니 블랜드)",
            details: ["카페인", "홀빈", "벌크", "500g", "1개"],
            price: "36,000원",
            subscriptionCount: "1/4",
            nextPaymentDate: "2025년 10월 01일 (화)",
            nextDeliveryDate: "2025년 10월 03일 (목)",
            deliveryName: "이기홍",
            deliveryAddress: "인천 부평구 길주남로 113번길 12 동아아파트 2동 512호",
            phone: "010-2934-3017",
            buttons: ["선택"]
        }
    ];

    // Filter data based on active tag
    const filteredData = activeTag === "전체"
        ? subscriptionData
        : subscriptionData.filter(item => item.status === activeTag);

    return (
        <div className="p-4">
            {/* Tags */}
            <div className="flex gap-2 mb-4">
                {tags.map((tag) => (
                    <button
                        key={tag.id}
                        onClick={() => setActiveTag(tag.id)}
                        className={`px-[9px] py-[3px] cursor-pointer rounded-sm text-sm leading-[20px] font-bold transition-all duration-200 whitespace-nowrap ${activeTag === tag.id
                            ? "bg-linear-gradient text-white border border-action-primary"
                            : "bg-white text-action-primary border border-action-primary"
                            }`}
                    >
                        {tag.label}
                    </button>
                ))}
            </div>

            {/* Subscription Cards */}
            <div className="space-y-4 text-gray-0">
                {filteredData.map((item) => (
                    <div key={item.id} className="bg-white rounded-2xl px-4 py-3 border border-border-default">
                        {/* Header with status */}
                        <div className="flex items-start justify-between mb-5">
                            <div>
                                <h3 className="text-sm font-bold">
                                    {item.title}
                                </h3>
                                <p className="text-[12px] font-bold mt-1">
                                    {item.subtitle}
                                </p>
                            </div>
                            <div className={`px-2 py-1 rounded-lg h-6 flex items-center justify-center ${item.statusColor}`}>
                                <span className={`text-xs font-medium ${item.statusTextColor}`}>
                                    {item.status}
                                </span>
                            </div>
                        </div>

                        {/* Product details and price */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="text-sm text-text-secondary flex items-center gap-1">
                                {["카페인", "홀빈", "벌크", "500g", "라벨"].map((item, idx) => (
                                    <span
                                        key={idx}
                                        className="text-[12px] leading-[16px] flex items-center gap-1"
                                    >
                                        {item}{" "}
                                        {idx !== 4 && (
                                            <span className="size-1 bg-[#9CA3AF] rounded-full inline-block"></span>
                                        )}
                                    </span>
                                ))}
                            </div>
                            <span className="text-sm font-bold">{item.price}</span>
                        </div>

                        {/* Subscription info */}
                        <div className="space-y-2 mb-4 text-xs">
                            <div className="flex justify-between">
                                <span className="">구독 횟수</span>
                                <span className="font-bold">{item.subscriptionCount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="">다음 결제일</span>
                                <span className="font-bold">{item.nextPaymentDate}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="">다음 배송일</span>
                                <span className="font-bold">{item.nextDeliveryDate}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="">배송지</span>
                                <span className="font-bold">이기홍</span>
                            </div>
                        </div>

                        {/* Delivery info */}
                        <div className="mb-4">
                            <div className="flex gap-2">
                                <div className="bg-[rgba(0,0,0,0.05)] rounded-full p-2 size-8">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <g clip-path="url(#clip0_3239_5687)">
                                            <path d="M9.99999 14.6655C9.82318 14.6655 9.65361 14.5952 9.52859 14.4702C9.40357 14.3452 9.33333 14.1756 9.33333 13.9988V11.3321C9.33331 11.2224 9.36038 11.1144 9.41213 11.0176C9.46388 10.9209 9.53872 10.8384 9.62999 10.7775L11.63 9.44413C11.7395 9.37104 11.8683 9.33203 12 9.33203C12.1317 9.33203 12.2604 9.37104 12.37 9.44413L14.37 10.7775C14.4613 10.8384 14.5361 10.9209 14.5879 11.0176C14.6396 11.1144 14.6667 11.2224 14.6667 11.3321V13.9988C14.6667 14.1756 14.5964 14.3452 14.4714 14.4702C14.3464 14.5952 14.1768 14.6655 14 14.6655H9.99999Z" stroke="#62402D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M12 6.66536C12 5.25088 11.4381 3.89432 10.4379 2.89413C9.4377 1.89393 8.08115 1.33203 6.66666 1.33203C5.25217 1.33203 3.89562 1.89393 2.89543 2.89413C1.89523 3.89432 1.33333 5.25088 1.33333 6.66536C1.33333 9.99403 5.026 13.4607 6.266 14.5314C6.38158 14.618 6.52219 14.6648 6.66666 14.6647" stroke="#62402D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M12 14.668V12.668" stroke="#62402D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M6.66667 8.66797C7.77124 8.66797 8.66667 7.77254 8.66667 6.66797C8.66667 5.5634 7.77124 4.66797 6.66667 4.66797C5.5621 4.66797 4.66667 5.5634 4.66667 6.66797C4.66667 7.77254 5.5621 8.66797 6.66667 8.66797Z" stroke="#62402D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_3239_5687">
                                                <rect width="16" height="16" fill="white" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </div>
                                <div className="space-y-1 text-text-secondary">
                                    <p className="text-xs font-bold leading-[18px] text-text-primary">인천 부평구 길주남로 113번길 12</p>
                                    <p className="text-xs font-normal leading-[18px]">동아아파트 2동 512호</p>
                                    <p className="text-xs font-normal leading-[18px]">010-2934-3017</p>
                                </div>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center justify-between gap-2">
                            {item.buttons.map((buttonText, index) => (
                                <Link
                                    key={index}
                                    href={`/profile/manage-subscriptions/${item.id}`}
                                    className={`btn-action text-center`}
                                >
                                    {buttonText}
                                </Link>
                            ))}
                            <button className="cursor-pointer size-8 border border-border-default rounded-sm flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M3.3335 4.1665H16.6668" stroke="#4E2A18" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M3.3335 10H16.6668" stroke="#4E2A18" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M3.3335 15.8335H16.6668" stroke="#4E2A18" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default ManageSubscriptions;