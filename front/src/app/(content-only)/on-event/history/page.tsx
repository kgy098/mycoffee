'use client';

import Header from '@/components/Header';
import ActionSheet from '@/components/ActionSheet';
import { useHeaderStore } from '@/stores/header-store';
import { useEffect, useState } from 'react';
import HistoryCard from './components/HistoryCard';
import ActionFlow from '../components/ActionFlow';
import { useGet } from '@/hooks/useApi';
import { useUserStore } from '@/stores/user-store';

export type TastingOrderItem = {
    cre_dt: string;
    gbn: string;
    cof_nm: string;
    sts_nm: string;
    tst_id: string;
    ord_no: string;
    details: Array<{
        grind_dgr_nm: string;
        ord_wgt_nm: string;
        ord_qty: number;
        ord_amt: number
    }>
};

export default function OnEventHistoryPage() {

    const { setHeader } = useHeaderStore();
    const { user } = useUserStore();
    const [openActionSheet, setOpenActionSheet] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<TastingOrderItem | null>(null);
    const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);

    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [name, setName] = useState<string>('');

    useEffect(() => {
        setHeader({
            title: '조회',
        });

        if (typeof window !== 'undefined') {
            setPhoneNumber(user.data?.phone || '');
            setName(user.data?.username || '');
        }
    }, []);

    const { data: tastingOrdersData } = useGet(
        ["mycoffee", "tasting-orders", name, phoneNumber],
        `/mycoffee/tasting-orders`,
        {
            params: {
                usr_name: name,
                usr_phn_no: phoneNumber,
            },
        },
        {
            enabled: !!name && !!phoneNumber,
        }
    );

    const { data: orderDetailData } = useGet(
        ["mycoffee", "tst-org", selectedItem?.ord_no],
        `/mycoffee/tst-org/${selectedItem?.ord_no}`,
        {},
        {
            enabled: !!selectedItem?.ord_no
        }
    );

    return (
        <>
            <div className="h-dvh bg-background flex flex-col">
                <Header />
                <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
                    <div className="px-4 py-4">
                        <div className="space-y-4">
                            {tastingOrdersData?.map((item, key) => (
                                <HistoryCard
                                    key={key}
                                    item={item}
                                    onClick={() => {
                                        setSelectedItem(item);
                                        if (!item?.ord_no) {
                                            setOpenActionSheet("detail");
                                        } else {
                                            setIsActionSheetOpen(true);
                                        }
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>


            <ActionSheet
                isOpen={isActionSheetOpen}
                onClose={() => { setIsActionSheetOpen(false); setSelectedItem(null); }}
                title="상세 정보"
            >
                {selectedItem && (
                    <div className="space-y-3 mt-3">

                        <>
                            <div className="border border-border-default rounded-2xl py-3 px-4">
                                <p className="text-sm font-bold text-gray-0 mb-3 leading-[20px]">
                                    {selectedItem.cof_nm}
                                </p>
                                <div className="flex justify-between items-center">
                                    <div>
                                        {selectedItem?.details.map((detail, index) => (
                                            <div key={index} className="flex justify-between items-center">
                                                <div className="flex items-center gap-1">
                                                    <span className='text-[#9CA3AF]'>•</span>
                                                    <span className='text-xs leading-[16px] font-normal text-text-secondary'>{detail.grind_dgr_nm}</span>
                                                    <span className='text-[#9CA3AF]'>•</span>
                                                    <span className='text-xs leading-[16px] font-normal text-text-secondary'>{detail.ord_wgt_nm}</span>
                                                    <span className='text-[#9CA3AF]'>•</span>
                                                    <span className='text-xs leading-[16px] font-normal text-text-secondary'>{detail.ord_qty}개</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-sm font-bold text-gray-0 leading-[20px]">
                                        {Math.floor(selectedItem?.details?.reduce((acc, detail) => acc + Number(detail?.ord_amt), 0) || 0).toLocaleString()}원
                                    </p>
                                </div>
                            </div>

                            <div className="border border-border-default rounded-2xl py-3 px-4 text-gray-0">
                                <p className="text-sm font-bold mb-3 leading-[20px]">주문정보</p>
                                <div className="space-y-2 text-xs">
                                    <div className="flex justify-between">
                                        <span className="leading-[18px] font-normal">주문번호</span>
                                        <span className="font-bold leading-[16px]">{selectedItem.ord_no}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="leading-[18px] font-normal">요청 일자</span>
                                        <span className="font-bold leading-[16px]">{selectedItem.cre_dt.replace(/\.\d+/, '').replace('T', ' ').slice(0, 16)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="leading-[18px] font-normal">요청 커피</span>
                                        <span className="font-bold leading-[16px]">{selectedItem.cof_nm}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="leading-[18px] font-normal">상태</span>
                                        <span
                                            className="font-bold leading-[16px]"
                                            style={{ color: selectedItem.sts_nm === '결제완료' ? 'text-[#28A745]' : 'text-gray-0' }}
                                        >
                                            {selectedItem.sts_nm}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="leading-[18px] font-normal">수령 방법</span>
                                        <span className="font-bold leading-[16px]">{orderDetailData?.rct_nm}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Basic Information */}
                            <div className="border border-border-default rounded-2xl py-3 px-4 text-gray-0 mb-6">
                                <p className="text-sm font-bold mb-3 leading-[20px]">기본 정보</p>
                                <div className="space-y-2 text-xs">
                                    <div className="flex justify-between">
                                        <span className="leading-[18px] font-normal">이름</span>
                                        <span className="font-bold leading-[16px]">{name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="leading-[18px] font-normal">전화번호</span>
                                        <span className="font-bold leading-[16px]">{phoneNumber}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="leading-[18px] font-normal">배송지 주소</span>
                                        <span className="font-bold leading-[16px] text-right">{orderDetailData?.de_addr}</span>
                                    </div>
                                </div>
                            </div>
                        </>
                        {
                            !selectedItem?.ord_no?.startsWith("B") && (
                                <button
                                    className="btn-primary w-full mb-2"
                                    onClick={() => { setIsActionSheetOpen(false); setOpenActionSheet("detail") }}
                                >
                                    원두 예약 주문
                                </button>)
                        }

                        <button
                            className="btn-primary-outline w-full"
                            onClick={() => { setIsActionSheetOpen(false); setSelectedItem(null); }}
                        >
                            닫기
                        </button>
                    </div>
                )}
            </ActionSheet>

            <ActionFlow
                openActionSheet={openActionSheet}
                setOpenActionSheet={setOpenActionSheet}
                descriptionData={{ ...selectedItem, tst_usr_nm: name, hphn_no: phoneNumber, blnd_nm: selectedItem?.cof_nm }}
            />
        </>
    );
}
