'use client';

import ActionSheet from "@/components/ActionSheet";
import { useGet, usePost } from "@/hooks/useApi";
import { ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const DEFAULT_PRICE = 16800;
const ActionFlow = ({ openActionSheet, setOpenActionSheet, descriptionData }: { openActionSheet: string | null, setOpenActionSheet: (openActionSheet: string | null) => void, descriptionData?: any }) => {
    const router = useRouter();
    const pathname = usePathname();

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        agreements: {
            personalInfo: false,
            marketing: false,
        },
    });
    const [orderData, setOrderData] = useState({
        option: '',
        caffeine: '카페인',
        grind: '홀빈',
        packaging: '스틱',
        quantity: 1,
        price: DEFAULT_PRICE,
        deliveryMethod: '배송' as '배송' | '현장',
        deliveryAddress: '',
        agreements: {
            personalInfo: false,
            marketing: false,
        },
        options: [] as Array<{
            quantity: number;
            grind: string;
            option: string;
            price: number;
            weight: number;
        }>,
    });

    const [showDeliveryFields, setShowDeliveryFields] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);


    useEffect(() => {
        if (openActionSheet === 'detail') {
            setOrderData({
                option: '',
                caffeine: '카페인',
                grind: '홀빈',
                packaging: '스틱',
                quantity: 1,
                price: DEFAULT_PRICE,
                deliveryMethod: '배송' as '배송' | '현장',
                deliveryAddress: '',
                agreements: {
                    personalInfo: false,
                    marketing: false,
                },
                options: [] as Array<{
                    quantity: number;
                    grind: string;
                    option: string;
                    price: number;
                    weight: number;
                }>,
            })
        }
    }, [openActionSheet])
    useEffect(() => {
        if (orderData.deliveryMethod === '배송') {
            setIsAnimating(true);
            setTimeout(() => {
                setShowDeliveryFields(true);
            }, 10);
        } else {
            setShowDeliveryFields(false);
            setTimeout(() => {
                setIsAnimating(false);
            }, 500);
        }
    }, [orderData.deliveryMethod]);


    const { mutate: orderCoffee, isPending: isOrderingCoffee, data: orderCoffeeData, isSuccess: isOrderingCoffeeSuccess } = usePost('/mycoffee/order', {
        onSuccess: (data) => {
            // refetchTastesData();
            setOpenActionSheet('order-confirm');
        },
    });

    const handleOrderCoffee = () => {
        const orderObject = {
            tst_id: descriptionData?.tst_id,
            rct_cd: orderData?.deliveryMethod === '배송' ? "D" : "A",
            de_addr: orderData.deliveryAddress,
            n1st_apro_flg: orderData.agreements.personalInfo ? "Y" : "N",
            n2nd_apro_flg: orderData.agreements.marketing ? "Y" : "N",
            ord_sts_cd: "A",
            delt_flg: "N",
            details: orderData.options.map((opt) => ({
                grind_dgr_cd: opt.grind === "홀빈" ? "A" : "B",
                ord_wgt_cd: opt.weight === 200 ? "A" : "B",
                ord_qty: opt?.quantity,
                ord_prc: DEFAULT_PRICE
            }))
        }
        orderCoffee(orderObject);
    }

    const { data: tastesData } = useGet(
        ["mycoffee/tst-org", orderCoffeeData?.out_ord_no],
        `/mycoffee/tst-org/${orderCoffeeData?.out_ord_no}`,
        {},
        {
            enabled: !!orderCoffeeData?.out_ord_no
        }
    );

    const onFinish = () => {
        if (pathname === '/on-event/result') {
            router.push('/on-event');
        } else {
            setOpenActionSheet(null);
        }
    }

    return (
        <>
            <ActionSheet
                isOpen={openActionSheet === 'detail'}
                onClose={() => setOpenActionSheet(null)}
                title="상세 정보"
            >
                <div className="mt-3">
                    <div className="space-y-2 border border-border-default rounded-2xl p-3 text-gray-0 mb-6">
                        <div className="flex justify-between">
                            <span className="text-xs leading-[18px]">시음번호</span>
                            <span className="text-xs leading-[16px] font-bold">{descriptionData?.tst_id}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-xs leading-[18px]">요청 일자</span>
                            <span className="text-xs leading-[16px] font-bold">{descriptionData?.cre_dt?.replace(/\.\d+/, '').replace('T', ' ').slice(0, 16)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-xs leading-[18px]">이름</span>
                            <span className="text-xs leading-[16px] font-bold">{descriptionData?.tst_usr_nm}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-xs leading-[18px]">전화번호</span>
                            <span className="text-xs leading-[16px] font-bold">{descriptionData?.hphn_no}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-xs leading-[18px]">요청 커피</span>
                            <span className="text-xs leading-[16px] font-bold">{descriptionData?.blnd_nm}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-xs leading-[18px]">상태</span>
                            <span className="text-xs leading-[16px] font-bold">{descriptionData?.sts_nm}</span>
                        </div>
                        {/* <div className="flex justify-between">
                            <span className="leading-[18px] font-normal">수령 방법</span>
                            <span className="font-bold leading-[16px]">{descriptionData.cof_nm}</span>
                        </div> */}
                    </div>
                    <button className="btn-primary w-full mb-2" onClick={() => setOpenActionSheet('order')}>원두 예약 주문</button>
                    <button className="btn-primary-outline w-full" onClick={() => setOpenActionSheet(null)}>닫기</button>
                </div>
            </ActionSheet>

            <ActionSheet
                isOpen={openActionSheet === 'order'}
                onClose={() => setOpenActionSheet(null)}
                title="원두 예약 주문"
            >
                <div className="space-y-6 mt-4">
                    <div className="relative cursor-pointer">
                        <p
                            onClick={() => setOpenActionSheet('option')}
                            className="w-full h-[40px] leading-[40px] text-xs text-gray-0 pl-4 pr-2 border border-border-default rounded-lg bg-white"
                        >
                            {'옵션(필수)'}
                        </p>
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M4 6L8 10L12 6" stroke="#1A1A1A" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>

                    {orderData.options.map((opt, index) => (
                        <div key={index} className="border border-border-default rounded-lg py-3 px-4 relative mb-3">
                            <button
                                onClick={() => {
                                    const newOptions = orderData.options.filter((_, i) => i !== index);
                                    const totalPrice = newOptions.reduce((sum, o) => sum + o.price, 0);
                                    setOrderData({
                                        ...orderData,
                                        options: newOptions,
                                        price: totalPrice
                                    });
                                }}
                                className="absolute top-2 right-2 cursor-pointer"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M12 4L4 12" stroke="#1A1A1A" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M4 4L12 12" stroke="#1A1A1A" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <p className="text-xs font-bold text-gray-0 mb-2 leading-[16px]">{descriptionData?.cof_nm}</p>
                            <p className="text-xs text-text-secondary mb-6">{opt.option}</p>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-[22px]">
                                    <button
                                        onClick={() => {
                                            const newOptions = [...orderData.options];
                                            const newQuantity = Math.max(1, opt.quantity - 1);
                                            const newPrice = DEFAULT_PRICE * newQuantity;
                                            newOptions[index] = { ...opt, quantity: newQuantity, price: newPrice };
                                            const totalPrice = newOptions.reduce((sum, o) => sum + o.price, 0);
                                            setOrderData({
                                                ...orderData,
                                                options: newOptions,
                                                price: totalPrice
                                            });
                                        }}
                                        className="w-6 h-6 cursor-pointer rounded hover:bg-gray-100 flex items-center justify-center text-xs"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="2" viewBox="0 0 14 2" fill="none">
                                            <path d="M0.833252 0.833008H12.4999" stroke="#4E2A18" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                    <span className="text-base font-bold text-gray-0">{opt.quantity}</span>
                                    <button
                                        onClick={() => {
                                            const newOptions = [...orderData.options];
                                            const newQuantity = opt.quantity + 1;
                                            const newPrice = DEFAULT_PRICE * newQuantity;
                                            newOptions[index] = { ...opt, quantity: newQuantity, price: newPrice };
                                            const totalPrice = newOptions.reduce((sum, o) => sum + o.price, 0);
                                            setOrderData({
                                                ...orderData,
                                                options: newOptions,
                                                price: totalPrice
                                            });
                                        }}
                                        className="w-6 h-6 cursor-pointer rounded bg-action-primary text-white flex items-center justify-center text-xs"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path d="M4.16675 10H15.8334" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M10 4.16699V15.8337" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                </div>
                                <span className="text-sm font-bold text-gray-0 leading-[20px]">{opt.price.toLocaleString()}원</span>
                            </div>
                        </div>
                    ))}

                    <div className="flex justify-between items-center">
                        <span className="text-sm leading-[20px] font-bold text-gray-0">최종 결제금액</span>
                        <span className="text-sm leading-[20px] font-bold text-gray-0">{orderData.options.reduce((sum, opt) => sum + opt.price, 0).toLocaleString()}원</span>
                    </div>

                    <button
                        className="btn-primary w-full mb-2"
                        onClick={() => {
                            if (orderData.options.length > 0) {
                                setOpenActionSheet('delivery');
                            } else {
                                setOpenActionSheet('option');
                            }
                        }}
                        disabled={orderData.options.length === 0}
                    >
                        다음으로
                    </button>
                    <button className="btn-primary-outline w-full" onClick={() => setOpenActionSheet("detail")}>닫기</button>
                </div>
            </ActionSheet>

            <ActionSheet
                isOpen={openActionSheet === 'option'}
                onClose={() => setOpenActionSheet(null)}
                title="옵션선택"
            >
                <div className="space-y-4 mt-4 text-text-primary">
                    <div>
                        <p className="text-xs font-bold text-gray-0 mb-2">분쇄 정도</p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setOrderData({ ...orderData, grind: '홀빈' })}
                                className={`flex-1 h-[40px] rounded-lg border text-xs cursor-pointer ${orderData.grind === '홀빈'
                                    ? 'border-[#A45F37] font-bold'
                                    : 'border-border-default font-normal'
                                    }`}
                            >
                                홀빈
                            </button>
                            <button
                                onClick={() => setOrderData({ ...orderData, grind: '분쇄 그라인딩' })}
                                className={`flex-1 h-[40px] rounded-lg border text-xs cursor-pointer ${orderData.grind === '분쇄 그라인딩'
                                    ? 'border-[#A45F37] font-bold'
                                    : 'border-border-default font-normal'
                                    }`}
                            >
                                분쇄 그라인딩
                            </button>
                        </div>
                    </div>

                    <div className="mb-6">
                        <p className="text-sm font-bold text-gray-0 mb-2 leading-[20px]">중량</p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setOrderData({ ...orderData })}
                                className={`flex-1 h-[40px] rounded-lg border text-xs cursor-pointer ${orderData.packaging === '스틱'
                                    ? 'border-[#A45F37] font-bold'
                                    : 'border-border-default font-normal'
                                    }`}
                            >
                                200g
                            </button>
                        </div>
                    </div>
                    <button
                        className="btn-primary w-full mb-2"
                        onClick={() => {
                            const newOption = {
                                quantity: orderData.quantity,
                                grind: orderData.grind,
                                option: `${orderData.grind} • 200g`,
                                price: DEFAULT_PRICE * orderData.quantity,
                                weight: 200,
                            };
                            const newOptions = [...orderData.options, newOption];
                            const totalPrice = newOptions.reduce((sum, opt) => sum + opt.price, 0);
                            setOrderData({
                                ...orderData,
                                options: newOptions,
                                option: `${orderData.grind} • 200g`,
                                quantity: 1,
                                price: totalPrice
                            });
                            setOpenActionSheet('order');
                        }}
                    >
                        선택 완료
                    </button>
                    <button className="btn-primary-outline w-full" onClick={() => setOpenActionSheet("order")}>닫기</button>
                </div>
            </ActionSheet>

            <ActionSheet
                isOpen={openActionSheet === 'delivery'}
                onClose={() => setOpenActionSheet(null)}
            >
                <div className="space-y-4 mt-4">
                    <div>
                        <p className="text-xs font-bold text-gray-0 mb-2">수령 방법</p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setOrderData({ ...orderData, deliveryMethod: '배송' })}
                                className={`flex-1 h-[40px] rounded-lg border text-xs cursor-pointer ${orderData.deliveryMethod === '배송'
                                    ? 'border-[#A45F37] font-bold'
                                    : 'border-border-default font-normal'
                                    }`}
                            >
                                배송
                            </button>
                            <button
                                onClick={() => setOrderData({ ...orderData, deliveryMethod: '현장' })}
                                className={`flex-1 h-[40px] rounded-lg border text-xs cursor-pointer ${orderData.deliveryMethod === '현장'
                                    ? 'border-[#A45F37] font-bold'
                                    : 'border-border-default font-normal'
                                    }`}
                            >
                                현장
                            </button>
                        </div>
                    </div>
                    {(showDeliveryFields || isAnimating) && (
                        <div className={`transition-all duration-500 ease-in-out ${showDeliveryFields && orderData.deliveryMethod === '배송'
                            ? 'opacity-100'
                            : 'opacity-0 pointer-events-none'
                            }`} style={{
                                transform: showDeliveryFields && orderData.deliveryMethod === '배송'
                                    ? 'translateX(0)'
                                    : orderData.deliveryMethod === '현장'
                                        ? 'translateX(100%)'
                                        : 'translateX(-100%)',
                                transition: 'opacity 500ms ease-in-out, transform 500ms ease-in-out'
                            }}>
                            <div>
                                <p className="text-xs font-bold text-gray-0 mb-2">배송지 주소</p>
                                <input
                                    type="text"
                                    value={orderData.deliveryAddress}
                                    onChange={(e) => setOrderData({ ...orderData, deliveryAddress: e.target.value })}
                                    placeholder="배송지를 입력해주세요."
                                    className="input-default w-full"
                                />
                            </div>

                        </div>
                    )}
                    <label className="flex items-center gap-2 cursor-pointer border-t border-border-default pt-5 mb-[18px] mt-4">
                        <input
                            type="checkbox"
                            checked={orderData.agreements.personalInfo}
                            onChange={() => setOrderData({ ...orderData, agreements: { ...orderData.agreements, personalInfo: !orderData.agreements.personalInfo } })}
                            className="auth-checkbox w-5 h-5 rounded-sm border border-border-default"
                        />
                        <span className="text-xs leading-[18px] text-gray-0 font-normal">
                            개인정보 수집 동의 (필수)
                        </span>
                        <ChevronRight size={20} className="ml-auto text-icon-default" />
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer mb-6">
                        <input
                            type="checkbox"
                            checked={orderData.agreements.marketing}
                            onChange={() => setOrderData({ ...orderData, agreements: { ...orderData.agreements, marketing: !orderData.agreements.marketing } })}
                            className="auth-checkbox w-5 h-5 rounded-sm border border-border-default"
                        />
                        <span className="text-xs leading-[18px] text-gray-0 font-normal">
                            앱 출시 알림 동의 (선택)
                        </span>
                        <ChevronRight size={20} className="ml-auto text-icon-default" />
                    </label>

                    <div className={`transition-all duration-500 ease-in-out`}>
                        <button
                            className="btn-primary w-full mb-2"
                            onClick={handleOrderCoffee}
                            disabled={isOrderingCoffee || !orderData.agreements.personalInfo || (orderData.deliveryMethod === '배송' ? (!orderData.deliveryAddress) : false)}
                        >
                            주문 접수
                        </button>
                        <button
                            className="btn-primary-outline w-full"
                            onClick={() => setOpenActionSheet('order')}
                        >
                            이전으로
                        </button>
                    </div>
                </div>
            </ActionSheet>

            <ActionSheet
                isOpen={openActionSheet === 'order-confirm'}
                onClose={() => setOpenActionSheet(null)}
            >
                <div className="h-[calc(75dvh)] overflow-y-auto" style={{ scrollbarWidth: "none" }}>
                    <div className="space-y-3 mt-4">
                        <div className="text-center mb-8">
                            <div className="mt-3 mb-[27px] text-center">
                                <svg className="mx-auto" xmlns="http://www.w3.org/2000/svg" width="70" height="70" viewBox="0 0 70 70" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M35 70C54.33 70 70 54.33 70 35C70 15.67 54.33 0 35 0C15.67 0 0 15.67 0 35C0 54.33 15.67 70 35 70ZM51.2186 29.3436C52.9271 27.635 52.9271 24.865 51.2186 23.1564C49.51 21.4479 46.74 21.4479 45.0314 23.1564L30.625 37.5628L24.9686 31.9064C23.26 30.1979 20.49 30.1979 18.7814 31.9064C17.0729 33.615 17.0729 36.385 18.7814 38.0936L27.5314 46.8436C29.24 48.5521 32.01 48.5521 33.7186 46.8436L51.2186 29.3436Z" fill="#28A745" />
                                </svg>
                            </div>
                            <p className="text-base font-bold text-gray-0 mb-3">주문번호 : {tastesData?.ord_no}</p>
                            <p className="text-sm text-text-secondary font-normal mb-6">주문 요청이 완료되었습니다.</p>
                            <p className="text-sm text-text-secondary font-bold underline ">* 부스에서 결제를 진행하여 주문을 확정해주세요.</p>
                        </div>
                        <div className="border border-border-default rounded-2xl py-3 px-4">
                            <p className="text-sm font-bold text-gray-0 mb-2 leading-[20px]">{tastesData?.cof_nm}</p>
                            <div className="flex justify-between items-center">
                                <div className="space-y-1">
                                    {
                                        tastesData?.details?.map((detail, index) => (
                                            <p className="text-xs text-text-secondary leading-[16px]">{detail.grind_dgr_nm} • {detail.ord_wgt_nm} • {detail.ord_qty}개</p>
                                        ))
                                    }
                                </div>
                                <p className="text-sm font-bold text-gray-0 leading-[20px]">{Math.floor(tastesData?.details?.reduce((acc, detail) => acc + Number(detail.ord_amt), 0) || 0).toLocaleString()}원</p>
                            </div>
                        </div>

                        <div className="border border-border-default rounded-2xl py-3 px-4 text-gray-0">
                            <p className="text-sm font-bold mb-3 leading-[20px]">주문정보</p>
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between">
                                    <span className="leading-[18px] font-normal">주문번호</span>
                                    <span className="font-bold leading-[16px]">{tastesData?.ord_no}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="leading-[18px] font-normal">요청 일자</span>
                                    <span className="font-bold leading-[16px]">{tastesData?.cre_dt?.replace(/\.\d+/, '').replace('T', ' ').slice(0, 16)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="leading-[18px] font-normal">요청 커피</span>
                                    <span className="font-bold leading-[16px]">{tastesData?.cof_nm}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="leading-[18px] font-normal">상태</span>
                                    <span className="font-bold leading-[16px]">{tastesData?.sts_nm}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="leading-[18px] font-normal">수령 방법</span>
                                    <span className="font-bold leading-[16px]">{tastesData?.rct_nm}</span>
                                </div>
                            </div>
                        </div>

                        <div className="border border-border-default rounded-2xl py-3 px-4 text-gray-0 mb-6">
                            <p className="text-sm font-bold mb-3 leading-[20px]">기본 정보</p>
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between">
                                    <span className="leading-[18px] font-normal">이름</span>
                                    <span className="font-bold leading-[16px]">{tastesData?.tst_usr_nm || formData.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="leading-[18px] font-normal">전화번호</span>
                                    <span className="font-bold leading-[16px]">{tastesData?.hphn_no || formData.phone}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="leading-[18px] font-normal">배송지 주소</span>
                                    <span className="font-bold leading-[16px]">{tastesData?.de_addr || orderData.deliveryAddress}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <button onClick={onFinish} className="btn-primary-outline w-full inline-block text-center mt-4">메인으로</button>
            </ActionSheet>
        </>
    );
}

export default ActionFlow;