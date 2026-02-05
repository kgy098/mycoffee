"use client";
import Header from "@/components/Header";
import { useHeaderStore } from "@/stores/header-store";
import { useEffect } from "react";

export default function PrivacyTermsPage() {

    const { setHeader } = useHeaderStore();

    useEffect(() => {
        setHeader({
            title: "개인정보 수집 및 약관 동의",
            showBackButton: true,
        });
        sessionStorage.setItem("internal-navigation", "true");
    }, []);

    return (
        <div>
            <Header />
            <div className="p-4">
                <div className="bg-white rounded-2xl border border-border-default p-3">
                    <h1 className="text-base leading-[20px] font-bold text-gray-0 mb-4">
                        개인정보 수집 및 주문 약관 동의
                    </h1>
                    <div className="space-y-4 text-[12px] leading-[16px] text-text-secondary">
                        <ul className="space-y-1 pl-4 list-disc text-xs leading-[18px] font-normal text-text-secondary [&>li]:text-text-secondary [&_li::marker]:text-text-secondary">
                            <li className="">제1조(목적)</li>
                            <ul className="space-y-1 pl-4 list-disc text-xs leading-[18px] font-normal text-text-secondary [&>li]:text-text-secondary [&_li::marker]:text-text-secondary">
                                <li>본 약관은 이용자가 제공하는 개인정보를 바탕으로 시음 요청 및 상품 배송 등 주문 처리 서비스를 제공함에 있어, 개인정보의 수집·이용 목적, 보관 기간, 처리 방식을 명확히 안내하기 위한 것입니다.</li>
                                <li>※ 화면 목적: 시음/주문 요청 완료 및 정보 제공 안내</li>
                            </ul>

                            <li className="mt-5">제2조(수집하는 개인정보 항목)</li>
                            <ul className="space-y-1 pl-4 list-disc text-xs leading-[18px] font-normal text-text-secondary [&>li]:text-text-secondary [&_li::marker]:text-text-secondary">
                                <li>회사는 시음 요청 및 주문 처리에 필요한 최소한의 정보만을 수집합니다.</li>
                                <ol type="i" style={{ listStyleType: "lower-roman" }} className="pl-4">
                                    <li>필수 수집 항목</li>
                                    <ul className="space-y-1 pl-5 list-disc text-xs leading-[18px] font-normal text-text-secondary [&>li]:text-text-secondary [&_li::marker]:text-text-secondary">
                                        <li>이름</li>
                                        <li>휴대폰 번호</li>
                                        <li>주소(우편번호, 상세주소)</li>
                                    </ul>
                                    <li>수집 방법</li>
                                    <ul className="space-y-1 pl-5 list-disc text-xs leading-[18px] font-normal text-text-secondary [&>li]:text-text-secondary [&_li::marker]:text-text-secondary">
                                        <li>이용자가 화면에 직접 입력하는 방식</li>
                                        <li>우편번호 API 연동 시 자동 입력되는 주소 정보</li>
                                    </ul>
                                </ol>

                                <li>수집 정보: 이름, 전화번호, 주소</li>
                                <li>이용 목적: 상품 배송을 위한 고객 식별용</li>
                            </ul>

                            <li className="mt-5">제3조(개인정보의 수집 및 이용 목적)</li>
                            <ul className="space-y-1 pl-4 list-disc text-xs leading-[18px] font-normal text-text-secondary [&>li]:text-text-secondary [&_li::marker]:text-text-secondary">
                                <li>회사는 다음의 목적을 위해 개인정보를 이용합니다:</li>
                                <ol type="i" style={{ listStyleType: "lower-roman" }} className="pl-4">
                                    <li>시음 요청 및 원두 주문 요청의 접수 처리</li>
                                    <li>주문 고객 식별 및 주문 이력 확인</li>
                                    <li>상품 배송 및 배송지 확인</li>
                                    <li>주문 관련 안내 및 서비스 제공</li>
                                    <li>고객 문의 대응 및 AS 처리</li>
                                </ol>
                            </ul>
                            <li className="mt-5">제4조(개인정보 보유 및 이용 기간)</li>
                            <ul className="space-y-1 pl-4 list-disc text-xs leading-[18px] font-normal text-text-secondary [&>li]:text-text-secondary [&_li::marker]:text-text-secondary">
                                <li>회사는 이용자의 개인정보를 수집일로부터 3개월 동안 보관한 후 파기합니다.</li>
                                <li>보관 기간: 수집일로부터 3개월</li>
                                <li>파기 시점: 보관 기간 경과 즉시</li>
                                <li>파기 방법: 전자적 파일은 복구 불가능한 방식으로 삭제</li>
                            </ul>
                            <li className="mt-5">※ 단, 관련 법령에 따라 별도 보관이 필요한 경우 해당 법령의 기간을 따릅니다.</li>
                            <li className="mt-5">제5조(개인정보 제공 및 처리 위탁)</li>

                            <ul className="space-y-1 pl-4 list-disc text-xs leading-[18px] font-normal text-text-secondary [&>li]:text-text-secondary [&_li::marker]:text-text-secondary">
                                <li>회사는 이용자의 개인정보를 제3자에게 제공하지 않습니다. 단, 배송 서비스 제공을 위해 택배사 등 필수 서비스 제공 업체에 한정하여 목적 범위 내에서 위탁할 수 있습니다.</li>
                                <li>위탁 시 회사는 관계 법령에 따라 계약 및 관리·감독을 수행합니다.</li>
                            </ul>
                            <li className="mt-5">제6조(동의 거부권 및 불이익 고지)</li>
                            <ul className="space-y-1 pl-4 list-disc text-xs leading-[18px] font-normal text-text-secondary [&>li]:text-text-secondary [&_li::marker]:text-text-secondary">
                                <li>이용자는 개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있습니다. 다만, 필수항목의 동의를 거부할 경우 시음 요청 및 상품 주문 서비스 이용이 불가능합니다.</li>
                                <li>본 동의는 서비스 제공을 위한 필수 동의입니다.</li>
                            </ul>
                            <li className="mt-5">제7조(이용자의 권리)</li>
                            <ul className="space-y-1 pl-4 list-disc text-xs leading-[18px] font-normal text-text-secondary [&>li]:text-text-secondary [&_li::marker]:text-text-secondary">
                                <li>이용자는 언제든지 본인의 개인정보에 대해 다음 권리를 행사할 수 있습니다.</li>
                                <ol type="i" style={{ listStyleType: "lower-roman" }} className="pl-4">
                                    <li>개인정보 열람 요청</li>
                                    <li>개인정보 정정·삭제 요청</li>
                                    <li>이용 중지 및 파기 요청</li>
                                </ol>
                                <li>요청은 고객센터 또는 이메일을 통해 접수할 수 있습니다.</li>
                            </ul>
                            <li className="mt-5">제8조(개인정보 보호 담당자)</li>
                            <ul className="space-y-1 pl-4 list-disc text-xs leading-[18px] font-normal text-text-secondary [&>li]:text-text-secondary [&_li::marker]:text-text-secondary">
                                <li>회사는 이용자의 개인정보 보호와 관련한 문의 처리를 위해 담당자를 지정하고 있습니다.</li>
                                <ul className="space-y-1 pl-4 list-disc text-xs leading-[18px] font-normal text-text-secondary [&>li]:text-text-secondary [&_li::marker]:text-text-secondary">
                                    <li>담당자: 개인정보 보호책임자</li>
                                    <li>연락처: (추후 기입)</li>
                                </ul>
                            </ul>
                            <li className="mt-5">제9조(약관의 변경)</li>
                            <ul className="space-y-1 pl-4 list-disc text-xs leading-[18px] font-normal text-text-secondary [&>li]:text-text-secondary [&_li::marker]:text-text-secondary">
                                <li>회사는 관련 법령의 제·개정 또는 서비스 변경 등 필요한 경우 본 약관을 변경할 수 있습니다. 변경 시 사유와 내용을 공지합니다.</li>
                            </ul>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}