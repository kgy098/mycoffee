'use client';

import Header from "@/components/Header";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PasswordInput from "../components/PasswordInput";
import DatePicker from "../components/DatePicker";
import { useHeaderStore } from "@/stores/header-store";
import { usePost } from "@/hooks/useApi";
import PhoneNumber from "./phoneNumber";
import VerifyCode from "./verifyCode";
import { User, useUserStore } from "@/stores/user-store";

const warningIcon = () => {
  return (
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
};

export default function Register() {
  const { setHeader } = useHeaderStore();

  useEffect(() => {
    setHeader({
      title: "회원가입",
      showBackButton: true,
    });
  }, [setHeader]);

  const [isAllAgreed, setIsAllAgreed] = useState(false);
  const [agreements, setAgreements] = useState({
    personalInfo: false,
    terms: false,
    marketing: false
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    birthDate: '',
    phone: '',
    verificationCode: '',
  });
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    birthDate: '',
    gender: 'male',
    phone: '',
    verificationCode: '',
  });
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [requestErrorMessage, setRequestErrorMessage] = useState('');
  const { setUser } = useUserStore();
  const [kcpPhone, setKcpPhone] = useState('');

  const router = useRouter()

  const handleAllAgree = () => {
    const newValue = !isAllAgreed;
    setIsAllAgreed(newValue);
    setAgreements({
      personalInfo: newValue,
      terms: newValue,
      marketing: newValue
    });
  };

  const handleAgreementChange = (key: keyof typeof agreements) => {
    const newAgreements = { ...agreements, [key]: !agreements[key] };
    setAgreements(newAgreements);
    setIsAllAgreed(Object.values(newAgreements).every(Boolean));
  };

  const validateField = (name: string, value: string) => {
    let error = '';

    switch (name) {
      case 'email':
        if (!value) {
          error = '이메일을 입력해주세요.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = '이메일이 올바르게 입력되지 않았습니다.';
        }
        break;
      case 'password':
        if (!value) {
          error = '비밀번호를 입력해주세요.';
        } else if (value.length < 8) {
          error = '비밀번호는 8자 이상이어야 합니다.';
        }
        break;
      case 'confirmPassword':
        if (!value) {
          error = '비밀번호를 다시 입력해주세요.';
        } else if (value !== formData.password) {
          error = '비밀번호가 일치하지 않습니다.';
        }
        break;
      case 'name':
        if (!value) {
          error = '이름을 입력해주세요.';
        }
        break;
      case 'birthDate':
        if (!value) {
          error = '생년월일을 입력해주세요.';
        }
        break;
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
        }
        break;
    }

    setErrors(prev => ({ ...prev, [name]: error }));
    return error === '';
  };

  const handleInputChange = (name: string, value: string) => {
    setRequestErrorMessage('');
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const { mutate: signup, isPending: isGettingSignup } = usePost<User, { [key: string]: any }>(
    '/auth/register',
    {
      onSuccess: (data) => {
        // Clear KCP localStorage on success
        if (typeof window !== 'undefined') {
          localStorage.removeItem('kcp_verified');
          localStorage.removeItem('kcp_phone');
          localStorage.removeItem('kcp_payload');
        }

        if (data?.status === 'success' || data?.data) {
          if (data?.data) {
            setUser(data);
          }
          router.push('/home');
          sessionStorage.removeItem('auth_redirect');
        } else if (data?.status === 'exists') {
          setRequestErrorMessage('이메일 또는 전화번호가 이미 등록되어 있습니다.');
        } else {
          setRequestErrorMessage('회원가입에 실패했습니다.');
        }
      },
      onError: (error) => {
        setRequestErrorMessage(error?.response?.data?.message || '회원가입에 실패했습니다.');
      },
    }
  );

  const handleRegister = () => {
    const fields = ['email', 'password', 'confirmPassword', 'name', 'birthDate'];
    let isValid = true;

    fields.forEach(field => {
      if (!validateField(field, formData[field as keyof typeof formData])) {
        isValid = false;
      }
    });

    // Check KCP verification
    const kcpVerified = typeof window !== 'undefined' && localStorage.getItem('kcp_verified') === '1';
    const kcpPhone = typeof window !== 'undefined' ? localStorage.getItem('kcp_phone') || '' : '';

    if (!kcpVerified || !kcpPhone) {
      setRequestErrorMessage('휴대폰 인증을 완료해주세요.');
      return;
    }

    if (isValid && isAllAgreed) {
      const data = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        birth_date: formData.birthDate,
        gender: formData.gender === "male" ? "M" : "F",
        phone_number: kcpPhone, // Use KCP verified phone
        verified: 1,
        terms_agreed: agreements.terms,
        privacy_agreed: agreements.personalInfo,
        marketing_agreed: agreements.marketing,
      };

      signup(data);
    }
  };

  const handleKCPVerificationComplete = (phone: string) => {
    setKcpPhone(phone);
    setIsPhoneVerified(true);
    // Update formData phone field
    setFormData(prev => ({ ...prev, phone }));
  };

  return (
    <div className="">
      <Header />
      {/* Register Form */}
      <div className="p-4 pb-10 text-gray-0">
        <div className="overflow-y-auto h-[calc(100vh-154px)]">

        {/* <KCPRegisterBtn onVerificationComplete={handleKCPVerificationComplete} /> */}
        
          {/* Email Input */}
          {requestErrorMessage && (
            <div className="flex items-center gap-1 mb-2">
              {warningIcon()}
              <span className="text-[#EF4444] text-[12px] font-normal">{requestErrorMessage}</span>
            </div>
          )}
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-[12px] font-bold text-gray-0 leading-[16px]">
              이메일
            </label>
            <input
              type="email"
              id="email"
              className={`input-default ${errors.email ? 'border-[#EF4444]' : 'border-[#E6E6E6]'
                }`}
              placeholder="이메일을 입력하세요."
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
              minLength={5}
              maxLength={50}
            />
            {errors.email && (
              <div className="flex items-center gap-1 mt-2">
                {warningIcon()}
                <span className="text-[#EF4444] text-[12px] font-normal">{errors.email}</span>
              </div>
            )}
          </div>

          {/* Password Input */}
          <PasswordInput
            id="password"
            label="비밀번호"
            placeholder="비밀번호를 입력해주세요."
            value={formData.password}
            onChange={(value) => handleInputChange('password', value)}
            error={errors.password}
            required
          />

          <PasswordInput
            id="confirmPassword"
            label="비밀번호 확인"
            placeholder="비밀번호를 다시 입력해주세요."
            value={formData.confirmPassword}
            onChange={(value) => handleInputChange('confirmPassword', value)}
            error={errors.confirmPassword}
            required
          />

          {/* Name Input */}
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2 text-[12px] font-bold text-gray-0 leading-[16px]">
              이름
            </label>
            <input
              type="text"
              id="name"
              className="input-default"
              placeholder="비밀번호를 입력해주세요."
              defaultValue=""
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
              minLength={2}
              maxLength={20}
            />
          </div>

          <DatePicker
            id="birthDate"
            label="생년월일"
            value={formData.birthDate}
            onChange={(value) => handleInputChange('birthDate', value)}
            error={errors.birthDate}
            placeholder="년도 / 월 / 일"
            required
          />

          {/* Gender Selection */}
          <div className="mb-4">
            <label className="block mb-2 text-[12px] font-bold text-gray-0 leading-[16px]">
              성별
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  className="w-4 h-4 !text-[#62402D] bg-transparent border-2 border-[#B3B3B3]"
                  checked={formData.gender === 'male'}
                  onChange={() => handleInputChange('gender', 'male')}
                />
                <span className="text-[12px] font-normal text-gray-0">남자</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  className="w-4 h-4 !text-[#62402D] bg-transparent border-2 border-[#B3B3B3]"
                  checked={formData.gender === 'female'}
                  onChange={() => handleInputChange('gender', 'female')}
                />
                <span className="text-[12px] font-normal text-gray-0">여자</span>
              </label>
            </div>
          </div>

          {/* Phone Number Input */}
          <PhoneNumber handleInputChange={handleInputChange} formData={formData} isPhoneVerified={isPhoneVerified} setIsPhoneVerified={setIsPhoneVerified} />

          {/* Verification Code Input */}
          <VerifyCode handleInputChange={handleInputChange} formData={formData} isPhoneVerified={isPhoneVerified} onVerificationSuccess={() => setIsPhoneVerified(true)} />

          {/* Agreement Checkboxes */}
          <div className="mb-6">
            {/* All Agree */}
            <div className="flex items-center mb-4 border-b border-[#E6E6E6] pb-4">
              <input
                id="allAgree"
                type="checkbox"
                className="cursor-pointer auth-checkbox w-5 h-5 bg-transparent border border-[#B3B3B3] rounded focus:ring-[#FF7939] focus:ring-0"
                style={{ accentColor: '#FF7939' }}
                checked={isAllAgreed}
                onChange={handleAllAgree}
              />
              <label htmlFor="allAgree" className="ml-2 text-[12px] text-gray-0 font-normal cursor-pointer">
                전체 동의
              </label>
            </div>

            {/* Individual Agreements */}
            <div className="space-y-2.5 px-2">
              <div className="flex items-center justify-between h-[28px]">
                <div className="flex items-center">
                  <input
                    id="personalInfo"
                    type="checkbox"
                    className="cursor-pointer auth-checkbox w-5 h-5 bg-white border border-[#B3B3B3] rounded focus:ring-[#FF7939] focus:ring-0"
                    style={{ accentColor: '#FF7939' }}
                    checked={agreements.personalInfo}
                    onChange={() => handleAgreementChange('personalInfo')}
                  />
                  <label htmlFor="personalInfo" className="ml-2 text-[12px] text-gray-0 cursor-pointer">
                    개인정보 수집 및 이용 동의 (필수)
                  </label>
                </div>
                <button className="cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M7.5 15L12.5 10L7.5 5" stroke="#1A1A1A" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center justify-between h-[28px]">
                <div className="flex items-center">
                  <input
                    id="terms"
                    type="checkbox"
                    className="cursor-pointer auth-checkbox w-5 h-5 bg-white border border-[#B3B3B3] rounded focus:ring-[#FF7939] focus:ring-0"
                    style={{ accentColor: '#FF7939' }}
                    checked={agreements.terms}
                    onChange={() => handleAgreementChange('terms')}
                  />
                  <label htmlFor="terms" className="ml-2 text-[12px] text-gray-0 cursor-pointer">
                    이용약관 동의 (필수)
                  </label>
                </div>
                <button className="cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M7.5 15L12.5 10L7.5 5" stroke="#1A1A1A" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center justify-between h-[28px]">
                <div className="flex items-center">
                  <input
                    id="marketing"
                    type="checkbox"
                    className="cursor-pointer auth-checkbox w-5 h-5 bg-white border border-[#B3B3B3] rounded focus:ring-[#FF7939] focus:ring-0"
                    style={{ accentColor: '#FF7939' }}
                    checked={agreements.marketing}
                    onChange={() => handleAgreementChange('marketing')}
                  />
                  <label htmlFor="marketing" className="ml-2 text-[12px] text-gray-0 cursor-pointer">
                    개인정보 마케팅 활용 동의 (선택)
                  </label>
                </div>
                <button className="cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M7.5 15L12.5 10L7.5 5" stroke="#1A1A1A" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Register Button */
          }
        </div>
        <button
          className={`w-full btn-primary mt-1`}
          disabled={!isAllAgreed || isGettingSignup}
          onClick={handleRegister}
        >
          가입하기
        </button>
      </div>
    </div>
  );
}
