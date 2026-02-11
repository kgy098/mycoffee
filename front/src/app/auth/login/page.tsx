'use client';

import Link from "next/link";
import Header from "@/components/Header";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useHeaderStore } from "@/stores/header-store";
import { Lock, Mail } from "lucide-react";
import { usePost } from "@/hooks/useApi";
import { User, useUserStore } from "@/stores/user-store";
import { setAccessTokenCookie, setRememberTokenCookie, getRememberMeCookie, setRememberMeCookie } from "@/utils/cookies";

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

export default function Login() {
  const { setHeader } = useHeaderStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isRememberChecked, setIsRememberChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [requestErrorMessage, setRequestErrorMessage] = useState('');
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const router = useRouter();
  const { setUser } = useUserStore();

  useEffect(() => {
    setHeader({
      title: "",
      showBackButton: true,
    });
  }, [setHeader]);

  useEffect(() => {
    setIsRememberChecked(getRememberMeCookie());
  }, []);

  const { mutate: signin, isPending: isGettingLogin } = usePost<User, {[key: string]: any}>(
    '/api/auth/login',
    {
      onSuccess: (data) => {
        console.log("data", data);
        
        if(data?.success){
          if(data?.token){
            setAccessTokenCookie(data.token);
            if (data.remember_token) {
              setRememberTokenCookie(data.remember_token);
            }
            setUser({
              data: {
                user_id: data.userId,
                session_id: "",
                token: data.token,
                token_type: data.token_type,
                expires_in: 0,
                result_code: "",
                result_message: "",
                display_name: data.display_name,
                email: data.email,
              },
              meta: {
                timestamp: new Date().toISOString()
              },
              isAuthenticated: true
            });
            router.push('/home');
          }
        }
      },
      onError: (error) => {
        setRequestErrorMessage(error?.response?.data?.detail || '로그인에 실패했습니다.');
      },
    }
  );

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
        }
        break;
    }

    setErrors(prev => ({ ...prev, [name]: error }));
    return error === '';
  };

  const handleInputChange = (name: string, value: string) => {
    setRequestErrorMessage('');
    setErrorMessage(null);
    
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
    
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleLogin = async () => {
    setErrorMessage(null);
    setRequestErrorMessage('');
    
    const isEmailValid = validateField('email', email);
    const isPasswordValid = validateField('password', password);
    
    if (!isEmailValid || !isPasswordValid) {
      return;
    }
    
    try {
      signin({ email, password, remember_me: isRememberChecked });
    } catch (err: any) {
      setErrorMessage(err?.message || "로그인 실패");
    }
  };
  return (
    <div className="h-[100dvh]">
      <Header />
      {/* Login Form */}
      <div className="p-4 text-gray-0">
        {requestErrorMessage && (
          <div className="flex items-center gap-1 mb-2">
            {warningIcon()}
            <span className="text-[#EF4444] text-[12px] font-normal">{requestErrorMessage}</span>
          </div>
        )}
        {/* Email Input */}
        <div className="mb-3">
          <label htmlFor="email" className="block mb-2 text-[12px] font-bold text-gray-0 leading-[16px]">
            이메일
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="text-[#B3B3B3]" size={20} />
            </div>
            <input
              type="email"
              id="email"
              className={`input-default !pl-11 ${errors.email ? 'border-[#EF4444]' : 'border-[#E6E6E6]'}`}
              placeholder="이메일을 입력하세요."
              required
              value={email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onBlur={(e) => validateField('email', e.target.value)}
            />
          </div>
          {errors.email && (
            <div className="flex items-center gap-1 mt-2">
              {warningIcon()}
              <span className="text-[#EF4444] text-[12px] font-normal">{errors.email}</span>
            </div>
          )}
        </div>

        {/* Password Input */}
        <div className="mb-3">
          <label htmlFor="password" className="block mb-2 text-[12px] font-bold text-gray-0 leading-[16px]">
            비밀번호
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="text-[#B3B3B3]" height={20} width={20} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className={`input-default !pl-11 pr-10 ${errors.password ? 'border-[#EF4444]' : 'border-[#E6E6E6]'}`}
              placeholder="비밀번호를 입력해주세요."
              required
              value={password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              onBlur={(e) => validateField('password', e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M2.06202 12.348C1.97868 12.1235 1.97868 11.8765 2.06202 11.652C2.87372 9.68385 4.25153 8.00103 6.02079 6.81689C7.79004 5.63275 9.87106 5.00061 12 5.00061C14.129 5.00061 16.21 5.63275 17.9792 6.81689C19.7485 8.00103 21.1263 9.68385 21.938 11.652C22.0214 11.8765 22.0214 12.1235 21.938 12.348C21.1263 14.3161 19.7485 15.999 17.9792 17.1831C16.21 18.3672 14.129 18.9994 12 18.9994C9.87106 18.9994 7.79004 18.3672 6.02079 17.1831C4.25153 15.999 2.87372 14.3161 2.06202 12.348Z" stroke="#B3B3B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#B3B3B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M10.733 5.07599C13.0624 4.7984 15.4186 5.29081 17.4419 6.47804C19.4652 7.66527 21.0442 9.48207 21.938 11.651C22.0214 11.8755 22.0214 12.1225 21.938 12.347C21.5705 13.238 21.0848 14.0755 20.494 14.837" stroke="#B3B3B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M14.084 14.158C13.5182 14.7045 12.7604 15.0069 11.9738 15C11.1872 14.9932 10.4348 14.6777 9.87856 14.1215C9.32233 13.5652 9.00683 12.8128 8.99999 12.0262C8.99316 11.2396 9.29554 10.4818 9.84201 9.91602" stroke="#B3B3B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M17.479 17.499C16.1525 18.2848 14.6725 18.776 13.1394 18.9394C11.6063 19.1028 10.056 18.9345 8.59365 18.4459C7.13133 17.9573 5.79121 17.1599 4.66423 16.1078C3.53725 15.0556 2.64977 13.7734 2.06202 12.348C1.97868 12.1235 1.97868 11.8765 2.06202 11.652C2.94865 9.50186 4.50869 7.69725 6.50802 6.509" stroke="#B3B3B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 2L22 22" stroke="#B3B3B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          </div>
          {errors.password && (
            <div className="flex items-center gap-1 mt-2">
              {warningIcon()}
              <span className="text-[#EF4444] text-[12px] font-normal">{errors.password}</span>
            </div>
          )}
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center mb-[50px]">
          <input
            id="remember"
            type="checkbox"
            className="cursor-pointer auth-checkbox w-5 h-5 bg-transparent border border-[#B3B3B3] rounded focus:ring-[#62402D] focus:ring-0"
            style={{ accentColor: '#FF7939' }}
            checked={isRememberChecked}
            onChange={(e) => {
              const checked = e.target.checked;
              setIsRememberChecked(checked);
              setRememberMeCookie(checked);
            }}
          />
          <label htmlFor="remember" className="leading-[16px] ml-2 text-xs text-gray-0 font-normal cursor-pointer">
            자동 로그인
          </label>
        </div>

        {errorMessage && (
          <div className="mb-3 text-[12px] text-red-500 font-medium">
            {errorMessage}
          </div>
        )}

        {/* Login Button */}
        <button
          className="w-full btn-primary"
          disabled={isGettingLogin || !email || !password}
          onClick={handleLogin}
        >
          {isGettingLogin ? '로그인 중...' : '로그인'}
        </button>

        {/* Account Management Links */}
        <div className="flex justify-center items-center mt-4 space-x-2 text-xs">
          <Link href="/auth/find-id" className="text-gray-0 py-[6px] px-[14px] leading-[18px] font-normal">
            아이디 찾기
          </Link>
          <Link href="/auth/forgot-password" className="text-gray-0 py-[6px] px-[14px] leading-[18px] font-normal">
            비밀번호 찾기
          </Link>
          <Link href="/auth/register" className="text-gray-0 py-[6px] px-[14px] leading-[18px] font-normal">
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
}
