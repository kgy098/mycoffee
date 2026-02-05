"use client";

import React, { useState } from "react";
import OrderDeliveryCard from "./components/Card";
import Tags from "./components/Tags";

const OrderDelivery = () => {
    const [activeTag, setActiveTag] = useState("전체");

    // Demo data for order delivery cards
    const orderData = [
        {
            id: 1,
            date: "2025.05.10",
            orderNumber: "20250510123412341",
            type: "단품",
            status: "주문 접수",
            productName: "나만의 커피 1호기 (클래식 하모니 블랜드)",
            productDetails: ["카페인", "홀빈", "벌크", "500g", "1개"],
            price: "36,000"
        },
        {
            id: 2,
            date: "2025.05.08",
            orderNumber: "20250508123412342",
            type: "단품",
            status: "주문 접수",
            productName: "나만의 커피 2호기 (프레시 아로마 블랜드)",
            productDetails: ["디카페인", "그라인드", "벌크", "250g", "2개"],
            price: "28,000"
        },
        {
            id: 3,
            date: "2025.05.05",
            orderNumber: "20250505123412343",
            type: "단품",
            status: "배송 준비",
            productName: "나만의 커피 3호기 (다크 로스트 블랜드)",
            productDetails: ["카페인", "홀빈", "벌크", "1kg", "1개"],
            price: "45,000"
        },
        {
            id: 4,
            date: "2025.05.01",
            orderNumber: "20250501123412344",
            type: "단품",
            status: "배송중",
            productName: "나만의 커피 4호기 (라이트 로스트 블랜드)",
            productDetails: ["카페인", "그라인드", "벌크", "500g", "1개"],
            price: "32,000"
        },
        {
            id: 5,
            date: "2025.04.28",
            orderNumber: "20250428123412345",
            type: "단품",
            status: "배송 완료",
            productName: "나만의 커피 5호기 (에스프레소 블랜드)",
            productDetails: ["카페인", "홀빈", "벌크", "250g", "1개"],
            price: "25,000"
        },
        {
            id: 6,
            date: "2025.05.10",
            orderNumber: "20250510123412341",
            type: "구독",
            status: "배송 완료",
            productName: "나만의 커피 5호기 (에스프레소 블랜드)",
            productDetails: ["카페인", "홀빈", "벌크", "250g", "1개"],
            price: "25,000"
        },
        {
            id: 7,
            date: "2025.05.10",
            orderNumber: "20250510123412341",
            type: "구독",
            status: "취소",
            productName: "나만의 커피 5호기 (에스프레소 블랜드)",
            productDetails: ["카페인", "홀빈", "벌크", "250g", "1개"],
            price: "25,000"
        },
    ];

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
                    <OrderDeliveryCard key={order.id} data={order} />
                ))}
            </div>
        </div>
    )
}
export default OrderDelivery;