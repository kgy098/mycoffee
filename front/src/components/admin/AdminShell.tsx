 "use client";
 
 import React from "react";
 import Link from "next/link";
 import { usePathname } from "next/navigation";
 
 type NavItem = {
   label: string;
   href: string;
 };
 
 type NavSection = {
   title: string;
   items: NavItem[];
 };
 
 const navigation: NavSection[] = [
   {
     title: "회원관리",
     items: [
       { label: "회원 리스트", href: "/admin/members" },
       { label: "회원 등록", href: "/admin/members/new" },
     ],
   },
   {
     title: "상품관리",
     items: [
       { label: "커피 상품", href: "/admin/products" },
       { label: "상품 등록", href: "/admin/products/new" },
       { label: "판매 통계", href: "/admin/sales" },
     ],
   },
   {
     title: "추천관리",
     items: [{ label: "취향 분석 항목", href: "/admin/score-scales" }],
   },
   {
     title: "주문/결제 관리",
     items: [
       { label: "주문 내역", href: "/admin/orders" },
       { label: "결제/환불 내역", href: "/admin/payments" },
     ],
   },
   {
     title: "배송 관리",
     items: [{ label: "배송 현황", href: "/admin/shipments" }],
   },
   {
     title: "구독 서비스 관리",
     items: [
       { label: "구독 상품", href: "/admin/subscriptions" },
       { label: "구독 회원 관리", href: "/admin/subscriptions/members" },
       { label: "결제/배송/해지 관리", href: "/admin/subscriptions/management" },
     ],
   },
   {
     title: "리뷰/커뮤니티 관리",
     items: [
       { label: "리뷰 모니터링", href: "/admin/reviews" },
       { label: "게시글 관리", href: "/admin/posts" },
     ],
   },
   {
     title: "리워드/포인트 관리",
     items: [
       { label: "포인트 적립/사용", href: "/admin/points" },
       { label: "이벤트 리워드", href: "/admin/rewards/events" },
     ],
   },
   {
     title: "운영자 관리",
     items: [
       { label: "관리자 계정", href: "/admin/admins" },
       { label: "접근 로그", href: "/admin/access-logs" },
     ],
   },
 ];
 
 const titleMap: Array<{ prefix: string; title: string; subtitle?: string }> = [
   { prefix: "/admin/members", title: "회원관리", subtitle: "회원 리스트 및 정보 관리" },
   { prefix: "/admin/products", title: "상품관리", subtitle: "커피 상품 정보 관리" },
   { prefix: "/admin/sales", title: "판매 통계", subtitle: "매출 및 성과 지표" },
   { prefix: "/admin/score-scales", title: "취향 분석 항목", subtitle: "추천 기준 설정" },
   { prefix: "/admin/orders", title: "주문 내역", subtitle: "주문 및 처리 현황" },
   { prefix: "/admin/payments", title: "결제/환불", subtitle: "결제 상태 및 환불" },
   { prefix: "/admin/shipments", title: "배송 관리", subtitle: "배송 현황 및 처리" },
   { prefix: "/admin/subscriptions", title: "구독 서비스", subtitle: "구독 상품 및 회원" },
   { prefix: "/admin/reviews", title: "리뷰 모니터링", subtitle: "리뷰 품질 관리" },
   { prefix: "/admin/posts", title: "게시글 관리", subtitle: "커뮤니티 게시글" },
   { prefix: "/admin/points", title: "포인트 관리", subtitle: "적립/사용 내역" },
   { prefix: "/admin/rewards", title: "이벤트 리워드", subtitle: "리워드 지급 현황" },
   { prefix: "/admin/admins", title: "운영자 관리", subtitle: "관리자 계정 및 권한" },
   { prefix: "/admin/access-logs", title: "접근 로그", subtitle: "관리자 접속 기록" },
   { prefix: "/admin", title: "대시보드", subtitle: "전체 운영 현황" },
 ];
 
 function resolveTitle(pathname: string | null) {
   if (!pathname) {
     return { title: "관리자", subtitle: "" };
   }
 
   const match = titleMap.find((item) => pathname.startsWith(item.prefix));
   return match ?? { title: "관리자", subtitle: "" };
 }
 
 export default function AdminShell({ children }: { children: React.ReactNode }) {
   const pathname = usePathname();
   const { title, subtitle } = resolveTitle(pathname);
 
   return (
     <div className="min-h-screen bg-[#0f0f0f] text-neutral-100">
       <div className="flex min-h-screen">
         <aside className="w-[250px] border-r border-white/10 bg-[#121212] px-4 py-6">
           <div className="mb-8">
             <p className="text-lg font-semibold text-white">MyCoffee.AI</p>
             <p className="text-xs text-white/50">관리자 콘솔</p>
           </div>
           <nav className="space-y-6 text-sm">
             {navigation.map((section) => (
               <div key={section.title}>
                 <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/40">
                   {section.title}
                 </p>
                 <div className="space-y-1">
                   {section.items.map((item) => {
                     const isActive =
                       pathname === item.href ||
                       (item.href !== "/admin" && pathname?.startsWith(item.href));
                     return (
                       <Link
                         key={item.href}
                         href={item.href}
                         className={`block rounded-lg px-3 py-2 text-sm transition ${
                           isActive
                             ? "bg-white/10 text-white"
                             : "text-white/70 hover:bg-white/5 hover:text-white"
                         }`}
                       >
                         {item.label}
                       </Link>
                     );
                   })}
                 </div>
               </div>
             ))}
           </nav>
         </aside>
 
         <div className="flex flex-1 flex-col bg-[#101010]">
           <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
             <div>
               <p className="text-xs text-white/50">MyCoffee.AI Admin</p>
               <p className="text-xl font-semibold text-white">{title}</p>
               {subtitle && <p className="text-xs text-white/40">{subtitle}</p>}
             </div>
             <div className="flex items-center gap-3 text-sm text-white/70">
               <span className="rounded-full bg-white/10 px-3 py-1 text-xs">
                 운영중
               </span>
               <span>admin@mycoffee.ai</span>
             </div>
           </header>
           <main className="flex-1 px-6 py-6">{children}</main>
         </div>
       </div>
     </div>
   );
 }
