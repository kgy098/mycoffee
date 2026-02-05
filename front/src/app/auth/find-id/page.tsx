'use client';

import Header from "@/components/Header";
import Alert from "@/components/Alert";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useHeaderStore } from "@/stores/header-store";
import { usePost } from "@/hooks/useApi";

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

export default function FindId() {
  const { setHeader } = useHeaderStore();
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [errors, setErrors] = useState({
    phone: '',
    verificationCode: '',
  });
  const router = useRouter();

  const { mutate: findId, isPending: isFindingId } = usePost<any, { phone_number: string }>(
    '/api/auth/find-id',
    {
      onSuccess: (data) => {
        if (data?.success) {
          // Store accounts in sessionStorage to pass to next page
          sessionStorage.setItem('foundAccounts', JSON.stringify(data.accounts));
          router.push('/auth/find-id/select');
        }
      },
      onError: (error) => {
        setErrors(prev => ({ ...prev, phone: '계정을 찾을 수 없습니다.' }));
      },
    }
  );

  useEffect(() => {
    setHeader({
      title: "아이디 찾기",
      showBackButton: true,
    });
  }, [setHeader]);

  // Counter effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const validateField = (name: string, value: string) => {
    let error = '';
    switch (name) {
      case 'phone':
        if (!value) {
          error = '휴대폰 번호를 입력해주세요.';
        } else if (!/^[0-9]{10,11}$/.test(value.replace(/\s/g, ''))) {
          error = '올바른 휴대폰 번호를 입력해주세요.';
        }
        break;
      case 'verificationCode':
        if (!value) {
          error = '인증 번호를 입력해주세요.';
        } else if (value.length !== 6) {
          error = '정확한 정보를 입력해주세요';
        }
        break;
    }
    setErrors(prev => ({ ...prev, [name]: error }));
    return error === '';
  };

  const handleInputChange = (name: string, value: string) => {
    if (name === 'phone') {
      setPhone(value);
    } else if (name === 'verificationCode') {
      setVerificationCode(value);
    }

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSendCode = () => {
    if (validateField('phone', phone)) {
      setIsCodeSent(true);
      setTimeLeft(60);
      // Reset verification code when resending
      setVerificationCode('');
      // 테스트용 인증번호 알럿
      const testCode = '123456';
      setAlertMessage(`[테스트] 인증번호: ${testCode}`);
      setShowAlert(true);
    }
  };

  const handleSubmit = () => {
    const isPhoneValid = validateField('phone', phone);
    const isCodeValid = validateField('verificationCode', verificationCode);

    if (isPhoneValid && isCodeValid && isCodeSent) {
      // Call find-id API
      findId({ phone_number: phone });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  return (
    <div className="h-[100dvh] flex flex-col">
      <Header />
      {/* Login Form */}
      <div className="p-4 text-gray-0">
        {/* Phone Number Input */}
        <div>
          <label htmlFor="phone" className="block mb-2 text-[12px] leading-[16px] font-bold text-gray-0">
            휴대폰 번호
          </label>
          <div className="flex gap-1">
            <div className="flex-1">
              <input
                type="tel"
                id="phone"
                className={`input-default ${errors.phone ? 'border-[#EF4444]' : 'border-[#E6E6E6]'
                  }`}
                placeholder="휴대폰 번호를 입력해주세요"
                value={phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
              />
            </div>
            <button
              type="button"
              onClick={handleSendCode}
              disabled={phone.trim() === '' || (isCodeSent && timeLeft > 0)}
              className="px-4 py-2.5 border border-[#ECE5DF] bg-[#ECE5DF] text-[#4E2A18] text-sm leading-[18px] rounded-lg font-bold cursor-pointer disabled:opacity-50 disabled:bg-[#E6E6E6] disabled:text-gray-700 disabled:border-[#E6E6E6] disabled:hover:bg-[#E6E6E6] disabled:hover:text-gray-700"
            >
              {isCodeSent ? '재전송' : '인증 요청'}
            </button>
          </div>
          {errors.phone && (
            <div className="flex items-center gap-1 mt-2">
              {warningIcon()}
              <span className="text-[#EF4444] text-[12px] font-normal">{errors.phone}</span>
            </div>
          )}
        </div>

        {isCodeSent && timeLeft > 0 && (
          <div className="mt-2 text-[12px] text-gray-0 font-normal flex items-center">
            유효 시간 {formatTime(timeLeft)}
          </div>
        )}
        {/* Verification Code Input */}
        <div className="pt-4">
          <label htmlFor="verificationCode" className="block mb-2 text-[12px] font-bold text-gray-0 leading-[16px]">
            인증 번호
          </label>
          <div className="flex gap-1">
            <input
              type="text"
              id="verificationCode"
              className={`input-default ${errors.verificationCode ? 'border-[#EF4444]' : 'border-[#E6E6E6]'
                }`}
              placeholder="인증 번호를 입력해주세요."
              value={verificationCode}
              onChange={(e) => handleInputChange('verificationCode', e.target.value)}
              required
            />
          </div>
          {errors.verificationCode && (
            <div className="flex items-center gap-1 mt-2">
              {warningIcon()}
              <span className="text-[#EF4444] text-[12px] font-normal">{errors.verificationCode}</span>
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="px-4 pb-10 mt-auto">
        <button
          onClick={handleSubmit}
          disabled={!isCodeSent || verificationCode.trim() === ''}
          className="w-full btn-primary"
        >
          아이디 찾기
        </button>
      </div>

      {/* Alert Component */}
      <Alert
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        message={alertMessage}
      />
    </div>
  );
}
