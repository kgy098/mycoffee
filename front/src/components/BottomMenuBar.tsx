'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import './BottomMenuBar.css';

const homeIcon = (fill: string = '#B3B3B3') => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <g clipPath="url(#clip0_1784_5452)">
        <path d="M7.71432 0.857422H2.57146C1.62469 0.857422 0.857178 1.62493 0.857178 2.57171V7.71456C0.857178 8.66134 1.62469 9.42885 2.57146 9.42885H7.71432C8.66109 9.42885 9.42861 8.66134 9.42861 7.71456V2.57171C9.42861 1.62493 8.66109 0.857422 7.71432 0.857422Z" stroke={fill} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M21.4287 0.857422H16.2858C15.339 0.857422 14.5715 1.62493 14.5715 2.57171V7.71456C14.5715 8.66134 15.339 9.42885 16.2858 9.42885H21.4287C22.3754 9.42885 23.143 8.66134 23.143 7.71456V2.57171C23.143 1.62493 22.3754 0.857422 21.4287 0.857422Z" stroke={fill} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7.71432 14.5723H2.57146C1.62469 14.5723 0.857178 15.3398 0.857178 16.2866V21.4294C0.857178 22.3762 1.62469 23.1437 2.57146 23.1437H7.71432C8.66109 23.1437 9.42861 22.3762 9.42861 21.4294V16.2866C9.42861 15.3398 8.66109 14.5723 7.71432 14.5723Z" stroke={fill} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M21.4287 14.5723H16.2858C15.339 14.5723 14.5715 15.3398 14.5715 16.2866V21.4294C14.5715 22.3762 15.339 23.1437 16.2858 23.1437H21.4287C22.3754 23.1437 23.143 22.3762 23.143 21.4294V16.2866C23.143 15.3398 22.3754 14.5723 21.4287 14.5723Z" stroke={fill} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </g>
    <defs>
        <clipPath id="clip0_1784_5452">
            <rect width="24" height="24" fill="white" />
        </clipPath>
    </defs>
</svg>;

const editIcon = (fill: string = '#B3B3B3') => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <g clipPath="url(#clip0_1784_5460)">
        <path d="M12 15.429L6.85718 16.3547L7.71432 11.1433L17.5372 1.35474C17.6965 1.19406 17.8861 1.06653 18.095 0.979497C18.3039 0.892465 18.528 0.847656 18.7543 0.847656C18.9806 0.847656 19.2047 0.892465 19.4136 0.979497C19.6225 1.06653 19.8121 1.19406 19.9715 1.35474L21.7886 3.17188C21.9493 3.33125 22.0768 3.52085 22.1638 3.72975C22.2509 3.93865 22.2957 4.16272 22.2957 4.38902C22.2957 4.61533 22.2509 4.8394 22.1638 5.0483C22.0768 5.2572 21.9493 5.4468 21.7886 5.60617L12 15.429Z" stroke={fill} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20.5715 16.2868V21.4297C20.5715 21.8843 20.3908 22.3204 20.0694 22.6419C19.7479 22.9634 19.3118 23.144 18.8572 23.144H2.57146C2.11681 23.144 1.68077 22.9634 1.35928 22.6419C1.03779 22.3204 0.857178 21.8843 0.857178 21.4297V5.14397C0.857178 4.68932 1.03779 4.25328 1.35928 3.93179C1.68077 3.6103 2.11681 3.42969 2.57146 3.42969H7.71432" stroke={fill} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </g>
    <defs>
        <clipPath id="clip0_1784_5460">
            <rect width="24" height="24" fill="white" />
        </clipPath>
    </defs>
</svg>

const globalIcon = (fill: string = '#B3B3B3') => <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none">
    <path d="M13 25C19.6274 25 25 19.6274 25 13C25 6.37258 19.6274 1 13 1C6.37258 1 1 6.37258 1 13C1 19.6274 6.37258 25 13 25Z" stroke={fill} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M1 13H25" stroke={fill} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M17.615 13C17.3883 17.3883 15.772 21.5908 12.9997 25C10.2273 21.5908 8.61098 17.3883 8.38428 13C8.61098 8.61171 10.2273 4.4092 12.9997 1C15.772 4.4092 17.3883 8.61171 17.615 13V13Z" stroke={fill} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
</svg>

const profileIcon = (fill: string = '#B3B3B3') => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 20 20" fill="none">
    <path d="M10 12.0986C11.4482 12.0987 12.8722 12.4714 14.1348 13.1807C15.3973 13.8899 16.4565 14.9117 17.21 16.1484C17.4255 16.5022 17.3127 16.9642 16.959 17.1797C16.6053 17.3949 16.1441 17.2823 15.9287 16.9287C15.3092 15.9119 14.4385 15.0715 13.4004 14.4883C12.3621 13.905 11.1909 13.5987 10 13.5986C8.80911 13.5986 7.6379 13.905 6.59961 14.4883C5.56151 15.0715 4.69083 15.9119 4.07129 16.9287C3.85578 17.2824 3.39378 17.3952 3.04004 17.1797C2.68642 16.9641 2.57457 16.5021 2.79004 16.1484C3.54348 14.9117 4.60266 13.8899 5.86523 13.1807C7.12786 12.4714 8.55179 12.0986 10 12.0986Z" fill={fill} />
    <path fillRule="evenodd" clipRule="evenodd" d="M9.99902 2.09668C12.5373 2.09668 14.5955 4.1542 14.5957 6.69238C14.5957 9.23077 12.5374 11.2891 9.99902 11.2891C7.46084 11.2888 5.40332 9.23062 5.40332 6.69238C5.40356 4.15435 7.461 2.09692 9.99902 2.09668ZM9.99902 3.59668C8.28942 3.59692 6.90356 4.98278 6.90332 6.69238C6.90332 8.40219 8.28927 9.78882 9.99902 9.78906C11.709 9.78906 13.0957 8.40234 13.0957 6.69238C13.0955 4.98263 11.7088 3.59668 9.99902 3.59668Z" fill={fill} />
    <path fillRule="evenodd" clipRule="evenodd" d="M17 0C18.6569 0 20 1.34315 20 3V17C20 18.6051 18.7394 19.9158 17.1543 19.9961L17 20H3L2.8457 19.9961C1.31166 19.9184 0.0816253 18.6883 0.00390625 17.1543L0 17V3C0 1.34315 1.34315 6.44255e-08 3 0H17ZM3 1.5C2.17157 1.5 1.5 2.17157 1.5 3V17C1.5 17.8284 2.17157 18.5 3 18.5H17C17.8284 18.5 18.5 17.8284 18.5 17V3C18.5 2.17157 17.8284 1.5 17 1.5H3Z" fill={fill} />
</svg>

const BottomMenuBar = () => {
    const pathname = usePathname();
    const [bouncingItem, setBouncingItem] = useState<string | null>(null);

    // URL'larda boxShadow bo'lmasligi kerak
    const shouldShowShadow = !(
        pathname.includes('/my-coffee/monthly-coffee/detail') ||
        pathname.includes('/my-coffee/taste-analysis/ready') ||
        pathname.includes('/my-coffee/monthly-coffee') ||
        pathname.includes('/review-main') ||
        pathname.includes('/review-analysys') ||
        (pathname.startsWith('/my-coffee/collection/') && pathname !== '/my-coffee/collection')
    );

    const isActive = (path: string) => {
        if (path === '/') {
            return pathname === '/';
        }
        return pathname.startsWith(path);
    };

    const handleItemClick = (itemName: string) => {
        // Clear any existing animation first
        setBouncingItem(null);

        // Use requestAnimationFrame to ensure the state is cleared before setting new animation
        requestAnimationFrame(() => {
            setBouncingItem(itemName);
            setTimeout(() => {
                setBouncingItem(null);
            }, 800); // Match animation duration (0.8s)
        });
    };

    return (
        <div className={`mt-auto navbar-menu h-[91px]`}>
            <div className={`fixed bottom-0 w-full sm:max-w-sm z-10`}>
                <div className="bg-[#fff] fixed bottom-0 w-full sm:max-w-sm z-10 -mt-4" style={{ boxShadow: shouldShowShadow ? "0 -1px 2px 0 rgba(0,0,0,0.04)" : "none" }}>
                    <div className="flex items-start justify-between w-full px-[15px] pb-2 pt-[10.5px]">
                        <div className='flex items-center w-[calc((100%-80px)/2)]'>
                            {/* Home */}
                            <Link
                                href="/home"
                                onClick={() => handleItemClick('home')}
                                className={`navbar-menu-item w-[50%] text-center flex flex-col items-center cursor-pointer ${isActive('/home') ? 'active' : ''} ${bouncingItem === 'home' ? '' : ''}`}
                            >
                                {homeIcon(isActive('/home') ? "#4E2A18" : "#B3B3B3")}
                                <span className={`navbar-menu-text font-normal !text-[12px] leading-[16px] mt-1 text-[#6E6E6E]`}>홈</span>
                            </Link>

                            {/* edit */}
                            <Link
                                href="/review-main"
                                onClick={() => handleItemClick('review')}
                                className={`navbar-menu-item w-[50%] text-center flex flex-col items-center cursor-pointer ${isActive('/review-main') ? 'active' : ''} ${bouncingItem === 'review' ? 'bounce' : ''}`}
                            >
                                {editIcon(isActive('/review-main') ? "#4E2A18" : "#B3B3B3")}
                                <span className={`navbar-menu-text font-normal !text-[12px] leading-[16px] mt-1 text-[#6E6E6E]`}>리뷰</span>
                            </Link>
                        </div>
                        <Link
                            href="/my-coffee"
                            onClick={() => handleItemClick('my-coffee')}
                            className={`w-[80px] text-center flex-shrink-0 flex-col items-center justify-center gap-3 rounded-full ${bouncingItem === 'my-coffee' ? 'bounce' : ''}`}
                        >
                            <div className="navbar-menu-main-item mx-auto mb-[5px] cursor-pointer flex items-center justify-center bg-action-primary rounded-full w-[44px] h-[44px]" style={{ boxShadow: "0 4px 12px 0 rgba(78,42,24,0.50)" }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M7.76676 4.17931C7.62154 3.85314 7.49595 3.35045 8.15139 3.0473C8.72441 2.77869 9.53293 2.69043 10.3807 2.69043C11.4561 2.70194 12.555 2.9552 13.6147 3.43103C14.6744 3.90686 15.6753 4.59758 16.5583 5.46097C17.4414 6.32437 18.1911 7.34893 18.7641 8.47327C19.3371 9.5976 19.7217 10.7987 19.8944 12.0074C20.0671 13.2162 20.0279 14.4134 19.7767 15.5263C19.5255 16.6391 19.0427 17.5984 18.4305 18.4963C18.0929 18.9453 17.7044 19.3482 17.2766 19.6897C16.6486 20.1924 15.8676 20.1003 15.4672 19.2983L11.7033 11.9077L7.76676 4.17931Z" fill="white" />
                                    <path d="M12.3156 16.0711C12.504 16.4434 12.5393 16.735 11.9388 17.0266C11.2442 17.3605 10.4278 17.4027 9.61928 17.395C8.54388 17.3835 7.44493 17.1302 6.38523 16.6544C5.32553 16.1786 4.32471 15.4879 3.44162 14.6245C2.55854 13.7611 1.8089 12.7365 1.23588 11.6122C0.662857 10.4878 0.278226 9.28676 0.105534 8.07801C-0.0671579 6.86925 -0.0279098 5.67201 0.223278 4.55919C0.474466 3.44637 0.929744 2.43715 1.56949 1.58911C1.94235 1.09409 2.37015 0.660474 2.84898 0.295929C3.41808 -0.137688 4.07744 -0.153037 4.45815 0.645125L8.29269 8.17778L12.3117 16.075L12.3156 16.0711Z" fill="white" />
                                </svg>
                            </div>
                            <span className="!text-[12px] leading-[18px] inline-block">내 커피</span>
                        </Link>
                        <div className='flex items-center w-[calc((100%-80px)/2)]'>
                            {/* globus */}
                            <Link
                                href="/community"
                                onClick={() => handleItemClick('community')}
                                className={`navbar-menu-item w-[50%] text-center flex flex-col items-center cursor-pointer ${isActive('/community') ? 'active' : ''} ${bouncingItem === 'community' ? 'bounce' : ''}`}
                            >
                                {globalIcon(isActive('/community') ? "#4E2A18" : "#B3B3B3")}
                                <span className={`navbar-menu-text font-normal !text-[12px] leading-[16px] mt-1 text-[#6E6E6E] text-nowrap`}>커뮤니티</span>
                            </Link>

                            {/* Profile */}
                            <Link
                                href="/profile"
                                onClick={() => handleItemClick('profile')}
                                className={`navbar-menu-item w-[50%] text-center flex flex-col items-center cursor-pointer ${isActive('/profile') ? 'active' : ''} ${bouncingItem === 'profile' ? 'bounce' : ''}`}
                            >
                                {profileIcon(isActive('/profile') ? "#4E2A18" : "#B3B3B3")}
                                <span className={`navbar-menu-text font-normal !text-[12px] leading-[16px] mt-1 text-[#6E6E6E]`}>MY</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BottomMenuBar;