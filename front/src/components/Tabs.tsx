"use client";

import React, { useRef, useEffect, useState } from "react";

type TabsProps = {
  tabs: { id?: number; label: string; value: string }[];
  activeTab: string;
  onTabChange: (tab: string) => void;
};

const Tabs = ({ tabs, activeTab, onTabChange }: TabsProps) => {
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update indicator position when activeTab changes
  useEffect(() => {
    const activeIndex = tabs.findIndex((tab) => tab.value === activeTab);
    const activeTabElement = tabRefs.current[activeIndex];

    if (activeTabElement && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const tabRect = activeTabElement.getBoundingClientRect();

      setIndicatorStyle({
        left: tabRect.left - containerRect.left,
        width: tabRect.width,
      });
    }
  }, [activeTab, tabs]);

  return (
    <div ref={containerRef} className="relative flex items-center justify-center gap-x-3 w-full">
      {/* Sliding indicator - positioned at the very bottom */}
      <div
        className="absolute h-0.5 bg-action-primary transition-all duration-300 ease-out"
        style={{
          left: `${indicatorStyle.left}px`,
          width: `${indicatorStyle.width}px`,
          bottom: "0px", // Position at the very bottom
        }}
      />
      {tabs.map((tab, i: number) => (
        <div
          ref={(el) => {
            tabRefs.current[i] = el;
          }}
          className="relative w-full justify-center text-sm cursor-pointer transition-all duration-200 ease-out flex items-center"
          style={{ height: "38px" }} // Exact height as per design
          key={tab.id || i}
          onClick={() => onTabChange(tab.value)}
        >
          <span
            className={`text-sm font-bold transition-colors duration-200 ease-out ${
              activeTab === tab.value
                ? "text-action-primary"
                : "text-text-secondary"
            }`}
          >
            {tab.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Tabs;
