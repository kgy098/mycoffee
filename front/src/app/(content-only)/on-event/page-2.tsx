'use client';

import Image from "next/image";
import Link from "next/link";

export default function OnEventHome() {
  return (
    <>
      <div className="h-dvh flex-1 flex flex-col justify-center items-center px-4 pb-10">
        <div className="my-auto text-center">  
          <Image
            src="/images/logo.svg"
            alt="My Coffee.Ai"
            className="w-[220px] h-[32px] mb-3
            "
            width={220}
            height={32}
          />
          <p className="mb-16 text-[14px] text-gray-0 leading-[20px]">
            나만의 커피 취향을 찾아볼까요?
          </p>
        </div>

        <Link href="/on-event/analysis" className="btn-primary w-full block text-center">
          취향 분석 시작
        </Link>
      </div>
    </>
  );
}