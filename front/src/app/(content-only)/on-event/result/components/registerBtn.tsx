"use client";

import ActionSheet from "@/components/ActionSheet";
import { usePost } from "@/hooks/useApi";
import { useEffect, useState, useCallback, useRef } from "react";
import Modal from "react-responsive-modal";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import KakaoLoginBtn from "./kakaoLoginBtn";
import OrderModalForm from "./orderModalForm";
import { useUserStore } from "@/stores/user-store";

interface RegisterBtnProps {
    coffeeBlendId: string;
    recommendation: any;
    onOpenModal: () => void;
    onCloseModal: () => void;
    open: boolean;
    setOpen: (value: boolean) => void;
}

const RegisterBtn = ({
    coffeeBlendId,
    recommendation,
    onOpenModal,
    onCloseModal,
    open,
    setOpen,
}: RegisterBtnProps) => {

    const { user } = useUserStore();
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const isUpdatingURLRef = useRef(false);
    
    const [openActionSheet, setOpenActionSheet] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        postalCode: '',
        address: '',
        detailAddress: '',
        agreements: {
            personalInfo: false,
            marketing: false,
        },
    });
    const [errors, setErrors] = useState({
        name: '',
        phone: '',
        postalCode: '',
        address: '',
        detailAddress: '',
    });

    const clearFormData = () => {
        setFormData({
            name: '',
            phone: '',
            postalCode: '',
            address: '',
            detailAddress: '',
            agreements: {
                personalInfo: false,
                marketing: false,
            },
        });
        setErrors({
            name: '',
            phone: '',
            postalCode: '',
            address: '',
            detailAddress: '',
        });
    };

    const clearUrlFormData = () => {
        isUpdatingURLRef.current = true;
        
        const params = new URLSearchParams();        
        const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
        router.replace(newUrl, { scroll: false });
        
        setTimeout(() => {
            isUpdatingURLRef.current = false;
        }, 100);
    };

    useEffect(() => {
        if (isUpdatingURLRef.current) return;

        const name = searchParams.get('name') || '';
        const phone = searchParams.get('phone') || '';
        const postalCode = searchParams.get('postalCode') || '';
        const address = searchParams.get('address') || '';
        const detailAddress = searchParams.get('detailAddress') || '';
        const personalInfo = searchParams.get('personalInfo') === 'true';
        const marketing = searchParams.get('marketing') === 'true';

        setFormData(prev => {
            const hasURLData = name || phone || postalCode || address || detailAddress;
            const isStateEmpty = !prev.name && !prev.phone && !prev.postalCode && !prev.address && !prev.detailAddress;

            // Faqat state bo'sh bo'lganda yoki URL dagi ma'lumotlar state dan butunlay boshqacha bo'lganda yuklash
            if (hasURLData && isStateEmpty) {
                return {
                    name,
                    phone,
                    postalCode,
                    address,
                    detailAddress,
                    agreements: { personalInfo, marketing },
                };
            }
            return prev;
        });

        const modalOpen = searchParams.get('modal') === 'open';
        if (modalOpen && !open) {
            onOpenModal();
        }
    }, [searchParams, open, onOpenModal]);

    useEffect(() => {
        if (open && !isUpdatingURLRef.current) {
            const timeoutId = setTimeout(() => {
                if (isUpdatingURLRef.current) return;

                const params = new URLSearchParams();

                if (formData.name) params.set('name', formData.name);
                if (formData.phone) params.set('phone', formData.phone);
                if (formData.postalCode) params.set('postalCode', formData.postalCode);
                if (formData.address) params.set('address', formData.address);
                if (formData.detailAddress) params.set('detailAddress', formData.detailAddress);
                if (formData.agreements.personalInfo) params.set('personalInfo', 'true');
                if (formData.agreements.marketing) params.set('marketing', 'true');
                params.set('modal', 'open');

                isUpdatingURLRef.current = true;
                router.replace(`${pathname}?${params.toString()}`, { scroll: false });
                setTimeout(() => {
                    isUpdatingURLRef.current = false;
                }, 150);
            }, 300);

            return () => clearTimeout(timeoutId);
        }
    }, [formData, open, pathname, router]);

    useEffect(() => {
        if (!open) {
            // clearFormData();
            // clearUrlFormData();
        } else if (open && !isUpdatingURLRef.current) {
            const name = searchParams.get('name') || '';
            const phone = searchParams.get('phone') || '';
            const postalCode = searchParams.get('postalCode') || '';
            const address = searchParams.get('address') || '';
            const detailAddress = searchParams.get('detailAddress') || '';
            const personalInfo = searchParams.get('personalInfo') === 'true';
            const marketing = searchParams.get('marketing') === 'true';

            const hasURLData = name || phone || postalCode || address || detailAddress;
            if (hasURLData) {
                setFormData(prev => {
                    const isStateEmpty = !prev.name && !prev.phone && !prev.postalCode && !prev.address && !prev.detailAddress;
                    if (isStateEmpty) {
                        return {
                            name,
                            phone,
                            postalCode,
                            address,
                            detailAddress,
                            agreements: { personalInfo, marketing },
                        };
                    }
                    return prev;
                });
            }
        }
    }, [open, searchParams]);

    const handleCloseModal = useCallback(() => {
        isUpdatingURLRef.current = true;
        setOpen(false);
        onCloseModal();
        // router.replace('/on-event');
        setTimeout(() => {
            isUpdatingURLRef.current = false;
        }, 100);
    }, [router, onCloseModal, setOpen]);

    const validateForm = useCallback(() => {
        const newErrors = { ...errors };
        let hasError = false;

        if (!formData.name?.trim()) {
            newErrors.name = '이름을 입력해주세요.';
            hasError = true;
        } else if (formData.name.length > 20) {
            newErrors.name = '이름은 20자 이하로 입력해주세요.';
            hasError = true;
        }

        if (!formData.phone?.trim()) {
            newErrors.phone = '휴대폰 번호를 입력해주세요.';
            hasError = true;
        } else if (formData.phone.length > 20) {
            newErrors.phone = '휴대폰 번호는 5~11자로 입력해주세요.';
            hasError = true;
        }

        if (!formData.postalCode?.trim()) {
            newErrors.postalCode = '우편번호를 입력해주세요.';
            hasError = true;
        }

        if (!formData.address?.trim()) {
            newErrors.address = '상세주소를 입력해주세요.';
            hasError = true;
        }

        if (!formData.detailAddress?.trim()) {
            newErrors.detailAddress = '상세주소를 입력해주세요.';
            hasError = true;
        }

        if (!formData.agreements.personalInfo) {
            hasError = true;
        }

        setErrors(newErrors);
        return !hasError;
    }, [formData, errors]);

    const { mutate: createPayment, isPending: isCreatingPayment } = usePost('/pg/payapp/pay', {
        onSuccess: (response: any) => {

            // clearFormData();
            // clearUrlFormData();

            // isUpdatingURLRef.current = true;
            // onCloseModal();
            // router.replace(pathname, { scroll: false });
            // setOpenActionSheet('success');

            if (response?.payUrl) {
                window.location.href = response?.payUrl;
            }
        },
        onError: (error: any) => {
            console.error('Payment error:', error);
        },
    });

    const { mutate: createTasteRequest, isPending: isCreatingTasteRequest, data: tasteRequestData } = usePost('/api/orders/taste-user', {
        onSuccess: (response: any) => {
            if (response?.ord_no) {
                createPayment({
                    ordNo: response?.ord_no,
                    goodName: "MyCoffeeAi 럭키박스",
                    amount: 4000,
                    buyerPhone: formData?.phone,
                    buyerName: formData?.name,
                    redirectUrl: `https://api.mycoffeeai.com/pg/payapp/return`,
                    var1: response?.ord_no,
                    var2: "whatever"
                });
            }
        },
        onError: (error: any) => {
            setErrors({ ...errors, phone: error.response.data.detail });
        },
    });
    
    const handleCreateTasteRequest = useCallback(() => {
        if (!validateForm()) return;
        const userTastes = localStorage.getItem('user_tastes');
        const userTastesObj = JSON.parse(userTastes || '{}');
        const obj = {
            p_tst_id: coffeeBlendId,
            user_aroma: userTastesObj?.aroma_score,
            user_acidity: userTastesObj?.acidity_score,
            user_sweetness: userTastesObj?.sweetness_score,
            user_nutty: userTastesObj?.nutty_score,
            user_body: userTastesObj?.body_score,
            p_cust_nm: formData.name,
            p_hp_no: formData.phone,
            p_post_no: formData.postalCode,
            p_addr1: formData.address,
            p_addr2: formData.detailAddress,
            p_agree_priv_flg: formData.agreements.personalInfo,
            p_agree_app_flg: formData.agreements.marketing
        }
        localStorage.setItem('hp_no', formData.phone);
        localStorage.setItem('cust_nm', formData.name);

        createTasteRequest(obj)
    }, [formData, coffeeBlendId, createTasteRequest, validateForm]);

    return (
        <>
            <button 
                onClick={() => {
                    // if (user.isAuthenticated) {
                    //     onOpenModal();
                    // } else {
                    //     setOpenActionSheet('login');
                    // }
                    setOpenActionSheet('soldout');
                }} 
                className="btn-primary w-full text-center block"
            >
                My Coffee 주문하기
            </button>

            <Modal
                open={open}
                onClose={handleCloseModal}
                center
                showCloseIcon={false}
                closeOnOverlayClick={false}
                styles={{
                    modal: {
                        width: '361px',
                        padding: '12px',
                        borderRadius: '16px',
                    }
                }}
            >
                <OrderModalForm
                    setFormData={setFormData}
                    formData={formData}
                    setErrors={setErrors}
                    errors={errors}
                />

                <button
                    disabled={!formData.agreements.personalInfo || isCreatingTasteRequest}
                    className="btn-primary w-full mb-2 mt-[28px]"
                    onClick={handleCreateTasteRequest}
                >
                    주문
                </button>
                <button className="btn-primary-empty py-0.5! w-full font-normal!" onClick={handleCloseModal}>
                    취소
                </button>
            </Modal>

            <ActionSheet
                isOpen={openActionSheet === 'login'}
                onClose={() => setOpenActionSheet(null)}
            >
                <div className="text-center">
                    <p className="text-sm leading-[20px] text-text-secondary mb-6">
                        이벤트 참여를 위해 카카오 간편 로그인하며, <br /> 추후 동일 계정으로 앱 서비스 이용이 가능합니다.
                    </p>
                    <KakaoLoginBtn />
                    <button
                        onClick={() => setOpenActionSheet(null)}
                        className="btn-primary-outline w-full"
                    >
                        닫기
                    </button>
                </div>
            </ActionSheet>

            <ActionSheet
                isOpen={openActionSheet === 'soldout'}
                onClose={() => setOpenActionSheet(null)}
            >
                <div className="text-center">
                    <h2 className="text-xl font-bold text-text-secondary mb-6">
                        마이커피.AI 서비스 프리런칭 럭키박스<br />
                        성원에 감사드립니다.
                    </h2>
                    <p className="text-sm leading-[22px] font-normal text-text-secondary mb-6">
                        준비한 수량이 소진되었습니다. <br />
                        발송은 1월 15일까지 순차발송 될 예정입니다. <br /> <br />
                        새해 복 많이 받으세요!
                    </p>
                    <button
                        onClick={() => setOpenActionSheet(null)}
                        className="btn-primary w-full"
                    >
                        확인
                    </button>
                </div>
            </ActionSheet>
        </>
    );
};

export default RegisterBtn;
