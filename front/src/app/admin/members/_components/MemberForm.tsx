"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useGet, usePost, usePut } from "@/hooks/useApi";

type MemberFormProps = {
  mode: "create" | "edit";
  memberId?: string;
};

type AdminUser = {
  id: number;
  email: string;
  display_name?: string | null;
  phone_number?: string | null;
  provider?: string | null;
  is_admin: boolean;
};

export default function MemberForm({ mode, memberId }: MemberFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [provider, setProvider] = useState("email");
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const { data: member } = useGet<AdminUser>(
    ["admin-user", memberId],
    `/api/admin/users/${memberId}`,
    undefined,
    { enabled: mode === "edit" && Boolean(memberId) }
  );

  const { mutate: createUser, isPending: isCreating } = usePost(
    "/api/admin/users",
    {
      onSuccess: () => setMessage("등록되었습니다."),
      onError: (err: any) =>
        setMessage(err?.response?.data?.detail || "등록에 실패했습니다."),
    }
  );

  const { mutate: updateUser, isPending: isUpdating } = usePut(
    `/api/admin/users/${memberId}`,
    {
      onSuccess: () => setMessage("수정되었습니다."),
      onError: (err: any) =>
        setMessage(err?.response?.data?.detail || "수정에 실패했습니다."),
    }
  );

  useEffect(() => {
    if (!member) return;
    setName(member.display_name || "");
    setEmail(member.email || "");
    setPhone(member.phone_number || "");
    setProvider(member.provider || "email");
    setIsAdmin(member.is_admin);
  }, [member]);

  const submit = () => {
    setMessage(null);
    if (!email || !phone) {
      setMessage("이메일과 휴대폰 번호는 필수입니다.");
      return;
    }
    const payload = {
      email,
      phone_number: phone,
      display_name: name || null,
      provider,
      is_admin: isAdmin,
      password: password || undefined,
    };

    if (mode === "create") {
      createUser(payload);
      return;
    }
    updateUser(payload);
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={mode === "create" ? "회원 등록" : "회원 정보 수정"}
        description="회원 기본 정보를 입력하거나 수정합니다."
      />

      <div className="rounded-xl border border-white/10 bg-[#141414] p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs text-white/60">이름</label>
            <input
              className="mt-1 w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white/80"
              placeholder="홍길동"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-white/60">이메일</label>
            <input
              className="mt-1 w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white/80"
              placeholder="example@mycoffee.ai"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-white/60">휴대폰 번호</label>
            <input
              className="mt-1 w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white/80"
              placeholder="010-1111-2222"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-white/60">가입 채널</label>
            <select
              className="mt-1 w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white/80"
              value={provider}
              onChange={(event) => setProvider(event.target.value)}
            >
              <option value="email">이메일</option>
              <option value="kakao">카카오</option>
              <option value="naver">네이버</option>
              <option value="apple">애플</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-white/60">관리자 여부</label>
            <select
              className="mt-1 w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white/80"
              value={isAdmin ? "true" : "false"}
              onChange={(event) => setIsAdmin(event.target.value === "true")}
            >
              <option value="false">일반 회원</option>
              <option value="true">관리자</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-white/60">
              {mode === "create" ? "비밀번호" : "새 비밀번호"}
            </label>
            <input
              type="password"
              className="mt-1 w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white/80"
              placeholder={mode === "create" ? "비밀번호 입력" : "비워두면 변경 없음"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <button
            className="rounded-lg bg-white px-5 py-2 text-sm font-semibold text-[#101010]"
            onClick={submit}
            disabled={isCreating || isUpdating}
          >
            {isCreating || isUpdating
              ? "저장 중..."
              : mode === "create"
              ? "등록"
              : "수정"}
          </button>
          <Link
            href="/admin/members"
            className="rounded-lg border border-white/20 px-5 py-2 text-sm text-white/70"
          >
            목록으로
          </Link>
        </div>

        {message && <p className="mt-4 text-xs text-white/60">{message}</p>}
        {memberId && (
          <p className="mt-4 text-xs text-white/40">회원 ID: {memberId}</p>
        )}
      </div>
    </div>
  );
}
