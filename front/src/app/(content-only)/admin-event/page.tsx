'use client';

import Image from "next/image";
import Link from "next/link";

export default function AdminEventHome() {
  return (
    <>
      <div className="h-[100dvh] flex-1 flex flex-col justify-center items-center px-4 pb-10">
        <div className="my-auto text-center w-full">  
          <Image
            src="/images/logo.svg"
            alt="My Coffee.Ai"
            className="w-[220px] h-[32px] mb-3 mx-auto"
            width={220}
            height={32}
          />
          <p className="mb-12 text-[14px] text-gray-0 leading-[20px]">행사용 관리자 화면</p>
          <Link href="/admin-event/requests" className="btn-primary w-full block text-center mb-3">시음 요청</Link>
          <Link href="/admin-event/order-history" className="btn-primary w-full block text-center">주문 접수</Link>
        </div>

      </div>
    </>
  );
}
