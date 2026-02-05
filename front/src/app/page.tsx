'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if user has a valid session (token)
    const checkSession = () => {
      try {
        // Check for token in cookies
        const cookies = document.cookie.split(';');
        const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
        
        if (tokenCookie && tokenCookie.split('=')[1]?.trim()) {
          // Token exists - redirect to home
          router.push('/home');
        } else {
          // No token - redirect to login selection
          router.push('/auth/login-select');
        }
      } catch (error) {
        console.error('Session check error:', error);
        router.push('/auth/login-select');
      }
    };

    checkSession();
  }, [router]);

  // Show loading while checking session
  return (
    <div className="h-[100dvh] flex flex-col justify-center items-center">
      <Image
        src="/images/logo.svg"
        alt="My Coffee.Ai"
        className="w-[220px] h-[32px] mb-4 animate-pulse"
        width={220}
        height={32}
      />
      <p className="text-text-secondary text-[14px]">로딩 중...</p>
    </div>
  );
}
