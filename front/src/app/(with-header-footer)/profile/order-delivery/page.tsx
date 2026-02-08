"use client";

import React, { useMemo, useState } from "react";
import OrderDeliveryCard from "./components/Card";
import Tags from "./components/Tags";
import { useGet } from "@/hooks/useApi";
import { useUserStore } from "@/stores/user-store";

const OrderDelivery = () => {
    const [activeTag, setActiveTag] = useState("전체");

    const { data: user } = useUserStore((state) => state.user);
    const { data: orders } = useGet<any[]>(
        ["orders", user?.user_id],
        "/api/orders",
        { params: { user_id: user?.user_id } },
        { enabled: !!user?.user_id }
    );

    const orderData = useMemo(() => {
        const items = orders || [];
        return items.map((order) => {
            const firstItem = order.items?.[0];
            const details = [
                firstItem?.options?.caffeine,
                firstItem?.options?.grind,
                firstItem?.options?.package,
                firstItem?.options?.weight,
                firstItem?.quantity ? `${firstItem.quantity}개` : null,
            ].filter(Boolean);

            const statusMap: Record<string, string> = {
                pending: "주문 접수",
                preparing: "배송 준비",
                shipping: "배송중",
                delivered: "배송 완료",
                cancelled: "취소",
                returned: "반품",
            };

            return {
                id: order.id,
                orderItemId: firstItem?.id,
                date: order.created_at ? new Date(order.created_at).toLocaleDateString("ko-KR") : "",
                orderNumber: order.order_number,
                type: order.order_type === "subscription" ? "구독" : "단품",
                status: statusMap[order.status] || order.status,
                productName: firstItem?.collection_name || firstItem?.blend_name || "나만의 커피",
                productDetails: details,
                price: order.total_amount ? Number(order.total_amount).toLocaleString("ko-KR") : "0",
            };
        });
    }, [orders]);

    // Filter data based on active tag
    const filteredData = activeTag === "전체" 
        ? orderData 
        : orderData.filter(item => {
            switch(activeTag) {
                case "주문접수":
                    return item.status === "주문 접수";
                case "배송준비":
                    return item.status === "배송 준비";
                case "배송중":
                    return item.status === "배송중";
                case "배송완료":
                    return item.status === "배송 완료";
                case "취소":
                    return item.status === "취소";
                default:
                    return true;
            }
        });

    return (
        <div>
            <Tags 
                activeTag={activeTag} 
                onTagChange={setActiveTag} 
            />
            <div className="space-y-4 px-4">
                {filteredData.map((order) => (
                    <div key={order.id}>
                        <OrderDeliveryCard data={order} />
                    </div>
                ))}
            </div>
        </div>
    )
}
export default OrderDelivery;