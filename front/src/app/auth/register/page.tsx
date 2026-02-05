'use client';

import Header from "@/components/Header";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PasswordInput from "../components/PasswordInput";
import { useHeaderStore } from "@/stores/header-store";
import { usePost } from "@/hooks/useApi";
import { User, useUserStore } from "@/stores/user-store";
import KCPRegisterButton from "./components/KCPRegisterButton";

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
  const [verifiedData, setVerifiedData] = useState<any>(null);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [sentVerificationCode, setSentVerificationCode] = useState('');
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
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    gender: 'male',
    phone: '',
    verificationCode: '',
  });

  const [requestErrorMessage, setRequestErrorMessage] = useState('');
  const { setUser } = useUserStore();

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
          error = '올바른 이메일 형식을 입력해주세요.';
        }
        break;
      case 'password':
        if (!value) {
          error = '비밀번호를 입력해주세요.';
        } else if (value.length < 8 || value.length > 20) {
          error = '8~20자의 영문/숫자/특수문자를 포함해주세요.';
        } else if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/.test(value)) {
          error = '영문, 숫자, 특수문자를 모두 포함해주세요.';
        }
        break;
      case 'confirmPassword':
        if (!value) {
          error = '비밀번호를 입력해주세요.';
        } else if (value !== formData.password) {
          error = '비밀번호가 일치하지 않습니다.';
        }
        break;
      case 'name':
        if (!value) {
          error = '이름을 입력해주세요.';
        } else if (value.length < 2) {
          error = '이름은 2자 이상 입력해주세요.';
        }
        break;
      case 'phone':
        if (!value) {
          error = '휴대폰 번호를 입력해주세요.';
        } else if (!/^01[016789]\d{7,8}$/.test(value.replace(/-/g, ''))) {
          error = '올바른 휴대폰 번호를 입력해주세요.';
        }
        break;
    }

    setErrors(prev => ({ ...prev, [name]: error }));
    return error === '';
  };

  const handleInputChange = (name: string, value: string) => {
    setRequestErrorMessage('');
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Real-time validation for email, password, confirmPassword
    if (['email', 'password', 'confirmPassword'].includes(name) && value) {
      validateField(name, value);
    } else if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Re-validate confirmPassword when password changes
    if (name === 'password' && formData.confirmPassword) {
      validateField('confirmPassword', formData.confirmPassword);
    }
  };

  const handleSendVerificationCode = () => {
    if (!formData.phone) {
      setErrors(prev => ({ ...prev, phone: '휴대폰 번호를 입력해주세요.' }));
      return;
    }
    
    if (!validateField('phone', formData.phone)) {
      return;
    }
    
    // 임시 인증번호 생성 (실제로는 백엔드에서 SMS 발송)
    const code = '123456';
    setSentVerificationCode(code);
    alert(`인증번호가 발송되었습니다: ${code}`);
  };

  const handleVerifyCode = () => {
    // 테스트용: 숫자만 입력되어 있으면 인증 통과
    if (!formData.verificationCode) {
      setErrors(prev => ({ ...prev, verificationCode: '인증번호를 입력해주세요.' }));
      return;
    }
    
    if (!/^\d+$/.test(formData.verificationCode)) {
      setErrors(prev => ({ ...prev, verificationCode: '숫자만 입력해주세요.' }));
      return;
    }
    
    setIsPhoneVerified(true);
    alert('휴대폰 인증이 완료되었습니다.');
    setErrors(prev => ({ ...prev, verificationCode: '' }));
  };

  const { mutate: signup, isPending: isGettingSignup } = usePost<User, { [key: string]: any }>(
    '/api/auth/signup',
    {
      onSuccess: (data) => {
        router.push('/auth/register/success');
      },
      onError: (error) => {
        setRequestErrorMessage(error?.response?.data?.detail || '회원가입에 실패했습니다.');
      },
    }
  );

  const handleRegister = () => {
    const fields = ['email', 'password', 'confirmPassword', 'name', 'phone'];
    let isValid = true;

    fields.forEach(field => {
      if (!validateField(field, formData[field as keyof typeof formData])) {
        isValid = false;
      }
    });

    // 휴대폰 인증 체크 - 에러 메시지는 인증번호 입력창 아래에 표시하므로 여기서는 제거
    if (!isPhoneVerified) {
      isValid = false;
    }

    // Check required agreements only (personalInfo and terms, marketing is optional)
    const requiredAgreementsMet = agreements.personalInfo && agreements.terms;

    if (isValid && requiredAgreementsMet) {
      // 생년월일이 입력된 경우에만 포함
      const birthDate = (formData.birthYear && formData.birthMonth && formData.birthDay) 
        ? `${formData.birthYear}-${formData.birthMonth.padStart(2, '0')}-${formData.birthDay.padStart(2, '0')}`
        : undefined;
      
      const data: any = {
        email: formData.email,
        password: formData.password,
        phone_number: formData.phone,
        provider: "email",
      };
      
      // Add optional fields only if they have values
      if (formData.name) data.display_name = formData.name;
      if (birthDate) data.birth_date = birthDate;
      if (formData.gender) data.gender = formData.gender;
      
      console.log('Sending signup data:', data);
      signup(data);
    }
  };

  console.log("verifiedData", verifiedData);


  return (
    <div className="">
      <Header />
      {/* Register Form */}
      <div className="p-4 pb-10 text-gray-0">
        <div className="overflow-y-auto h-[calc(100vh-154px)]">

          {requestErrorMessage && (
            <div className="flex items-center gap-1 mb-4">
              {warningIcon()}
              <span className="text-[#EF4444] text-[12px] font-normal">{requestErrorMessage}</span>
            </div>
          )}

          {/* 이메일 */}
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-[12px] font-bold text-gray-0 leading-[16px] relative">
              이메일
              <span className="absolute top-0 -right-2 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            </label>
            <input
              type="email"
              id="email"
              className={`input-default ${errors.email ? 'border-[#EF4444]' : 'border-[#E6E6E6]'
                }`}
              placeholder="이메일을 입력하세요"
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

          {/* 비밀번호 */}
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 text-[12px] font-bold text-gray-0 leading-[16px] relative">
              비밀번호
              <span className="absolute top-0 -right-2 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            </label>
            <PasswordInput
              id="password"
              label=""
              placeholder="비밀번호를 입력해주세요"
              value={formData.password}
              onChange={(value) => handleInputChange('password', value)}
              error={errors.password}
              required
            />
          </div>

          {/* 비밀번호 확인 */}
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block mb-2 text-[12px] font-bold text-gray-0 leading-[16px] relative">
              비밀번호 확인
              <span className="absolute top-0 -right-2 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            </label>
            <PasswordInput
              id="confirmPassword"
              label=""
              placeholder="비밀번호를 다시 입력해주세요"
              value={formData.confirmPassword}
              onChange={(value) => handleInputChange('confirmPassword', value)}
              error={errors.confirmPassword}
              required
            />
          </div>

          {/* 이름 */}
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2 text-[12px] font-bold text-gray-0 leading-[16px] relative">
              이름
              <span className="absolute top-0 -right-2 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            </label>
            <input
              type="text"
              id="name"
              className="input-default border-[#E6E6E6]"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="이름을 입력해주세요"
              required
            />
          </div>

          {/* 생년월일 */}
          <div className="mb-4">
            <label className="block mb-2 text-[12px] font-bold text-gray-0 leading-[16px]">
              생년월일
            </label>
            <div className="flex gap-2">
              <select
                className="flex-1 input-default border-[#E6E6E6]"
                value={formData.birthYear}
                onChange={(e) => handleInputChange('birthYear', e.target.value)}
              >
                <option value="">년도</option>
                {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <select
                className="flex-1 input-default border-[#E6E6E6]"
                value={formData.birthMonth}
                onChange={(e) => handleInputChange('birthMonth', e.target.value)}
              >
                <option value="">월</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                  <option key={month} value={month.toString().padStart(2, '0')}>{month}월</option>
                ))}
              </select>
              <select
                className="flex-1 input-default border-[#E6E6E6]"
                value={formData.birthDay}
                onChange={(e) => handleInputChange('birthDay', e.target.value)}
              >
                <option value="">일</option>
                {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                  <option key={day} value={day.toString().padStart(2, '0')}>{day}일</option>
                ))}
              </select>
            </div>
          </div>

          {/* 성별 */}
          <div className="mb-4">
            <label className="block mb-2 text-[12px] font-bold text-gray-0 leading-[16px]">
              성별
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                className={`flex-1 h-[48px] rounded-lg border ${
                  formData.gender === 'male'
                    ? 'border-[#FF7939] bg-[#FFF5F0] text-[#FF7939]'
                    : 'border-[#E6E6E6] bg-white text-gray-600'
                } text-[14px] font-medium`}
                onClick={() => handleInputChange('gender', 'male')}
              >
                남자
              </button>
              <button
                type="button"
                className={`flex-1 h-[48px] rounded-lg border ${
                  formData.gender === 'female'
                    ? 'border-[#FF7939] bg-[#FFF5F0] text-[#FF7939]'
                    : 'border-[#E6E6E6] bg-white text-gray-600'
                } text-[14px] font-medium`}
                onClick={() => handleInputChange('gender', 'female')}
              >
                여자
              </button>
            </div>
          </div>

          {/* 휴대폰 번호 */}
          <div className="mb-4">
            <label htmlFor="phone" className="block mb-2 text-[12px] font-bold text-gray-0 leading-[16px] relative">
              휴대폰 번호
              <span className="absolute top-0 -right-2 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            </label>
            <div className="flex gap-2">
              <input
                type="tel"
                id="phone"
                className={`flex-1 input-default ${errors.phone ? 'border-[#EF4444]' : 'border-[#E6E6E6]'}`}
                placeholder="휴대폰 번호를 입력하세요"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                maxLength={11}
                disabled={isPhoneVerified}
              />
              <button
                type="button"
                className="px-4 h-[48px] bg-white border border-[#E6E6E6] rounded-lg text-[14px] font-medium text-gray-0 whitespace-nowrap hover:bg-gray-50"
                onClick={handleSendVerificationCode}
                disabled={isPhoneVerified}
              >
                {isPhoneVerified ? '인증완료' : '인증 요청'}
              </button>
            </div>
            {errors.phone && (
              <div className="flex items-center gap-1 mt-2">
                {warningIcon()}
                <span className="text-[#EF4444] text-[12px] font-normal">{errors.phone}</span>
              </div>
            )}
          </div>

          {/* 인증 번호 */}
          <div className="mb-4">
            <label htmlFor="verificationCode" className="block mb-2 text-[12px] font-bold text-gray-0 leading-[16px]">
              인증 번호
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="verificationCode"
                className={`flex-1 input-default ${errors.verificationCode ? 'border-[#EF4444]' : 'border-[#E6E6E6]'}`}
                placeholder="인증 번호를 입력하세요"
                value={formData.verificationCode}
                onChange={(e) => handleInputChange('verificationCode', e.target.value)}
                maxLength={6}
                disabled={isPhoneVerified}
              />
              <button
                type="button"
                className="px-4 h-[48px] bg-white border border-[#E6E6E6] rounded-lg text-[14px] font-medium text-gray-0 whitespace-nowrap hover:bg-gray-50"
                onClick={handleVerifyCode}
                disabled={isPhoneVerified || !sentVerificationCode}
              >
                {isPhoneVerified ? '인증완료' : '인증 확인'}
              </button>
            </div>
            {errors.verificationCode && (
              <div className="flex items-center gap-1 mt-2">
                {warningIcon()}
                <span className="text-[#EF4444] text-[12px] font-normal">{errors.verificationCode}</span>
              </div>
            )}
            {!isPhoneVerified && (
              <div className="flex items-center gap-1 mt-2">
                {warningIcon()}
                <span className="text-[#EF4444] text-[12px] font-normal">휴대폰 인증을 완료해주세요.</span>
              </div>
            )}
            {isPhoneVerified && (
              <div className="flex items-center gap-1 mt-2">
                <svg className="shrink-0" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M13.3334 4L6.00002 11.3333L2.66669 8" stroke="#10B981" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-[#10B981] text-[12px] font-normal">휴대폰 인증이 완료되었습니다.</span>
              </div>
            )}
          </div>

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
                <Link href="/auth/register/privacy" className="cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M7.5 15L12.5 10L7.5 5" stroke="#1A1A1A" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
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
                <Link href="/auth/register/terms" className="cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M7.5 15L12.5 10L7.5 5" stroke="#1A1A1A" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
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
                <Link href="/auth/register/marketing" className="cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M7.5 15L12.5 10L7.5 5" stroke="#1A1A1A" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <button
          className={`w-full btn-primary mt-1`}
          disabled={!agreements.personalInfo || !agreements.terms || isGettingSignup
            || !!errors.email || !!errors.password || !!errors.confirmPassword}
          onClick={handleRegister}
        >
          가입하기
        </button>
      </div>
    </div>
  );
}
