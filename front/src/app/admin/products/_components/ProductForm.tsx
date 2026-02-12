"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useGet, usePost, usePut } from "@/hooks/useApi";

type ProductFormProps = {
  mode: "create" | "edit";
  productId?: string;
};

type BlendDetail = {
  id: number;
  name: string;
  summary?: string | null;
  price?: number | null;
  stock?: number | null;
  thumbnail_url?: string | null;
  origin_ratios?: Record<string, number> | null;
  attributes?: Record<string, number> | null;
  aroma?: number;
  acidity?: number;
  sweetness?: number;
  body?: number;
  nuttiness?: number;
};

export default function ProductForm({ mode, productId }: ProductFormProps) {
  const [name, setName] = useState("");
  const [summary, setSummary] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [originRatios, setOriginRatios] = useState("{}");
  const [aroma, setAroma] = useState("");
  const [acidity, setAcidity] = useState("");
  const [sweetness, setSweetness] = useState("");
  const [body, setBody] = useState("");
  const [nuttiness, setNuttiness] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const { data: blend } = useGet<BlendDetail>(
    ["admin-blend", productId],
    `/api/blends/${productId}`,
    undefined,
    { enabled: mode === "edit" && Boolean(productId) }
  );

  const { mutate: createBlend, isPending: isCreating } = usePost(
    "/api/blends",
    {
      onSuccess: () => setMessage("등록되었습니다."),
      onError: (err: any) =>
        setMessage(err?.response?.data?.detail || "등록에 실패했습니다."),
    }
  );

  const { mutate: updateBlend, isPending: isUpdating } = usePut(
    `/api/blends/${productId}`,
    {
      onSuccess: () => setMessage("수정되었습니다."),
      onError: (err: any) =>
        setMessage(err?.response?.data?.detail || "수정에 실패했습니다."),
    }
  );

  useEffect(() => {
    if (!blend) return;
    setName(blend.name || "");
    setSummary(blend.summary || "");
    setPrice(blend.price ? String(blend.price) : "");
    setStock(blend.stock ? String(blend.stock) : "");
    setThumbnailUrl(blend.thumbnail_url || "");
    if (blend.origin_ratios) {
      setOriginRatios(JSON.stringify(blend.origin_ratios, null, 2));
    }
    const attrs = blend.attributes || {};
    setAroma(String(attrs.aroma ?? blend.aroma ?? ""));
    setAcidity(String(attrs.acidity ?? blend.acidity ?? ""));
    setSweetness(String(attrs.sweetness ?? blend.sweetness ?? ""));
    setBody(String(attrs.body ?? blend.body ?? ""));
    setNuttiness(String(attrs.nuttiness ?? blend.nuttiness ?? ""));
  }, [blend]);

  const submit = () => {
    setMessage(null);
    if (!name) {
      setMessage("상품명을 입력해주세요.");
      return;
    }
    let originData: Record<string, number> = {};
    try {
      originData = originRatios ? JSON.parse(originRatios) : {};
    } catch {
      setMessage("원산지 비율 JSON 형식이 올바르지 않습니다.");
      return;
    }

    const payload = {
      name,
      summary: summary || null,
      origin_ratios: originData,
      attributes: {
        aroma: Number(aroma) || 0,
        acidity: Number(acidity) || 0,
        sweetness: Number(sweetness) || 0,
        body: Number(body) || 0,
        nuttiness: Number(nuttiness) || 0,
      },
      price: price ? Number(price) : null,
      stock: stock ? Number(stock) : 0,
      thumbnail_url: thumbnailUrl || null,
    };

    if (mode === "create") {
      createBlend(payload);
      return;
    }
    updateBlend(payload);
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={mode === "create" ? "상품 등록" : "상품 정보 수정"}
        description="커피 상품의 기본 정보를 입력합니다."
      />

      <div className="rounded-xl border border-white/10 bg-[#141414] p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="text-xs text-white/60">상품명</label>
            <input
              className="mt-1 w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white/80"
              placeholder="벨벳 터치 블렌드"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-white/60">요약</label>
            <input
              className="mt-1 w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white/80"
              placeholder="커피 요약 문구"
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-white/60">재고 상태</label>
            <input
              className="mt-1 w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white/80"
              placeholder="99,999"
              value={stock}
              onChange={(event) => setStock(event.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-white/60">가격</label>
            <input
              className="mt-1 w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white/80"
              placeholder="35,000"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-white/60">썸네일 URL</label>
            <input
              className="mt-1 w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white/80"
              placeholder="https://..."
              value={thumbnailUrl}
              onChange={(event) => setThumbnailUrl(event.target.value)}
            />
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm font-semibold text-white">맛 프로파일</p>
          <div className="mt-3 grid gap-3 md:grid-cols-5">
            {[
              { label: "향", value: aroma, onChange: setAroma },
              { label: "산미", value: acidity, onChange: setAcidity },
              { label: "단맛", value: sweetness, onChange: setSweetness },
              { label: "고소함", value: nuttiness, onChange: setNuttiness },
              { label: "바디감", value: body, onChange: setBody },
            ].map((item) => (
              <div key={item.label}>
                <label className="text-xs text-white/60">{item.label}</label>
                <input
                  className="mt-1 w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white/80"
                  placeholder="0~5"
                  value={item.value}
                  onChange={(event) => item.onChange(event.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm font-semibold text-white">원산지 비율</p>
          <textarea
            className="mt-3 h-28 w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white/80"
            value={originRatios}
            onChange={(event) => setOriginRatios(event.target.value)}
          />
          <p className="mt-2 text-xs text-white/40">
            예: {"{ \"케냐\": 51, \"코스타리카\": 49 }"}
          </p>
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
            href="/admin/products"
            className="rounded-lg border border-white/20 px-5 py-2 text-sm text-white/70"
          >
            목록으로
          </Link>
        </div>

        {message && <p className="mt-4 text-xs text-white/60">{message}</p>}
        {productId && (
          <p className="mt-2 text-xs text-white/40">상품 ID: {productId}</p>
        )}
      </div>
    </div>
  );
}
