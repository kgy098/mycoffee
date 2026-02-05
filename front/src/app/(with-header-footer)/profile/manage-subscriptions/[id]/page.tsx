"use client";
import { useHeaderStore } from "@/stores/header-store";
import { useEffect } from "react";

const ManageSubscriptionsDetail = () => {


    const { setHeader } = useHeaderStore();

    useEffect(() => {
      setHeader({
        title: "구독 상세",
      });
    }, []);

    const item = {
        id: 1,
        status: "구독",
        statusColor: "bg-[#28A745]",
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
    };

    return (
        <div className="p-4 text-gray-0">
            <div className="bg-white rounded-2xl px-4 py-3 border border-border-default mb-4">
                <h3 className="text-sm font-bold mb-4">구독 상품</h3>
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
                <div className="flex items-center justify-between">
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
            </div>
            <div className="bg-white rounded-2xl px-4 py-3 border border-border-default mb-4">
                <h3 className="text-sm font-bold mb-4">구독 정보</h3>
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

                <div className="space-y-1 text-text-secondary">
                    <p className="text-xs font-normal text-right leading-[18px]">인천 부평구 길주남로 113번길 12</p>
                    <p className="text-xs font-normal text-right leading-[18px]">동아아파트 2동 512호</p>
                    <p className="text-xs font-normal text-right leading-[18px]">010-2934-3017</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl px-4 py-3 border border-border-default mb-4">
                <h3 className="text-sm font-bold mb-4">주문 이력</h3>
                <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                        <span className="leading-[18px]">2025-05-10</span>
                        <span className="font-bold leading-[18px]">20250510123412341</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="leading-[18px]">2025-05-10</span>
                        <span className="font-bold leading-[18px]">20250510123412341</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="leading-[18px]">2025-05-10</span>
                        <span className="font-bold leading-[18px]">20250510123412341</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="leading-[18px]">2025-05-10</span>
                        <span className="font-bold leading-[18px]">20250510123412341</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ManageSubscriptionsDetail;