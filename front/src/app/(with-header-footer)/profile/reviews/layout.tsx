"use client";
import React, { useEffect, useState } from "react";
import Tabs from "@/components/Tabs";
import { usePathname, useRouter } from "next/navigation";
import { useHeaderStore } from "@/stores/header-store";
import dynamic from "next/dynamic";
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';

// Dynamically import the tab components to avoid SSR issues
const WriteReview = dynamic(() => import("./write-review/page"), { ssr: false });
const History = dynamic(() => import("./history/page"), { ssr: false });

const tabs = [
  { id: 1, label: "리뷰작성 (5)", value: "write-review" },
  { id: 2, label: "리뷰내역 (10)", value: "history" },
];

export default function ReviewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState('write-review');
  const [swiper, setSwiper] = useState<any>(null);
  
  const isMainTabRoute = () => {
    const mainRoutes = ['/profile/reviews/write-review', '/profile/reviews/history'];
    // Also include history/[id] routes
    return mainRoutes.some(route => pathname === route) || pathname.startsWith('/profile/reviews/history/');
  };

  // Get current tab from pathname
  const getCurrentTab = () => {
    if (pathname.includes('write-review')) return 'write-review';
    if (pathname.includes('history')) return 'history';
    return 'write-review'; // default
  };

  // Get the index of current tab
  const getTabIndex = (tab: string) => {
    return tabs.findIndex(t => t.value === tab);
  };

  useEffect(() => {
    const tabFromPath = getCurrentTab();
    if (tabFromPath !== currentTab) {
      setCurrentTab(tabFromPath);
      // Update swiper slide when pathname changes
      if (swiper && isMainTabRoute()) {
        const index = getTabIndex(tabFromPath);
        swiper.slideTo(index);
        // Update height after slide change
        setTimeout(() => {
          if (swiper && swiper.updateAutoHeight) {
            swiper.updateAutoHeight();
          }
        }, 50);
      }
    }
  }, [pathname]);

  // Update swiper when it's ready
  useEffect(() => {
    if (swiper) {
      const tabFromPath = getCurrentTab();
      const index = getTabIndex(tabFromPath);
      swiper.slideTo(index);
    }
  }, [swiper]);

  const handleTabChange = (tab: string) => {
    if (tab === currentTab) return;
    
    setCurrentTab(tab);
    
    // Update URL using useRouter
    router.push(`/profile/reviews/${tab}`, { scroll: false });
    
    // Update swiper slide
    if (swiper) {
      const index = getTabIndex(tab);
      swiper.slideTo(index);
      
      // Update height after slide change
      setTimeout(() => {
        if (swiper && swiper.updateAutoHeight) {
          swiper.updateAutoHeight();
        }
      }, 100);
    }
  };

  const handleSwiperSlideChange = (swiper: any) => {
    const activeIndex = swiper.activeIndex;
    const newTab = tabs[activeIndex];
    
    if (newTab && newTab.value !== currentTab) {
      setCurrentTab(newTab.value);
      // Update URL using useRouter
      router.push(`/profile/reviews/${newTab.value}`, { scroll: false });
    }
    
    // Update swiper height when slide changes
    setTimeout(() => {
      if (swiper && swiper.updateAutoHeight) {
        swiper.updateAutoHeight();
      }
    }, 100);
  };

  const { setHeader } = useHeaderStore();

  useEffect(() => {
    setHeader({
      title: "내 리뷰",
    });
  }, []);

  // If we're on a sub-route (write-review detail or history detail), render in layout
  if (!isMainTabRoute()) {
    return <div className="flex-1 overflow-y-auto">{children}</div>;
  }

  // Check if we're on a history detail page
  const isHistoryDetail = pathname.startsWith('/profile/reviews/history/');

  return (
    <div>
      <div className="bg-background mt-4 mb-4 px-4">
        <Tabs
          tabs={tabs}
          activeTab={currentTab}
          onTabChange={handleTabChange}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 overflow-y-auto h-[calc(100vh-226px)]">
        {isHistoryDetail ? (
          // If on history detail page, render children directly
          <div>{children}</div>
        ) : (
          // Otherwise use Swiper for tab switching
          <Swiper
            onSwiper={setSwiper}
            onSlideChange={handleSwiperSlideChange}
            initialSlide={getTabIndex(currentTab)}
            modules={[FreeMode]}
            spaceBetween={0}
            slidesPerView={1}
            allowTouchMove={true}
            resistance={true}
            resistanceRatio={0.85}
            speed={300}
            autoHeight={true}
            updateOnWindowResize={true}
            observer={true}
            observeParents={true}
          >
            <SwiperSlide>
              <div>
                <WriteReview />
              </div>
            </SwiperSlide>
            
            <SwiperSlide>
              <div>
                <History />
              </div>
            </SwiperSlide>
          </Swiper>
        )}
      </div>
    </div>
  );
}
