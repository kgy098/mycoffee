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
const CoffeeStoryMain = dynamic(() => import("./coffee-story-main/page"), { ssr: false });
const EventMain = dynamic(() => import("./event-main/page"), { ssr: false });
const CoffeeTipMain = dynamic(() => import("./coffee-tip-main/page"), { ssr: false });

const tabs = [
  { id: 1, label: "커피스토리", value: "coffee-story-main" },
  { id: 2, label: "이벤트", value: "event-main" },
  { id: 3, label: "커피 꿀팁", value: "coffee-tip-main" },
];

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState('coffee-story-main');
  const [swiper, setSwiper] = useState<any>(null);
  
  const isMainTabRoute = () => {
    const mainRoutes = ['/community/coffee-story-main', '/community/event-main', '/community/coffee-tip-main'];
    return mainRoutes.some(route => pathname === route);
  };

  // Get current tab from pathname
  const getCurrentTab = () => {
    if (pathname.includes("coffee-story-main")) return "coffee-story-main";
    if (pathname.includes("event-main")) return "event-main";
    if (pathname.includes("coffee-tip-main")) return "coffee-tip-main";
    return "coffee-story-main"; // default
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
    router.push(`/community/${tab}`, { scroll: false });
    
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
      router.push(`/community/${newTab.value}`, { scroll: false });
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
      title: tabs.find(tab => tab.value === currentTab)?.label,
    });
  }, [currentTab]);

  // If we're on a sub-route, just render children
  if (!isMainTabRoute()) {
    return <div className="flex-1 overflow-y-auto">{children}</div>;
  }

  return (
    <div className="w-full">
      <div className="bg-background mt-4 mb-4 px-4">
        <Tabs
          tabs={tabs}
          activeTab={currentTab}
          onTabChange={handleTabChange}
        />
      </div>

      {/* Main Content with Swiper */}
      <div className="flex-1 overflow-y-auto h-[calc(100vh-226px)]">
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
              <CoffeeStoryMain />
            </div>
          </SwiperSlide>
          
          <SwiperSlide>
            <div>
              <EventMain />
            </div>
          </SwiperSlide>
          
          <SwiperSlide>
            <div>
              <CoffeeTipMain />
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
}
