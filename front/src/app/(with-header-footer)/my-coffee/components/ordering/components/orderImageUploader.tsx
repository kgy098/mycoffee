import ActionSheet from "@/components/ActionSheet";
import { useOrderImageStore, useOrderStore } from "@/stores/order-store";
import React, { useState, useRef } from "react";

interface OrderSelectLabelOptionProps {
  isOpen: boolean;
  onClose: () => void;
}

const OrderSelectLabelOption: React.FC<OrderSelectLabelOptionProps> = ({
  isOpen,
  onClose,
}) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
 
  const { setOrderImage } = useOrderImageStore();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024 * 2) {
      alert("파일 크기는 10MB를 초과할 수 없습니다.");
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드 가능합니다.");
      return;
    }

    setIsUploading(true);

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string); 
      setOrderImage({ name: file.name }); 
      setIsUploading(false);

    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleComplete = () => {
    // Handle completion logic here
    onClose();
  };

  return (
    <>
      <ActionSheet isOpen={isOpen} onClose={onClose} title="라벨 옵션">
        <div className="mt-4">
          {/* Information Text */}
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-gray-0 rounded-full flex-shrink-0"></div>
                <p className="text-xs leading-[18px] font-bold">
                  커피 패키지 표면에 라벨이 인쇄되어 제공됩니다.
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-gray-0 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-xs leading-[18px] font-bold">
                  아래 사이즈에 맞춰 이미지를 업로드해 주세요.
                </p>
              </div>
            </div>

            {/* Size Specifications */}
            <div className="space-y-1">
              <div className="flex items-start space-x-2">
                <div className="w-1 h-1 bg-text-secondary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-[12px] leading-[16px] font-normal text-text-secondary">
                  커피 스틱 라벨: <span>35mm × 100mm</span>
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1 h-1 bg-text-secondary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-[12px] leading-[16px] font-normal text-text-secondary">
                  커피 번들 라벨(5~10스틱용): <span>70mm × 120mm</span>
                </p>
              </div>
            </div>
          </div>

          {/* Image Upload Area */}
          <div className="space-y-3 my-6">
            {uploadedImage ? (
              <div className="relative mb-0">
                <img
                  src={uploadedImage}
                  alt="Uploaded label"
                  className="w-full h-48 max-h-[240px] object-cover rounded-lg border border-gray-200"
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 w-6 h-6 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-opacity"
                >
                  <svg
                    width="12"
                    height="12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <div
                onClick={handleUploadClick}
                className="w-full h-15 border-1 bg-action-secondary border-dashed border-[#A45F37] rounded-lg flex items-center justify-center cursor-pointer transition-colors"
              >
                <div className="flex flex-row items-center gap-2">
                  <div className=" flex items-center justify-center">
                    <svg
                      width="24"
                      height="24"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      className="text-gray-0"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm leading-[20px] font-normal">
                    라벨 이미지 업로드
                  </p>
                </div>
              </div>
            )}

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Complete Button */}
          <button
            disabled={uploadedImage === null}
            onClick={handleComplete}
            className="w-full btn-primary"
          >
            선택 완료
          </button>
        </div>
      </ActionSheet>
    </>
  );
};

export default OrderSelectLabelOption;
