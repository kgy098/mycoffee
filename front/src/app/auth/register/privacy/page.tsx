'use client';

import Header from "@/components/Header";
import { useEffect } from "react";
import { useHeaderStore } from "@/stores/header-store";

export default function PrivacyPolicy() {
  const { setHeader } = useHeaderStore();

  useEffect(() => {
    setHeader({
      title: "개인정보 수집 및 이용 동의",
      showBackButton: true,
    });
  }, [setHeader]);

  return (
    <div className="">
      <Header />
      <div className="p-4 overflow-y-auto h-[calc(100vh-64px)]">
        <div className="text-gray-0 text-[14px] leading-[20px] space-y-4">
          <section>
            <h2 className="font-bold text-[16px] mb-2">1. 개인정보의 수집 및 이용 목적</h2>
            <p className="text-gray-600 mb-2">MyCoffeeAI는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>
            
            <div className="ml-4 space-y-2">
              <div>
                <h3 className="font-semibold text-gray-0 mb-1">가. 회원 가입 및 관리</h3>
                <p className="text-gray-600">회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리, 서비스 부정이용 방지, 각종 고지·통지 목적으로 개인정보를 처리합니다.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-0 mb-1">나. 서비스 제공</h3>
                <p className="text-gray-600">AI 기반 커피 취향 분석, 맞춤형 커피 추천, 커피 구독 서비스 제공, 주문 및 배송, 본인인증, 요금결제·정산을 목적으로 개인정보를 처리합니다.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-0 mb-1">다. 고충처리</h3>
                <p className="text-gray-600">민원인의 신원 확인, 민원사항 확인, 사실조사를 위한 연락·통지, 처리결과 통보 목적으로 개인정보를 처리합니다.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-bold text-[16px] mb-2">2. 수집하는 개인정보의 항목</h2>
            
            <div className="ml-4 space-y-2">
              <div>
                <h3 className="font-semibold text-gray-0 mb-1">가. 필수 수집 항목</h3>
                <ul className="list-disc list-inside text-gray-600 ml-2 space-y-1">
                  <li>이메일 주소</li>
                  <li>비밀번호 (암호화 저장)</li>
                  <li>이름</li>
                  <li>생년월일</li>
                  <li>성별</li>
                  <li>휴대폰 번호</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-0 mb-1">나. 선택 수집 항목</h3>
                <ul className="list-disc list-inside text-gray-600 ml-2 space-y-1">
                  <li>프로필 사진</li>
                  <li>배송지 정보 (주소, 연락처)</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-0 mb-1">다. 서비스 이용과정에서 자동으로 수집되는 정보</h3>
                <ul className="list-disc list-inside text-gray-600 ml-2 space-y-1">
                  <li>IP 주소, 쿠키, 서비스 이용 기록</li>
                  <li>기기 정보 (OS 버전, 디바이스 모델명)</li>
                  <li>커피 취향 분석 결과</li>
                  <li>구매 및 주문 내역</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-bold text-[16px] mb-2">3. 개인정보의 보유 및 이용기간</h2>
            <div className="ml-4 space-y-2 text-gray-600">
              <p>회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.</p>
              
              <div>
                <h3 className="font-semibold text-gray-0 mb-1">가. 회원 가입 및 관리</h3>
                <p>회원 탈퇴 시까지. 다만, 다음의 사유에 해당하는 경우에는 해당 사유 종료 시까지</p>
                <ul className="list-disc list-inside ml-2 mt-1">
                  <li>관계 법령 위반에 따른 수사·조사 등이 진행 중인 경우: 해당 수사·조사 종료 시까지</li>
                  <li>서비스 이용에 따른 채권·채무관계 잔존 시: 해당 채권·채무관계 정산 시까지</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-0 mb-1">나. 전자상거래 관련 법령에 따른 보존</h3>
                <ul className="list-disc list-inside ml-2 space-y-1">
                  <li>계약 또는 청약철회 등에 관한 기록: 5년</li>
                  <li>대금결제 및 재화 등의 공급에 관한 기록: 5년</li>
                  <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년</li>
                  <li>표시·광고에 관한 기록: 6개월</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-bold text-[16px] mb-2">4. 개인정보의 제3자 제공</h2>
            <p className="text-gray-600 mb-2">회사는 정보주체의 개인정보를 제1항(개인정보의 수집 및 이용 목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.</p>
            
            <div className="ml-4 space-y-2">
              <div>
                <h3 className="font-semibold text-gray-0 mb-1">가. 배송 서비스</h3>
                <ul className="list-disc list-inside text-gray-600 ml-2 space-y-1">
                  <li>제공받는 자: 배송업체 (CJ대한통운 등)</li>
                  <li>제공 목적: 상품 배송</li>
                  <li>제공 항목: 이름, 주소, 연락처</li>
                  <li>보유 및 이용기간: 배송 완료 시까지</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-0 mb-1">나. 결제 서비스</h3>
                <ul className="list-disc list-inside text-gray-600 ml-2 space-y-1">
                  <li>제공받는 자: 결제대행사 (KCP 등)</li>
                  <li>제공 목적: 결제 처리</li>
                  <li>제공 항목: 결제 정보, 거래 정보</li>
                  <li>보유 및 이용기간: 전자상거래법에 따른 보존 기간</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-bold text-[16px] mb-2">5. 개인정보 처리의 위탁</h2>
            <p className="text-gray-600 mb-2">회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.</p>
            
            <div className="ml-4">
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>수탁업체: AWS (Amazon Web Services)</li>
                <li>위탁업무: 클라우드 서버 호스팅, 데이터 저장</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="font-bold text-[16px] mb-2">6. 정보주체의 권리·의무 및 행사방법</h2>
            <p className="text-gray-600 mb-2">이용자는 개인정보주체로서 다음과 같은 권리를 행사할 수 있습니다.</p>
            
            <ol className="list-decimal list-inside text-gray-600 ml-2 space-y-1">
              <li>개인정보 열람 요구</li>
              <li>오류 등이 있을 경우 정정 요구</li>
              <li>삭제 요구</li>
              <li>처리정지 요구</li>
            </ol>
            
            <p className="text-gray-600 mt-2">권리 행사는 개인정보 보호법 시행규칙 별지 제8호 서식에 따라 서면, 전자우편 등을 통하여 하실 수 있으며, 회사는 이에 대해 지체없이 조치하겠습니다.</p>
          </section>

          <section>
            <h2 className="font-bold text-[16px] mb-2">7. 개인정보의 파기</h2>
            <div className="ml-4 space-y-2 text-gray-600">
              <p>회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.</p>
              
              <div>
                <h3 className="font-semibold text-gray-0 mb-1">가. 파기절차</h3>
                <p>이용자가 입력한 정보는 목적 달성 후 별도의 DB에 옮겨져(종이의 경우 별도의 서류) 내부 방침 및 기타 관련 법령에 따라 일정기간 저장된 후 혹은 즉시 파기됩니다.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-0 mb-1">나. 파기방법</h3>
                <ul className="list-disc list-inside ml-2 space-y-1">
                  <li>전자적 파일 형태: 복구 및 재생되지 않도록 안전하게 삭제</li>
                  <li>종이 문서: 분쇄기로 분쇄하거나 소각</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-bold text-[16px] mb-2">8. 개인정보 보호책임자</h2>
            <div className="ml-4 text-gray-600">
              <p className="mb-2">회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>
              
              <div className="bg-gray-50 p-3 rounded">
                <p><strong>개인정보 보호책임자</strong></p>
                <p>이메일: privacy@mycoffeeai.com</p>
                <p>전화: 02-1234-5678</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-bold text-[16px] mb-2">9. 개인정보의 안전성 확보조치</h2>
            <p className="text-gray-600 mb-2">회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.</p>
            
            <ol className="list-decimal list-inside text-gray-600 ml-2 space-y-1">
              <li>관리적 조치: 내부관리계획 수립·시행, 정기적 직원 교육</li>
              <li>기술적 조치: 개인정보처리시스템 등의 접근권한 관리, 접근통제시스템 설치, 개인정보의 암호화, 보안프로그램 설치</li>
              <li>물리적 조치: 전산실, 자료보관실 등의 접근통제</li>
            </ol>
          </section>

          <section>
            <h2 className="font-bold text-[16px] mb-2">10. 개인정보 자동 수집 장치의 설치·운영 및 거부</h2>
            <div className="ml-4 space-y-2 text-gray-600">
              <p>회사는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용정보를 저장하고 수시로 불러오는 '쿠키(cookie)'를 사용합니다.</p>
              
              <p>쿠키는 웹사이트를 운영하는데 이용되는 서버가 이용자의 브라우저에게 보내는 소량의 정보이며 이용자의 PC 또는 모바일 기기 내의 저장공간에 저장되기도 합니다.</p>
              
              <p>이용자는 쿠키 설치에 대한 선택권을 가지고 있으며, 웹브라우저 설정을 통해 모든 쿠키를 허용하거나, 쿠키가 저장될 때마다 확인을 거치거나, 모든 쿠키의 저장을 거부할 수 있습니다.</p>
            </div>
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
