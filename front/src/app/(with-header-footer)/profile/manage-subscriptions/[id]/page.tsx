"use client";
import { useHeaderStore } from "@/stores/header-store";
import { useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { useGet } from "@/hooks/useApi";

const ManageSubscriptionsDetail = () => {


    const { setHeader } = useHeaderStore();

    useEffect(() => {
      setHeader({
        title: "구독 상세",
      });
    }, []);

    const params = useParams();
    const subscriptionIdParam = Array.isArray(params.id) ? params.id[0] : params.id;
    const subscriptionId = Number(subscriptionIdParam);

    const { data: subscription } = useGet<any>(
        ["subscription-detail", subscriptionId],
        `/api/subscriptions/${subscriptionId}`,
        {},
        { enabled: Number.isFinite(subscriptionId) }
    );

    const { data: subscriptionOrders } = useGet<any[]>(
        ["subscription-orders", subscriptionId],
        `/api/subscriptions/${subscriptionId}/orders`,
        {},
        { enabled: Number.isFinite(subscriptionId) }
    );

    const item = useMemo(() => {
        if (!subscription) return null;
        const statusMap: Record<string, { label: string; color: string; textColor: string }> = {
            active: { label: "구독", color: "bg-[#28A745]", textColor: "text-white" },
            paused: { label: "일시정지", color: "bg-[rgba(0,0,0,0.05)]", textColor: "text-[#1A1A1A]" },
            cancelled: { label: "종료", color: "bg-[#C97A50]", textColor: "text-white" },
            expired: { label: "종료", color: "bg-[#C97A50]", textColor: "text-white" },
        };
        const statusInfo = statusMap[subscription.status] || statusMap.active;
        const details = [
            subscription.options?.caffeine,
            subscription.options?.grind,
            subscription.options?.package,
            subscription.options?.weight,
            subscription.quantity ? `${subscription.quantity}개` : null,
        ].filter(Boolean);
        const nextBilling = subscription.next_billing_date ? new Date(subscription.next_billing_date) : null;
        const nextDelivery = nextBilling ? new Date(nextBilling.getTime() + 2 * 24 * 60 * 60 * 1000) : null;
        return {
            status: statusInfo.label,
            statusColor: statusInfo.color,
            statusTextColor: statusInfo.textColor,
            title: subscription.blend_name || "나만의 커피",
            subtitle: "",
            details,
            price: subscription.total_amount ? `${Number(subscription.total_amount).toLocaleString("ko-KR")}원` : "-",
            subscriptionCount: `${subscription.current_cycle || 0}/${subscription.total_cycles || 0}`,
            nextPaymentDate: nextBilling ? nextBilling.toLocaleDateString("ko-KR") : "-",
            nextDeliveryDate: nextDelivery ? nextDelivery.toLocaleDateString("ko-KR") : "-",
            deliveryName: subscription.delivery_address?.recipient_name || "-",
            deliveryAddress: [subscription.delivery_address?.address_line1, subscription.delivery_address?.address_line2].filter(Boolean).join(" ") || "-",
            phone: subscription.delivery_address?.phone_number || "-",
        };
    }, [subscription]);

    if (!item) {
        return (
            <div className="p-4 text-gray-0">
                <div className="bg-white rounded-2xl px-4 py-6 border border-border-default text-center text-text-secondary">
                    구독 정보를 찾을 수 없습니다.
                </div>
            </div>
        );
    }

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
                        {item.details.map((detail, idx) => (
                            <span
                                key={idx}
                                className="text-[12px] leading-[16px] flex items-center gap-1"
                            >
                                {detail}{" "}
                                {idx !== item.details.length - 1 && (
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
                        <span className="font-bold">{item.deliveryName}</span>
                    </div>
                </div>

                <div className="space-y-1 text-text-secondary">
                    <p className="text-xs font-normal text-right leading-[18px]">{item.deliveryAddress}</p>
                    <p className="text-xs font-normal text-right leading-[18px]">{item.phone}</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl px-4 py-3 border border-border-default mb-4">
                <h3 className="text-sm font-bold mb-4">주문 이력</h3>
                <div className="space-y-2 text-xs">
                    {(subscriptionOrders || []).map((order) => (
                        <div key={order.order_id} className="flex justify-between">
                            <span className="leading-[18px]">
                                {order.order_date ? new Date(order.order_date).toLocaleDateString("ko-KR") : ""}
                            </span>
                            <span className="font-bold leading-[18px]">{order.order_number}</span>
                        </div>
                    ))}
                    {(subscriptionOrders || []).length === 0 && (
                        <div className="text-text-secondary">주문 이력이 없습니다.</div>
                    )}
                </div>
            </div>
        </div>
    )
}
export default ManageSubscriptionsDetail;