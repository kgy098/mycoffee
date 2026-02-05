'use client';

import { useState } from 'react';
import Tabs from './Tabs';
import MonthlyCoffeeTab from './MonthlyCoffeeTab';
import MyCollectionTab from './MyCollectionTab';

const MyCoffeeSummary = () => {
    const [currentTab, setCurrentTab] = useState('monthly-coffee');

    const tabs = [
        { id: 1, label: "이달의 커피", value: "monthly-coffee" },
        { id: 2, label: "내 커피 컬렉션", value: "my-collection" },
    ];

    const handleTabChange = (tab: string) => {
        if (tab === currentTab) return;

        setCurrentTab(tab);
    };

    return (
        <div className={`mb-3 bg-background-sub text-gray-0 py-3`}>
            <div className="flex items-center justify-between mb-3 pr-6 pl-4">
                <div className='w-[176px]'>
                    <Tabs
                        tabs={tabs}
                        activeTab={currentTab}
                        onTabChange={handleTabChange}
                    />
                </div>
                <svg className='cursor-pointer' xmlns="http://www.w3.org/2000/svg" width="8" height="12" viewBox="0 0 8 12" fill="none">
                    <path d="M1.5 10.5L6.5 6L1.5 1.5" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
            {currentTab === 'my-collection' ? (
                <MyCollectionTab />
            ) : (
                <MonthlyCoffeeTab />
            )}
        </div>
    );
};

export default MyCoffeeSummary;