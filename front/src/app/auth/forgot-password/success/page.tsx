'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterSuccess() {
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Animation trigger
        setTimeout(() => setIsVisible(true), 100);
    }, []);

    const handleContinue = () => {
        router.push('/auth/login-select');
    };

    return (
        <div className="h-[100dvh] flex flex-col px-4 pb-10">
            {/* Success Content */}
            <div className="flex-1 flex flex-col items-center justify-center my-auto">
                {/* Success Icon with Animation */}
                <svg className='mb-16' xmlns="http://www.w3.org/2000/svg" width="112" height="112" viewBox="0 0 112 112" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M56 112C86.9279 112 112 86.9279 112 56C112 25.0721 86.9279 0 56 0C25.0721 0 0 25.0721 0 56C0 86.9279 25.0721 112 56 112ZM81.9497 46.9497C84.6834 44.2161 84.6834 39.7839 81.9497 37.0503C79.2161 34.3166 74.7839 34.3166 72.0502 37.0503L49 60.1005L39.9497 51.0502C37.2161 48.3166 32.7839 48.3166 30.0503 51.0502C27.3166 53.7839 27.3166 58.2161 30.0503 60.9497L44.0503 74.9497C46.7839 77.6834 51.2161 77.6834 53.9497 74.9497L81.9497 46.9497Z" fill="#28A745" />
                </svg>

                {/* Success Text with Animation */}
                <div
                    className={`text-center mb-12 transition-all duration-1000 ease-out delay-300 ${isVisible
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-8'
                        }`}
                >
                    <h1 className="text-[20px] font-bold text-gray-0 mb-2">
                        비밀번호 재설정이 완료되었습니다.
                    </h1>
                </div>

            </div>
            {/* Continue Button with Animation */}
            <div
                className={`w-full transition-all duration-1000 ease-out delay-500 ${isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                    }`}
            >
                <button
                    onClick={handleContinue}
                    className="w-full btn-primary duration-200"
                >
                    로그인
                </button>
            </div>
        </div>
    );
}
