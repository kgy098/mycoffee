"use client";

import { ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/user-store";

const WarningIcon = () => (
    <svg className="shrink-0" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <g clipPath="url(#clip0_1366_13821)">
            <path d="M7.99992 14.6667C11.6818 14.6667 14.6666 11.6819 14.6666 8.00001C14.6666 4.31811 11.6818 1.33334 7.99992 1.33334C4.31802 1.33334 1.33325 4.31811 1.33325 8.00001C1.33325 11.6819 4.31802 14.6667 7.99992 14.6667Z" stroke="#EF4444" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 5.33334V8.00001" stroke="#EF4444" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 10.6667H8.00667" stroke="#EF4444" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
            <clipPath id="clip0_1366_13821">
                <rect width="16" height="16" fill="white" />
            </clipPath>
        </defs>
    </svg>
);

interface OrderModalFormProps {
    setFormData: (data: any) => void;
    formData: any;
    setErrors: (errors: any) => void;
    errors: any;
}

const OrderModalForm = ({
    setFormData,
    formData,
    setErrors,
    errors
}: OrderModalFormProps) => {
    const router = useRouter();

    const { user } = useUserStore();

    useEffect(() => {
        if (user.data?.user_id) {
            const phone = user.data?.phone;
            const isPhoneNumeric = phone && /^[0-9]+$/.test(phone);
            
            setFormData(prev => ({
                ...prev,
                name: user.data?.username,
                ...(isPhoneNumeric && { phone }),
            }));
        }
    }, [user.data?.user_id, user.data?.phone, user.data?.username]);
    
    const handleOpenPostcode = useCallback(() => {
        if (typeof window === "undefined") return;

        new (window as any).daum.Postcode({
            oncomplete: (data: any) => {
                setFormData(prev => ({
                    ...prev,
                    postalCode: data.zonecode,
                    address: data.address,
                }));
                setErrors(prev => ({ ...prev, postalCode: '', address: '' }));
            },
        }).open();
    }, []);

    const handleInputChange = useCallback((field: keyof typeof formData, value: string) => {
        if (field === 'phone') {
            const numericValue = value.replace(/[^0-9]/g, '');
            setFormData(prev => ({ ...prev, [field]: numericValue }));
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
        if (errors[field as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    }, [errors]);

    const handleAgreementChange = useCallback((field: 'personalInfo' | 'marketing', value: boolean) => {
        setFormData(prev => ({
            ...prev,
            agreements: { ...prev.agreements, [field]: value }
        }));
    }, []);

    const handleAllAgreementChange = useCallback(() => {
        setFormData(prev => ({
            ...prev,
            agreements: { marketing: true, personalInfo: true }
        }));
    }, []);

    const inputFields = useMemo(() => [
        {
            key: 'name' as const,
            label: '이름',
            placeholder: '이름을 입력해주세요.',
            value: formData.name ?? '',
            error: errors.name,
            minLength: 1,
            maxLength: 20,
        },
        {
            key: 'phone' as const,
            label: '휴대폰 번호',
            placeholder: '휴대폰 번호를 입력해주세요.',
            value: formData.phone ?? '',
            error: errors.phone,
            type: 'tel' as const,
            minLength: 5,
            maxLength: 11,
        },
    ], [formData.name, formData.phone, errors.name, errors.phone]);

    return (
        <>
            {inputFields.map((field) => (
                <div key={field.key} className="mb-3">
                    <label className="block text-xs leading-[16px] font-bold text-gray-0 mb-2">
                        {field.label}
                    </label>
                    <input
                        value={field.value}
                        type={field.type || 'text'}
                        minLength={field.minLength}
                        maxLength={field.maxLength}
                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className={`input-default ${field.error ? 'border-red-500' : ''}`}
                    />
                    {field.error && (
                        <div className="flex items-center gap-1 mt-1">
                            <WarningIcon />
                            <span className="text-[#EF4444] text-[12px] font-normal">{field.error}</span>
                        </div>
                    )}
                </div>
            ))}

            <div className="mb-3">
                <label className="block text-xs leading-[16px] font-bold text-gray-0 mb-2">
                    배송지
                </label>
                <div className="flex gap-2">
                    <input
                        value={formData.postalCode ?? ''}
                        type="text"
                        disabled
                        placeholder="우편번호"
                        className={`input-default ${errors.postalCode ? 'border-red-500' : ''}`}
                    />
                    <button onClick={handleOpenPostcode} className="btn-primary shrink-0 text-xs! leading-[18px]! py-[11px]!">
                        우편번호 찾기
                    </button>
                </div>
                {errors.postalCode && (
                    <div className="flex items-center gap-1 mt-1">
                        <WarningIcon />
                        <span className="text-[#EF4444] text-[12px] font-normal">{errors.postalCode}</span>
                    </div>
                )}
                <input
                    value={formData.address ?? ''}
                    type="text"
                    disabled
                    className={`input-default my-2 ${errors.address ? 'border-red-500' : ''}`}
                />
                {errors.address && (
                    <div className="flex items-center gap-1 mt-1 mb-2">
                        <WarningIcon />
                        <span className="text-[#EF4444] text-[12px] font-normal">{errors.address}</span>
                    </div>
                )}
                <input
                    value={formData.detailAddress ?? ''}
                    type="text"
                    onChange={(e) => handleInputChange('detailAddress', e.target.value)}
                    placeholder="상세주소를 입력해주세요."
                    className={`input-default ${errors.detailAddress ? 'border-red-500' : ''}`}
                />
                {errors.detailAddress && (
                    <div className="flex items-center gap-1 mt-1">
                        <WarningIcon />
                        <span className="text-[#EF4444] text-[12px] font-normal">{errors.detailAddress}</span>
                    </div>
                )}
            </div>

            <label className="flex items-center gap-2 cursor-pointer mb-[18px] border-t border-border-default pt-4">
                <input
                    type="checkbox"
                    checked={formData.agreements.personalInfo && formData.agreements.marketing}
                    onChange={handleAllAgreementChange}
                    className="auth-checkbox w-5 h-5 rounded-sm border border-border-default"
                />
                <span className="text-xs leading-[16px] font-normal">
                    전체 동의
                </span>
            </label>

            <div>
                <label className="flex items-center gap-2 cursor-pointer mb-[18px]">
                    <input
                        type="checkbox"
                        checked={formData.agreements.personalInfo}
                        onChange={(e) => handleAgreementChange('personalInfo', e.target.checked)}
                        className="auth-checkbox w-5 h-5 rounded-sm border border-border-default"
                    />
                    <span className="text-xs leading-[16px] font-normal">
                        개인정보 수집 및 약관 동의 (필수)
                    </span>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            router.push('/on-event/terms/privacy');
                        }}
                        className="ml-auto group cursor-pointer"
                    >
                        <ChevronRight size={20} className="text-icon-default group-hover:text-blue-500 transition-colors" />
                    </button>
                </label>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
                <input
                    type="checkbox"
                    checked={formData.agreements.marketing}
                    onChange={(e) => handleAgreementChange('marketing', e.target.checked)}
                    className="auth-checkbox w-5 h-5 rounded-sm border border-border-default"
                />
                <span className="text-xs leading-[16px] font-normal">
                    앱 출시 알림 동의 (선택)
                </span>
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        router.push('/on-event/terms/marketing');
                    }}
                    className="ml-auto group cursor-pointer"
                >
                    <ChevronRight size={20} className="text-icon-default group-hover:text-blue-500 transition-colors" />
                </button>
            </label>
        </>
    );
};

export default OrderModalForm;