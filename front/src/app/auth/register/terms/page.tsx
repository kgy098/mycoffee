'use client';

import Header from "@/components/Header";
import { useEffect } from "react";
import { useHeaderStore } from "@/stores/header-store";

export default function TermsOfService() {
  const { setHeader } = useHeaderStore();

  useEffect(() => {
    setHeader({
      title: "이용약관",
      showBackButton: true,
    });
  }, [setHeader]);

  return (
    <div className="">
      <Header />
      <div className="p-4 overflow-y-auto h-[calc(100vh-64px)]">
        <div className="text-gray-0 text-[14px] leading-[20px] space-y-4">
          <section>
            <h2 className="font-bold text-[16px] mb-2">제1조 (목적)</h2>
            <p className="text-gray-600">
              본 약관은 MyCoffeeAI(이하 "회사")가 제공하는 커피 추천 서비스 및 관련 제반 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-[16px] mb-2">제2조 (정의)</h2>
            <p className="text-gray-600 mb-2">본 약관에서 사용하는 용어의 정의는 다음과 같습니다.</p>
            <ol className="list-decimal list-inside space-y-1 text-gray-600 ml-2">
              <li>"서비스"란 회사가 제공하는 AI 기반 커피 취향 분석 및 커피 추천, 구독 서비스 등을 의미합니다.</li>
              <li>"이용자"란 본 약관에 따라 회사가 제공하는 서비스를 이용하는 회원 및 비회원을 말합니다.</li>
              <li>"회원"이란 회사와 서비스 이용계약을 체결하고 이용자 아이디(ID)를 부여받은 자를 말합니다.</li>
              <li>"비회원"이란 회원으로 가입하지 않고 회사가 제공하는 서비스를 이용하는 자를 말합니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="font-bold text-[16px] mb-2">제3조 (약관의 효력 및 변경)</h2>
            <ol className="list-decimal list-inside space-y-1 text-gray-600 ml-2">
              <li>본 약관은 서비스 화면에 게시하거나 기타의 방법으로 공지함으로써 효력이 발생합니다.</li>
              <li>회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 본 약관을 변경할 수 있으며, 변경된 약관은 제1항과 같은 방법으로 공지함으로써 효력이 발생합니다.</li>
              <li>회원은 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단하고 이용계약을 해지할 수 있습니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="font-bold text-[16px] mb-2">제4조 (서비스의 제공 및 변경)</h2>
            <ol className="list-decimal list-inside space-y-1 text-gray-600 ml-2">
              <li>회사는 다음과 같은 서비스를 제공합니다:
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>AI 기반 커피 취향 분석 서비스</li>
                  <li>개인 맞춤형 커피 추천 서비스</li>
                  <li>커피 구독 서비스</li>
                  <li>커피 관련 콘텐츠 제공</li>
                  <li>기타 회사가 추가 개발하거나 제휴계약 등을 통해 회원에게 제공하는 일체의 서비스</li>
                </ul>
              </li>
              <li>회사는 운영상, 기술상의 필요에 따라 제공하고 있는 서비스를 변경할 수 있습니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="font-bold text-[16px] mb-2">제5조 (서비스 이용계약의 성립)</h2>
            <ol className="list-decimal list-inside space-y-1 text-gray-600 ml-2">
              <li>이용계약은 이용자가 본 약관에 동의하고 회원가입을 신청한 후, 회사가 이를 승낙함으로써 체결됩니다.</li>
              <li>회사는 다음 각 호에 해당하는 경우 회원가입을 승낙하지 않을 수 있습니다:
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>타인의 명의를 사용한 경우</li>
                  <li>허위 정보를 기재한 경우</li>
                  <li>사회의 안녕과 질서 또는 미풍양속을 저해할 목적으로 신청한 경우</li>
                  <li>기타 회사가 정한 이용신청 요건이 미비한 경우</li>
                </ul>
              </li>
            </ol>
          </section>

          <section>
            <h2 className="font-bold text-[16px] mb-2">제6조 (회원정보의 변경)</h2>
            <p className="text-gray-600">
              회원은 개인정보관리를 통해 언제든지 본인의 개인정보를 열람하고 수정할 수 있습니다. 회원은 이용신청 시 기재한 사항이 변경되었을 경우 온라인으로 수정하거나 기타 방법으로 회사에 대하여 그 변경사항을 알려야 합니다.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-[16px] mb-2">제7조 (개인정보의 보호)</h2>
            <p className="text-gray-600">
              회사는 관련 법령이 정하는 바에 따라 회원의 개인정보를 보호하기 위해 노력합니다. 개인정보의 보호 및 사용에 대해서는 관련 법령 및 회사의 개인정보처리방침이 적용됩니다.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-[16px] mb-2">제8조 (회원의 의무)</h2>
            <ol className="list-decimal list-inside space-y-1 text-gray-600 ml-2">
              <li>회원은 다음 행위를 하여서는 안 됩니다:
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>신청 또는 변경 시 허위내용의 등록</li>
                  <li>타인의 정보도용</li>
                  <li>회사가 게시한 정보의 변경</li>
                  <li>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</li>
                  <li>회사 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
                  <li>회사 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
                  <li>외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 서비스에 공개 또는 게시하는 행위</li>
                </ul>
              </li>
            </ol>
          </section>

          <section>
            <h2 className="font-bold text-[16px] mb-2">제9조 (서비스 이용의 제한)</h2>
            <p className="text-gray-600">
              회사는 회원이 본 약관의 의무를 위반하거나 서비스의 정상적인 운영을 방해한 경우, 경고, 일시정지, 영구이용정지 등으로 서비스 이용을 단계적으로 제한할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-[16px] mb-2">제10조 (면책조항)</h2>
            <ol className="list-decimal list-inside space-y-1 text-gray-600 ml-2">
              <li>회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.</li>
              <li>회사는 회원의 귀책사유로 인한 서비스 이용의 장애에 대하여는 책임을 지지 않습니다.</li>
              <li>회사는 회원이 서비스를 이용하여 기대하는 수익을 상실한 것에 대하여 책임을 지지 않으며, 그 밖의 서비스를 통하여 얻은 자료로 인한 손해에 관하여 책임을 지지 않습니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="font-bold text-[16px] mb-2">제11조 (분쟁해결)</h2>
            <ol className="list-decimal list-inside space-y-1 text-gray-600 ml-2">
              <li>회사는 이용자로부터 제출되는 불만사항 및 의견을 우선적으로 처리합니다.</li>
              <li>본 약관에 명시되지 않은 사항은 전기통신기본법, 전기통신사업법 및 기타 관련법령의 규정에 따릅니다.</li>
            </ol>
          </section>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-gray-600 text-[12px]">시행일: 2026년 2월 3일</p>
          </div>
        </div>
      </div>
    </div>
  );
}
