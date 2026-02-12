import { NextResponse } from "next/server";

/**
 * TTFB 점검용: 문서 요청이 5초 걸릴 때 이 API가 빠르면 → 콜드 스타트/렌더링 지연
 * Network 탭에서 /home (document) vs /api/health 시간 비교
 */
export async function GET() {
  return NextResponse.json({ ok: true, t: Date.now() });
}
