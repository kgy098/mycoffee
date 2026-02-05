import { usePost } from "@/hooks/useApi";
import { useEffect, useState } from "react";

const warningIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
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
};

const VerifyCode = ({ handleInputChange, formData, isPhoneVerified, onVerificationSuccess }: { handleInputChange: (key: string, value: string) => void, formData: any, isPhoneVerified: boolean, onVerificationSuccess: () => void }) => {

    const [getVerificationCodeError, setgetVerificationCodeError] = useState('')
    const [isButtonDisabled, setIsButtonDisabled] = useState(true)
    const [isVerificationSuccess, setIsVerificationSuccess] = useState(false)

    const { mutate: verificationCodeCheck, isPending: ischeckingVerificationCode } = usePost<any, any>(
        '/phone/verify',
        {
            onSuccess: (data) => {
                if (data?.data) {
                    setIsVerificationSuccess(true);
                    onVerificationSuccess();
                }
            },
            onError: (error) => {
                setgetVerificationCodeError(error?.response?.data?.message);
            },
        }
    );

    useEffect(() => {
        setIsVerificationSuccess(isPhoneVerified);
    }, [isPhoneVerified]);

    // Hide the entire component if verification is successful
    if (isVerificationSuccess) {
        return null;
    }

    return (
        <div className="mb-4">
            <label htmlFor="verificationCode" className="block mb-2 text-[12px] font-bold text-gray-0 leading-[16px]">
                인증 번호
            </label>
            <div className="flex gap-1">
                <input
                    type="text"
                    id="verificationCode"
                    className="flex-1 input-default"
                    placeholder="인증 번호를 입력하세요."
                    value={formData.verificationCode}
                    onChange={(e) => {
                        const codeValue = e.target.value.trim();
                        setIsButtonDisabled(codeValue.length !== 6);
                        setgetVerificationCodeError("");
                        handleInputChange('verificationCode', e.target.value);
                    }}
                    required
                />
                
                <button
                    type="button"
                    id="verifyButton"
                    className="h-max px-4 py-[9px] border border-[#ECE5DF] bg-[#ECE5DF] text-[#4E2A18] text-sm leading-[20px] rounded-lg font-bold cursor-pointer disabled:bg-[#E6E6E6] disabled:text-[#9CA3AF] disabled:border-[#E6E6E6] disabled:hover:bg-[#E6E6E6] disabled:hover:cursor-not-allowed"
                    disabled={isButtonDisabled || ischeckingVerificationCode}
                    onClick={() => verificationCodeCheck({ phone_number: formData.phone, verification_code: formData.verificationCode, purpose: "SIGNUP" })}
                >
                    {ischeckingVerificationCode ? '인증 확인 중...' : '인증 확인'}
                </button>
            </div>
            {getVerificationCodeError && (
                <div className="flex items-center gap-1 mt-2">
                    {warningIcon()}
                    <span className="text-[#EF4444] text-[12px] font-normal">{getVerificationCodeError}</span>
                </div>
            )}
        </div>
    )
}
export default VerifyCode;