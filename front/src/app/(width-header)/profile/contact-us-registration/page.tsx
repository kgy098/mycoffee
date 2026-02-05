"use client";

import ActionSheet from "@/components/ActionSheet";
import { useHeaderStore } from "@/stores/header-store";
import { useEffect, useState } from "react";


const ContactUsRegistration = () => {
    const [images, setImages] = useState<string[]>([]);
    const [imageCount, setImageCount] = useState(0);
    const [textareaValue, setTextareaValue] = useState("");
    const [registerModalIsOpen, setRegisterModalIsOpen] = useState(false);
    const [registerSuccessModalIsOpen, setRegisterSuccessModalIsOpen] = useState(false);
    const maxImages = 3;

    const { setHeader } = useHeaderStore();

    useEffect(() => {
        setHeader({
            title: "문의하기", 
        });
    }, []);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const newImages: string[] = [];
            for (let i = 0; i < Math.min(files.length, maxImages - imageCount); i++) {
                const file = files[i];
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (e.target?.result) {
                        newImages.push(e.target.result as string);
                        if (newImages.length === Math.min(files.length, maxImages - imageCount)) {
                            setImages(prev => [...prev, ...newImages]);
                            setImageCount(prev => prev + newImages.length);
                        }
                    }
                };
                reader.readAsDataURL(file);
            }
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setImageCount(prev => prev - 1);
    };

    const statuses = ["디카페인", "그라인드", "벌크", "250g", "2개"]
    return (
        <div className="p-4 text-gray-0 flex flex-col h-full">
            <h3 className="text-sm font-bold leading-[20px] mb-3">문의 상품</h3>
            <div className="border border-border-default rounded-2xl p-3 bg-white mb-4">
                <span className="text-xs w-max font-bold bg-[#C97A50] text-white px-2 py-1 mb-3 rounded-sm h-[24px] flex items-center justify-center">
                    단품
                </span>
                <h3 className="text-sm font-bold mb-[12px]">
                    나만의 커피 1호기 (클래식 하모니 블랜드)
                </h3>
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-1">
                        {statuses.map((detail: string, index: number) => (
                            <span key={index} className="text-[12px] text-text-secondary flex items-center gap-1">
                                {detail}
                                {index < statuses.length - 1 && <span className="text-brand-secondary-accent-sub w-1 h-1 rounded-full flex items-center">•</span>}
                            </span>
                        ))}
                    </div>
                    <span className="text-sm font-bold leading-[142%]">36,000원</span>
                </div>
            </div>

            <h3 className="text-base font-bold leading-[20px] mb-3">상품에 대해 문의사항을 작성해주세요.</h3>
            <div className="relative mb-4">
                <textarea
                    rows={10}
                    value={textareaValue}
                    onChange={(e) => setTextareaValue(e.target.value)}
                    maxLength={300}
                    className="bg-white placeholder:text-text-secondary placeholder:font-normal font-bold border border-[#E6E6E6] text-gray-0 text-[12px] rounded-lg focus:outline-none focus:ring-[#A45F37] focus:border-[#A45F37] block w-full py-2.5 px-4 pb-8"
                    placeholder="문의를 남겨주시면 빠르게 답변해드리겠습니다."
                />
                <div className="absolute bottom-2 right-3 text-[12px] text-text-secondary">
                    {textareaValue.length}/300
                </div>
            </div>

            {/* Photo Upload Section */}
            <div className="mb-6">
                <label
                    htmlFor="image-upload"
                    className={`flex items-center justify-center gap-2  h-15 border border-dashed border-[#A45F37] rounded-lg p-3 text-center mb-4 bg-action-secondary ${imageCount >= maxImages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                        <path d="M14.497 4C14.8578 3.99999 15.2119 4.09759 15.5217 4.28244C15.8316 4.46729 16.0856 4.73251 16.257 5.05L16.743 5.95C16.9144 6.26749 17.1684 6.53271 17.4783 6.71756C17.7881 6.90241 18.1422 7.00001 18.503 7H20.5C21.0304 7 21.5391 7.21071 21.9142 7.58579C22.2893 7.96086 22.5 8.46957 22.5 9V18C22.5 18.5304 22.2893 19.0391 21.9142 19.4142C21.5391 19.7893 21.0304 20 20.5 20H4.5C3.96957 20 3.46086 19.7893 3.08579 19.4142C2.71071 19.0391 2.5 18.5304 2.5 18V9C2.5 8.46957 2.71071 7.96086 3.08579 7.58579C3.46086 7.21071 3.96957 7 4.5 7H6.497C6.85742 7.00002 7.21115 6.90264 7.52078 6.71817C7.83041 6.53369 8.08444 6.26897 8.256 5.952L8.745 5.048C8.91656 4.73103 9.17059 4.46631 9.48022 4.28183C9.78985 4.09736 10.1436 3.99998 10.504 4H14.497Z" stroke="#A45F37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12.5 16C14.1569 16 15.5 14.6569 15.5 13C15.5 11.3431 14.1569 10 12.5 10C10.8431 10 9.5 11.3431 9.5 13C9.5 14.6569 10.8431 16 12.5 16Z" stroke="#A45F37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="text-sm text-action-primary">사진 추가 ({imageCount} / {maxImages})</p>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                        disabled={imageCount >= maxImages}
                    />
                </label>

                {/* Image preview grid */}
                <div className="grid grid-cols-3 gap-2">
                    {Array.from({ length: maxImages }).map((_, index) => (
                        <div key={index} className="relative">
                            {images[index] ? (
                                <div className="relative">
                                    <img
                                        src={images[index]}
                                        alt={`Uploaded ${index + 1}`}
                                        className="w-full h-25 object-cover rounded-2xl"
                                    />
                                    <button
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 w-6 h-6 p-1 cursor-pointer rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                                        style={{
                                            borderRadius: '100px',
                                            background: 'rgba(255, 255, 255, 0.10)',
                                            backdropFilter: 'blur(5px)'
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <g clip-path="url(#clip0_1714_6533)">
                                                <path d="M8.00016 14.6673C11.6821 14.6673 14.6668 11.6825 14.6668 8.00065C14.6668 4.31875 11.6821 1.33398 8.00016 1.33398C4.31826 1.33398 1.3335 4.31875 1.3335 8.00065C1.3335 11.6825 4.31826 14.6673 8.00016 14.6673Z" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M10 6L6 10" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M6 6L10 10" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_1714_6533">
                                                    <rect width="16" height="16" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    </button>
                                </div>
                            ) : (
                                <div className="w-full h-25 border border-dashed border-border-default rounded-2xl flex items-center justify-center bg-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M13.997 4C14.3578 3.99999 14.7119 4.09759 15.0217 4.28244C15.3316 4.46729 15.5856 4.73251 15.757 5.05L16.243 5.95C16.4144 6.26749 16.6684 6.53271 16.9783 6.71756C17.2881 6.90241 17.6422 7.00001 18.003 7H20C20.5304 7 21.0391 7.21071 21.4142 7.58579C21.7893 7.96086 22 8.46957 22 9V18C22 18.5304 21.7893 19.0391 21.4142 19.4142C21.0391 19.7893 20.5304 20 20 20H4C3.46957 20 2.96086 19.7893 2.58579 19.4142C2.21071 19.0391 2 18.5304 2 18V9C2 8.46957 2.21071 7.96086 2.58579 7.58579C2.96086 7.21071 3.46957 7 4 7H5.997C6.35742 7.00002 6.71115 6.90264 7.02078 6.71817C7.33041 6.53369 7.58444 6.26897 7.756 5.952L8.245 5.048C8.41656 4.73103 8.67059 4.46631 8.98022 4.28183C9.28985 4.09736 9.64358 3.99998 10.004 4H13.997Z" stroke="#B3B3B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M12 16C13.6569 16 15 14.6569 15 13C15 11.3431 13.6569 10 12 10C10.3431 10 9 11.3431 9 13C9 14.6569 10.3431 16 12 16Z" stroke="#B3B3B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <button
                className={`w-full mt-auto btn-primary`}
                disabled={!textareaValue.trim()}
                onClick={() => setRegisterModalIsOpen(true)}
            >
                문의 등록하기
            </button>

            <ActionSheet
                isOpen={registerModalIsOpen}
                onClose={() => setRegisterModalIsOpen(false)}
            >
                <div className="text-center">
                    <div className="flex flex-col gap-2">
                        <p className="text-base font-bold leading-[20px] mb-4 mt-3">
                            문의를 등록하시겠습니까?
                        </p>
                        <button
                            onClick={() => setRegisterSuccessModalIsOpen(true)}
                            className="w-full btn-primary"
                        >
                            등록
                        </button>
                        <button
                            onClick={() => setRegisterModalIsOpen(false)}
                            className="w-full btn-primary-empty"
                        >
                            취소
                        </button>
                    </div>
                </div>
            </ActionSheet>

            <ActionSheet
                isOpen={registerSuccessModalIsOpen}
                onClose={() => setRegisterSuccessModalIsOpen(false)}
            >
                <div className="text-center">
                    <div className="flex flex-col gap-2">
                        <p className="text-base font-bold leading-[20px] mb-4 mt-3">
                            상품 문의 등록이 완료되었습니다.
                        </p>
                        <button
                            onClick={() => setRegisterSuccessModalIsOpen(false)}
                            className="w-full btn-primary"
                        >
                            이전 화면으로
                        </button>
                        <button
                            onClick={() => setRegisterSuccessModalIsOpen(false)}
                            className="w-full btn-primary-empty"
                        >
                            문의 내역 확인
                        </button>
                    </div>
                </div>
            </ActionSheet>
        </div>
    )
}

export default ContactUsRegistration;