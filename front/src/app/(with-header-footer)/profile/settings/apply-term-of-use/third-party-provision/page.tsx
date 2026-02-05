"use client";
import { useHeaderStore } from "@/stores/header-store";
import React, { useEffect } from "react";
const ThirdPartyProvision = () => {
  const { setHeader } = useHeaderStore();

  useEffect(() => {
    setHeader({
      title: "구매 조건 및 개인정보 제3자 제공",
      showBackButton: true,
    });
  }, []);

  return (
    <div className="p-4" >
      <div className="bg-white rounded-2xl border border-border-default p-3">
        {/* Title */}
        <h1 className="text-base leading-[20px] font-bold text-gray-0 mb-4">
          구매 조건 및 개인정보 제3자 제공
        </h1>

        {/* 1. 일반 원칙 */}
        <section className="mb-4">
          <p className="text-[12px] leading-[16px] font-normal mb-2">
            1. 일반 원칙
          </p>
          <ol className="space-y-1 text-[12px] leading-[16px] pl-4 list-disc">
            <li>
              본 환불 및 교환 정책은 「전자상거래 등에서의 소비자보호에 관한
              법률」에 근거합니다.
            </li>
            <li>
              커스텀(맞춤) 제작 제품 특성상, 단순 변심으로 인한 환불 및 교환은
              불가합니다.
            </li>
            <li>
              단, 제품 하자, 오배송, 품질 문제와 같이 당사의 귀책 사유가 있는
              경우 환불 및 교환을 진행합니다.
            </li>
          </ol>
        </section>

        {/* 2. 환불/교환이 가능한 경우 */}
        <section className="mb-4">
          <p className="text-[12px] leading-[16px] font-normal mb-2">
            2. 환불/교환이 가능한 경우
          </p>
          <ol className="space-y-1 text-[12px] leading-[16px] pl-4 list-disc">
            <li>
              상품 하자 발생: 로스팅 불량, 포장 불량, 이물질 혼입 등 품질 문제가
              확인된 경우
            </li>
            <li>
              오배송: 주문한 원두 종류, 분쇄도, 중량과 다른 상품이 배송된 경우
            </li>
            <li> 배송 중 파손: 제품 파손 또는 심각한 손상 발생 시</li>
            <li>
              위 사유 발생 시, 제품 수령 후 7일 이내 고객센터로 접수해야 합니다.
            </li>
          </ol>
        </section>

        {/* 3. 환불/교환이 불가능한 경우*/}
        <section className="mb-4">
          <p className="text-[12px] leading-[16px] font-normal mb-2">
            3. 환불/교환이 불가능한 경우
          </p>
          <ol className="space-y-1 text-[12px] leading-[16px] pl-4 list-disc">
            <li> 맞춤 제작 특성상 단순 변심 또는 개인의 기호 차이</li>
            <li>
              상품을 개봉·섭취한 경우 (단, 하자가 명백히 입증된 경우 제외)
            </li>
            <li> 고객의 보관 부주의로 인한 변질, 훼손</li>
            <li> 수령 후 7일 이상 경과한 경우</li>
          </ol>
        </section>

        {/* 4. 환불 절차*/}
        <section className="mb-4">
          <p className="text-[12px] leading-[16px] font-normal mb-2">
            4. 환불 절차
          </p>
          <ol className="space-y-1 text-[12px] leading-[16px] pl-4">
            <li>a. 고객센터(전화, 이메일, 채팅 등)를 통해 환불 신청</li>
            <li>b. 하자 또는 오배송 확인 후, 반품 회수 절차 진행</li>
            <li>
              c. 반품 확인 후, 결제 취소 또는 환불 (영업일 기준 5~7일 소요)
            </li>
          </ol>
        </section>

        {/* 5. 교환 절차 */}
        <section className="mb-4">
          <p className="text-[12px] leading-[16px] font-normal mb-2">
            5. 교환 절차
          </p>
          <ol className="space-y-1 text-[12px] leading-[16px] pl-4 list-disc">
            <li>동일 제품 재제작 및 재발송 원칙</li>
            <li>
              재제작 기간은 평균 2~3영업일 소요될 수 있으며, 원두의 특성상
              로스팅 스케줄에 따라 변동될 수 있음
            </li>
          </ol>
        </section>

        {/* 6. 배송비 정책*/}
        <section className="mb-4">
          <p className="text-[12px] leading-[16px] font-normal mb-2">
            6. 환불 절차
          </p>
          <ol className="space-y-1 text-[12px] leading-[16px] pl-4 list-disc">
            <li>당사 귀책 사유(하자, 오배송 등): 왕복 배송비 전액 당사 부담</li>
            <li>고객 귀책 사유: 환불/교환 불가</li>
          </ol>
        </section>

        {/* 7. 개인정보 제3자 제공 안내*/}
        <section className="mb-4">
          <p className="text-[12px] leading-[16px] font-normal mb-2">
            7.개인정보 제3자 제공 안내
          </p>
          <ol className="space-y-1 text-[12px] leading-[16px] pl-4 list-disc">
            <li>
              고객님의 결제 및 주문 처리와 관련하여 아래와 같이 개인정보가
              제3자(결제 대행사)에게 제공됩니다.
            </li>
            <li>제공받는 자: 토스페이먼츠 주식회사</li>
            <li>제공 목적: 결제 승인, 결제 처리, 환불 처리</li>
            <li>
              제공 항목: 이름, 휴대전화번호, 이메일, 결제 정보(카드사명,
              승인번호 등)
            </li>
            <li>
              보유 및 이용 기간: 관련 법령에 따른 의무 보관기간 동안 보유 후
              파기
            </li>
            <li>
              당사는 원활한 결제 및 환불 처리 이외의 목적으로 개인정보를
              제공하지 않습니다.
            </li>
          </ol>
        </section>

        {/* 8. 고객센터 안내*/}
        <section className="mb-4">
          <p className="text-[12px] leading-[16px] font-normal mb-2">
            8. 고객센터 안내
          </p>
          <ol className="space-y-1 text-[12px] leading-[16px] pl-4 list-disc">
            <li>
              문의 접수: 아로마빌 고객센터 (전화: 070-7721-8181 / 이메일:
              aromaville@aromaville.co.kr)
            </li>
            <li>상담 가능 시간: 평일 09:00 ~ 18:00 (주말·공휴일 제외)</li>
          </ol>
        </section>
      </div>
    </div>
  );
};

export default ThirdPartyProvision;
