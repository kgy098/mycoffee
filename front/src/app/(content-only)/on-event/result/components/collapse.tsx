import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const OnEventResultCollapse = () => {

    const [openItems, setOpenItems] = useState<number[]>([0]);

    const accordionItems = [
        {
            id: 0,
            title: "AI 추천 원두, 럭키박스로 먼저 만나보세요",
        }
    ];

    const toggleItem = (id: number) => {
        setOpenItems(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    return (
        <div>
            <div className="space-y-[26px]">
                {accordionItems.map((item, index) => (
                    <div key={item.id} className="overflow-hidden pl-[10px] pr-[9px]">
                        <div className="pr-[6px]">
                            <button
                                type="button"
                                onClick={() => toggleItem(item.id)}
                                className="r-4 flex items-center justify-between w-full py-0 font-medium text-gray-500 rounded-lg transition-colors duration-200 cursor-pointer"
                            >
                                <div className="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M20 6L9 17L4 12" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <p className="flex items-center mt-[3px] text-gray-0 text-base font-bold leading-[125%]">{item.title}</p>
                                </div>
                                <svg
                                    className={`shrink-0 transition-transform duration-200 ${openItems.includes(item.id) ? '' : 'rotate-180'
                                        }`}
                                    xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8" fill="none">
                                    <path d="M10.5 6.5L6 1.5L1.5 6.5" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>

                        <div
                            className={`transition-all duration-300 ease-in-out ${openItems.includes(item.id)
                                ? 'max-h-[2000px] opacity-100'
                                : 'max-h-0 opacity-0'
                                }`}
                        >
                            <div className="pt-3">
                                {item.id === 0 ? (
                                    <Link href="/on-event/detail">
                                        <Image 
                                            src="/images/event-add.png" 
                                            alt="collapse" 
                                            className="w-full" 
                                            width={360} 
                                            height={600} 
                                        />
                                    </Link>
                                ) : null}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default OnEventResultCollapse;