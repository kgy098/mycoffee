'use client';

import ActionSheet from '@/components/ActionSheet';
import { useGet, usePost } from '@/hooks/useApi';
import { staticBlends } from '@/statics';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AdminEventRequests() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'전체' | '대기' | '수령완료'>('전체');

    const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
    const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);

    const handleStatusClick = (itemId: string) => {
        setSelectedRequestId(itemId);
        setIsActionSheetOpen(true);
    };

    const { data: tasteRequestData, refetch } = useGet(
        ["mycoffee", "tasting-requests", activeTab],
        `/mycoffee/tasting-requests`,
        {
            params: {
                sts_nm: activeTab,
            },
        },
        {
            enabled: !!activeTab,
        }
    );

    const { mutate: changeStatus, isPending: isChangingStatus } = usePost(`/mycoffee/requests/${selectedRequestId}/toggle-end`, {
        onSuccess: (data) => {
            refetch()
            setIsActionSheetOpen(false);
            setSelectedRequestId(null);
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
                <p className='text-base font-bold text-gray-0 leading-[20px]'>시음 요청</p>
                <div className='w-6'></div>
            </div>
            <div className="flex items-center gap-2 px-4 py-3">
                {(['전체', '대기', '수령완료'] as const).map((tab) => (
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
                        {tasteRequestData?.items?.map((item) => (
                            <div
                                key={item.tst_id}
                                className="bg-white rounded-2xl border border-border-default py-3 px-4 text-gray-0"
                            >
                                <p className="text-[10px] font-bold leading-[16px] mb-4">{item.cre_dt.replace(/\.\d+/, '').replace('T', ' ').slice(0, 16)}</p>
                                <div className='border border-border-default rounded-2xl p-4 pb-3'>
                                    <div className="flex justify-between items-center gap-4 mb-3">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                {item.cof_nm && <span className="text-sm leading-[20px] font-bold bg-[#1A1A1A] rounded-[2px] border border-black text-white size-5 flex items-center justify-center">{staticBlends.find(blend => blend.name === item.cof_nm)?.value}</span>}
                                                <p className="text-sm font-bold leading-[20px]">{item.cof_nm}</p>
                                            </div>
                                            <p className="text-sm font-bold leading-[20px] my-2">{item.tst_id}</p>
                                            {item?.orgn_list && (
                                                <div className="flex items-center gap-1 flex-wrap">
                                                    {item.orgn_list.match(/[^%]+%/g)?.map((part, index) => {
                                                        const trimmedPart = part.trim();
                                                        if (!trimmedPart) return null;
                                                        return (
                                                            <div key={index} className="flex items-center gap-1">
                                                                <span className='text-[#FFE5BF] leading-[16px]'>•</span>
                                                                <span className='text-xs leading-[16px] font-normal'>{trimmedPart}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => handleStatusClick(item.tst_id)}
                                            className={`shrink-0 h-7 px-3 py-1 rounded-sm text-xs font-bold leading-[16px] cursor-pointer ${item.sts_nm === '수령완료'
                                                ? 'bg-[#28A745] text-white'
                                                : 'bg-white border border-action-primary text-black'
                                                }`}
                                        >
                                            {item.sts_nm}
                                        </button>
                                    </div>
                                    <div className="flex justify-between text-xs mb-2">
                                        <span className="text-xs font-normal leading-[18px]">이름</span>
                                        <span className="font-bold text-xs leading-[16px]">{item.tst_usr_nm}</span>
                                    </div>
                                    <div className="flex justify-between text-xs mb-2">
                                        <span className="text-xs font-normal leading-[18px]">전화번호</span>
                                        <span className="font-bold text-xs leading-[16px]">{item.hphn_no}</span>
                                    </div>
                                    <div className="flex justify-between text-xs mb-2">
                                        <span className="text-xs font-normal leading-[18px]">개인정보 수집 동의</span>
                                        <span className="font-bold text-xs leading-[16px]">
                                            {item.n1st_apro_flg}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-xs font-normal leading-[18px]">앱 출시 알림 동의</span>
                                        <span className="font-bold text-xs leading-[16px]">
                                            {item.n2nd_apro_flg}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Status Change Action Sheet */}
            <ActionSheet
                isOpen={isActionSheetOpen}
                onClose={() => {
                    setIsActionSheetOpen(false);
                    setSelectedRequestId(null);
                }}
                title="상태를 변경합니다."
            >
                <div className="space-y-4 mt-6">
                    <button
                        className="btn-primary w-full mb-2"
                        onClick={() => changeStatus({})}
                        disabled={isChangingStatus}
                    >
                        {isChangingStatus ? '변경 중...' : '확인'}
                    </button>
                    <button
                        className="btn-primary-outline w-full"
                        onClick={() => {
                            setIsActionSheetOpen(false);
                            setSelectedRequestId(null);
                        }}
                    >
                        취소
                    </button>
                </div>
            </ActionSheet>
        </div>
    );
}