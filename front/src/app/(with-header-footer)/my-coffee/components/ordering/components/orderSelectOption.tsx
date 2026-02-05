import ActionSheet, { ActionSheetRef } from "@/components/ActionSheet";
import { useOrderImageStore, useOrderStore } from "@/stores/order-store";
import { ChevronDown } from "lucide-react";
import React, { useState, useRef } from "react";

interface OrderSelectOptionProps {
  isOpen: boolean;
  onClose: () => void;
  orderLabelOption: boolean;
  setOrderLabelOption: (value: boolean) => void;
}

const OrderSelectOption: React.FC<OrderSelectOptionProps> = ({
  isOpen,
  onClose,
  orderLabelOption,
  setOrderLabelOption,
}) => {
  const [caffeineStrength, setCaffeineStrength] = useState<
    "CAFFEINE" | "DECAFFEINE" | ""
  >("");
  const [grindLevel, setGrindLevel] = useState<"WHOLE_BEAN" | "GROUND" | "">("");
  const [packaging, setPackaging] = useState<"STICK" | "BULK" | "">("");
  const [weight, setWeight] = useState<string>("");
  // const [photo, setPhoto] = useState<string>("");

  const { order, setOrder } = useOrderStore();
  const { orderImage, setOrderImage } = useOrderImageStore();
  const actionSheetRef = useRef<ActionSheetRef>(null);

  const handleComplete = () => {
    // Handle selection completion with smooth animation
    actionSheetRef.current?.closeWithAnimation();
    setOrder([
      ...order,
      {
        caffeineStrength,
        grindLevel,
        packaging,
        weight,
        price: 36000,
        quantity: 1,
      },
    ]);
    setOrderImage({ name: "" });

    setCaffeineStrength("");
    setGrindLevel("");
    setPackaging("");
    setWeight("");
  };

  const isButtonsDisabled =
    caffeineStrength === "" || grindLevel === "" || packaging === "";

  return (
    <>
      <ActionSheet
        ref={actionSheetRef}
        isOpen={isOpen}
        onClose={onClose}
        title="옵션선택"
      >
        <div className="space-y-4 mt-4 text-text-primary">
          {/* 카페인 강도 (Caffeine Intensity) */}
          <div>
            <h3 className="text-sm leading-[20px] font-bold mb-2">
              카페인 강도
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setCaffeineStrength("CAFFEINE")}
                className={`flex-1 h-[40px] leading-[40px] inline-block text-xs rounded-lg border transition-colors ${
                  caffeineStrength === "CAFFEINE"
                    ? "border-[#A45F37] font-bold"
                    : "border-border-default"
                }`}
              >
                카페인
              </button>
              <button
                onClick={() => setCaffeineStrength("DECAFFEINE")}
                className={`flex-1 h-[40px] leading-[40px] inline-block text-xs rounded-lg border transition-colors ${
                  caffeineStrength === "DECAFFEINE"
                    ? "border-[#A45F37] font-bold"
                    : "border-border-default"
                }`}
              >
                디카페인
              </button>
            </div>
          </div>

          {/* 분쇄 정도 (Grind Level) */}
          <div>
            <h3 className="text-sm leading-[20px] font-bold mb-2">분쇄 정도</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setGrindLevel("WHOLE_BEAN")}
                className={`flex-1 h-[40px] leading-[40px] inline-block text-xs rounded-lg border transition-colors ${
                  grindLevel === "WHOLE_BEAN"
                    ? "border-[#A45F37] font-bold"
                    : "border-border-default"
                }`}
              >
                홀빈
              </button>
              <button
                onClick={() => setGrindLevel("GROUND")}
                className={`flex-1 h-[40px] leading-[40px] inline-block text-xs rounded-lg border transition-colors ${
                  grindLevel === "GROUND"
                    ? "border-[#A45F37] font-bold"
                    : "border-border-default"
                }`}
              >
                분쇄 그라인딩
              </button>
            </div>
          </div>

          {/* 포장 방법 (Packaging Method) */}
          <div>
            <h3 className="text-sm leading-[20px] font-bold mb-2">포장 방법</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setPackaging("STICK")}
                className={`flex-1 h-[40px] leading-[40px] inline-block text-xs rounded-lg border transition-colors ${
                  packaging === "STICK"
                    ? "border-[#A45F37] font-bold"
                    : "border-border-default"
                }`}
              >
                스틱
              </button>
              <button
                onClick={() => setPackaging("BULK")}
                className={`flex-1 h-[40px] leading-[40px] inline-block text-xs rounded-lg border transition-colors ${
                  packaging === "BULK"
                    ? "border-[#A45F37] font-bold"
                    : "border-border-default"
                }`}
              >
                벌크
              </button>
            </div>
          </div>

          {/* 중량 (Weight) */}
          <div>
            <h3 className="text-sm leading-[20px] font-bold mb-2">중량</h3>
            <div className="relative">
              <select
                disabled={packaging === ""}
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className={`w-full h-[40px] text-xs pl-4 pr-2 border border-border-default rounded-lg appearance-none bg-white ${
                  packaging === "" && "cursor-not-allowed"
                }`}
              >
                <option value="">중량을 선택해주세요.</option>
                <option value="500g">500g</option>
                <option value="250g">250g</option>
                <option value="15gX15">15g X 15</option>
                <option value="15gX30">15g X 30</option>
                <option value="15gX45">15g X 45</option>
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    stroke={"var(--icon-default)"}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* add photo */}
          <div>
            <h3 className="text-sm leading-[20px] font-bold mb-2">
              라벨 (선택사항)
            </h3>
            <div className="relative">
              <p
                onClick={() => setOrderLabelOption(true)}
                className={`w-full h-[40px] leading-[40px] text-xs pl-4 pr-2 border border-border-default rounded-lg bg-white ${
                  orderImage.name ? "text-blue-400" : "text-text-primary"
                }`}
              >
                {orderImage.name || "라벨 이미지를 업로드해주세요."}
              </p>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>

          {isButtonsDisabled ? (
            <button
              onClick={handleComplete}
              className="w-full mt-2 py-3 bg-action-disabled text-text-disabled rounded-lg font-bold leading-[24px] cursor-not-allowed"
            >
              선택 완료
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="w-full mt-2 py-3 bg-linear-gradient text-white rounded-lg font-bold leading-[24px]"
            >
              선택 완료
            </button>
          )}
        </div>
      </ActionSheet>
    </>
  );
};

export default OrderSelectOption;
