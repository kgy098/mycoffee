"use client"

import Image from "next/image";
import Link from "next/link";
import KakaoTalkLoginButton from "./login-buttons/kakaoLoginButton";

export default function LoginSelect() {

  return (
    <>
      {/* Main Content */}
      <div className="h-[100dvh] flex-1 flex flex-col justify-center items-center px-4 pb-8">
        {/* Logo and Title */}
        <div className="my-auto text-center w-full">
          <Image
            src="/images/logo.svg"
            alt="My Coffee.Ai"
            className="w-[220px] h-[32px] mb-3 mx-auto"
            width={220}
            height={32}
          />
          <p className="mb-10 text-[14px]">
            나만의 커피를 찾는 가장 똑똑한 방법
          </p>
          {/* CTA Button */}
          <KakaoTalkLoginButton />
          
          <Link href="#" className="btn-primary-empty w-full text-center mb-2 !bg-[#03C75A] !text-white flex items-center justify-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
              <g clipPath="url(#clip0_1267_5584)">
                <path d="M14.0614 10.7033L6.64609 0H0.5V20H6.93861V9.295L14.3539 20H20.5V0H14.0614V10.7033Z" fill="white" />
              </g>
              <defs>
                <clipPath id="clip0_1267_5584">
                  <rect width="20" height="20" fill="white" transform="translate(0.5)" />
                </clipPath>
              </defs>
            </svg>
            네이버로 계속하기
          </Link>
          <Link href="#" className="btn-primary-empty w-full text-center mb-2 !bg-[#111827] !text-white flex items-center justify-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="22" viewBox="0 0 19 22" fill="none">
              <path d="M18.1227 16.6534C17.7996 17.4 17.417 18.0872 16.9738 18.7191C16.3697 19.5804 15.8751 20.1766 15.4938 20.5077C14.9029 21.0512 14.2698 21.3295 13.5917 21.3453C13.105 21.3453 12.518 21.2068 11.8348 20.9259C11.1492 20.6462 10.5192 20.5077 9.94321 20.5077C9.33907 20.5077 8.69115 20.6462 7.99811 20.9259C7.30402 21.2068 6.74486 21.3532 6.31735 21.3678C5.66718 21.3955 5.01913 21.1092 4.37226 20.5077C3.95939 20.1476 3.44297 19.5303 2.82433 18.6557C2.16057 17.7218 1.61488 16.6389 1.18737 15.4042C0.729518 14.0707 0.5 12.7793 0.5 11.5291C0.5 10.097 0.809453 8.86178 1.42928 7.82671C1.91642 6.9953 2.56447 6.33946 3.37557 5.85799C4.18666 5.37653 5.06305 5.13119 6.00684 5.11549C6.52326 5.11549 7.20047 5.27523 8.04204 5.58917C8.88123 5.90416 9.42006 6.0639 9.65631 6.0639C9.83293 6.0639 10.4315 5.87712 11.4463 5.50475C12.4059 5.15941 13.2158 5.01643 13.8793 5.07275C15.6772 5.21785 17.0279 5.92659 17.9262 7.20345C16.3183 8.17771 15.5229 9.54229 15.5387 11.2928C15.5532 12.6564 16.0479 13.791 17.02 14.6919C17.4606 15.1101 17.9526 15.4333 18.5 15.6628C18.3813 16.0071 18.256 16.3368 18.1227 16.6534ZM13.9993 0.427514C13.9993 1.49624 13.6089 2.4941 12.8306 3.41771C11.8915 4.51571 10.7555 5.15018 9.52361 5.05006C9.50791 4.92185 9.49881 4.78691 9.49881 4.64511C9.49881 3.61914 9.94545 2.52114 10.7386 1.62338C11.1346 1.16883 11.6382 0.790878 12.2489 0.489377C12.8583 0.192375 13.4348 0.0281268 13.9769 0C13.9927 0.142872 13.9993 0.285752 13.9993 0.4275V0.427514Z" fill="#F9FAFB" />
            </svg>
            Apple로 계속하기
          </Link>
          
          <Link href="/auth/login" className="btn-primary-empty bg-white w-full block text-center text-[#1F2937] border-solid border-[1px] border-[#E5E7EB] hover:border-[#1F2937]">
            이메일로 계속하기
          </Link>
          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E6E6E6]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-[18px] bg-[#F9FAFB] text-text-secondary text-[12px] py-[1px] leading-[160%]">또는</span>
            </div>
          </div>

          <Link 
            href="/analysis" 
            className="text-[14px] text-text-secondary hover:text-text-primary font-bold my-[14px]"
          >
            먼저 둘러보기
          </Link>
        </div>

      </div>
    </>
  );
}
