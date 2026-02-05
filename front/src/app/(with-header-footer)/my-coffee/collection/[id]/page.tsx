"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import LikeModal from "./components/LikeModal";
import OrderingComponent from "../../components/ordering/Ordering";
import SpiderChart from "@/app/(content-only)/analysis/SpiderChart";
import CoffeeCollectionSlider from "@/components/CoffeeCollectionSlider";

const CollectionDetail = () => {
  const params = useParams();
  const analysisId = params.id;
  const [openItems, setOpenItems] = useState<number[]>([0, 1, 2]); // First item open by default
  const [isLikeModalOpen, setIsLikeModalOpen] = useState(false);

  // Sample taste ratings data
  const tasteRatings = {
    aroma: 5,
    sweetness: 4,
    body: 4,
    nutty: 3,
    acidity: 4,
  };

  const accordionItems = [
    {
      id: 0,
      title: "원두 프로파일",
      content:
        "이 페이지는 커피 분석의 상세 정보를 보여줍니다. 개인화된 커피 추천과 함께 다양한 분석 결과를 확인할 수 있습니다.",
    },
    {
      id: 1,
      title: "AI 커피 추천 스토리",
      content:
        "분석 결과가 여기에 표시됩니다. 향, 산미, 바디감, 단맛, 고소함 등의 다양한 요소들이 종합적으로 분석되어 표시됩니다.",
    },
  ];

  const toggleItem = (id: number) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleLikeSave = (coffeeName: string, comment: string) => {
    console.log("Saved coffee:", { coffeeName, comment });
    // Here you can add logic to save the coffee to your database or state
  };

  return (
    <div className="">
      <div className="overflow-y-auto h-[calc(100vh-253px)] pl-4 pt-3 pb-2">
        <div className="pr-4">
          <h2 className="text-[20px] font-bold text-gray-0 mb-2 text-center">
            나만의 커피 1호기
          </h2>
          <p className="text-[12px] text-text-secondary mb-2 text-center font-normal">
            2025-08-24 오후 12:34
          </p>
          <p className="text-xs text-gray-0 mb-6 text-center font-normal ">
            달달한 커피가 먹고 싶을 때 추천받은 커피
          </p>
          <h2 className="text-[20px] font-bold text-gray-0 mb-2 text-center">
            클래식 하모니 블렌드
          </h2>
          <p className="text-xs text-gray-0 mb-6 text-center font-normal">
            “ 향긋한 꽃향기와 크리미한 바디감이 인상 깊습니다. ”
          </p>
        </div>

        <div className="">
          <div className="space-y-[26px]">
            {accordionItems.map((item, index) => (
              <div key={item.id} className="overflow-hidden">
                <div className="pr-8">
                  <button
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    className="r-4 flex items-center justify-between w-full py-0 font-medium text-gray-500 rounded-lg transition-colors duration-200 cursor-pointer"
                  >
                    <span className="flex items-center gap-2 text-gray-0 text-base font-bold leading-[125%]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M20 6L9 17L4 12"
                          stroke="#22C55E"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {item.title}
                    </span>
                    <svg
                      className={`shrink-0 transition-transform duration-200 ${openItems.includes(item.id) ? "" : "rotate-180"
                        }`}
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="8"
                      viewBox="0 0 12 8"
                      fill="none"
                    >
                      <path
                        d="M10.5 6.5L6 1.5L1.5 6.5"
                        stroke="#1A1A1A"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>

                <div
                  className={`transition-all duration-300 ease-in-out ${openItems.includes(item.id)
                      ? "max-h-[2000px] opacity-100"
                      : "max-h-0 opacity-0"
                    }`}
                >
                  <div className="pt-3">
                    {item.id === 0 ? (
                      <div className="border border-border-default rounded-2xl p-3 bg-white mr-4">
                        {/* Radar Chart */}
                        <SpiderChart
                          ratings={tasteRatings}
                          setRatings={() => { }}
                          isChangable={false}
                          isClickable={true}
                          wrapperClassName="!mb-1"
                          size="medium"
                        />

                        {/* Origin Info */}
                        <div className="text-center mb-4">
                          <p className="text-xs text-gray-0 leading-[16px]">
                            (브라질 42%, 페루 58%)
                          </p>
                        </div>

                        {/* <TasteDetails ratings={tasteRatings} /> */}
                      </div>
                    ) : item.id === 1 ? (
                      <div>
                        {/* Coffee Collection Slider */}
                        <CoffeeCollectionSlider />
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {item.content}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white py-2 px-4" style={{ boxShadow: "0 -1px 2px 0 rgba(0,0,0,0.04)" }}>
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setIsLikeModalOpen(true)}
            className="size-12 flex-shrink-0 border border-border-default rounded-lg flex items-center justify-center cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M1.66699 7.91662C1.66701 6.98929 1.94832 6.08377 2.47377 5.31967C2.99922 4.55557 3.74409 3.96883 4.61 3.63695C5.47591 3.30507 6.42212 3.24366 7.32367 3.46082C8.22521 3.67799 9.03968 4.16352 9.65949 4.85329C9.70315 4.89996 9.75593 4.93718 9.81456 4.96262C9.87319 4.98806 9.93641 5.00119 10.0003 5.00119C10.0642 5.00119 10.1275 4.98806 10.1861 4.96262C10.2447 4.93718 10.2975 4.89996 10.3412 4.85329C10.959 4.15904 11.7737 3.66943 12.6767 3.44962C13.5797 3.22982 14.5282 3.29024 15.3961 3.62286C16.2639 3.95547 17.0098 4.5445 17.5346 5.31154C18.0594 6.07858 18.3381 6.98725 18.3337 7.91662C18.3337 9.82495 17.0837 11.25 15.8337 12.5L11.257 16.9275C11.1017 17.1058 10.9103 17.249 10.6954 17.3477C10.4805 17.4464 10.247 17.4982 10.0106 17.4997C9.77411 17.5012 9.54003 17.4523 9.3239 17.3564C9.10776 17.2605 8.91452 17.1196 8.75699 16.9433L4.16699 12.5C2.91699 11.25 1.66699 9.83329 1.66699 7.91662Z"
                fill="#4E2A18"
                stroke="#4E2A18"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <OrderingComponent title={"주문하기"} />
        </div>
      </div>

      {/* Like Modal */}
      <LikeModal
        isOpen={isLikeModalOpen}
        onClose={() => setIsLikeModalOpen(false)}
        onSave={handleLikeSave}
        href={`/my-coffee/collection`}
      />
    </div>
  );
};

export default CollectionDetail;