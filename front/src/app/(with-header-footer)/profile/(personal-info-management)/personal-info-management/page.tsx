"use client";
import React, { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import ActionSheet from "@/components/ActionSheet";
import { useHeaderStore } from "@/stores/header-store";
import Link from "next/link";
import DatePicker from "@/app/auth/components/DatePicker";
import { useUserStore } from "@/stores/user-store";
import { removeAccessTokenCookie } from "@/utils/cookies";

const PersonalInfoManagement = () => {
  const router = useRouter();
  const { setHeader } = useHeaderStore();
  const { user, resetUser } = useUserStore();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birth, setBirth] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [showLogOutModal, setShowLogOutModal] = useState(false);

  useEffect(() => {
    setHeader({
      title: "개인정보관리",
      showBackButton: true,
    });
  }, []);

  useEffect(() => {
    // Load user data
    if (user?.data) {
      setName(user.data.display_name || "");
      setEmail(user.data.email || "");
      setPhone(user.data.phone || "");
    }
  }, [user]);

  const handleChangePhone = () => {
    router.push("/profile/change-phone");
  };

  const handleLogout = () => {
    // Remove token from cookie
    removeAccessTokenCookie();
    // Reset user store
    resetUser();
    // Close modal
    setShowLogOutModal(false);
    // Redirect to login page
    router.push('/auth/login');
  };

  return (
    <>
      <div className="bg-background p-4">
        {/* Name */}
        <div className="mb-3">
          <label className="block text-sm leading-[20px] font-bold text-gray-0 mb-2">
            이름
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이기홍"
            className="input-default"
          />
        </div>

        {/* Email */}
        <div className="mb-3">
          <label className="block text-sm leading-[20px] font-bold text-gray-0 mb-2">
            아이디 또는 이메일
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@gmail.com"
            className="input-default"
          />
        </div>

        {/* Phone */}
        <div className="mb-3">
          <label className="block text-sm leading-[20px] font-bold text-gray-0 mb-2">
            휴대폰 번호
          </label>
          <div className="flex items-center gap-2">
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="휴대폰 번호를 입력해주세요."
              className="input-default"
            />
            <button
              onClick={handleChangePhone}
              className="px-4 shrink-0 h-10 text-sm leading-[20px] rounded-lg bg-action-secondary text-action-primary font-bold"
            >
              변경
            </button>
          </div>
        </div>

        {/* Birth */}
        <div className="mb-3">
          <DatePicker
            id="birth"
            label="생년월일"
            value={birth}
            onChange={(value) => setBirth(value)}
            error={""}
            placeholder="년도 / 월 / 일"
            required
          />

          {/* <label className="block text-sm leading-[20px] font-bold mb-2">
            생년월일
          </label>
          <input
            type="date"
            value={birth}
            onChange={(e) => setBirth(e.target.value)}
            className="w-full h-10 appearance-none px-4 rounded-lg border border-border-default text-gray-0"
          /> */}
        </div>

        {/* Gender */}
        <div className="mb-4">
          <label className="block text-sm leading-[20px] font-bold text-gray-0 mb-2">
            성별
          </label>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="gender"
                checked={gender === "male"}
                onChange={() => setGender("male")}
              />
              <span className="text-xs leading-[16px]">남자</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="gender"
                checked={gender === "female"}
                onChange={() => setGender("female")}
              />
              <span className="text-xs leading-[16px]">여자</span>
            </label>
          </div>
        </div>

        <hr className="border-t border-border-default mt-3 mb-4" />

        {/* Actions */}
        <div className=" flex flex-col gap-2.5 ">
          <button
            onClick={() => setShowLogOutModal(true)}
            className="w-full flex items-center justify-between py-1.5 px-2"
          >
            <span className="text-xs leading-[18px] text-gray-0">로그아웃</span>
            <ChevronRight size={20} className="text-icon-default" />
          </button>
          <Link
            href="/profile/membership-withdraw"
            className="w-full flex items-center justify-between py-1.5 px-2"
          >
            <span className="text-xs leading-[18px] text-gray-0">회원탈퇴</span>
            <ChevronRight size={20} className="text-icon-default" />
          </Link>
        </div>
      </div>

      {/* Show modal action sheet */}
      <ActionSheet
        isOpen={showLogOutModal}
        onClose={() => setShowLogOutModal(false)}
      >
        <div className="">
          <p className="mb-6 text-center text-base leading-[20px] font-bold">
            로그아웃 하시겠습니까?
          </p>
          <button
            onClick={handleLogout}
            className={`inline-block mb-2 text-center w-full mt-auto py-3 rounded-lg font-bold leading-[24px] bg-[#DC3545] text-white`}
          >
            예
          </button>
          <button
            onClick={() => setShowLogOutModal(false)}
            className={`inline-block text-center w-full mt-auto py-3 rounded-lg font-bold leading-[24px]`}
          >
            아니오
          </button>
        </div>
      </ActionSheet>
    </>
  );
};

export default PersonalInfoManagement;
