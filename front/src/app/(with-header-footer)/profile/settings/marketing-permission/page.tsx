"use client";
import ActionSheet from "@/components/ActionSheet";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useHeaderStore } from "@/stores/header-store";
const Bullet = () => (
  <span className="inline-block w-1 h-1  bg-gray-0 rounded-full mr-2 ml-1 translate-y-[-2px]" />
);

const MarketingPermission = () => {
  const [isAgreed, setIsAgreed] = useState(false);

  const { setHeader } = useHeaderStore();

  useEffect(() => {
    setHeader({
      title: "개인정보 마케팅 활용 동의",
      showBackButton: true,
    });
  }, []);

  const handleAgree = () => {
    setIsAgreed(true);
  };

  return (
    <div className="bg-background p-4 pb-0 flex flex-col justify-between h-[calc(100vh-145px)]">
      <div className="bg-white rounded-2xl border border-border-default p-3">
        {/* Title */}
        <h1 className="text-base leading-[20px] font-bold text-gray-0 mb-4">
          개인정보 마케팅 활용 동의
        </h1>

        {/* Top bullet description */}
        <p className="text-xs leading-[18px] mb-4">
          <Bullet />
          마케팅 정보(이벤트·혜택·추천상품)를 푸시·SMS·이메일로 보내드리는 것에
          동의합니다.
        </p>

        {/* 1. 이용 목적 */}
        <section className="mb-4">
          <p className="text-[12px] leading-[16px] font-normal mb-2">
            1. 이용 목적
          </p>
          <ol className="space-y-1 text-[12px] leading-[16px] pl-4">
            <li> a. 신규 서비스 및 이벤트 안내</li>
            <li> b. 할인/프로모션 등 마케팅 정보 제공</li>
            <li> c. 맞춤형 상품 및 서비스 추천</li>
          </ol>
        </section>

        {/* 2. 수단 항목 */}
        <section className="mb-4">
          <p className="text-[12px] leading-[16px] font-normal mb-2">
            2. 수단 항목
          </p>
          <ol className="space-y-1 text-[12px] leading-[16px] pl-4">
            <li> a. 푸시 알림(APP)</li>
            <li> b. 문자메세지(SMS/MMS)</li>
            <li> c. 이메일</li>
          </ol>
        </section>

        {/* 3. 보유 및 이용 기간 */}
        <section className="mb-4">
          <p className="text-[12px] leading-[16px] font-normal mb-2">
            3. 보유 및 이용 기간
          </p>
          <ol className="space-y-1 text-[12px] leading-[16px] pl-4">
            <li> a. 동의일로부터 회원 탈퇴 또는 동의 철회시 까지</li>
            <li> b. 법령에 따른 보존 필요 시 해당 기간 준수</li>
          </ol>
        </section>

        {/* Bottom note */}
        <p className="text-xs leading-[18px]">
          <Bullet />본 동의는 선택 사항으로, 고객님은 이를 거부하실 권리가
          있습니다. 다만, 거부 시 다양한 혜택 및 이벤트 알림을 받아보실 수
          없습니다.
        </p>
      </div>

      {/* Agree Button */}
      <button
        onClick={handleAgree}
        className="w-full mt-auto  py-3 bg-linear-gradient text-white rounded-lg font-bold leading-[24px] mt-auto"
      >
        동의하기
      </button>

      {/* Agree Modal Action sheet*/}
      <ActionSheet isOpen={isAgreed} onClose={() => setIsAgreed(false)}>
        <div className="">
          <p className="text-base leading-[20px] font-bold text-center">
            개인정보 마케팅 활용 동의 안내
          </p>

          <div className="w-42 text-center text-xs leading-[18px] mx-auto my-6">
            전송자 : MyCoffee.Ai
            <br />
            전송매체 : 이메일,SMS,푸시 알림
            <br />
            수신 동의 일시 : 2025년 08월 31일
            <br />
            처리내용 : 수신 동의 처리 완료
          </div>

          <Link
            href="/profile/settings/my-settings"
            className="inline-block text-center w-full mt-auto  py-3 bg-linear-gradient text-white rounded-lg font-bold leading-[24px]"
          >
            확인
          </Link>
        </div>
      </ActionSheet>
    </div>
  );
};

export default MarketingPermission;
