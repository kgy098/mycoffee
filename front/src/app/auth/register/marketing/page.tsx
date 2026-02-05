'use client';

import Header from "@/components/Header";
import { useEffect } from "react";
import { useHeaderStore } from "@/stores/header-store";

export default function MarketingConsent() {
  const { setHeader } = useHeaderStore();

  useEffect(() => {
    setHeader({
      title: "개인정보 마케팅 활용 동의",
      showBackButton: true,
    });
  }, [setHeader]);

  return (
    <div className="">
      <Header />
      <div className="p-4 overflow-y-auto h-[calc(100vh-64px)]">
        <div className="text-gray-0 text-[14px] leading-[20px] space-y-4">
          <section>
            <p className="text-gray-600 mb-4">
              마케팅 정보의 수신 및 개인정보 활용에 대해 SMS·이메일로 보내드리는 것에 동의합니다.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-[16px] mb-2">1. 이용 목적</h2>
            <div className="ml-4 space-y-2">
              <div>
                <h3 className="font-semibold text-gray-0 mb-1">가. 신규 서비스 및 이벤트 안내</h3>
                <ul className="list-disc list-inside text-gray-600 ml-2 space-y-1">
                  <li>할인쿠폰 및 이벤트 정보 안내</li>
                  <li>맞춤형 상품 및 서비스 추천</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-0 mb-1">나. 광고성 정보 전달 및 서비스 홍보</h3>
                <ul className="list-disc list-inside text-gray-600 ml-2 space-y-1">
                  <li>문자메시지(SMS/MMS) 통한 정보 전송</li>
                  <li>푸시 알림(APP)을 통한 정보 전송</li>
                  <li>이메일 통한 정보 전송</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-bold text-[16px] mb-2">2. 수집 항목</h2>
            <p className="text-gray-600 mb-2">마케팅 정보 제공을 위해 다음의 정보를 활용합니다.</p>
            
            <div className="ml-4">
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>문자 알림(APP): 휴대폰 번호</li>
                <li>푸시 알림(APP): 기기 토큰 정보, 동의 여부 정보</li>
                <li>이메일: 이메일 주소</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="font-bold text-[16px] mb-2">3. 보관 및 이용 기간</h2>
            <div className="ml-4 text-gray-600 space-y-2">
              <div>
                <h3 className="font-semibold text-gray-0 mb-1">가. 동의일로부터 회원 탈퇴 시 또는 동의 철회 시까지</h3>
                <p>마케팅 동의를 철회하시면 해당 정보를 파기하며, 동의 철회 후에는 마케팅 정보를 받으실 수 없습니다.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-0 mb-1">나. 법령에 따른 보존의무가 있는 경우 해당 기간까지</h3>
                <p>전자상거래 등에서의 소비자 보호에 관한 법률, 통신비밀보호법 등 관련 법령에 따른 보존 의무가 있는 경우 해당 기간 동안 보관합니다.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-bold text-[16px] mb-2">4. 동의 거부권 및 불이익</h2>
            <div className="ml-4 text-gray-600 space-y-2">
              <p>
                본 동의는 거부하실 수 있습니다. 다만, 거부 시 다양한 이벤트 및 할인 정보, 개인 맞춤형 상품 추천 등의 마케팅 정보 안내 서비스를 받으실 수 없습니다.
              </p>
            </div>
          </section>

          <section className="bg-orange-50 p-4 rounded-lg">
            <h2 className="font-bold text-[16px] mb-2 text-orange-600">※ 본 동의는 선택사항입니다</h2>
            <p className="text-gray-600 text-[13px]">
              본 동의를 거부하셔도 서비스 가입 및 이용이 가능하나, 거부 시 다양한 이벤트 및 할인 정보, 개인 맞춤형 상품 추천 등의 마케팅 정보 안내 서비스 이용에 제한이 있을 수 있습니다.
            </p>
          </section>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-gray-600 text-[12px]">공고일자: 2026년 2월 3일</p>
            <p className="text-gray-600 text-[12px]">시행일자: 2026년 2월 3일</p>
          </div>
        </div>
      </div>
    </div>
  );
}
