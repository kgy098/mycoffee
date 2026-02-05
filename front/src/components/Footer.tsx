import Image from "next/image";
import Link from "next/link";

const Footer = () => {
    return (
        <div className="pb-3 text-gray-0">
            <div className="bg-white p-4">
                <div className="mx-auto">
                    {/* Company Name */}
                    {/* <h3 className="text-base font-bold mb-2.5 leading-[125%]">MyCoffee.Ai</h3> */}
                    <Image
                        src="/images/logo.svg"
                        alt="My Coffee.Ai"
                        className="w-[137.5px] h-[20px] mb-4"
                        width={137.5}
                        height={20}
                    />
                    
                    {/* Company Information */}
                    <div className="space-y-3 text-[12px] font-normal leading-[150%]">
                        <div className="flex items-center gap-2">
                            <div className="flex justify-center items-center size-8 rounded-full bg-[rgba(0,0,0,0.05)]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 12 12" fill="none">
                                    <path d="M6 5H6.005" stroke="#62402D" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M6 7H6.005" stroke="#62402D" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M6 3H6.005" stroke="#62402D" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M7.99997 5H8.00497" stroke="#62402D" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M7.99997 7H8.00497" stroke="#62402D" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M7.99997 3H8.00497" stroke="#62402D" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M4.00003 5H4.00503" stroke="#62402D" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M4.00003 7H4.00503" stroke="#62402D" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M4.00003 3H4.00503" stroke="#62402D" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M4.5 11V9.5C4.5 9.36739 4.55268 9.24021 4.64645 9.14645C4.74021 9.05268 4.86739 9 5 9H7C7.13261 9 7.25979 9.05268 7.35355 9.14645C7.44732 9.24021 7.5 9.36739 7.5 9.5V11" stroke="#62402D" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M8.99997 1H2.99997C2.44768 1 1.99997 1.44772 1.99997 2V10C1.99997 10.5523 2.44768 11 2.99997 11H8.99997C9.55225 11 9.99997 10.5523 9.99997 10V2C9.99997 1.44772 9.55225 1 8.99997 1Z" stroke="#62402D" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        <p>(주)아로마빌 커피</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex justify-center items-center size-8 rounded-full bg-[rgba(0,0,0,0.05)]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M12.6667 14V12.6667C12.6667 11.9594 12.3857 11.2811 11.8856 10.781C11.3855 10.281 10.7073 10 10 10H6.00002C5.29277 10 4.6145 10.281 4.1144 10.781C3.6143 11.2811 3.33335 11.9594 3.33335 12.6667V14" stroke="#62402D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M8.00002 7.33333C9.47278 7.33333 10.6667 6.13943 10.6667 4.66667C10.6667 3.19391 9.47278 2 8.00002 2C6.52726 2 5.33335 3.19391 5.33335 4.66667C5.33335 6.13943 6.52726 7.33333 8.00002 7.33333Z" stroke="#62402D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        <p>대표 : 노환걸</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex justify-center items-center size-8 rounded-full bg-[rgba(0,0,0,0.05)]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <g clip-path="url(#clip0_3213_12193)">
                                        <path d="M11.4285 5.71449C11.4285 8.56764 8.26337 11.5391 7.20051 12.4568C7.10149 12.5312 6.98097 12.5715 6.85708 12.5715C6.7332 12.5715 6.61267 12.5312 6.51365 12.4568C5.45079 11.5391 2.28565 8.56764 2.28565 5.71449C2.28565 4.50208 2.76728 3.33932 3.62459 2.48201C4.4819 1.6247 5.64466 1.14307 6.85708 1.14307C8.0695 1.14307 9.23226 1.6247 10.0896 2.48201C10.9469 3.33932 11.4285 4.50208 11.4285 5.71449Z" stroke="#62402D" strokeWidth="1.14286" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M6.85712 7.42857C7.80389 7.42857 8.5714 6.66106 8.5714 5.71429C8.5714 4.76751 7.80389 4 6.85712 4C5.91034 4 5.14283 4.76751 5.14283 5.71429C5.14283 6.66106 5.91034 7.42857 6.85712 7.42857Z" stroke="#62402D" strokeWidth="1.14286" strokeLinecap="round" strokeLinejoin="round" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_3213_12193">
                                            <rect width="13.7143" height="13.7143" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </div>
                        <p>18530 경기도 화성시 팔탄면 서해로987번길 23 (주)아로마빌커피</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex justify-center items-center size-8 rounded-full bg-[rgba(0,0,0,0.05)]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M9.99998 1.3335H3.99998C3.64636 1.3335 3.30722 1.47397 3.05717 1.72402C2.80712 1.97407 2.66665 2.31321 2.66665 2.66683V13.3335C2.66665 13.6871 2.80712 14.0263 3.05717 14.2763C3.30722 14.5264 3.64636 14.6668 3.99998 14.6668H12C12.3536 14.6668 12.6927 14.5264 12.9428 14.2763C13.1928 14.0263 13.3333 13.6871 13.3333 13.3335V4.66683L9.99998 1.3335Z" stroke="#62402D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M9.33334 1.3335V4.00016C9.33334 4.35378 9.47382 4.69292 9.72387 4.94297C9.97392 5.19302 10.3131 5.3335 10.6667 5.3335H13.3333" stroke="#62402D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M6.66668 6H5.33335" stroke="#62402D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M10.6667 8.6665H5.33335" stroke="#62402D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M10.6667 11.3335H5.33335" stroke="#62402D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <p>122-81-68406</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex justify-center items-center size-8 rounded-full bg-[rgba(0,0,0,0.05)]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <g clip-path="url(#clip0_3213_12208)">
                                        <path d="M9.22135 11.0455C9.35904 11.1087 9.51415 11.1232 9.66115 11.0865C9.80814 11.0497 9.93824 10.964 10.03 10.8435L10.2667 10.5335C10.3909 10.3679 10.5519 10.2335 10.7371 10.1409C10.9222 10.0484 11.1264 10.0002 11.3334 10.0002H13.3334C13.687 10.0002 14.0261 10.1406 14.2762 10.3907C14.5262 10.6407 14.6667 10.9799 14.6667 11.3335V13.3335C14.6667 13.6871 14.5262 14.0263 14.2762 14.2763C14.0261 14.5264 13.687 14.6668 13.3334 14.6668C10.1508 14.6668 7.09851 13.4025 4.84807 11.1521C2.59763 8.90167 1.33335 5.84943 1.33335 2.66683C1.33335 2.31321 1.47383 1.97407 1.72388 1.72402C1.97392 1.47397 2.31306 1.3335 2.66668 1.3335H4.66668C5.02031 1.3335 5.35944 1.47397 5.60949 1.72402C5.85954 1.97407 6.00002 2.31321 6.00002 2.66683V4.66683C6.00002 4.87382 5.95182 5.07797 5.85925 5.26311C5.76668 5.44825 5.63228 5.6093 5.46668 5.7335L5.15468 5.9675C5.0323 6.06095 4.94603 6.19389 4.91054 6.34373C4.87506 6.49357 4.89254 6.65108 4.96002 6.7895C5.87114 8.64007 7.36963 10.1367 9.22135 11.0455Z" stroke="#62402D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_3213_12208">
                                            <rect width="16" height="16" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </div>
                            <p>070-7721-8181</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex justify-center items-center size-8 rounded-full bg-[rgba(0,0,0,0.05)]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M10.6667 6.6665C10.6667 7.37375 10.3857 8.05203 9.88564 8.55212C9.38554 9.05222 8.70726 9.33317 8.00002 9.33317C7.29277 9.33317 6.6145 9.05222 6.1144 8.55212C5.6143 8.05203 5.33335 7.37375 5.33335 6.6665" stroke="#62402D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M2.0687 4.02246H13.9314" stroke="#62402D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M2.26667 3.64483C2.09357 3.87562 2 4.15634 2 4.44483V13.3335C2 13.6871 2.14048 14.0263 2.39052 14.2763C2.64057 14.5264 2.97971 14.6668 3.33333 14.6668H12.6667C13.0203 14.6668 13.3594 14.5264 13.6095 14.2763C13.8595 14.0263 14 13.6871 14 13.3335V4.44483C14 4.15634 13.9064 3.87562 13.7333 3.64483L12.4 1.86683C12.2758 1.70123 12.1148 1.56683 11.9296 1.47426C11.7445 1.38169 11.5403 1.3335 11.3333 1.3335H4.66667C4.45967 1.3335 4.25552 1.38169 4.07038 1.47426C3.88524 1.56683 3.7242 1.70123 3.6 1.86683L2.26667 3.64483Z" stroke="#62402D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <p>제 2018-화성팔탄-0052호</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex justify-center items-center size-8 rounded-full bg-[rgba(0,0,0,0.05)]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M14.6667 4.6665L8.67268 8.4845C8.46928 8.60265 8.23824 8.66487 8.00302 8.66487C7.76779 8.66487 7.53675 8.60265 7.33335 8.4845L1.33335 4.6665" stroke="#62402D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M13.3334 2.6665H2.66668C1.9303 2.6665 1.33335 3.26346 1.33335 3.99984V11.9998C1.33335 12.7362 1.9303 13.3332 2.66668 13.3332H13.3334C14.0697 13.3332 14.6667 12.7362 14.6667 11.9998V3.99984C14.6667 3.26346 14.0697 2.6665 13.3334 2.6665Z" stroke="#62402D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <p>aromaville@aromaville.co.kr</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex justify-center items-center size-8 rounded-full bg-[rgba(0,0,0,0.05)]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M16.6667 10.8335C16.6667 15.0002 13.75 17.0835 10.2833 18.2919C10.1018 18.3534 9.90462 18.3505 9.725 18.2835C6.25 17.0835 3.33334 15.0002 3.33334 10.8335V5.00021C3.33334 4.7792 3.42113 4.56724 3.57741 4.41096C3.73369 4.25468 3.94566 4.16688 4.16667 4.16688C5.83334 4.16688 7.91667 3.16688 9.36667 1.90021C9.54321 1.74938 9.7678 1.6665 10 1.6665C10.2322 1.6665 10.4568 1.74938 10.6333 1.90021C12.0917 3.17521 14.1667 4.16688 15.8333 4.16688C16.0543 4.16688 16.2663 4.25468 16.4226 4.41096C16.5789 4.56724 16.6667 4.7792 16.6667 5.00021V10.8335Z" stroke="#62402D" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M5.31333 15.7582C5.66893 14.8017 6.30868 13.9769 7.14668 13.3945C7.98469 12.8122 8.98081 12.5002 10.0013 12.5005C11.0218 12.5008 12.0177 12.8133 12.8554 13.3961C13.6931 13.9788 14.3324 14.804 14.6875 15.7607" stroke="#62402D" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M10 12.5002C11.8409 12.5002 13.3333 11.0078 13.3333 9.16683C13.3333 7.32588 11.8409 5.8335 10 5.8335C8.15905 5.8335 6.66666 7.32588 6.66666 9.16683C6.66666 11.0078 8.15905 12.5002 10 12.5002Z" stroke="#62402D" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <p>노환결 (aromaville@aromaville.co.kr)</p>
                        </div>
                    </div>
                    <svg className="my-2" xmlns="http://www.w3.org/2000/svg" width="361" height="1" viewBox="0 0 361 1" fill="none">
                        <path d="M0 0.5H361" stroke="#E6E6E6" />
                    </svg>
                    <p className="text-text-secondary text-[10px] font-normal leading-[16px] text-center mb-2">Copyright ⓒ MyCoffee.AI All Rights Reserved.</p>
                    <div className="flex justify-between items-center gap-2">
                        <Link href={'#'} className="text-[10px] font-normal leading-[16px] py-2.5 text-[#3182F6] w-1/2 text-center">이용약관</Link>
                        <Link href={'#'} className="text-[10px] font-normal leading-[16px] py-2.5 text-[#3182F6] w-1/2 text-center">개인정보취급방침</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
