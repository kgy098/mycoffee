'use client';

import ActionSheet from '@/components/ActionSheet';
import { useGet, usePost } from '@/hooks/useApi';
import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AdminEventOrderHistory() {

    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'전체' | '결제 완료' | '취소'>('전체');
    const [selectedItem, setSelectedItem] = useState<any | null>(null);
    const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);

    const handleStatusClick = (item: string) => {
        setSelectedItem(item);
        setIsActionSheetOpen(true);
    };

    const { data: orderHistoryData, isLoading, isError, refetch } = useGet<any>(
        ["payment", "status", activeTab],
        `/api/admin/order/list`,
        {
            params: {
                status: activeTab === "전체" ? 0 : activeTab ==="결제 완료" ? "1" : "2",
                // status: activeTab === "전체" ? null : activeTab ==="접수" ? "1" : "2",
            },
        },
        {
            enabled: !!activeTab,
            retry: 1,
        }
    );    
    
    const { mutate: changeStatus, isPending: isChangingStatus } = usePost(`/api/orders/tst-order/status`, {
        onSuccess: (data) => {
            refetch()
            setIsActionSheetOpen(false);
            setSelectedItem(null);
        },
    });


    return (
        <div className="h-[100dvh] bg-background flex flex-col">
            <div className='flex justify-between items-center py-2.5 px-[26px]'>
                <button className='cursor-pointer' onClick={() => router.back()}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M15 18L9 12L15 6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <p className='text-base font-bold text-gray-0 leading-[20px]'>주문 접수</p>
                <div className='w-6'></div>
            </div>
            <div className="flex items-center gap-2 px-4 py-3">
                {(['전체', '결제 완료', '취소'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`h-7 px-2.5 py-1 rounded-sm text-sm leading-[20px] font-bold cursor-pointer ${activeTab === tab
                            ? "bg-action-primary text-white"
                            : "bg-white text-action-primary border border-action-primary"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
                <div className="px-4 pb-4">
                    <div className="space-y-5">
                        {orderHistoryData?.items?.filter(({data: item}) => item?.STATUS == "PAID" || item?.STATUS == "CANCELED")?.map(({data: item}) => (
                            <div
                                key={item?.ORD_NO}
                                className="bg-white rounded-2xl border border-border-default py-3 px-4 text-gray-0"
                            >
                                <p className="text-[10px] font-bold leading-[16px] mb-4">{item?.PAY_DATE?.replace(/\.\d+/, '')?.replace('T', ' ')?.slice(0, 16)}</p>
                                <div className='border border-border-default rounded-2xl p-4 pb-3'>
                                    <div className="flex justify-between items-center gap-1">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-bold leading-[20px]">{item?.coffee_name}</p>
                                            </div>
                                            <p className="text-sm font-bold leading-[20px] mt-2">{item?.ORD_NO}</p>
                                            <p className="text-sm font-bold leading-[20px] mt-2">{item?.MUL_NO}</p>
                                        </div>
                                        <button
                                            className={`px-3 h-6 rounded-sm text-xs font-bold leading-[16px] ${item?.STATUS === 'PAID'
                                                ? 'bg-[#28A745] text-white'
                                                : 'bg-white border border-action-primary text-black'
                                                }`}
                                        >
                                            {item?.STATUS === "PAID" ? "결제 완료" : "취소"}
                                        </button>
                                    </div>
                                    <div className="flex justify-between text-xs mb-5">
                                        <span className="text-xs font-normal leading-[18px]"></span>
                                        <span className="font-bold text-xs leading-[16px]">{item?.AMOUNT?.toLocaleString()}원</span>
                                    </div>
                                    <div className="flex justify-between text-xs mb-2">
                                        <span className="text-xs font-normal leading-[18px]">이름</span>
                                        <span className="font-bold text-xs leading-[16px]">{item?.CUST_NM}</span>
                                    </div>
                                    <div className="flex justify-between text-xs mb-2">
                                        <span className="text-xs font-normal leading-[18px]">전화번호</span>
                                        <span className="font-bold text-xs leading-[16px]">{item?.HP_NO}</span>
                                    </div>
                                    <div className="flex justify-between gap-20 text-xs mb-2">
                                        <span className="text-xs font-normal leading-[18px] shrink-0">배송지 주소</span>
                                        <div>
                                            <span className="block font-bold text-xs leading-[16px] text-right">{item?.POST_NO} <br /> {item?.DE_ADDR}</span>
                                        </div>
                                    </div>
                                    <button
                                        className={`btn-primary-outline ${item?.ORD_STS_CD == "2" ? "!bg-[#28A745] !text-white !border-[#28A745]" : ""} w-full py-1! text-[12px]! leading-[16px]! rounded-[4px]! h-6 `}
                                        onClick={() => handleStatusClick(item)}
                                    >
                                        {
                                            item?.ORD_STS_CD == "2" ? "배송완료" : "배송전"
                                        }
                                    </button>
                                    {/* <div className="flex justify-between text-xs mb-2">
                                        <span className="text-xs font-normal leading-[18px]">개인정보 수집 동의</span>
                                        <span className="font-bold text-xs leading-[16px]">
                                            {item.agree_priv_flg}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-xs font-normal leading-[18px]">앱 출시 알림 동의</span>
                                        <span className="font-bold text-xs leading-[16px]">
                                            {item.agree_app_flg}
                                        </span>
                                    </div> */}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <ActionSheet
                isOpen={isActionSheetOpen}
                onClose={() => {
                    setIsActionSheetOpen(false);
                    setSelectedItem(null);
                }}
                title="상태를 변경합니다."
            >
                <div className="space-y-4 mt-6">
                    <button
                        className="btn-primary w-full mb-2"
                        onClick={() => changeStatus({
                            ord_no: selectedItem?.ORD_NO,
                            ord_sts_cd: selectedItem?.ORD_STS_CD === "1" ? "2" : "1",
                        })}
                        disabled={isChangingStatus}
                    >
                        {isChangingStatus ? '변경 중...' : '확인'}
                    </button>
                    <button
                        className="btn-primary-outline w-full"
                        onClick={() => {
                            setIsActionSheetOpen(false);
                            setSelectedItem(null);
                        }}
                    >
                        취소
                    </button>
                </div>
            </ActionSheet>
        </div>
    );
}