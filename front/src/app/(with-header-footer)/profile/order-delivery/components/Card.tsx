import OrderingComponent from "@/app/(with-header-footer)/my-coffee/components/ordering/Ordering";
import ActionSheet from "@/components/ActionSheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const OrderDeliveryCard = ({ data }: { data: any }) => {

    const [readyModalIsOpen, setReadyModalIsOpen] = useState(false);
    const [isRequest, setIsRequest] = useState(false);

    const openRequestModal = (isR: boolean) => {
        setReadyModalIsOpen(true);
        setIsRequest(isR);
    };

    const closeRequestModal = () => {
        setReadyModalIsOpen(true);
        setIsRequest(false);
    };

    return (
        <div className="bg-white rounded-2xl p-3 border border-border-default text-gray-0">
            {/* Header with date and order number */}
            <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold leading-[160%] text-text-secondary">
                    {data.date} | {data.orderNumber}
                </span>
                <Link
                    href={`/order-delivery/${data.id}`}
                    className="text-[10px] font-bold flex items-center gap-2"
                >
                    주문 상세보기
                    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="12" viewBox="0 0 8 12" fill="none">
                        <path d="M1.5 10.5L6.5 6L1.5 1.5" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </Link>
            </div>

            {/* Main content card */}
            <div className="border border-border-default rounded-2xl py-3 px-4">
                {/* Status and tag row */}
                <div className="flex items-center justify-between mb-4">
                    <div className={`${data.type === "구독" ? "bg-[#8B5E3C]" : "bg-[#C97A50]"}  px-2 py-1 rounded-sm h-[24px] flex items-center justify-center`}>
                        <span className="text-xs text-white font-bold leading-[133%]">{data.type}</span>
                    </div>
                    <span className="text-sm font-bold leading-[142%]">{data.status}</span>
                </div>

                {/* Product name */}
                <h3 className="text-sm font-bold mb-[12px]">
                    {data.productName}
                </h3>

                <div className="flex items-center justify-between mb-5">
                    {/* Product details */}
                    <div className="flex items-center gap-1">
                        {data.productDetails.map((detail: string, index: number) => (
                            <span key={index} className="text-[12px] text-text-secondary flex items-center gap-1">
                                {detail}
                                {index < data.productDetails.length - 1 && <span className="text-brand-secondary-accent-sub w-1 h-1 rounded-full flex items-center">•</span>}
                            </span>
                        ))}
                    </div>
                    {/* Price */}
                    <span className="text-sm font-bold leading-[142%]">{data.price}원</span>
                </div>

                {
                    data?.status === "배송 완료" && data?.type === "단품" ? (
                        <div className="flex items-center justify-between gap-2 mb-4">
                            <OrderingComponent title={"주문하기"} isTooltipOpenHave={false}>
                                <button
                                    className="w-full cursor-pointer py-[5px] border border-action-primary text-center text-action-primary rounded-sm font-bold text-sm leading-[20px]"
                                >
                                    다시 구매하기
                                </button>
                            </OrderingComponent>
                            <Link
                                href={`#`}
                                className="flex-1 py-[5px] border border-action-primary text-center text-action-primary rounded-sm font-bold text-sm leading-[20px]"
                            >
                                배송 조회
                            </Link>

                            <button onClick={() => openRequestModal(true)} className="cursor-pointer size-8 border border-border-default rounded-sm flex items-center justify-center">
                                <Menu className="size-5 text-action-primary" />
                            </button>
                        </div>
                    ) : ""
                }
                {
                    data?.status === "배송 완료" && data?.type === "구독" ? (
                        <div className="flex items-center justify-between gap-2 mb-4">
                            <Link
                                href={`/my-coffee/collection/${data.id}`}
                                className="flex-1 py-[5px] border border-action-primary text-center text-action-primary rounded-sm font-bold text-sm leading-[20px]"
                            >
                                배송 조회
                            </Link>

                            <button onClick={() => openRequestModal(true)} className="cursor-pointer size-8 border border-border-default rounded-sm flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M3.3335 4.1665H16.6668" stroke="#4E2A18" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M3.3335 10H16.6668" stroke="#4E2A18" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M3.3335 15.8335H16.6668" stroke="#4E2A18" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                    ) : ""
                }
                <div className="flex items-center justify-between gap-2">
                    <Link
                        href={
                            (data?.status === "배송 완료" && data?.type === "단품") ?`/profile/write-review/1`
                                : (data?.status === "배송 완료" && data?.type === "구독") ? `/profile/reviews/history`
                                    : data?.type === '구독' ? `/profile/reviews/history` : `/profile/reviews/history`
                        }
                        className="btn-action text-center"
                    >
                        {
                            (data?.status === "배송 완료" && data?.type === "단품") ? "리뷰 작성"
                                : (data?.status === "배송 완료" && data?.type === "구독") ? "리뷰 보기"
                                    : data?.type === '구독' ? "반품/취소 상세" : "배송 조회"
                        }
                    </Link>
                    {
                        !(data?.status === "배송 완료" && data?.type === "단품") && !(data?.status === "배송 완료" && data?.type === "구독") && (
                            <button onClick={() => openRequestModal(false)} className="cursor-pointer size-8 border border-border-default rounded-sm flex items-center justify-center">
                                <Menu className="size-5 text-action-primary" />
                            </button>
                        )
                    }
                </div>
            </div>
            <ActionSheet
                isOpen={readyModalIsOpen}
                onClose={() => setReadyModalIsOpen(false)}
            >
                <div className="text-center">
                    <div className="flex flex-col gap-2">
                        <Link
                            href={'/profile/contact-us-registration'}
                            className="w-full btn-primary"
                        >
                            상품 문의
                        </Link>
                        <button
                            onClick={() => closeRequestModal()}
                            className="w-full btn-primary-empty"
                        >
                            {
                                isRequest ? "반품 요청" : "주문 취소"
                            }
                        </button>
                        {
                            isRequest && (
                                <button
                            onClick={() => closeRequestModal()}
                            className="w-full btn-primary-empty"
                        >
                            구독 상세
                        </button>
                            )
                        }
                    </div>
                </div>
            </ActionSheet>
        </div>
    )
}
export default OrderDeliveryCard;