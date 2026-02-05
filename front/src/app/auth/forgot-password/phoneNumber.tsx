import { usePost } from "@/hooks/useApi";
import { useState, useEffect } from "react";

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

const PhoneNumber = ({ handleInputChange, isPhoneVerified, setIsPhoneVerified, setPhone, phone }: { handleInputChange: (key: string, value: string) => void, isPhoneVerified: boolean, setIsPhoneVerified: (value: boolean) => void, setPhone: (value: string) => void, phone: string }) => {

    const [getVerificationCodeError, setgetVerificationCodeError] = useState('')
    const [isButtonDisabled, setIsButtonDisabled] = useState(true)
    const [countdown, setCountdown] = useState(0)
    const [isCountdownActive, setIsCountdownActive] = useState(false)

    const { mutate: getVerificationCode, isPending: isGettingVerificationCode } = usePost<any, any>(
        '/phone/request',
        {
            onSuccess: (data) => {
                if (data?.data) {
                    setCountdown(180); // 3 minutes = 180 seconds
                    setIsCountdownActive(true);
                }
            },
            onError: (error) => {
                setgetVerificationCodeError(error?.response?.data?.message);
            },
        }
    );

    // Clear countdown when phone is verified
    useEffect(() => {
        if (isPhoneVerified) {
            setCountdown(0);
            setIsCountdownActive(false);
        }
    }, [isPhoneVerified]);

    // Countdown timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout;
        
        if (isCountdownActive && countdown > 0) {
            interval = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        setIsCountdownActive(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isCountdownActive, countdown]);

    // Format countdown to MM:SS
    const formatCountdown = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div>
            <label htmlFor="phone" className="block mb-2 text-[12px] font-bold text-gray-0 leading-[16px]">
                휴대폰 번호
            </label>
            <div className="flex gap-1">
                <div className="flex-1">
                    <input
                        type="tel"
                        id="phone"
                        className="input-default"
                        placeholder="휴대폰 번호를 입력해주세요."
                        value={phone}
                        onChange={(e) => {
                            const phoneValue = e.target.value.trim();
                            const isValidLength = phoneValue.length === 10 || phoneValue.length === 11;
                            // Don't enable button if countdown is active
                            setIsButtonDisabled(!isValidLength || phoneValue === '' || isCountdownActive);
                            setgetVerificationCodeError('');
                            handleInputChange('phone', e.target.value);
                            setIsPhoneVerified(false)
                        }}
                        required
                    />
                    {getVerificationCodeError && (
                        <div className="flex items-center gap-1 mt-2">
                            {warningIcon()}
                            <span className="text-[#EF4444] text-[12px] font-normal">{getVerificationCodeError}</span>
                        </div>
                    )}
                </div>
                <button
                    type="button"
                    id="phoneButton"
                    className="h-max px-4 py-[9px] border border-[#ECE5DF] bg-[#ECE5DF] text-[#4E2A18] text-sm leading-[20px] rounded-lg font-bold cursor-pointer disabled:bg-[#E6E6E6] disabled:text-[#9CA3AF] disabled:border-[#E6E6E6] disabled:hover:bg-[#E6E6E6] disabled:hover:cursor-not-allowed"
                    disabled={isButtonDisabled || isGettingVerificationCode || isCountdownActive}
                    onClick={() => getVerificationCode({ phone_number: phone, purpose: 'SIGNUP', "user_id": 0 })}
                >
                    {isGettingVerificationCode 
                        ? '인증 요청 중...' 
                        : '인증 요청'
                    }
                </button>
            </div>
            {
                isCountdownActive && (
                    <p className="text-[12px] text-gray-0 font-normal mt-2">{`유효 시간 ${formatCountdown(countdown)}`}</p>
                )
            }
        </div>
    )
}
export default PhoneNumber;