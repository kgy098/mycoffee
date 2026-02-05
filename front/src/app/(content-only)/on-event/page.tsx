'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { usePost, useQryMutation } from '@/hooks/useApi';
import { CoffeeData } from '@/types/coffee';
import { useRecommendationStore } from '@/stores/recommendation-store';
import { api } from '@/lib/api';
import Modal from 'react-responsive-modal';
import Link from 'next/link';
import ActionSheet from '@/components/ActionSheet';
import SpiderChart from '../analysis/SpiderChart';

type GetRecommendationsParams = {
    aroma: number;
    acidity: number;
    nutty: number;
    body: number;
    sweetness: number;
    userId: number;
    saveAnalysis: number;
};

export default function AnalysisPage() {

    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
    });
    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);

    const router = useRouter();
    const [ratings, setRatings] = useState({
        aroma: 1,
        acidity: 1,
        sweetness: 1,
        nutty: 1,
        body: 1,
    });
    const [userId] = useState(0);
    const { setRecommendations } = useRecommendationStore();
    const [openActionSheet, setOpenActionSheet] = useState<string | null>(null);

    const { mutate: getRecommendations, isPending: isGettingRecommendations } = useQryMutation<CoffeeData, GetRecommendationsParams>({
        mutationFn: async (data: GetRecommendationsParams) => {
            const response = await api.get<CoffeeData>("/mycoffee/blend/top5", { params: data });
            return response.data;
        },
        options: {
            onSuccess: (data) => {
                localStorage.setItem('user_tastes', JSON.stringify({
                    acidity_score: ratings.acidity,
                    aroma_score: ratings.aroma,
                    body_score: ratings.body,
                    sweetness_score: ratings.sweetness,
                    nutty_score: ratings.nutty,
                }));
                setRecommendations(data?.reco_list);
                if (data?.reco_list && data.reco_list.length > 0) {
                    localStorage.setItem('recommendation', JSON.stringify(data.reco_list[0]));
                }

                router.push('/on-event/result');
            },
        },
    });

    const handleSubmitAnalysis = useCallback(() => {
        getRecommendations({
            aroma: ratings.aroma,
            acidity: ratings.acidity,
            nutty: ratings.nutty,
            body: ratings.body,
            sweetness: ratings.sweetness,
            userId: userId,
            saveAnalysis: 0,
        });
    }, [ratings, userId]);



    const { mutate: getDescription, data: descriptionData } = usePost('/api/orders/user-order', {
        onSuccess: (response: any) => {
            setOpenActionSheet('detail');
            setOpen(false);
            setFormData({ name: "", phone: "" });
        },
    });

    const onSubmitForm = () => {
        getDescription({ cust_nm: formData.name, hp_no: formData.phone });
    }

    useEffect(() => {
        sessionStorage.setItem("internal-navigation", "true");
        if (typeof window !== 'undefined') {
            localStorage.removeItem('recommendation');
            localStorage.removeItem('user_tastes');
        }
    }, []);

    return (
        <>
            <div className="h-dvh flex-1 flex flex-col justify-center items-center px-4 pb-10">
                <div className="my-auto">
                    <div className="w-full sm:mx-auto px-4 py-4">
                        <Image
                            src="/images/logo.svg"
                            alt="My Coffee.Ai"
                            className="w-[220px] h-[32px] mx-auto mb-4"
                            width={220}
                            height={32}
                        />
                        <h3 className='text-center text-[20px] leading-[28px] font-bold text-text-secondary mb-[30px]'>1월 15일, 마이커피 앱 정식출시 예정!</h3>
                        <div className='flex justify-center items-center gap-2 mb-3'>
                            <span className='bg-[#28A745] text-white text-[14px] leading-[16px] font-bold px-1 h-[20px] rounded-[4px] flex items-center justify-center'>STEP 1</span>
                            <p className="text-text-secondary text-center text-[14px] leading-[20px]">나만의 원두 취향 입력</p>
                        </div>
                        <div className='flex justify-center items-center gap-2'>
                            <span className='bg-[#28A745] text-white text-[14px] leading-[16px] font-bold px-1 h-[20px] rounded-[4px] flex items-center justify-center'>STEP 2</span>
                            <p className="text-text-secondary text-center text-[14px] leading-[20px]">AI 원두 추천 및  럭키박스(배송비) 구매 🎁</p>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-center items-center px-6 pb-8 sm:mx-auto">
                        <SpiderChart
                            ratings={ratings}
                            setRatings={setRatings}
                        />
                    </div>
                </div>
                <button
                    onClick={handleSubmitAnalysis}
                    disabled={isGettingRecommendations}
                    className="btn-primary w-full text-center block disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isGettingRecommendations ? '분석 중...' : '결과보기'}
                </button>
                <button className="btn-primary-outline w-full mt-2 text-center block" onClick={onOpenModal}>
                    배송 조회
                </button>
            </div>

            <Modal
                open={open}
                onClose={onCloseModal}
                center
                showCloseIcon={false}
                styles={{
                    modal: {
                        width: '361px',
                        padding: '12px',
                        borderRadius: '16px',
                    }
                }}
            >
                <div className="mb-3">
                    <label className="block text-xs leading-[16px] font-bold text-gray-0 mb-2">
                        이름
                    </label>
                    <input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="이름을 입력해주세요."
                        className="input-default"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-xs leading-[16px] font-bold text-gray-0 mb-2">
                        휴대폰 번호
                    </label>
                    <input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="휴대폰 번호를 입력해주세요."
                        className="input-default"
                    />
                </div>
                <button disabled={formData.name === '' || formData.phone === ''} onClick={onSubmitForm} className="btn-primary w-full mb-2">요청</button>
                <button className="btn-primary-empty py-0.5! w-full font-normal!" onClick={onCloseModal}>취소</button>
            </Modal>

            <ActionSheet
                isOpen={openActionSheet === 'detail'}
                onClose={() => setOpenActionSheet(null)}
            >
                {
                    descriptionData?.orders?.[0]?.ord_no ? (
                        <div>
                            <div className="mt-3 mb-6 text-center">
                                <svg className="mx-auto" xmlns="http://www.w3.org/2000/svg" width="70" height="70" viewBox="0 0 70 70" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M35 70C54.33 70 70 54.33 70 35C70 15.67 54.33 0 35 0C15.67 0 0 15.67 0 35C0 54.33 15.67 70 35 70ZM51.2186 29.3436C52.9271 27.635 52.9271 24.865 51.2186 23.1564C49.51 21.4479 46.74 21.4479 45.0314 23.1564L30.625 37.5628L24.9686 31.9064C23.26 30.1979 20.49 30.1979 18.7814 31.9064C17.0729 33.615 17.0729 36.385 18.7814 38.0936L27.5314 46.8436C29.24 48.5521 32.01 48.5521 33.7186 46.8436L51.2186 29.3436Z" fill="#28A745" />
                                </svg>
                            </div>

                            <p className="text-center text-base leading-[20px] font-bold text-gray-0 mb-3">
                                주문번호 : {descriptionData?.orders?.[0]?.ord_no}
                            </p>

                            <div className="rounded-lg p-3 mb-3 border border-border-default">
                                <h3 className="text-sm leading-[18px] font-bold text-gray-0 mb-2">기본 정보</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-xs leading-[18px] text-text-secondary">이름</span>
                                        <span className="text-xs leading-[18px] font-bold text-gray-0">
                                            {descriptionData?.orders?.[0]?.cust_nm}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-xs leading-[18px] text-text-secondary">전화번호</span>
                                        <span className="text-xs leading-[18px] font-bold text-gray-0">
                                            {descriptionData?.orders?.[0]?.hp_no}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-xs leading-[18px] text-text-secondary">배송지 주소</span>
                                        <span className="text-xs leading-[18px] font-bold text-gray-0 text-right flex-1 ml-2">
                                            {descriptionData?.orders?.[0]?.de_addr}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-lg p-3 mb-6 border border-border-default">
                                <h3 className="text-sm leading-[18px] font-bold text-gray-0 mb-2">주문정보</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-xs leading-[18px] text-text-secondary">요청 일자</span>
                                        <span className="text-xs leading-[18px] font-bold text-gray-0">
                                            {descriptionData?.orders?.[0]?.cre_dt
                                                ? descriptionData?.orders?.[0].cre_dt.replace(/\.\d+/, '').replace('T', ' ').slice(0, 16)
                                                : 'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-xs leading-[18px] text-text-secondary">요청 커피</span>
                                        <span className="text-xs leading-[18px] font-bold text-gray-0">
                                            {descriptionData?.orders?.[0]?.cof_nm}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-xs leading-[18px] text-text-secondary">상태</span>
                                        <span className="text-xs leading-[18px] font-bold text-gray-0">
                                            {descriptionData?.orders?.[0]?.ord_sts_cd === "1" ? '접수' : '배송'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-xs leading-[18px] text-text-secondary">결제</span>
                                        <span className="text-xs leading-[18px] font-bold text-gray-0">
                                            {descriptionData?.orders?.[0]?.pay_status === "PAID" ? '결제 완료' 
                                            : descriptionData?.orders?.[0]?.pay_status === "REQUESTED" ? '결제 미완료' : '취소'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <Link href="/on-event" onClick={() => setOpenActionSheet(null)} className="btn-primary-outline w-full inline-block text-center">
                                메인으로
                            </Link>
                        </div>
                    ) : (
                        <div>
                            <p className="text-center text-sm leading-[20px] font-bold text-text-secondary mb-6">주문 내역이 없습니다.</p>
                            <Link href="/on-event" className="btn-primary-outline w-full inline-block text-center">
                                닫기
                            </Link>
                        </div>
                    )
                }
            </ActionSheet>
        </>
    );
}
