"""AI 스토리 생성 (OpenAI)"""
import json
import logging
from typing import List, Optional

from app.config import get_settings

logger = logging.getLogger(__name__)

# 프론트와 동일한 4개 섹션 구조
SECTION_SPEC = [
    {"key": "enjoy", "title": "이렇게 즐겨보세요.", "icon": "🌱"},
    {"key": "moments", "title": "함께하면 좋은 순간", "icon": "🍰"},
    {"key": "music", "title": "오늘은 이런 음악과", "icon": "🎶"},
    {"key": "movie", "title": "영화와 함께라면", "icon": "🎬"},
]

PROMPT_TEMPLATE = """당신은 커피 추천 콘텐츠 작성자입니다. 아래 블렌드 정보를 바탕으로, 4개 섹션의 스토리를 한국어로 작성해 주세요. 각 섹션은 2~4문장으로, 따뜻하고 구체적인 톤으로 작성합니다.

블렌드명: {blend_name}
한줄 요약: {summary}
취향 점수(1~5): 향 {aroma}, 산미 {acidity}, 단맛 {sweetness}, 고소함 {nuttiness}, 바디 {body}
원산지: {origin_text}

다음 JSON 형식으로만 답변하세요. 다른 설명 없이 JSON만 출력하세요. 각 content는 문장 하나씩 문자열 배열로 넣어주세요.
{{
  "enjoy": ["문장1", "문장2", ...],
  "moments": ["문장1", "문장2", ...],
  "music": ["문장1", "문장2", ...],
  "movie": ["문장1", "문장2", ...]
}}
"""


def _parse_response(text: str) -> Optional[dict]:
    """응답 텍스트에서 JSON 추출"""
    text = text.strip()
    if text.startswith("```"):
        lines = text.split("\n")
        start = 0
        for i, line in enumerate(lines):
            if line.strip().startswith("```"):
                start = i + 1
                break
        end = start
        for i in range(start, len(lines)):
            if lines[i].strip().startswith("```"):
                end = i
                break
            end = i + 1
        text = "\n".join(lines[start:end])
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return None


def generate_ai_story(
    blend_name: str,
    summary: str,
    aroma: int,
    acidity: int,
    sweetness: int,
    body: int,
    nuttiness: int,
    origin_text: str = "다양한 원산지의 조화",
) -> Optional[List[dict]]:
    """
    OpenAI로 4개 섹션 스토리 생성.
    반환: [{"title": str, "icon": str, "content": [str]}, ...] 또는 None(실패/키 없음)
    """
    settings = get_settings()
    if not settings.openai_api_key:
        logger.debug("OPENAI_API_KEY not set, skip AI story generation")
        return None

    prompt = PROMPT_TEMPLATE.format(
        blend_name=blend_name or "블렌드",
        summary=summary or "특징을 담은 블렌드입니다.",
        aroma=aroma,
        acidity=acidity,
        sweetness=sweetness,
        nuttiness=nuttiness,
        body=body,
        origin_text=origin_text or "다양한 원산지의 조화",
    )

    try:
        from openai import OpenAI

        client = OpenAI(api_key=settings.openai_api_key)
        resp = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You output only valid JSON. No markdown, no explanation."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.7,
        )
        choice = resp.choices[0] if resp.choices else None
        if not choice or not getattr(choice, "message", None):
            return None
        raw = getattr(choice.message, "content", "") or ""
        data = _parse_response(raw)
        if not data or not isinstance(data, dict):
            return None

        sections = []
        for spec in SECTION_SPEC:
            key = spec["key"]
            content = data.get(key)
            if isinstance(content, list):
                content = [str(c).strip() for c in content if c]
            else:
                content = [str(content).strip()] if content else []
            if not content:
                content = [f"{spec['title']}에 어울리는 내용을 추천해 드립니다."]
            sections.append({
                "title": spec["title"],
                "icon": spec["icon"],
                "content": content,
            })
        return sections
    except Exception as e:
        logger.warning("AI story generation failed: %s", e)
        return None
