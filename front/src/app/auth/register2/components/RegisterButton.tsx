'use client';

import { useEffect, useState } from 'react';
import { API_CONFIG } from '@/lib/config';

interface KCPRegisterButtonProps {
  email: string;
  password: string;
  onVerificationComplete?: (data: any) => void;
  onRegisterSuccess?: () => void;
  onRegisterError?: (error: string) => void;
  kcpUrl?: string;
}

export default function KCPRegisterButton({
  email,
  password,
  onVerificationComplete,
  onRegisterSuccess,
  onRegisterError,
  kcpUrl = 'https://dev.mycoffeeai.com/auth/kcp',
}: KCPRegisterButtonProps) {
  const [verifiedData, setVerifiedData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // KCP postMessage listener
  useEffect(() => {
    const listener = (event: MessageEvent) => {
      const data = event.data;
      if (!data?.type) return;

      if (data.type === 'KCP_DONE') {
        setVerifiedData(data);
        if (onVerificationComplete) {
          onVerificationComplete(data);
        }
      } else if (data.type === 'KCP_FAIL') {
        const errorMsg = data.message || 'Tasdiqlash muvaffaqiyatsiz';
        alert(errorMsg);
        if (onRegisterError) {
          onRegisterError(errorMsg);
        }
      }
    };

    window.addEventListener('message', listener);
    return () => window.removeEventListener('message', listener);
  }, [onVerificationComplete, onRegisterError]);

  // KCP popup ochish
  const openKcpAuth = () => {
    const width = 480;
    const height = 720;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    window.open(
      kcpUrl,
      'kcpAuth',
      `width=${width},height=${height},left=${left},top=${top},resizable=no,scrollbars=no`
    );
  };

  // Register submit
  const handleSubmit = async () => {
    if (!verifiedData?.verified) {
      alert("Iltimos, avval telefon orqali tasdiqlang.");
      return;
    }

    if (!email || !password) {
      alert("Iltimos, email va parolni kiriting.");
      return;
    }

    setIsLoading(true);

    try {
      const body = {
        name: verifiedData.user_name,
        email: email,
        password: password,
        birth_date: verifiedData.birth_day,
        gender: verifiedData.sex_code === '01' ? 'M' : 'F',
        phone_number: verifiedData.phone_number,
        verified: 1,
      };

      const res = await fetch(`${API_CONFIG.BASE_URL}auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const result = await res.json();
      if (res.ok) {
        alert("✅ Ro'yxatdan o'tish muvaffaqiyatli!");
        if (onRegisterSuccess) {
          onRegisterSuccess();
        }
      } else {
        const errorMsg = result.detail || result.message || 'Xatolik yuz berdi';
        alert('❌ ' + errorMsg);
        if (onRegisterError) {
          onRegisterError(errorMsg);
        }
      }
    } catch (error) {
      console.error('Register error:', error);
      const errorMsg = 'Xatolik yuz berdi';
      alert('❌ ' + errorMsg);
      if (onRegisterError) {
        onRegisterError(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isActive = email && password && verifiedData?.verified && !isLoading;

  const handleClick = () => {
    if (isActive) {
      handleSubmit();
    } else if (!verifiedData?.verified) {
      // Agar verification bo'lmasa, KCP popup ochish
      openKcpAuth();
    }
  };

  const isDisabled = true;
  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      className={`btn-primary-empty w-full bg-action-secondary text-action-primary 
        ${isDisabled ? 
            '!cursor-not-allowed !text-icon-disabled !bg-action-disabled' : 
            'cursor-pointer bg-action-secondary text-action-primary'}
        `}
    >
      {isLoading
        ? "등록 중..."
        : '인증 요청'}
    </button>
  );
}

