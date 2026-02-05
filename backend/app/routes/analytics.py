"""Analytics routes for taste analysis details"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional, Any
import json

from app.database import get_db
from app.models import AnalysisResult, Blend, BlendOrigin
from app.schemas.recommendation import TastePreferences
from app.services.recommendation import RecommendationService
from pydantic import BaseModel

router = APIRouter()


class AiStorySection(BaseModel):
    title: str
    icon: str
    content: List[str]


class AiStoryResponse(BaseModel):
    sections: List[AiStorySection]


class SimilarBlendResponse(BaseModel):
    id: int
    name: str
    summary: Optional[str]
    acidity: int
    sweetness: int
    body: int
    nuttiness: int
    bitterness: int
    similarity_score: Optional[float] = None

    class Config:
        from_attributes = True


def _build_default_story(origins: List[BlendOrigin]) -> List[AiStorySection]:
    origin_text = "다양한 원산지의 조화"
    if origins:
        origin_text = ", ".join([f"{item.origin} {item.pct}%" for item in origins])

    return [
        AiStorySection(
            title="이렇게 즐겨보세요.",
            icon="🌱",
            content=[
                "원두는 중·굵게 분쇄해보세요. 너무 곱게 갈면 이 부드러운 하모니가 무겁게 눌려버립니다.",
                "핸드드립으로 내리면 향이 선명하게 피어나고, 프렌치프레스를 쓰면 고소하고 크리미한 바디감이 강조됩니다.",
                "혹은 진한 풍미를 원한다면 에스프레소로 짧고 강렬하게 즐겨도 좋습니다.",
            ],
        ),
        AiStorySection(
            title="함께하면 좋은 순간",
            icon="🍰",
            content=[
                "이 커피에는 치즈케이크 한 조각이 잘 어울립니다. 치즈의 크리미함이 커피의 바디와 맞물려 부드럽게 감싸줍니다.",
                f"원산지 조합({origin_text})의 균형 덕분에 견과류 디저트와도 잘 어울립니다.",
            ],
        ),
        AiStorySection(
            title="오늘은 이런 음악과",
            icon="🎶",
            content=[
                "잔잔히 흐르는 노라 존스(Norah Jones)의 목소리, 혹은 드뷔시의 Clair de Lune을 틀어두면 어떨까요?",
                "커피의 부드러운 크리미함과 음악의 서정성이 서로 겹치며, 평범한 오후를 특별한 순간으로 바꿔줍니다.",
            ],
        ),
        AiStorySection(
            title="영화와 함께라면",
            icon="🎬",
            content=[
                "한 잔의 커피와 함께라면, Before Sunrise 같은 영화가 잘 어울립니다. 대화 속에 잔잔히 흐르는 낭만이 이 블렌드의 향기와 닮아 있습니다.",
                "혹은 리틀 포레스트처럼 따뜻한 위로를 전하는 영화도 좋습니다. 커피 향처럼 은은하게 스며드는 치유의 시간이 될 거예요.",
            ],
        ),
    ]


def _normalize_story(raw: Any) -> Optional[List[AiStorySection]]:
    if not raw:
        return None

    if isinstance(raw, str):
        try:
            raw = json.loads(raw)
        except Exception:
            return None

    if isinstance(raw, dict):
        if "sections" in raw:
            raw = raw["sections"]
        elif "ai_story" in raw:
            raw = raw["ai_story"]
        elif "story" in raw:
            raw = raw["story"]

    if not isinstance(raw, list):
        return None

    sections: List[AiStorySection] = []
    for item in raw:
        if not isinstance(item, dict):
            continue
        title = item.get("title")
        icon = item.get("icon", "☕")
        content = item.get("content")
        if title and isinstance(content, list):
            sections.append(
                AiStorySection(
                    title=str(title),
                    icon=str(icon),
                    content=[str(text) for text in content if text],
                )
            )

    return sections or None


@router.get("/ai-story/{result_id}", response_model=AiStoryResponse)
async def get_ai_story(
    result_id: int,
    db: Session = Depends(get_db)
):
    """
    분석 결과 기반 AI 스토리 반환
    """
    result = db.query(AnalysisResult).filter(AnalysisResult.id == result_id).first()
    if not result:
        raise HTTPException(status_code=404, detail="분석 결과를 찾을 수 없습니다")

    blend = None
    origins: List[BlendOrigin] = []
    if result.blend_id:
        blend = db.query(Blend).filter(Blend.id == result.blend_id).first()
        if blend:
            origins = (
                db.query(BlendOrigin)
                .filter(BlendOrigin.blend_id == blend.id)
                .order_by(BlendOrigin.display_order.asc(), BlendOrigin.id.asc())
                .all()
            )

    story_sections = _normalize_story(result.score) or _normalize_story(result.interpretation)
    if not story_sections:
        story_sections = _build_default_story(origins)

    return AiStoryResponse(sections=story_sections)


@router.get("/similar/{result_id}", response_model=List[SimilarBlendResponse])
async def get_similar_blends(
    result_id: int,
    limit: int = 5,
    db: Session = Depends(get_db)
):
    """
    분석 결과와 유사한 커피 목록 반환
    """
    result = db.query(AnalysisResult).filter(AnalysisResult.id == result_id).first()
    if not result:
        raise HTTPException(status_code=404, detail="분석 결과를 찾을 수 없습니다")

    user_prefs = TastePreferences(
        aroma=result.acidity,
        sweetness=result.sweetness,
        body=result.body,
        nutty=result.nuttiness,
        acidity=result.bitterness,
    )

    candidates = RecommendationService.get_recommendations(
        db=db,
        user_prefs=user_prefs,
        limit=limit + 3,
    )

    filtered = []
    for blend, similarity in candidates:
        if result.blend_id and blend.id == result.blend_id:
            continue
        filtered.append(
            SimilarBlendResponse(
                id=blend.id,
                name=blend.name,
                summary=blend.summary,
                acidity=blend.acidity,
                sweetness=blend.sweetness,
                body=blend.body,
                nuttiness=blend.nuttiness,
                bitterness=blend.bitterness,
                similarity_score=similarity,
            )
        )
        if len(filtered) >= limit:
            break

    return filtered
