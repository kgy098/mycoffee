'use client';

import { TastingOrderItem } from "../page";

interface HistoryCardProps {
    item: TastingOrderItem;
    onClick: () => void;
}

export default function HistoryCard({ item, onClick }: HistoryCardProps) {

    return (
        <div
            onClick={onClick}
            className="bg-white rounded-2xl border border-border-default p-3 pt-4 text-gray-0 cursor-pointer"
        >
            <p className="text-[10px] font-bold leading-[16px] mb-4">{item.cre_dt.replace(/\.\d+/, '').replace('T', ' ').slice(0, 16)}</p>
            {
                !item?.ord_no && (
                    <div className='border border-border-default rounded-2xl px-4 py-3 mb-2 last:mb-0'>
                        <div className="flex justify-between items-center mb-4">
                            <div className={`inline-block px-2 py-0 rounded-sm h-[24px] leading-[22px] ${item?.ord_no?.startsWith("B") ? 'bg-[#28A745]' : 'bg-[#17A2B8]'}`} >
                                <span className={`text-xs font-bold leading-[16px] text-white`} >
                                    {item?.ord_no?.startsWith("B") ? '원두 주문' : '시음'}
                                </span>
                            </div>
                            <span
                                className={`text-xs font-bold leading-[16px] ${item.sts_nm === '결제완료' ? 'text-[#28A745]' : 'text-gray-0'}`}
                            >
                                {item.sts_nm}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-sm font-bold leading-[20px]">
                                {item.cof_nm}
                            </p>
                            <p className="text-sm font-bold leading-[20px]">
                                {item.tst_id}
                            </p>
                        </div>
                    </div>
                )
            }

            {
                item?.details?.length > 0 && (
                    <>        
                        <div className='border border-border-default rounded-2xl px-4 py-3 mb-2 last:mb-0'>
                            <div className="flex justify-between items-center mb-4">
                                <div className={`inline-block px-2 py-0 rounded-sm h-[24px] leading-[22px] ${item?.ord_no?.startsWith("B") ? 'bg-[#28A745]' : 'bg-[#17A2B8]'}`} >
                                    <span className={`text-xs font-bold leading-[16px] text-white`} >
                                        {item?.ord_no?.startsWith("B") ? '원두 주문' : '시음'}
                                    </span>
                                </div>
                                <span
                                    className={`text-xs font-bold leading-[16px] ${item.sts_nm === '결제완료' ? 'text-[#28A745]' : 'text-gray-0'}`}
                                >
                                    {item.sts_nm}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-sm font-bold leading-[20px]">
                                    {item.cof_nm}
                                </p>
                                <p className="text-sm font-bold leading-[20px]">
                                    {item.ord_no}
                                </p>
                            </div>
                            <div className="flex justify-between items-center mt-3">
                                <div>
                                    {
                                        item?.details?.map((detail, index) => (
                                            <div key={index} className="flex items-center gap-1">
                                                <span className='text-[#FFE5BF]'>•</span>
                                                <span className='text-xs leading-[16px] font-normal'>{detail?.grind_dgr_nm}</span>
                                                <span className='text-[#FFE5BF]'>•</span>
                                                <span className='text-xs leading-[16px] font-normal'>{detail?.ord_wgt_nm}</span>
                                                <span className='text-[#FFE5BF]'>•</span>
                                                <span className='text-xs leading-[16px] font-normal'>{detail?.ord_qty}개</span>
                                            </div>
                                        ))
                                    }
                                </div>
                                <p className="text-sm font-bold leading-[20px]">
                                    {Math.floor(item?.details?.reduce((acc, detail) => acc + Number(detail?.ord_amt), 0) || 0).toLocaleString()}원
                                </p>
                            </div>
                        </div>
                    </>
                )
            }
        </div>
    );
}

